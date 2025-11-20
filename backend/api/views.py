from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.contrib.auth import authenticate
from django.db.models import QuerySet, Count, Sum, Avg, Q
from django.db.models.functions import TruncDate
from typing import Any, Dict
from datetime import timedelta
from .models import User, Auction, Bid, CurrencyRate, UserNotification
from .serializers import (
    UserSerializer, AuctionSerializer, BidSerializer,
    CurrencyRateSerializer, UserNotificationSerializer,
    UserLoginSerializer, UserRegistrationSerializer
)
from .permissions import IsAdminUser
import jdatetime
import datetime

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not current_password or not new_password or not confirm_password:
            return Response({'detail': 'تمام فیلدها الزامی است'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({'detail': 'رمزهای عبور مطابقت ندارند'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        if not user.check_password(current_password):
            return Response({'detail': 'رمز عبور فعلی اشتباه است'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'رمز عبور با موفقیت تغییر کرد',
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }, status=status.HTTP_200_OK)

class AuctionListCreateView(generics.ListCreateAPIView):
    queryset = Auction.objects.all()  # type: ignore
    serializer_class = AuctionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

class AuctionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Auction.objects.all()  # type: ignore
    serializer_class = AuctionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_update(self, serializer):
        if self.request.user != serializer.instance.creator:
            return Response(
                {"error": "Only the creator can update the auction"},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save()

class BidCreateView(generics.CreateAPIView):
    serializer_class = BidSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        auction = get_object_or_404(Auction, pk=self.kwargs['auction_pk'])
        if auction.status != 'active' or auction.end_date < timezone.now():
            return Response(
                {"error": "This auction is not active"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        bid = serializer.save(bidder=self.request.user, auction=auction)
        auction.current_price = bid.amount
        auction.save()

        # Create notification for auction creator
        UserNotification.objects.create(  # type: ignore
            user=auction.creator,
            type='new_bid',
            message=f'New bid of {bid.amount} on your auction {auction.title}'
        )

class CurrencyRateListView(generics.ListAPIView):
    queryset = CurrencyRate.objects.all()  # type: ignore
    serializer_class = CurrencyRateSerializer
    permission_classes = [permissions.AllowAny]

class UserNotificationListView(generics.ListAPIView):
    serializer_class = UserNotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserNotification.objects.filter(user=self.request.user)  # type: ignore

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_notification_read(request, pk):
    notification = get_object_or_404(UserNotification, pk=pk, user=request.user)
    notification.read = True
    notification.save()
    return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_auctions(request):
    created_auctions = Auction.objects.filter(creator=request.user)  # type: ignore
    participated_auctions = Auction.objects.filter(bids__bidder=request.user).distinct()  # type: ignore
    won_auctions = Auction.objects.filter(winner=request.user)  # type: ignore

    return Response({
        'created_auctions': AuctionSerializer(created_auctions, many=True).data,
        'participated_auctions': AuctionSerializer(participated_auctions, many=True).data,
        'won_auctions': AuctionSerializer(won_auctions, many=True).data
    })

class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            email = validated_data.get('email')  # type: ignore
            password = validated_data.get('password')  # type: ignore
            
            if email and password:
                user = authenticate(username=email, password=password)
                if user:
                    refresh = RefreshToken.for_user(user)
                    return Response({
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                        'user': UserSerializer(user).data
                    })
                else:
                    return Response(
                        {'detail': 'Invalid credentials'},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
            else:
                return Response(
                    {'detail': 'Email and password are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SubscriptionPurchaseView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        subscription_type = request.data.get('subscription_type')
        
        if not subscription_type or subscription_type not in ['bronze', 'silver', 'gold']:
            return Response(
                {'detail': 'نوع اشتراک نامعتبر است'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = request.user
        now = timezone.now()
        
        # اگر کاربر قبلاً اشتراک فعال دارد، تاریخ پایان را تمدید کن
        if user.subscription_active and user.subscription_end_date:
            start_date = user.subscription_end_date
        else:
            start_date = now
        
        # اضافه کردن 30 روز به تاریخ پایان
        end_date = start_date + timedelta(days=30)
        
        # به‌روزرسانی اطلاعات اشتراک کاربر
        user.subscription_type = subscription_type
        user.subscription_start_date = start_date
        user.subscription_end_date = end_date
        user.subscription_active = True
        user.save()
        
        # ایجاد اعلان برای کاربر
        UserNotification.objects.create(  # type: ignore
            user=user,
            type='auction_start',
            message=f'اشتراک {subscription_type} شما با موفقیت فعال شد و تا {end_date.strftime("%Y-%m-%d")} معتبر است.',
            read=False
        )
        
        return Response({
            'message': 'اشتراک با موفقیت خریداری شد',
            'subscription_type': subscription_type,
            'start_date': start_date,
            'end_date': end_date,
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)

class CreateAuctionView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            # بررسی اشتراک کاربر
            user = request.user
            if not user.subscription_active:
                return Response(
                    {'detail': 'برای ایجاد مزایده نیاز به اشتراک فعال دارید'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # تبدیل تاریخ شمسی به میلادی
            def jalali_to_gregorian(jalali_date):
                if not jalali_date:
                    return datetime.datetime.now().date()
                year, month, day = map(int, jalali_date.split('/'))
                gregorian_date = jdatetime.date(year, month, day).togregorian()
                return gregorian_date
            start_date = jalali_to_gregorian(request.data.get('start_date'))
            end_date = jalali_to_gregorian(request.data.get('end_date'))
            start_time = datetime.datetime.strptime(request.data.get('start_time', '00:00'), '%H:%M').time()
            end_time = datetime.datetime.strptime(request.data.get('end_time', '23:59'), '%H:%M').time()
            start_datetime = datetime.datetime.combine(start_date, start_time)
            end_datetime = datetime.datetime.combine(end_date, end_time)
            
            # ایجاد مزایده
            auction_data = {
                'title': request.data.get('title'),
                'description': request.data.get('description'),
                'starting_price': request.data.get('starting_price'),
                'current_price': request.data.get('starting_price'),
                'start_date': start_datetime,
                'end_date': end_datetime,
                'category': request.data.get('category'),
                'condition': request.data.get('condition'),
                'location': request.data.get('location'),
                'status': 'pending_review',
                'creator': user
            }
            
            auction = Auction.objects.create(**auction_data)  # type: ignore
            
            # ایجاد اعلان برای کاربر
            UserNotification.objects.create(  # type: ignore
                user=user,
                type='auction_created',
                message=f'مزایده "{auction.title}" ایجاد شد و در انتظار تایید ادمین است',
                read=False
            )
            
            # ایجاد اعلان برای ادمین‌ها
            admin_users = User.objects.filter(is_admin=True)
            for admin in admin_users:
                UserNotification.objects.create(  # type: ignore
                    user=admin,
                    type='pending_approval',
                    message=f'مزایده جدید "{auction.title}" برای تایید در انتظار است',
                read=False
            )
            
            return Response({
                'message': 'مزایده با موفقیت ایجاد شد و در انتظار تایید ادمین است',
                'auction': AuctionSerializer(auction).data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'detail': f'خطا در ایجاد مزایده: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

class CreateTenderView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            # بررسی اشتراک کاربر
            user = request.user
            if not user.subscription_active:
                return Response(
                    {'detail': 'برای ایجاد مناقصه نیاز به اشتراک فعال دارید'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # تبدیل تاریخ شمسی به میلادی
            def jalali_to_gregorian(jalali_date):
                if not jalali_date:
                    return datetime.datetime.now().date()
                year, month, day = map(int, jalali_date.split('/'))
                gregorian_date = jdatetime.date(year, month, day).togregorian()
                return gregorian_date
            start_date = jalali_to_gregorian(request.data.get('start_date'))
            end_date = jalali_to_gregorian(request.data.get('end_date'))
            start_time = datetime.datetime.strptime(request.data.get('start_time', '00:00'), '%H:%M').time()
            end_time = datetime.datetime.strptime(request.data.get('end_time', '23:59'), '%H:%M').time()
            start_datetime = datetime.datetime.combine(start_date, start_time)
            end_datetime = datetime.datetime.combine(end_date, end_time)
            
            # ایجاد مناقصه (به عنوان مزایده با نوع مناقصه)
            tender_data = {
                'title': request.data.get('title'),
                'description': request.data.get('description'),
                'starting_price': request.data.get('budget') or 0,
                'current_price': request.data.get('budget') or 0,
                'start_date': start_datetime,
                'end_date': end_datetime,
                'category': request.data.get('category'),
                'condition': 'tender',  # نشان‌دهنده مناقصه
                'location': request.data.get('location'),
                'status': 'pending_review',
                'creator': user
            }
            
            tender = Auction.objects.create(**tender_data)  # type: ignore
            
            # ایجاد اعلان برای کاربر
            UserNotification.objects.create(  # type: ignore
                user=user,
                type='tender_created',
                message=f'مناقصه "{tender.title}" ایجاد شد و در انتظار تایید ادمین است',
                read=False
            )
            
            # ایجاد اعلان برای ادمین‌ها
            admin_users = User.objects.filter(is_admin=True)
            for admin in admin_users:
                UserNotification.objects.create(  # type: ignore
                    user=admin,
                    type='pending_approval',
                    message=f'مناقصه جدید "{tender.title}" برای تایید در انتظار است',
                read=False
            )
            
            return Response({
                'message': 'مناقصه با موفقیت ایجاد شد',
                'tender': AuctionSerializer(tender).data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'detail': f'خطا در ایجاد مناقصه: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

# Admin Views
class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        """آمار کلی سیستم برای داشبورد ادمین"""
        try:
            # آمار کاربران
            total_users = User.objects.count()
            active_users = User.objects.filter(is_active=True).count()
            premium_users = User.objects.filter(subscription_active=True).count()
            
            # آمار مزایده‌ها
            total_auctions = Auction.objects.count()
            active_auctions = Auction.objects.filter(status='active').count()
            completed_auctions = Auction.objects.filter(status='completed').count()
            
            # آمار پیشنهادات
            total_bids = Bid.objects.count()
            total_bid_amount = Bid.objects.aggregate(total=Sum('amount'))['total'] or 0
            
            # آمار اعلان‌ها
            total_notifications = UserNotification.objects.count()
            unread_notifications = UserNotification.objects.filter(read=False).count()
            
            # آمار ارزها
            total_currencies = CurrencyRate.objects.count()
            
            # آمار روزانه (آخرین 7 روز)
            today = timezone.now().date()
            daily_stats = []
            for i in range(7):
                date = today - timedelta(days=i)
                daily_users = User.objects.filter(created_at__date=date).count()
                daily_auctions = Auction.objects.filter(created_at__date=date).count()
                daily_bids = Bid.objects.filter(created_at__date=date).count()
                daily_stats.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'users': daily_users,
                    'auctions': daily_auctions,
                    'bids': daily_bids
                })
            
            return Response({
                'users': {
                    'total': total_users,
                    'active': active_users,
                    'premium': premium_users
                },
                'auctions': {
                    'total': total_auctions,
                    'active': active_auctions,
                    'completed': completed_auctions
                },
                'bids': {
                    'total': total_bids,
                    'total_amount': float(total_bid_amount)
                },
                'notifications': {
                    'total': total_notifications,
                    'unread': unread_notifications
                },
                'currencies': {
                    'total': total_currencies
                },
                'daily_stats': daily_stats
            })
        except Exception as e:
            return Response(
                {'error': f'خطا در دریافت آمار: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AdminUserManagementView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        queryset = User.objects.all()
        search = self.request.query_params.get('search', None)
        subscription_type = self.request.query_params.get('subscription_type', None)
        is_active = self.request.query_params.get('is_active', None)
        
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search) |
                Q(company__icontains=search)
            )
        
        if subscription_type:
            queryset = queryset.filter(subscription_type=subscription_type)
        
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset

class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminAuctionManagementView(generics.ListCreateAPIView):
    queryset = Auction.objects.all()
    serializer_class = AuctionSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        queryset = Auction.objects.all()
        search = self.request.query_params.get('search', None)
        status_filter = self.request.query_params.get('status', None)
        
        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) |
                models.Q(description__icontains=search)
            )
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset

class AdminAuctionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Auction.objects.all()
    serializer_class = AuctionSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminBidManagementView(generics.ListAPIView):
    queryset = Bid.objects.all()
    serializer_class = BidSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        queryset = Bid.objects.all()
        auction_id = self.request.query_params.get('auction_id', None)
        bidder_id = self.request.query_params.get('bidder_id', None)
        
        if auction_id:
            queryset = queryset.filter(auction_id=auction_id)
        
        if bidder_id:
            queryset = queryset.filter(bidder_id=bidder_id)
        
        return queryset

class AdminBidDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Bid.objects.all()
    serializer_class = BidSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminNotificationManagementView(generics.ListCreateAPIView):
    queryset = UserNotification.objects.all()
    serializer_class = UserNotificationSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        queryset = UserNotification.objects.all()
        user_id = self.request.query_params.get('user_id', None)
        notification_type = self.request.query_params.get('type', None)
        read_status = self.request.query_params.get('read', None)
        
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        if notification_type:
            queryset = queryset.filter(type=notification_type)
        
        if read_status is not None:
            queryset = queryset.filter(read=read_status.lower() == 'true')
        
        return queryset

class AdminNotificationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserNotification.objects.all()
    serializer_class = UserNotificationSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminCurrencyManagementView(generics.ListCreateAPIView):
    queryset = CurrencyRate.objects.all()
    serializer_class = CurrencyRateSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminCurrencyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CurrencyRate.objects.all()
    serializer_class = CurrencyRateSerializer
    permission_classes = [permissions.IsAdminUser]

@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def admin_bulk_action(request):
    """عملیات گروهی برای ادمین"""
    action = request.data.get('action')
    model_type = request.data.get('model_type')
    ids = request.data.get('ids', [])
    
    if not action or not model_type or not ids:
        return Response(
            {'error': 'پارامترهای مورد نیاز ارسال نشده است'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        if model_type == 'user':
            queryset = User.objects.filter(id__in=ids)
        elif model_type == 'auction':
            queryset = Auction.objects.filter(id__in=ids)
        elif model_type == 'bid':
            queryset = Bid.objects.filter(id__in=ids)
        elif model_type == 'notification':
            queryset = UserNotification.objects.filter(id__in=ids)
        elif model_type == 'currency':
            queryset = CurrencyRate.objects.filter(id__in=ids)
        else:
            return Response(
                {'error': 'نوع مدل نامعتبر است'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if action == 'delete':
            count = queryset.count()
            queryset.delete()
            return Response({
                'message': f'{count} مورد با موفقیت حذف شد',
                'deleted_count': count
            })
        elif action == 'activate':
            if model_type == 'user':
                queryset.update(is_active=True)
            elif model_type == 'auction':
                queryset.update(status='active')
            return Response({
                'message': f'{queryset.count()} مورد فعال شد'
            })
        elif action == 'deactivate':
            if model_type == 'user':
                queryset.update(is_active=False)
            elif model_type == 'auction':
                queryset.update(status='inactive')
            return Response({
                'message': f'{queryset.count()} مورد غیرفعال شد'
            })
        elif action == 'mark_read':
            if model_type == 'notification':
                queryset.update(read=True)
                return Response({
                    'message': f'{queryset.count()} اعلان خوانده شد'
                })
        
        return Response(
            {'error': 'عملیات نامعتبر است'},
            status=status.HTTP_400_BAD_REQUEST
        )
        
    except Exception as e:
        return Response(
            {'error': f'خطا در انجام عملیات: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def admin_approve_auction(request, auction_id):
    """تایید یا رد مزایده/مناقصه توسط ادمین"""
    try:
        auction = get_object_or_404(Auction, pk=auction_id)
        action = request.data.get('action')  # 'approve' or 'reject'
        
        if action == 'approve':
            auction.status = 'active'
            notification_type = 'auction_approved' if auction.condition != 'tender' else 'tender_approved'
            message = f'مزایده "{auction.title}" تایید شد' if auction.condition != 'tender' else f'مناقصه "{auction.title}" تایید شد'
        elif action == 'reject':
            auction.status = 'rejected'
            notification_type = 'auction_rejected' if auction.condition != 'tender' else 'tender_rejected'
            message = f'مزایده "{auction.title}" رد شد' if auction.condition != 'tender' else f'مناقصه "{auction.title}" رد شد'
        else:
            return Response(
                {'detail': 'عملیات نامعتبر است'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        auction.save()
        
        # ایجاد اعلان برای کاربر
        UserNotification.objects.create(  # type: ignore
            user=auction.creator,
            type=notification_type,
            message=message,
            read=False
        )
        
        return Response({
            'message': message,
            'auction': AuctionSerializer(auction).data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'detail': f'خطا در تایید/رد: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_pending_approvals(request):
    """دریافت لیست مزایده‌ها و مناقصه‌های در انتظار تایید"""
    try:
        pending_auctions = Auction.objects.filter(status='pending_review').order_by('-created_at')
        return Response({
            'pending_auctions': AuctionSerializer(pending_auctions, many=True).data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'detail': f'خطا در دریافت لیست: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_export_data(request):
    """صادرات داده‌ها برای ادمین"""
    model_type = request.query_params.get('model_type')
    format_type = request.query_params.get('format', 'json')
    
    if not model_type:
        return Response(
            {'error': 'نوع مدل مشخص نشده است'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        if model_type == 'users':
            data = UserSerializer(User.objects.all(), many=True).data
        elif model_type == 'auctions':
            data = AuctionSerializer(Auction.objects.all(), many=True).data
        elif model_type == 'bids':
            data = BidSerializer(Bid.objects.all(), many=True).data
        elif model_type == 'notifications':
            data = UserNotificationSerializer(UserNotification.objects.all(), many=True).data
        elif model_type == 'currencies':
            data = CurrencyRateSerializer(CurrencyRate.objects.all(), many=True).data
        else:
            return Response(
                {'error': 'نوع مدل نامعتبر است'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response({
            'data': data,
            'count': len(data),
            'exported_at': timezone.now().isoformat()
        })
        
    except Exception as e:
        return Response(
            {'error': f'خطا در صادرات داده: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
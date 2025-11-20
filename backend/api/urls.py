from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    UserRegistrationView, UserLoginView, UserProfileView,
    AuctionListCreateView, AuctionDetailView,
    BidCreateView, CurrencyRateListView,
    UserNotificationListView, mark_notification_read,
    user_auctions, SubscriptionPurchaseView,
    CreateAuctionView, CreateTenderView,
    ChangePasswordView,
    # Admin Views
    AdminDashboardView, AdminUserManagementView, AdminUserDetailView,
    AdminAuctionManagementView, AdminAuctionDetailView,
    AdminBidManagementView, AdminBidDetailView,
    AdminNotificationManagementView, AdminNotificationDetailView,
    AdminCurrencyManagementView, AdminCurrencyDetailView,
    admin_bulk_action, admin_export_data, admin_approve_auction, admin_pending_approvals
)

urlpatterns = [
    # Authentication URLs
    path('auth/register/', UserRegistrationView.as_view(), name='user-register'),
    path('auth/login/', UserLoginView.as_view(), name='user-login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change-password'),
    
    # User Profile URLs
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/auctions/', user_auctions, name='user-auctions'),
    
    # Auction URLs
    path('auctions/', AuctionListCreateView.as_view(), name='auction-list-create'),
    path('auctions/<int:pk>/', AuctionDetailView.as_view(), name='auction-detail'),
    path('auctions/<int:auction_pk>/bid/', BidCreateView.as_view(), name='auction-bid'),
    
    # Currency Rates URLs
    path('currency-rates/', CurrencyRateListView.as_view(), name='currency-rates'),
    
    # Notification URLs
    path('notifications/', UserNotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/mark-read/', mark_notification_read, name='mark-notification-read'),
    
    # Subscription URLs
    path('subscription/purchase/', SubscriptionPurchaseView.as_view(), name='subscription-purchase'),
    
    # Create Auction and Tender URLs
    path('create-auction/', CreateAuctionView.as_view(), name='create-auction'),
    path('create-tender/', CreateTenderView.as_view(), name='create-tender'),
    
    # Admin URLs
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
    
    # Admin User Management
    path('admin/users/', AdminUserManagementView.as_view(), name='admin-users'),
    path('admin/users/<int:pk>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
    
    # Admin Auction Management
    path('admin/auctions/', AdminAuctionManagementView.as_view(), name='admin-auctions'),
    path('admin/auctions/<int:pk>/', AdminAuctionDetailView.as_view(), name='admin-auction-detail'),
    
    # Admin Bid Management
    path('admin/bids/', AdminBidManagementView.as_view(), name='admin-bids'),
    path('admin/bids/<int:pk>/', AdminBidDetailView.as_view(), name='admin-bid-detail'),
    
    # Admin Notification Management
    path('admin/notifications/', AdminNotificationManagementView.as_view(), name='admin-notifications'),
    path('admin/notifications/<int:pk>/', AdminNotificationDetailView.as_view(), name='admin-notification-detail'),
    
    # Admin Currency Management
    path('admin/currencies/', AdminCurrencyManagementView.as_view(), name='admin-currencies'),
    path('admin/currencies/<int:pk>/', AdminCurrencyDetailView.as_view(), name='admin-currency-detail'),
    
    # Admin Bulk Actions
    path('admin/bulk-action/', admin_bulk_action, name='admin-bulk-action'),
    path('admin/export-data/', admin_export_data, name='admin-export-data'),
    
    # Admin Approval URLs
    path('admin/auctions/<int:auction_id>/approve/', admin_approve_auction, name='admin-approve-auction'),
    path('admin/pending-approvals/', admin_pending_approvals, name='admin-pending-approvals'),
]
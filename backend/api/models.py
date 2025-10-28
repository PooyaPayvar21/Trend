from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    company = models.CharField(max_length=200, blank=True)
    national_id = models.CharField(max_length=10, blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    
    # Subscription fields
    subscription_type = models.CharField(
        max_length=20, 
        choices=[
            ('none', 'بدون اشتراک'),
            ('bronze', 'برنزی'),
            ('silver', 'نقره‌ای'),
            ('gold', 'طلایی')
        ],
        default='none'
    )
    subscription_start_date = models.DateTimeField(null=True, blank=True)
    subscription_end_date = models.DateTimeField(null=True, blank=True)
    subscription_active = models.BooleanField( null=True, blank=True)
    
    # Admin field
    is_admin = models.BooleanField( verbose_name="ادمین")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self) -> str:
        return str(self.email)

class Auction(models.Model):
    AUCTION_STATUS = [
        ('pending_review', 'در حال بررسی'),
        ('active', 'فعال'),
        ('inactive', 'غیرفعال'),
        ('completed', 'تکمیل شده'),
        ('cancelled', 'لغو شده'),
        ('rejected', 'رد شده')
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=AUCTION_STATUS, default='pending_review')
    starting_price = models.DecimalField(max_digits=15, decimal_places=2)
    current_price = models.DecimalField(max_digits=15, decimal_places=2)
    category = models.CharField(max_length=100, blank=True, null=True)
    condition = models.CharField(max_length=50, blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_auctions')
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='won_auctions')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return str(self.title)

class Bid(models.Model):
    auction = models.ForeignKey(Auction, on_delete=models.CASCADE, related_name='bids')
    bidder = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bids')
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-amount']

    def __str__(self) -> str:
        return f'{self.bidder.email} - {self.amount} on {self.auction.title}'  # type: ignore

class CurrencyRate(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=10)
    rate = models.DecimalField(max_digits=15, decimal_places=4)
    change = models.DecimalField(max_digits=10, decimal_places=4)
    last_updated = models.DateTimeField(default=timezone.now)

    def __str__(self) -> str:
        return f'{self.name} ({self.code})'

class UserNotification(models.Model):
    NOTIFICATION_TYPES = [
        ('auction_start', 'شروع مزایده'),
        ('auction_end', 'پایان مزایده'),
        ('new_bid', 'پیشنهاد جدید'),
        ('won_auction', 'برنده شدن در مزایده'),
        ('outbid', 'پیشنهاد بالاتر'),
        ('auction_created', 'مزایده ایجاد شد'),
        ('tender_created', 'مناقصه ایجاد شد'),
        ('auction_approved', 'مزایده تایید شد'),
        ('tender_approved', 'مناقصه تایید شد'),
        ('auction_rejected', 'مزایده رد شد'),
        ('tender_rejected', 'مناقصه رد شد'),
        ('pending_approval', 'در انتظار تایید')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    message = models.TextField()
    read = models.BooleanField()  
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'{self.user.email} - {self.type}'  # type: ignore
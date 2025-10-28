from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Auction, Bid, CurrencyRate, UserNotification

# تنظیمات کلی admin
admin.site.site_header = "پنل مدیریت پلتفرم مزایده و مناقصه"
admin.site.site_title = "مدیریت پلتفرم"
admin.site.index_title = "خوش آمدید به پنل مدیریت"

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'phone_number', 'company', 'subscription_type', 'subscription_active', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('subscription_type', 'subscription_active', 'is_staff', 'is_active', 'date_joined')
    search_fields = ('username', 'email', 'phone_number', 'company', 'national_id')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('اطلاعات شخصی', {'fields': ('first_name', 'last_name', 'email', 'phone_number', 'address', 'company', 'national_id', 'profile_image')}),
        ('اشتراک', {'fields': ('subscription_type', 'subscription_start_date', 'subscription_end_date', 'subscription_active')}),
        ('دسترسی‌ها', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('تاریخ‌های مهم', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'phone_number', 'company'),
        }),
    )

@admin.register(Auction)
class AuctionAdmin(admin.ModelAdmin):
    list_display = ('title', 'creator', 'status', 'starting_price', 'current_price', 'start_date', 'end_date', 'winner', 'created_at')
    list_filter = ('status', 'start_date', 'end_date', 'created_at')
    search_fields = ('title', 'description', 'creator__username', 'creator__email')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('اطلاعات اصلی', {'fields': ('title', 'description', 'status')}),
        ('قیمت‌گذاری', {'fields': ('starting_price', 'current_price')}),
        ('زمان‌بندی', {'fields': ('start_date', 'end_date')}),
        ('کاربران', {'fields': ('creator', 'winner')}),
        ('تاریخ‌ها', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Bid)
class BidAdmin(admin.ModelAdmin):
    list_display = ('auction', 'bidder', 'amount', 'auction_status', 'created_at')
    list_filter = ('created_at', 'auction__status')
    search_fields = ('auction__title', 'bidder__username', 'bidder__email')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('اطلاعات پیشنهاد', {'fields': ('auction', 'bidder', 'amount')}),
        ('تاریخ', {'fields': ('created_at',)}),
    )
    
    readonly_fields = ('created_at',)
    
    def auction_status(self, obj):
        return obj.auction.status
    auction_status.short_description = 'وضعیت مزایده'

@admin.register(CurrencyRate)
class CurrencyRateAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'rate', 'change', 'last_updated')
    list_filter = ('last_updated',)
    search_fields = ('name', 'code')
    ordering = ('name',)
    
    fieldsets = (
        ('اطلاعات ارز', {'fields': ('name', 'code')}),
        ('نرخ ارز', {'fields': ('rate', 'change')}),
        ('تاریخ به‌روزرسانی', {'fields': ('last_updated',)}),
    )
    
    readonly_fields = ('last_updated',)

@admin.register(UserNotification)
class UserNotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'message_preview', 'read', 'created_at')
    list_filter = ('type', 'read', 'created_at')
    search_fields = ('user__username', 'user__email', 'message')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('اطلاعات اعلان', {'fields': ('user', 'type', 'message')}),
        ('وضعیت', {'fields': ('read',)}),
        ('تاریخ', {'fields': ('created_at',)}),
    )
    
    readonly_fields = ('created_at',)
    
    def message_preview(self, obj):
        return obj.message[:50] + '...' if len(obj.message) > 50 else obj.message
    message_preview.short_description = 'پیش‌نمایش پیام'

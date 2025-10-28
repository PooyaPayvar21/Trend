#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import User

def create_admin_user():
    """ایجاد کاربر ادمین"""
    try:
        # بررسی وجود کاربر ادمین
        admin_user = User.objects.filter(is_staff=True).first()
        
        if admin_user:
            print(f"کاربر ادمین موجود است: {admin_user.email}")
            return admin_user
        
        # ایجاد کاربر ادمین جدید
        admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='admin123456',
            first_name='ادمین',
            last_name='سیستم',
            is_staff=True,
            is_superuser=True,
            is_active=True,
            subscription_type='gold',
            subscription_active=True
        )
        
        print(f"کاربر ادمین با موفقیت ایجاد شد:")
        print(f"ایمیل: {admin_user.email}")
        print(f"نام کاربری: {admin_user.username}")
        print(f"رمز عبور: admin123456")
        
        return admin_user
        
    except Exception as e:
        print(f"خطا در ایجاد کاربر ادمین: {e}")
        return None

def create_sample_data():
    """ایجاد داده‌های نمونه"""
    try:
        # ایجاد کاربران نمونه
        for i in range(1, 6):
            user = User.objects.create_user(
                username=f'user{i}',
                email=f'user{i}@example.com',
                password='user123456',
                first_name=f'کاربر {i}',
                last_name='نمونه',
                company=f'شرکت {i}',
                subscription_type='bronze' if i % 2 == 0 else 'silver',
                subscription_active=True
            )
            print(f"کاربر نمونه ایجاد شد: {user.email}")
        
        # ایجاد ارزهای نمونه
        from api.models import CurrencyRate
        currencies = [
            {'name': 'دلار آمریکا', 'code': 'USD', 'rate': 500000, 'change': 1000},
            {'name': 'یورو', 'code': 'EUR', 'rate': 550000, 'change': -500},
            {'name': 'پوند انگلیس', 'code': 'GBP', 'rate': 650000, 'change': 2000},
        ]
        
        for currency_data in currencies:
            currency = CurrencyRate.objects.create(**currency_data)
            print(f"ارز نمونه ایجاد شد: {currency.name}")
        
        print("داده‌های نمونه با موفقیت ایجاد شدند")
        
    except Exception as e:
        print(f"خطا در ایجاد داده‌های نمونه: {e}")

if __name__ == '__main__':
    print("در حال ایجاد کاربر ادمین...")
    admin_user = create_admin_user()
    
    if admin_user:
        print("\nدر حال ایجاد داده‌های نمونه...")
        create_sample_data()
        
        print("\n=== اطلاعات ورود ادمین ===")
        print("ایمیل: admin@example.com")
        print("رمز عبور: admin123456")
        print("==========================") 
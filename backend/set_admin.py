#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import User

def create_admin_user():
    """ایجاد کاربر ادمین جدید"""
    try:
        # بررسی وجود کاربر ادمین با ایمیل جدید
        admin_user = User.objects.filter(email='superadmin@trend.com').first()
        
        if admin_user:
            print(f"کاربر ادمین با ایمیل superadmin@trend.com موجود است: {admin_user.email}")
            return admin_user
        
        # ایجاد کاربر ادمین جدید
        admin_user = User.objects.create_user(
            username='superadmin',
            email='superadmin@trend.com',
            password='superadmin123',
            first_name='سوپر',
            last_name='ادمین',
            is_admin=True,
            is_active=True,
            subscription_type='gold',
            subscription_active=True
        )
        
        print(f"کاربر ادمین با موفقیت ایجاد شد:")
        print(f"ایمیل: {admin_user.email}")
        print(f"نام کاربری: {admin_user.username}")
        print(f"رمز عبور: superadmin123")
        print(f"وضعیت ادمین: {admin_user.is_admin}")
        
        return admin_user
        
    except Exception as e:
        print(f"خطا در ایجاد کاربر ادمین: {e}")
        return None

def set_user_as_admin():
    """تنظیم کاربر pooya.payvar25@gmail.com به عنوان ادمین"""
    try:
        # پیدا کردن کاربر
        user = User.objects.get(email='pooya.payvar25@gmail.com')
        
        # تنظیم به عنوان ادمین
        user.is_admin = True
        user.save()
        
        print(f"کاربر {user.email} با موفقیت به عنوان ادمین تنظیم شد!")
        print(f"نام کاربری: {user.username}")
        print(f"وضعیت ادمین: {user.is_admin}")
        
        return user
        
    except User.DoesNotExist:
        print("کاربر با ایمیل pooya.payvar25@gmail.com یافت نشد!")
        return None
    except Exception as e:
        print(f"خطا در تنظیم کاربر به عنوان ادمین: {e}")
        return None

if __name__ == "__main__":
    print("=== ایجاد کاربر ادمین جدید ===")
    create_admin_user()
    print("\n=== تنظیم کاربر موجود به عنوان ادمین ===")
    set_user_as_admin() 
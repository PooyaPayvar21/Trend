#!/usr/bin/env python
"""
Test script to verify backend connection and basic functionality
"""
import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from api.models import User

def test_database_connection():
    """Test database connection"""
    try:
        # Try to create a test user
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        print(f"✅ Database connection successful. Created test user: {user.username}")
        
        # Clean up
        user.delete()
        print("✅ Test user cleaned up successfully")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_user_model():
    """Test User model functionality"""
    try:
        # Test user creation
        user = User.objects.create_user(
            username='testuser2',
            email='test2@example.com',
            password='testpass123',
            phone_number='09123456789',
            address='Test Address'
        )
        print(f"✅ User model test successful. User: {user.email}")
        
        # Test authentication
        from django.contrib.auth import authenticate
        auth_user = authenticate(username='test2@example.com', password='testpass123')
        if auth_user:
            print("✅ User authentication test successful")
        else:
            print("❌ User authentication test failed")
        
        # Clean up
        user.delete()
        print("✅ Test user2 cleaned up successfully")
        return True
    except Exception as e:
        print(f"❌ User model test failed: {e}")
        return False

if __name__ == '__main__':
    print("🔧 Testing backend connection and functionality...")
    print("=" * 50)
    
    db_success = test_database_connection()
    user_success = test_user_model()
    
    print("=" * 50)
    if db_success and user_success:
        print("🎉 All tests passed! Backend is ready.")
    else:
        print("❌ Some tests failed. Please check the errors above.") 
from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    اجازه دسترسی فقط برای کاربران ادمین
    """
    
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin) 
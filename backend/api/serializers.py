from rest_framework import serializers
from .models import User, Auction, Bid, CurrencyRate, UserNotification

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone_number', 'address', 'company', 'national_id', 'profile_image', 'subscription_type', 'subscription_start_date', 'subscription_end_date', 'subscription_active', 'is_admin', 'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class AuctionSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    winner = UserSerializer(read_only=True)
    current_price = serializers.DecimalField(read_only=True, max_digits=15, decimal_places=2)
    
    class Meta:
        model = Auction
        fields = ['id', 'title', 'description', 'start_date', 'end_date', 'status',
                'starting_price', 'current_price', 'category', 'condition', 'location',
                'creator', 'winner', 'created_at', 'updated_at']

class BidSerializer(serializers.ModelSerializer):
    bidder = UserSerializer(read_only=True)
    
    class Meta:
        model = Bid
        fields = ['id', 'auction', 'bidder', 'amount', 'created_at']

    def validate_amount(self, value):
        auction = self.context['auction']
        if value <= auction.current_price:
            raise serializers.ValidationError('Bid amount must be higher than current price')
        return value

class CurrencyRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurrencyRate
        fields = ['id', 'name', 'code', 'rate', 'change', 'last_updated']

class UserNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNotification
        fields = ['id', 'user', 'type', 'message', 'read', 'created_at']

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 'phone_number', 'address', 'company', 'national_id']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        return User.objects.create_user(**validated_data)
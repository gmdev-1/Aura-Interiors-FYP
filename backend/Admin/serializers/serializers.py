from rest_framework import serializers
from Admin.models.models import User
from django.core.exceptions import ValidationError
import io
import re
from utils.db_connection import mongo_db

user_collection = mongo_db["users"]

class SignupSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    role = serializers.CharField(default='admin', read_only=True)
    
    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name is required.")
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Name must be at least 3 characters long.")
        return value
    
    def validate_email(self, value):
       email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
       if not re.match(email_regex, value):
           raise serializers.ValidationError("Enter a valid email format")
       if user_collection.find_one({"email": value, "role": "admin"}):
           raise serializers.ValidationError("Email already taken")
       return value.strip()
    
    def validate_password(self, value):
        password_regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d#\u00a3@$!%*?&]{8,}$'
        if not re.match(password_regex, value):
            raise serializers.ValidationError("Password must contain at least 8 characters, "
                "one uppercase letter, one lowercase letter, "
                "one number, and one special character")
        return value
    
    def create(self, validated_data):
        
        user = User(
            name=validated_data['name'],
            email=validated_data['email'],
            password=validated_data['password'],
            role='admin'
        )
        user.save()
        user.password = None
        return user
    
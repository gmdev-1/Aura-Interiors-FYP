from rest_framework import serializers
from Admin.models.models import User
from django.core.exceptions import ValidationError
import io
import re


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    
    def validate_email(self, value):
       email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
       if not re.match(email_regex, value):
           raise serializers.ValidationError("Enter a valid email format")
       return value.strip()
    
    def validate_password(self, value):
        password_regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d#\u00a3@$!%*?&]{8,}$'
        if not re.match(password_regex, value):
            raise serializers.ValidationError("Password must contain at least 8 characters, "
                "one uppercase letter, one lowercase letter, "
                "one number, and one special character")
        return value.strip()
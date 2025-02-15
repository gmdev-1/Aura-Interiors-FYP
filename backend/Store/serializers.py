from rest_framework import serializers
from Store.models.models import User
from django.core.exceptions import ValidationError
import io
import re
import bcrypt
from utils.db_connection import mongo_db

user_collection = mongo_db["users"]

class UserSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=3, max_length=100)
    email = serializers.EmailField()
    phone = serializers.CharField()
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        if user_collection.find_one({"email": value.lower()}):
            raise serializers.ValidationError("Email is already registered.")
        return value

    def validate_phone(self, value):
        phone_regex = r"^\+?\d{10,13}$"
        if not re.match(phone_regex, value):
            raise serializers.ValidationError("Phone must be in valid format.")
        if user_collection.find_one({"phone": value}):
            raise serializers.ValidationError("Phone number is already registered.")
        return value

    def validate_password(self, value):
        password_regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
        if not re.match(password_regex, value):
            raise serializers.ValidationError(
                "Password must include uppercase, lowercase, number, and special character."
            )
        return value

    def create(self, validated_data):
        user = User(
            name=validated_data['name'],
            email=validated_data['email'],
            phone=validated_data['phone'],
            password=validated_data['password']
        )
        user.save()
        return user

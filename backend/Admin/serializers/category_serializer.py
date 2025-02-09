from rest_framework import serializers
from Admin.models.category import Category
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
import io


class CategorySerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True)
    image = serializers.ImageField(required=True,
            validators=[
                FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp', 'avif'])
                ])

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name is required.")
        if len(value) < 3:
            raise serializers.ValidationError("Category name must be at least 3 characters long.")
        return value

    def validate_description(self, value):
        if len(value) > 200:
            raise serializers.ValidationError("Description is too long (maximum 200 characters).")
        return value

    def validate_image(self, value):
        if not value:
            raise serializers.ValidationError("Image is required.")

        max_size = 5 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError("Image size cannot exceed 5MB.")
        return value
    
    def create(self, validated_data):
        category = Category(**validated_data)
        category.save()  
        return category
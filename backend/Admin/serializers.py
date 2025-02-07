from rest_framework import serializers
from .models import Category
from django.core.exceptions import ValidationError
import io

class CategorySerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(required=True, allow_blank=True)
    image = serializers.CharField(required=True)

    def validate_name(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Category name must be at least 3 characters long.")
        return value

    def validate_description(self, value):
        if len(value) > 200:
            raise serializers.ValidationError("Description is too long (maximum 200 characters).")
        return value

    def validate_image(self, value):
        try:
            image = Image.open(value)
            image.verify()  # This will raise an exception if the file is not a valid image
        except (IOError, SyntaxError):
            raise serializers.ValidationError("The uploaded file is not a valid image.")

        if value.size > 5 * 1024 * 1024:  # 5MB size limit
            raise serializers.ValidationError("Image size should not exceed 5MB.")

        valid_formats = ["JPEG", "PNG", "JPG"]
        if image.format not in valid_formats:
            raise serializers.ValidationError(f"Only {', '.join(valid_formats)} formats are allowed.")
        
        return value

from rest_framework import serializers
from Admin.models.carousal import Carousal
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
import io


class CarousalSerializer(serializers.Serializer):
    image = serializers.ImageField(required=True,
            validators=[
                FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp', 'avif'])
                ])
    image_type = serializers.ChoiceField([("home", "Home"), ("category", "Category")], required=True)
    category = serializers.CharField(required=False)
    
    def validate(self, attrs):
        if attrs.get("image_type") == "category" and not attrs.get("category"):
            raise serializers.ValidationError("Category is required when image type is category")
        return attrs
    
    def validate_image(self, value):
        max_size = 5 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError("Image size cannot exceed 5MB.")
        return value
    
    def create(self, validated_data):
        carousal = Carousal(**validated_data)
        carousal.save()
        return carousal
    
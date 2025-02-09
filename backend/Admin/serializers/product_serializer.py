from rest_framework import serializers
from Admin.models.product import Product
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
import io


class ProductSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=False)
    image = serializers.ImageField(required=True,
            validators=[
                FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp', 'avif'])
                ])
    price = serializers.IntegerField()
    category = serializers.CharField()
    quantity = serializers.IntegerField()
    review = serializers.IntegerField()
    rating = serializers.DecimalField(max_digits=2, decimal_places=1)
    is_featured = serializers.BooleanField()
    color = serializers.CharField(max_length=100, allow_blank=False)
    material = serializers.CharField(max_length=100, allow_blank=False)
    size = serializers.CharField(max_length=50, allow_blank=False)
    discount = serializers.IntegerField(required=False, default=0)
    
    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name is required.")
        if len(value) < 3:
            raise serializers.ValidationError("Product name must be at least 3 characters long.")
        return value

    def validate_description(self, value):
        if len(value) > 255:
            raise serializers.ValidationError("Description is too long (maximum 255 characters).")
        return value
    
    def validate_price(self, value):
        if value<=0:
            raise serializers.ValidationError("Price must be greater than zero.")
        return value
    
    def validate_category(self, value):
        if not value.strip():
            raise serializers.ValidationError("Category must be provided.")
        return value
    
    def validate_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Quantity cannot be negative.")
        return value
    
    def validate_review(self, value):
        if value < 0:
            raise serializers.ValidationError("Review cannot be negative.")
        return value

    def validate_rating(self, value):
        if value < 0 or value > 5:
            raise serializers.ValidationError("Rating must be between 0 and 5.")
        return value
    
    def validate_color(self, value):
        if not value.strip():
            raise serializers.ValidationError("Color cannot be blank.")
        return value

    def validate_material(self, value):
        if not value.strip():
            raise serializers.ValidationError("Material cannot be blank.")
        return value

    def validate_size(self, value):
        if not value.strip():
            raise serializers.ValidationError("Size cannot be blank.")
        return value

    def validate_discount(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Discount must be zero or positive.")
        return value

    def validate_image(self, value):
        if not value:
            raise serializers.ValidationError("Image is required.")
        
        max_size = 5 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError("Image size cannot exceed 5MB.")
        return value
    
    def create(self, validated_data):
        if 'category' in validated_data:
            validated_data['category_id'] = validated_data.pop('category')
        if 'rating' in validated_data:
            validated_data['rating'] = float(validated_data['rating'])
            
        product = Product(**validated_data)
        product.save()
        return product
        
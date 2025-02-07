from django.http import HttpResponse
from django.core.files.base import ContentFile
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from Admin.models.category import Category
from Admin.models.product import Product
from Admin.serializers import CategorySerializer
from rest_framework.permissions import IsAuthenticated
import cloudinary.uploader
import os

# Cloudinary methods
def cloudinary_upload_image(file, folder_name):
    if file:
        try:
            result = cloudinary.uploader.upload(
                file,
                folder=f"{folder_name}/",
                resource_type="image"
            )
            return result['secure_url']
        except Exception as e:
            return None
        return None

def delete_cloudinary_image(image_url, folder_name):
    try:
        if image_url:
            public_id = image_url.split('/')[-1].split('.')[0]
            cloudinary.uploader.destroy(f"categories/{public_id}")
    except Exception as e:
        return None

# Category Views

class CategoryCreateView(APIView):
    # permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        name = request.data.get('name')
        description = request.data.get('description', "")
        image_file = request.FILES.get('image')
        
        image_url = cloudinary_upload_image(image_file, folder_name="categories") if image_file else None
        
        category = Category(
            name=name,
            description=description,
            image=image_url
        )

        category.save()

        return Response(status=status.HTTP_201_CREATED)


class CategoriesListView(APIView):
    def get(self, request):
        try:
            categories = Category.get_all_categories() 
            
            category_list = [
                {
                    "id": str(category.get("_id")), 
                    "name": category.get("name", ""),
                    "description": category.get("description", ""),
                     "image": category.get('image'),
                }
                for category in categories
            ]
            
            return Response(category_list, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class CategoryRetrieveView(APIView):
    def get(self, request, category_id):
        try:
            category = Category.get_one_category(category_id) 
            
            category_list = [
                {
                    "id": str(category.get("_id")), 
                    "name": category.get("name", ""),
                    "description": category.get("description", ""),
                    "image": category.get('image'),
                }
            ]
            return Response(category_list, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CategoryDeleteView(APIView):
    def delete(self, request, category_id):
        try:
            category = Category.get_one_category(category_id)
            if category.get('image'):
                delete_cloudinary_image(category['image'], folder_name="categories")
                
            deleted_count = Category.delete_one_category(category_id)
            if deleted_count > 0:
              return Response({"message": "Category deleted successfully"}, status=status.HTTP_200_OK)
            else:
              return Response({"error": "Category not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class CategoryUpdateView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def put(self, request, category_id):
        try:
            category = Category.get_one_category(category_id)
            update_data = {
                'name': request.data.get('name'),
                'description': request.data.get('description'),
            }

            # Handle image update
            new_image = request.FILES.get('image')
            if new_image:
                if category.get('image'):                               # Delete old image first
                    delete_cloudinary_image(category['image'], folder_name="categories")
                image_url = cloudinary_upload_image(new_image, folder_name="categories")          # Upload new image
                if image_url:
                    update_data['image'] = image_url 

            modified_count = Category.update_one_category(category_id, update_data)
            
            if modified_count > 0:
                return Response({"message": "Category updated successfully"}, status=status.HTTP_200_OK)
            return Response({"message": "No changes detected"}, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# Product Views

class ProductCreateView(APIView):
     parser_classes = (MultiPartParser, FormParser)
     def post(self, request):
        name = request.data.get('name')
        description = request.data.get('description', "")
        price = request.data.get('price')
        category_id = request.data.get('category')
        quantity = request.data.get('quantity')
        color = request.data.get('color')
        size = request.data.get('size')
        material = request.data.get('material')
        review = request.data.get('review')
        
        is_featured = request.data.get('is_featured', False)
        is_featured = is_featured.lower() == 'true'
        
        discount = request.data.get('discount')
        discount = float(discount) if discount else None
        
        rating = request.data.get('rating')
        rating = float(rating) if rating else None
        
        image_file = request.FILES.get('image')
        
        image_url = cloudinary_upload_image(image_file, folder_name="products") if image_file else None
        
        product = Product(
            name=name,
            description=description,
            price=price,
            category_id=category_id,
            quantity=quantity,
            discount=discount,
            color=color,
            size=size,
            material=material,
            rating=rating,
            review=review,
            is_featured=is_featured,
            image=image_url
        )

        product.save()

        return Response(status=status.HTTP_201_CREATED)

    
class ProductsListView(APIView):
    def get(self, request):
        try:
            products = Product.get_all_products()
            product_list = [
                {
                    "id": product.get("id"),
                    "name": product.get("name"),
                    "description": product.get("description"),
                    "price": product.get("price"),
                    "category": str(product.get("category")),
                    "quantity": product.get("quantity"),
                    "discount": product.get("discount"),
                    "image": product.get("image"),
                    "color": product.get("color"),
                    "size": product.get("size"),
                    "material": product.get("material"),
                    "rating": product.get("rating"),
                    "review": product.get("review"),
                    "is_featured": product.get("is_featured"),
                }
                for product in products
            ]
            
            return Response(product_list, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProductRetrieveView(APIView):
    def get(self, request, product_id):
        try:
            product = Product.get_one_product(product_id)
            
            product_list = [
                {
                    "id": str(product.get("id")), 
                    "name": product.get("name"),
                    "description": product.get("description"),
                    "price": product.get("price"),
                    "category": product.get("category_id"),
                    "quantity": product.get("quantity"),
                    "discount": product.get("discount"),
                    "image": product.get("image"),
                    "color": product.get("color"),
                    "size": product.get("size"),
                    "material": product.get("material"),
                    "rating": product.get("rating"),
                    "review": product.get("review"),
                    "is_featured": product.get("is_featured", False),
                    
                }
            ]
            return Response(product_list, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            

class ProductDeleteView(APIView):
    def delete(self, request, product_id):
        try:
            product = Product.get_one_product(product_id)
            if product.get('image'):
                delete_cloudinary_image(product['image'], folder_name="products")
                
            deleted_count = Product.delete_one_product(product_id)
            if deleted_count > 0:
              return Response({"message": "Product deleted successfully"}, status=status.HTTP_200_OK)
            else:
              return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class ProductUpdateView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    def put(self, request, product_id):
        try:
            product = Product.get_one_product(product_id)
            update_data = {
                'name': request.data.get('name'),
                'description': request.data.get('description'),
                'price': request.data.get('price'),
                'category': request.data.get('category'),
                'quantity': request.data.get('quantity'),
                'discount': request.data.get('discount'),
                'color': request.data.get('color'),
                'size': request.data.get('size'),
                'material': request.data.get('material'),
                'rating': request.data.get('rating'),
                'review': request.data.get('review'),
                'is_featured': request.data.get('is_featured'),
            }

            # Handle image update
            new_image = request.FILES.get('image')
            if new_image:
                if product.get('image'):                               # Delete old image first
                    delete_cloudinary_image(product['image'], folder_name="products")
                image_url = cloudinary_upload_image(new_image, folder_name="products")   # Upload new image
                if image_url:
                    update_data['image'] = image_url 

            modified_count = Product.update_one_product(product_id, update_data)
            
            if modified_count > 0:
                return Response({"message": "Product updated successfully"}, status=status.HTTP_200_OK)
            return Response({"message": "No changes detected"}, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
            

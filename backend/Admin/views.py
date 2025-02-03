import base64
import os
from django.http import HttpResponse
from django.core.files.base import ContentFile
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import FileSystemStorage
from rest_framework.parsers import MultiPartParser, FormParser
from Admin.models import Category
from Admin.serializers import CategorySerializer
from rest_framework.permissions import IsAuthenticated
import cloudinary.uploader


def cloudinary_upload_image(file):
    if file:
        try:
            result = cloudinary.uploader.upload(
                file,
                folder="categories/",
                resource_type="image"
            )
            return result['secure_url']
        except Exception as e:
            return None
        return None

def delete_cloudinary_image(image_url):
    try:
        if image_url:
            public_id = image_url.split('/')[-1].split('.')[0]
            cloudinary.uploader.destroy(f"categories/{public_id}")
    except Exception as e:
        return None

class AddCategoryView(APIView):
    # permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        name = request.data.get('name')
        description = request.data.get('description', "")
        image_file = request.FILES.get('image')
        
        image_url = cloudinary_upload_image(image_file) if image_file else None
        
        category = Category(
            name=name,
            description=description,
            image=image_url
        )

        category.save()

        return Response(status=status.HTTP_201_CREATED)


class GetCategoriesView(APIView):
    def get(self, request):
        try:
            categories = Category.get_all() 
            
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
        
class GetOneCategoryView(APIView):
    def get(self, request, category_id):
        try:
            category = Category.get_one(category_id) 
            
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

class DeleteCategoryView(APIView):
    def delete(self, request, category_id):
        try:
            category = Category.get_one(category_id)
            if category.get('image'):
                delete_cloudinary_image(category['image'])
                
            deleted_count = Category.delete_one(category_id)
            if deleted_count > 0:
              return Response({"message": "Category deleted successfully"}, status=status.HTTP_200_OK)
            else:
              return Response({"error": "Category not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class EditCategoryView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def put(self, request, category_id):
        try:
            category = Category.get_one(category_id)
            update_data = {
                'name': request.data.get('name'),
                'description': request.data.get('description'),
            }

            # Handle image update
            new_image = request.FILES.get('image')
            if new_image:
                if category.get('image'):                               # Delete old image first
                    delete_cloudinary_image(category['image'])
                image_url = cloudinary_upload_image(new_image)          # Upload new image
                if image_url:
                    update_data['image'] = image_url 

            modified_count = Category.update_one(category_id, update_data)
            
            if modified_count > 0:
                return Response({"message": "Category updated successfully"}, status=status.HTTP_200_OK)
            return Response({"message": "No changes detected"}, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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


def upload_image(request):
    
    image_file = request.FILES.get('image')
    if image_file:
        fs = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'categories'))
        sanitized_filename = image_file.name.replace(" ", "_")
        filename = fs.save(sanitized_filename, image_file)
        image_url = os.path.join(settings.MEDIA_URL, 'categories', filename)

        return image_url
    return None

class AddCategoryView(APIView):
    # permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        name = request.data.get('name')
        description = request.data.get('description', "")
        image_file = upload_image(request)
        
        category = Category(
            name=name,
            description=description,
            image=image_file
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
                     "image": f"{category.get('image')}" if category.get("image") else None,
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
                    "image": f"{category.get('image')}" if category.get("image") else None,
                }

            ]
            
            return Response(category_list, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DeleteCategoryView(APIView):
    def delete(self, request, category_id):
        try:
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
            update_data = {
                'name': request.data.get('name'),
                'description': request.data.get('description'),
            }

            # Handle image update
            if 'image' in request.data:
                # Delete old image first
                category = Category.get_one(category_id)
                if category and category.get('image'):
                    image_path = category['image'].split('media/')[-1]
                    full_path = os.path.join(settings.MEDIA_ROOT, image_path)
                    if default_storage.exists(full_path):
                        default_storage.delete(full_path)
                
                # Upload new image
                image_url = upload_image(request)
                if image_url:
                    update_data['image'] = image_url

            modified_count = Category.update_one(category_id, update_data)
            
            if modified_count > 0:
                return Response({"message": "Category updated successfully"}, status=status.HTTP_200_OK)
            return Response({"message": "No changes detected"}, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
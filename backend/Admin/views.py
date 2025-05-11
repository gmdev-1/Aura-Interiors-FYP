from django.http import HttpResponse
from django.core.files.base import ContentFile
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from datetime import datetime, timedelta
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from Admin.models.category import Category
from Admin.models.product import Product
from Admin.models.carousal import Carousal
from Admin.models.models import User
from Admin.serializers.serializers import SignupSerializer
from Admin.serializers.login_serializer import LoginSerializer
from Admin.serializers.category_serializer import CategorySerializer
from Admin.serializers.carousal_serializer import CarousalSerializer
from Admin.serializers.product_serializer import ProductSerializer
import cloudinary.uploader
import os
from bson import ObjectId
from utils.db_connection import mongo_db
import bcrypt
from .analytics import AnalyticsService


user_collection = mongo_db["users"]

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

# Authentication Views

class AdminLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            user = User.authenticate(email, password)
            if not user:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            
            # Generate JWT tokens
            access_token = AccessToken()
            access_token['user_id'] = user.id
            access_token['email'] = user.email
            access_token['role'] = user.role
            
            access_token.set_exp(lifetime=timedelta(minutes=15))
            
            refresh_token = RefreshToken()
            refresh_token['user_id'] = user.id
            refresh_token.set_exp(lifetime=timedelta(days=7))
            
            response_data = {
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'role': user.role
                },
                'message': 'Login Successful'
            }
            response = Response(response_data, status=status.HTTP_200_OK)
            
            response.set_cookie(
                key='access_token',
                value=str(access_token),
                httponly=True,
                secure=False,
                samesite='Lax',
                max_age=60 * 60 * 2
            )
            
            response.set_cookie(
                key='refresh_token',
                value=str(refresh_token),
                httponly=True,
                secure=False,
                samesite='Lax',
                max_age=60 * 60 * 24 * 7
            )
            
            return response
        
        except Exception as e:
            print("Exception during authentication:", repr(e))
            return Response({'error': 'Authentication failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CookieJWTAuthentication(JWTAuthentication):
    permission_classes = [AllowAny]
    def authenticate(self, request):
        raw_token = request.COOKIES.get('access_token')
        if raw_token is not None:
            try:
                validated_token = self.get_validated_token(raw_token)
            except TokenError as e:
                raise AuthenticationFailed('Invalid or expired token.') from e
            return self.get_user(validated_token), validated_token

        return super().authenticate(request)   
        
    def get_user(self, validated_token):
        try:
            user_id = validated_token.get('user_id')
            user = User.get_by_id(user_id)
            if user is None:
                raise AuthenticationFailed('User not found')
            return user
        except Exception as e:
            raise AuthenticationFailed('User retrievel failed') from e

           
class VerifyAuthView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not user or not getattr(user, 'is_authenticated', False):
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        if user.role != 'admin':
            return Response({'error': 'Only Admin can Access'}, status=status.HTTP_403_FORBIDDEN)

        return Response({
            'user_id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role,
        }, status=status.HTTP_200_OK)
        
class CookieTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        # Retrieve the refresh token from the cookie.
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({'detail': 'Refresh token not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Pass the refresh token to the serializer by placing it in the expected "refresh" field.
        data = {'refresh': refresh_token}
        serializer = self.get_serializer(data=data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError:
            return Response({'detail': 'Invalid or expired refresh token'}, status=status.HTTP_401_UNAUTHORIZED)
        
        new_access_token = serializer.validated_data.get('access')
        response = Response({'access': new_access_token}, status=status.HTTP_200_OK)
        
        # Update the access token cookie with the new token.
        response.set_cookie(
            key='access_token',
            value=new_access_token,
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=60 * 60 * 2
        )
        return response

class AdminLogoutView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        response = Response(
            {'message': 'Successfully logged out'},
            status=status.HTTP_200_OK
        )
        
        # Clear access token cookie
        response.set_cookie(
            key='access_token',
            value='',
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Lax',
            max_age=0  # Immediately expires
        )
        
        # Clear refresh token cookie
        response.set_cookie(
            key='refresh_token',
            value='',
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Lax',
            max_age=0  # Immediately expires
        )
        
        return response

class AdminSignupView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            admin = serializer.save()
            return Response({
                'name': admin.name,
                'email': admin.email,
                'role': admin.role
                },status=201)
        return Response(serializer.errors, status=400)

# Category Views

class CategoryCreateView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            image_file = request.FILES.get('image')
            image_url = cloudinary_upload_image(image_file, folder_name="categories")
            category = serializer.save(image=image_url)       
            return Response(status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors,  status=status.HTTP_400_BAD_REQUEST)


class CategoriesListView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
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
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
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
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
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
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
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
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            image_file = request.FILES.get('image')
            image_url = cloudinary_upload_image(image_file, folder_name="products")
            product = serializer.save(image=image_url)
            return Response(status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class ProductsListView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
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
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
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
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
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
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
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
        
         
# Carousal Views

class CarousalCreateView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        serializer = CarousalSerializer(data=request.data)
        if serializer.is_valid():
            image_file = request.FILES.get('image')
            image_url = cloudinary_upload_image(image_file, folder_name="carousals")
            carousal = serializer.save(image=image_url)
            return Response({"message": "Carousal created"},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,  status=status.HTTP_400_BAD_REQUEST)

    

class CarousalsListView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            carousals = Carousal.get_all_carousals() 
            
            carousal_list = [
                {
                    "id": str(carousal.get("_id")), 
                     "image": carousal.get('image'),
                }
                for carousal in carousals
            ]
            
            return Response(carousal_list, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CarousalDeleteView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def delete(self, request, carousal_id):
        try:
            carousal = Carousal.get_one_carousal(carousal_id)
            if carousal.get('image'):
                delete_cloudinary_image(carousal['image'], folder_name="carousals")
                
            deleted_count = Carousal.delete_one_carousal(carousal_id)
            if deleted_count > 0:
              return Response({"message": "Carousal deleted successfully"}, status=status.HTTP_200_OK)
            else:
              return Response({"error": "Carousal not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

# Analytics Views

class AnalyticsDataView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):

       service = AnalyticsService(settings.GA4_PROPERTY_ID)
       report = service.run_report(start_date="7daysAgo", end_date="today")

       data = []
       
       for row in report.rows:
            dims = row.dimension_values
            mets = row.metric_values
            data.append({
                "date":              dims[0].value,
                "activeUsers":       int(mets[0].value),
                "eventCount":        int(mets[1].value),
                "screenPageViews":   int(mets[2].value),
                "engagementRate":    float(mets[3].value) * 100,
                "sessions":          int(mets[4].value),
                "addToCarts":        int(mets[5].value),
                "checkouts":         int(mets[6].value),
                "ecommercePurchases":int(mets[7].value),
                "purchaseRevenue":   float(mets[8].value),
                "totalRevenue":      float(mets[9].value),
            })

       return Response(data)
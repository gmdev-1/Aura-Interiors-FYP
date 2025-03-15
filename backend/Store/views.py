from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.shortcuts import redirect
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
import os
import uuid
from bson import ObjectId
from utils.db_connection import mongo_db
from utils.verify_email import send_verification_email
from Admin.models.product import Product
from Admin.models.category import Category
from Admin.models.carousal import Carousal
from Store.models.models import User
from Store.models.cart_model import Cart
from Store.serializers.serializers import UserSignupSerializer
from Store.serializers.login_serializer import UserLoginSerializer
from Store.services import get_one_product_by_name
from Store.services import get_filtered_products, home_featured_products

user_collection = mongo_db["users"]
product_collection = mongo_db["product"]
carousal_collection = mongo_db["carousal"]


class CategoriesFilterView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        try:
            categories = Category.get_all_categories() 
            
            category_list = [
                {
                    "id": str(category.get("_id")), 
                    "name": category.get("name", ""),
                }
                for category in categories
            ]
            
            return Response(category_list, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# Carousal Banner

class HomeCarousalsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        try:
            carousals = carousal_collection.find({"image_type": "home"})
            carousal_list = [
                {
                    "id": str(carousal.get(("_id"))),
                    "image": carousal.get("image"),
                }
                for carousal in carousals
            ]
            return Response(carousal_list, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CarousalCategoryView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        try:
            category = request.query_params.get("category")
            if category:
                carousals = carousal_collection.find({
                    "image_type": "category",
                    "category": category
                })
            else:
                carousals = []
            carousal_list = [
                {
                "id": str(carousal.get("_id")),
                "image": carousal.get("image")
                }
                for carousal in carousals
            ]
            return Response(carousal_list, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# Shop by category section

class HomeCategoriesView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        try:
            categories = Category.get_all_categories() 
            
            category_list = [
                {
                    "id": str(category.get("_id")), 
                    "name": category.get("name", ""),
                    "image": category.get("image"),
                }
                for category in categories
            ]
            
            return Response(category_list, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# Top Products Section

class TopProductsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        try:
            top_products = home_featured_products()
            return Response(top_products, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


# Product Shop

class ProductShopView(APIView):
    permission_classes = [AllowAny]
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
        

# Product Detail view

class ProductDetailView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, name):
        try:
            product = get_one_product_by_name(name)
            product_list = [
                {
                    "id": str(product.get("id")), 
                    "name": product.get("name"),
                    "description": product.get("description"),
                    "price": product.get("price"),
                    "category": product.get("category"),
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
        
# Shop Filters

class ProductShopFilterView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        products = get_filtered_products(request.query_params)
        return Response(products)

# Authentication Views

class UserLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            user = User.authenticate(email, password)
            if not user:
                return Response({'error': 'Invalid credentials or Email not verified'}, status=status.HTTP_401_UNAUTHORIZED)
            
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
                max_age=60 * 15
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

class UserCookieJWTAuthentication(JWTAuthentication):
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

           
class UserVerifyAuthView(APIView):
    authentication_classes = [UserCookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not user or not getattr(user, 'is_authenticated', False):
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({
            'user_id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role,
        }, status=status.HTTP_200_OK)
        
class UserCookieTokenRefreshView(TokenRefreshView):
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
            max_age=60 * 15  # 15 minutes
        )
        return response

class UserLogoutView(APIView):
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

class UserSignupView(APIView):
    authentication_classes = [UserCookieJWTAuthentication]
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UserSignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            send_verification_email(user)
            
            return Response({
                'name': user.name,
                'email': user.email,
                'role': user.role,
                'message': 'Signup Successful. Please check your email to verify your account'
                },status=201)
        return Response(serializer.errors, status=400)

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        token = request.query_params.get("token")
        user_id = request.query_params.get("user_id")
        if not token:
            return Response({"error": "Verification token missing"})
        if not user_id:
            return Response({"error": "User id missing"})
        try:
            user_doc = user_collection.find_one({
                "_id": ObjectId(user_id),
                "verification_token": token
            })
        except Exception as e:
            return Response({"error": "Invalid user id format"}, status=status.HTTP_400_BAD_REQUEST)
        if not user_doc:
            return Response({"error": "Invalid Token"})
        
        token_expires_at = user_doc.get("token_expires_at")
        if not token_expires_at or datetime.utcnow() > token_expires_at:
            return Response({"error": "Token has expired"}, status=status.HTTP_400_BAD_REQUEST)
        
        user_collection.update_one(
            {"_id": user_doc["_id"]},
            {"$set": {"is_verified": True}, "$unset": {"verification_token": "", "token_expires_at": ""}}
        )
        
        # return Response({"message": "Email verified successfully"}, status=status.HTTP_200_OK)
        return redirect (f"{settings.FRONTEND_URL}/user/login")

# Cart Views

class AddToCartView(APIView):
   authentication_classes = [UserCookieJWTAuthentication]
   permission_classes = [IsAuthenticated]
   def post(self, request):
        user_id = str(request.user.id)
        product_id = request.data.get("product_id")
        if not product_id:
            return Response({"error": "product_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            product_data = product_collection.find_one({"_id": ObjectId(product_id)})
        except Exception:
            return Response({"error": "Invalid product id format"}, status=status.HTTP_400_BAD_REQUEST)
        if not product_data:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        
        quantity = request.data.get("quantity", 1)
        
        cart_item = Cart.create_cart_item(user_id, product_data, quantity)
        
        cart_item_dict = {
            "id": str(cart_item.id),
            "user_id": cart_item.user_id,
            "product_id": cart_item.product_id,
            "product_name": cart_item.product_name,
            "price": cart_item.price,
            "quantity": cart_item.quantity,
            "image": cart_item.image,
            "discount": cart_item.discount,
            "size": cart_item.size,
            "color": cart_item.color,
            "material": cart_item.material,
            "created_at": cart_item.created_at,
            "updated_at": cart_item.updated_at,
        }
        return Response({"message": "Cart item created", "cart_item": cart_item_dict}, status=status.HTTP_201_CREATED)

class UpdateCartView(APIView):
    authentication_classes = [UserCookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def put(self, request, cart_item_id):
        try:
            user_id = str(request.user.id)
            update_data = {}
            if "quantity" in request.data:
                update_data["quantity"] = request.data["quantity"]
            if not update_data:
                return Response({"error": "No update data provided"}, status=status.HTTP_400_BAD_REQUEST)
            modified_count = Cart.update_cart_item(cart_item_id, user_id, update_data)
            if modified_count is None:
                 return Response({"error": "Update method did not return a value"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            if modified_count > 0:    
                return Response({"message": "Cart item updated successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": repr(e)}, status=status.HTTP_404_NOT_FOUND)

class DeleteCartView(APIView):
    authentication_classes = [UserCookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def delete(self, request, cart_item_id):
        user_id = str(request.user.id)
        deleted_count = Cart.delete_cart_item(cart_item_id, user_id)
        if deleted_count > 0:
            return Response({"message": "Cart item deleted successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND)
    
    
class ListCartView(APIView):
    authentication_classes = [UserCookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user_id = str(request.user.id)
        cart_items = Cart.get_cart_items(user_id)
        for item in cart_items:
            item["id"] = str(item["_id"])
            del item["_id"]
        return Response({"cart_items": cart_items}, status=status.HTTP_200_OK)



    



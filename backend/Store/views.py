from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from Admin.models.product import Product
from Admin.models.category import Category
from Store.services import get_one_product_by_name
from Store.services import get_filtered_products


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
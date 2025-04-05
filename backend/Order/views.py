from django.shortcuts import render
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from Store.models.models import User
from Store.models.cart_model import Cart
from Order.models import Order


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


class CreateOrderView(APIView):
    authentication_classes = [UserCookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user_id = str(request.user.id)
        cart_items = Cart.get_cart_items(user_id)  # Assumes you have a Cart utility
        
        if not cart_items:
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate shipping details
        shipping_details = request.data.get("shipping_details")
        required_fields = ["name", "email", "phone", "address", "postal_code", "city"]
        if not shipping_details or not all(field in shipping_details for field in required_fields):
            return Response({"error": "Invalid shipping details. Please include name, email, phone, address, postal code, and city."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Create order from cart
            order_id = Order.create_from_cart(
                user_id=user_id,
                cart_items=cart_items,
                shipping_details=shipping_details,
                payment_method=request.data.get("payment_method", "Cash on Delivery")
            )
            
            # Fetch the created order
            order = Order.get_order_by_id(order_id)
            
            # Convert order to response format
            order_data = {
                "order_id": str(order["_id"]),
                "user_id": order["user_id"],
                "total": order["total"],
                "order_status": order["order_status"],
                "payment_status": order["payment_status"],
                "payment_method": order["payment_method"],
                "items": order["items"],
                "shipping_details": order["shipping_details"],
                "created_at": order["created_at"].isoformat(),
                "updated_at": order["updated_at"].isoformat(),
            }
            
            return Response({
                "message": "Order created successfully", 
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ListOrdersView(APIView):
    authentication_classes = [UserCookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = str(request.user.id)
        status_filter = request.query_params.get("status")  # Optional status filter

        orders = Order.find_by_user(user_id, status=status_filter)

        # Serialize orders
        serialized_orders = []
        for order in orders:
            serialized_orders.append({
                "order_id": order["_id"],
                "user_id": order["user_id"],
                "total": order["total"],
                "order_status": order["order_status"],
                "payment_status": order["payment_status"],
                "payment_method": order["payment_method"],
                "items": order["items"],
                "shipping_details": order["shipping_details"],
                "created_at": order["created_at"].isoformat(),
                "updated_at": order["updated_at"].isoformat(),
            })

        return Response({"orders": serialized_orders}, status=status.HTTP_200_OK)


class OrderDetailView(APIView):
    authentication_classes = [UserCookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        try:
            # Fetch order from database
            order = Order.get_order_by_id(order_id)
            if not order:
                return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

            # Verify user ownership
            if str(order["user_id"]) != str(request.user.id):
                return Response({"error": "Unauthorized access"}, status=status.HTTP_403_FORBIDDEN)

            # Serialize order
            order_data = {
                "order_id": str(order["_id"]),
                "user_id": order["user_id"],
                "total": order["total"],
                "order_status": order["order_status"],
                "payment_status": order["payment_status"],
                "payment_method": order["payment_method"],
                "items": order["items"],
                "shipping_details": order["shipping_details"],
                "created_at": order["created_at"].isoformat(),
                "updated_at": order["updated_at"].isoformat(),
            }

            return Response({"order": order_data}, status=status.HTTP_200_OK)

        except Exception:
            return Response({"error": "Invalid order ID"}, status=status.HTTP_400_BAD_REQUEST)


class ListOrdersAdminView(APIView):
    authentication_classes = [UserCookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            orders = Order.get_all_orders()

            serialized_orders = []
            for order in orders:
                serialized_orders.append({
                    "order_id": order["_id"],
                    "user_id": order["user_id"],
                    "total": order["total"],
                    "order_status": order["order_status"],
                    "payment_status": order["payment_status"],
                    "payment_method": order["payment_method"],
                    "items": order["items"],
                    "shipping_details": order["shipping_details"],
                    "created_at": order["created_at"].isoformat(),
                    "updated_at": order["updated_at"].isoformat(),
                })
                
            return Response({"orders": serialized_orders}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"An error occurred while fetching orders: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OrderDetailAdminView(APIView):
    authentication_classes = [UserCookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        try:
            # Fetch order from database
            order = Order.get_order_by_id(order_id)
            if not order:
                return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

            # Serialize order
            order_data = {
                "order_id": str(order["_id"]),
                "user_id": order["user_id"],
                "total": order["total"],
                "order_status": order["order_status"],
                "payment_status": order["payment_status"],
                "payment_method": order["payment_method"],
                "items": order["items"],
                "shipping_details": order["shipping_details"],
                "created_at": order["created_at"].isoformat(),
                "updated_at": order["updated_at"].isoformat(),
            }

            return Response({"order": order_data}, status=status.HTTP_200_OK)

        except Exception:
            return Response({"error": "Invalid order ID"}, status=status.HTTP_400_BAD_REQUEST)



class UpdateOrderStatusView(APIView):
    """Allows admins to update order status."""
    authentication_classes = [UserCookieJWTAuthentication]
    permission_classes = [IsAuthenticated]  

    def patch(self, request, order_id):
        new_status = request.data.get("order_status")

        if not new_status:
            return Response({"error": "Order status is required"}, status=status.HTTP_400_BAD_REQUEST)

        updated = Order.update_status(order_id, new_status)
        if not updated:
            return Response({"error": "Failed to update order status"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Order status updated successfully"}, status=status.HTTP_200_OK)


class UpdatePaymentStatusView(APIView):
    """Allows updating payment status for an order."""
    authentication_classes = [UserCookieJWTAuthentication]
    permission_classes = [IsAuthenticated]  # Modify for admin-level permission control

    def patch(self, request, order_id):
        new_payment_status = request.data.get("payment_status")

        if not new_payment_status:
            return Response({"error": "Payment status is required"}, status=status.HTTP_400_BAD_REQUEST)

        updated = Order.update_payment_status(order_id, new_payment_status)
        if not updated:
            return Response({"error": "Failed to update payment status"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Payment status updated successfully"}, status=status.HTTP_200_OK)

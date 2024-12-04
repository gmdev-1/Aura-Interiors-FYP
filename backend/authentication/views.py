from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from decouple import config
from django.contrib.auth.hashers import check_password
from authentication.models import User

class SignupView(APIView):
    def post(self, request):
        data = request.data
        try:
            user = User(
                name=data.get('name'),
                email=data.get('email'),
                phone=data.get('phone'),
                password=data.get('password')
                )
            user.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class SigninView(APIView):
    def post(self, request):
        data = request.data
        try:
            if not data.get('email') or not data.get('password'):
              return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
            
            user_data = User.find_by_email(data.get('email'))
            if not user_data:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
         
            if not User.check_password(user_data['password'], data.get('password')) or user_data.password.strip() == "":
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
               
            refresh = RefreshToken.for_user(user_data)
            access_token = refresh.access_token
            
            return Response({
                    'refresh': str(refresh),
                    'access_token': str(access_token),
                    'message': 'Sign-in Successful',
                }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)    
    
            
class CustomTokenRefreshView(TokenRefreshView):
     def post(self, request, *args, **kwargs):
        try:
            # Call the default behavior of TokenRefreshView
            response = super().post(request, *args, **kwargs)
            return Response({
                "access_token": response.data.get("access"),
                "message": "Token refreshed successfully."
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
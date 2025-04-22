from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from Store.models.models import User


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


class DesignGenerateView(APIView):
    authentication_classes = [UserCookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        
        


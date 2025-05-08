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
from rest_framework.parsers import MultiPartParser, FormParser
from Store.models.models import User
import io
import base64
import requests
from requests.exceptions import ConnectTimeout, ReadTimeout, RequestException
from PIL import Image
import json



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
    # parser_classes = [MultiPartParser, FormParser]
    authentication_classes = [UserCookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        prompt = request.data.get('prompt')
        width = request.data.get('width', 1024)
        height = request.data.get('height', 1024)
        steps = request.data.get('steps', 30)
        samples = request.data.get('samples', 1)
        cfg_scale = request.data.get('cfg_scale', 7)

        payload = {
            "text_prompts": [{"text": prompt}],
            "cfg_scale": cfg_scale,
            "height": height,
            "width": width,
            "samples": samples,
            "steps": steps,
        }
        url = f"{settings.API_HOST}/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image"
        headers = {
            "Authorization": f"Bearer {settings.STABILITY_API_KEY}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        try:
            body = json.dumps(payload)
            resp = requests.post(url, json=payload, headers=headers, timeout=30)
        except ConnectTimeout:
            return Response(
                {"detail": "Connection to Stability API timed out."},
                status=status.HTTP_504_GATEWAY_TIMEOUT
            )
        except ReadTimeout:
            return Response(
                {"detail": "Stability API took too long to respond."},
                status=status.HTTP_504_GATEWAY_TIMEOUT
            )
        except RequestException as e:
            return Response(
                {"detail": f"Network error calling Stability API: {str(e)}"},
                status=status.HTTP_502_BAD_GATEWAY
            )

        # Now handle non-200 *without* wrapping it as a generic 502
        if resp.status_code != 200:
            # Forward the Stability API’s own error JSON and status code
            try:
                err = resp.json()
            except ValueError:
                err = {"detail": "Stability API returned an unexpected error."}
            return Response(err, status=resp.status_code)

        data = resp.json()
        images = [art['base64'] for art in data.get('artifacts', [])]
        return Response({"images": images})
    


class DesignGenerateControlView(APIView):
    parser_classes = [MultiPartParser]
    authentication_classes = [UserCookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Fetch fields
        prompt = request.data.get('prompt')
        init_image = request.data.get('image')                
        strength = float(request.data.get('control_strength', 0.7))
        negative = request.data.get('negative_prompt', '')
        seed = int(request.data.get('seed', 0))
        style = request.data.get('style_preset', 'digital-art')

        # Prepare multipart payload
        files = {'image': init_image}
        data = {
            'prompt': prompt,
            'control_strength': strength,
            'negative_prompt': negative,
            'seed': seed,
            'style_preset': style,
        }
        url = f"{settings.API_HOST}/v2beta/stable-image/control/structure"
        headers = {
            'Authorization': f"Bearer {settings.STABILITY_API_KEY}",
            'Accept': 'application/json',
        }

        resp = requests.post(url, files=files, data=data, headers=headers)
        if resp.status_code != 200:
            return Response(resp.json(), status=resp.status_code)

        artifacts = resp.json().get('artifacts', [])
        images = [art['base64'] for art in artifacts]
        return Response({'images': images}, status=status.HTTP_200_OK)
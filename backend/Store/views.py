from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from Store.serializers import UserSerializer

class SignupView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        try:
            data = request.data
            email = data.get('email', '').strip().lower()
            password = data.get('password', '').strip()

            if not email or not password:
                return Response(
                    {'error': 'Email and password are required.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Authenticate user
            user = User.authenticate(email, password)
            
            if not user:
                return Response(
                    {'error': 'Invalid email or password'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            # Add custom claims
            access_token['role'] = user.role
            access_token['email'] = user.email
            access_token['user_id'] = user.id  # Add user_id to token
            
            return Response({
                'refresh': str(refresh),
                'access_token': str(access_token),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'name': user.name,
                    'role': user.role
                },
                'message': 'Sign-in Successful'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
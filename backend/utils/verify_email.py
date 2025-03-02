from django.conf import settings
from datetime import datetime, timedelta
import secrets
from django.core.mail import send_mail
from Store.models.models import User

def send_verification_email(user):
    token = secrets.token_hex(64)
    token_expires_at = datetime.utcnow() + timedelta(hours=24)
    
    user.verification_token = token
    user.token_expires_at = token_expires_at
    user.update_verification_token(token, token_expires_at)
            
    verification_link = f"{settings.BACKEND_URL}/user/verify-email/?user_id={user.id}&token={token}"
            
    send_mail(
        subject="Verify your email",
        message=f"""Hello, {user.name}

        Please click the link below to verify your email address:

        {verification_link}

        Thanks,
        Team Aura Interiors
        """,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False
    )


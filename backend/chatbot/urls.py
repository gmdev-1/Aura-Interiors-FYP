from django.urls import path
from django.conf import settings
from chatbot.views import ChatbotView

urlpatterns = [
    path('/chat', ChatbotView.as_view(), name='chat')
]


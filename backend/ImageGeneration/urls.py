from django.urls import path
from django.conf import settings
from ImageGeneration.views import DesignGenerateView

urlpatterns = [
    path('interior-design/generate/', DesignGenerateView.as_view(), name='design-generate'),
]
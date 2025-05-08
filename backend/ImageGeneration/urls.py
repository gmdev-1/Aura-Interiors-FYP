from django.urls import path
from django.conf import settings
from ImageGeneration.views import DesignGenerateView, DesignGenerateControlView

urlpatterns = [
    path('interior-design/generate/', DesignGenerateView.as_view(), name='design-generate'),
    path('interior-design/control/', DesignGenerateView.as_view(), name='design-control'),
]
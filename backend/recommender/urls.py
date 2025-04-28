from django.urls import path
from django.conf import settings
from recommender.views import RecommenderView

urlpatterns = [
    path('recommend/<str:product_name>/', RecommenderView.as_view(), name='recommend')
]

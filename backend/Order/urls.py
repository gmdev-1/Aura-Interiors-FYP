from django.urls import path
from django.conf import settings
from Order.views import CreateOrderView, ListOrdersView, OrderDetailView


urlpatterns = [
    path('create-order/', CreateOrderView.as_view(), name='create-order'),
    path('order-list/', ListOrdersView.as_view(), name='order-list'),
    path('order-detail/<str:order_id>/', OrderDetailView.as_view(), name='order-detail'),
    
]
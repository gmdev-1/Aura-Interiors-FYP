from django.urls import path
from django.conf import settings
from Order.views import CreateOrderView, ListOrdersView, OrderDetailView, ListOrdersAdminView, OrderDetailAdminView, UpdateOrderStatusView, UpdatePaymentStatusView


urlpatterns = [
    path('create-order/', CreateOrderView.as_view(), name='create-order'),
    path('order-list/', ListOrdersView.as_view(), name='order-list'),
    path('order-detail/<str:order_id>/', OrderDetailView.as_view(), name='order-detail'),
    path('order-list-admin/', ListOrdersAdminView.as_view(), name='order-list-admin'),
    path('order-detail-admin/<str:order_id>/', OrderDetailAdminView.as_view(), name='order-detail-admin'),
    path('update-status/<str:order_id>/', UpdateOrderStatusView.as_view(), name='update-status'),
    path('update-payment/<str:order_id>/', UpdatePaymentStatusView.as_view(), name='update-payment'),
]
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from Store.views import CategoriesFilterView, ProductShopView, ProductDetailView, ProductShopFilterView

urlpatterns = [
    path('products-shop/', ProductShopView.as_view(), name='products-shop'),
    path('products-shop/filter/', ProductShopFilterView.as_view(), name='products-shop-filter'),
    path('product-detail/<str:name>/', ProductDetailView.as_view(), name='product-detail'),
    path('categories-filter/', CategoriesFilterView.as_view(), name='categories-filter'),
]
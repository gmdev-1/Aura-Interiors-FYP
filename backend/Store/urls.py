from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from Store.views import UserSignupView, UserLoginView, UserVerifyAuthView, UserCookieTokenRefreshView, VerifyEmailView, UserLogoutView, HomeCategoriesView, TopProductsView, HomeCarousalsView, CategoriesFilterView, ProductShopView, ProductDetailView, ProductShopFilterView

urlpatterns = [
    path('user/signup/', UserSignupView.as_view(), name='user-signup'),
    path('user/login/', UserLoginView.as_view(), name='user-login'),
    path('user/verify-auth/', UserVerifyAuthView.as_view(), name='user-verify-auth'),
    path('user/token-refresh/', UserCookieTokenRefreshView.as_view(), name='user-token-refresh'),
    path('user/verify-email/', VerifyEmailView.as_view(), name='user-verify-email'),
    path('user/logout/', UserLogoutView.as_view(), name='user-logout'),
    
    path('home-categories/', HomeCategoriesView.as_view(), name='home-categories'),
    path('top-products/', TopProductsView.as_view(), name='top-products'),
    path('home-carousals/', HomeCarousalsView.as_view(), name='home-carousals'),
    path('products-shop/', ProductShopView.as_view(), name='products-shop'),
    path('products-shop/filter/', ProductShopFilterView.as_view(), name='products-shop-filter'),
    path('product-detail/<str:name>/', ProductDetailView.as_view(), name='product-detail'),
    path('categories-filter/', CategoriesFilterView.as_view(), name='categories-filter'),
]
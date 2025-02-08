from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from Admin.views import CategoryCreateView, CategoriesListView, CategoryRetrieveView, CategoryDeleteView, CategoryUpdateView, ProductCreateView, ProductsListView, ProductRetrieveView, ProductDeleteView, ProductUpdateView, CarousalCreateView, CarousalsListView, CarousalDeleteView

urlpatterns = [
    path('add-category/', CategoryCreateView.as_view(), name='add-category'),
    path('get-categories/', CategoriesListView.as_view(), name='get-categories'),
    path('get-category/<str:category_id>/', CategoryRetrieveView.as_view(), name='get-category'),
    path('delete-category/<category_id>/', CategoryDeleteView.as_view(), name='delete-category'),
    path('edit-category/<category_id>/', CategoryUpdateView.as_view(), name='edit-category'),
    
    path('add-product/', ProductCreateView.as_view(), name='add-product'),
    path('get-products/', ProductsListView.as_view(), name='get-products'),
    path('get-product/<str:product_id>/', ProductRetrieveView.as_view(), name='get-product'),
    path('delete-product/<product_id>/', ProductDeleteView.as_view(), name='delete-product'),
    path('edit-product/<product_id>/', ProductUpdateView.as_view(), name='edit-product'),
    
    path('add-carousal/', CarousalCreateView.as_view(), name='add-carousal'),
    path('get-carousals/', CarousalsListView.as_view(), name='get-carousals'),
    path('delete-carousal/<carousal_id>/', CarousalDeleteView.as_view(), name='delete-carousal'),
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

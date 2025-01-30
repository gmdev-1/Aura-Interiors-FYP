from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from Admin.views import AddCategoryView, GetCategoriesView, GetOneCategoryView, DeleteCategoryView, EditCategoryView

urlpatterns = [
    path('add-category/', AddCategoryView.as_view(), name='add-category'),
    path('get-categories/', GetCategoriesView.as_view(), name='get-categories'),
    path('get-category/<str:category_id>/', GetOneCategoryView.as_view(), name='get-category'),
    path('delete-category/<category_id>/', DeleteCategoryView.as_view(), name='delete-category'),
    path('edit-category/<category_id>/', EditCategoryView.as_view(), name='edit-category'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

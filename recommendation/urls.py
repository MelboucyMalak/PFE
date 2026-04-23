from django.urls import path

from recommendation import views
urlpatterns = [
    path("farmer/dashboard",views.recommendation_api_view),
    path("farmer/recommended-crop",views.croplist_api_view)
]

from django.urls import path

from recommendation import views
urlpatterns = [
    path("",views.recommendation_api_view),
    path("crop_list",views.croplist_api_view)
]

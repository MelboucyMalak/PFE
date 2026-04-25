from django.urls import path

from recommendation import views
urlpatterns = [
    path("api/recommenadation",views.recommendation_api_view),
    path("api/crop-recomendation",views.croplist_api_view),
    path("api/recommendation/favorite",views.favorite_api_view),
]

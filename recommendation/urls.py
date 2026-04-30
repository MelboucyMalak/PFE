from django.urls import path

from recommendation import views
urlpatterns = [
    path("api/recommendation",views.recommendation_api_view),
    path("api/crop-recommendation",views.croplist_api_view),
    path("api/recommendation/favorite",views.favorite_api_view),
    path("api/meteo",views.get_meteo),
    path("api/history",views.recommondation_history),
    path("api/favorite",views.recommondation_favorite),
]

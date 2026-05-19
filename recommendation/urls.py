from django.urls import path

from recommendation import views
urlpatterns = [
    path("api/recommendation",views.recommendation_api_view),# create recommendation
    path("api/crop-recommendation",views.croplist_api_view),# see crop recommendation
    path("api/recommendation/favorite",views.favorite_api_view),# add recommendation to fav
    path("api/meteo",views.get_meteo),# ta3 meteo
    path("api/history",views.recommondation_history),# historique ta3 recommendation
    path("api/favorite",views.recommondation_favorite),# list ta3 fav recommendation
]

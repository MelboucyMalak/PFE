from django.urls import path

from recommendation import api

urlpatterns = [
    path("api/recommendation_list",api.recommendation_list_api,name="recommendation_list"),
    path("api/plan_list",api.plan_list_api,name="plan_list")
]

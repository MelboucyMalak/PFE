from django.urls import path, include

from user import api

urlpatterns = [
    path("api/user_list",api.user_list_api,name="user_list"),
]


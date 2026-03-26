from django.urls import path, include

from user import views

urlpatterns = [
    path("api/user_list",views.user_list_api,name="user_list"),
]


from django.urls import path, include

from user import views


urlpatterns = [
    path("admin/user-management",views.user_list,name="user_list"),
    path("admin/user-management/<int:id>",views.user_details,name="user_details"),
    path('',include('crop.urls')),
    path("admin/login",views.login),
    path("admin/logout",views.logout),
    path("farmer/login",views.login),
    path("farmer/logout",views.logout),
    path("farmer/register",views.register)

]


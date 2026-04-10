#user/urls.py
from django.urls import path, include
from django.utils.cache import patch_vary_headers
from django_rest_passwordreset.views import ResetPasswordRequestToken, ResetPasswordConfirm

from user import views


urlpatterns = [
    path("admin/user-management",views.user_list,name="user_list"),
    path("admin/user-management/<int:id>",views.user_details,name="user_details"),
    path('',include('crop.urls')),
    path("admin/login",views.login),
    path("admin/logout",views.logout),
    path("farmer/login",views.login),
    path("farmer/logout",views.logout),
    path("farmer/register",views.register),
    path("admin/Profile",views.change_password),
    path("farmer/Profile",views.change_password),
    path('admin/forgot-password/', ResetPasswordRequestToken.as_view(), name="forgot-password"),
    path('admin/test-code',views.testcode,name='test-code'),
    path('admin/reset-password', ResetPasswordConfirm.as_view(), name="confirm-password"),
    path('farmer/forgot-password/', ResetPasswordRequestToken.as_view(), name="forgot-password"),
    path('admin/test-code', views.testcode, name='test-code'),
    path('farmer/reset-password', ResetPasswordConfirm.as_view(), name="confirm-password"),
    path("api/map",views.save_recommendation,name="save_recommendation"),
]


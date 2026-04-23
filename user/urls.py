#user/urls.py
from django.urls import path, include
from django_rest_passwordreset.views import ResetPasswordRequestToken, ResetPasswordConfirm

from user import views


urlpatterns = [
    path("admin/user-management",views.user_list,name="user_list"),
    path("admin/user-management/<int:id>",views.user_details,name="user_details"),
    path('',include('crop.urls')),
    path("login",views.login),
    path("admin/logout",views.logout),
    path("farmer/logout",views.logout),
    path("sign-up",views.register),
    path("admin/Profile",views.change_password),
    path("farmer/Profile",views.change_password),
    path('forgot-password', ResetPasswordRequestToken.as_view(), name="forgot-password"),
    path('verify-password',views.testcode,name='test-code'),
    path('reset-password', ResetPasswordConfirm.as_view(), name="confirm-password"),]


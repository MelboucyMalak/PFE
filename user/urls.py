#user/urls.py
from django.urls import path, include
from django_rest_passwordreset.views import ResetPasswordRequestToken, ResetPasswordConfirm

from user import views


urlpatterns = [
    path("api/users",views.user_list,name="user_list"),
    path("api/users/<int:id>",views.user_details,name="user_details"),
    path("api/login",views.login),
    path("api/logout",views.logout),
    path("api/sign-up",views.register),
    path("api/Profile/change-password",views.change_password),# not complete
    path('api/forgot-password', views.forgot_password, name="forgot-password"),
    path('api/verify-password',views.testcode,name='test-code'),
    path('api/reset-password', ResetPasswordConfirm.as_view(), name="confirm-password"),
]



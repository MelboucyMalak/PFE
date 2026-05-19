#user/urls.py
from django.urls import path, include
from django_rest_passwordreset.views import ResetPasswordRequestToken, ResetPasswordConfirm

from user import views


urlpatterns = [
    path("api/users",views.user_list,name="user_list"),# user list (admin)
    path("api/users/<int:id>",views.user_details,name="user_details"),# user details ( admin)
    path("api/me",views.user_own_data,name="user profile"),# user details (user)
    path("api/login",views.login),#login
    path("api/logout",views.logout),#logout
    path("api/sign-up",views.register),#sign up
    path("api/Profile/change-password",views.change_password),# not complete  # i forget why i added his comment anyway it work i geuss
    path('api/forgot-password', views.forgot_password, name="forgot-password"),# forget password
    path('api/verify-password',views.testcode,name='test-code'),#test code sent to email
    path('api/reset-password', ResetPasswordConfirm.as_view(), name="reset-password"),# reset password( forget password)
]



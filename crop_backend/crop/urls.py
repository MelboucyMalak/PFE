from django.urls import path

from crop import  views

urlpatterns = [
    path('api/crop_list',views.crop_list_api),
]

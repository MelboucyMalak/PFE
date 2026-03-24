from django.urls import path

from crop import  api

urlpatterns = [
    path('api/crop_list',api.crop_list_api),
    #path('a',views.crop_detail),
]

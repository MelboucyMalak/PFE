from django.urls import path

from crop import views

urlpatterns = [
  path('', views.crops_list, name='cropList' ),
  path('cropProtocole/',views.crop,name='crop'),
]

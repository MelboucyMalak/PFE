from django.urls import path

from crop import views

urlpatterns = [
  path('cropList/', views.crops_list, name='cropList' ),
  path('cropList/<str:name>/',views.crop,name='crop'),
]

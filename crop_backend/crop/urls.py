from django.urls import path

from crop import  views

urlpatterns = [
    path('farmer/crops-consulting/',views.crop_list),
    path('farmer/crops-consulting/<int:pk>/', views.crop_detail),
    path('admin/crops-managment/', views.CropViewSet.as_view({'get': 'list', 'post': 'create'}),name='crop_list'),# the admin can see the list of crops and add only
    path('admin/crops-managment/<int:pk>/', views.CropViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),# the admin can update / delete only

]
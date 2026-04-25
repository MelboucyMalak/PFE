from django.urls import path

from crop import  views

urlpatterns = [
    path('api/farmer/crops/',views.crop_list),
    path('api/farmer/crops/<int:pk>', views.crop_detail),
    path('api/admin/crops/', views.CropViewSet.as_view({'get': 'list', 'post': 'create'}),name='crop_list'),# the admin can see the list of crops and add only
    path('api/admin/crops/<int:pk>', views.CropViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),# the admin can update / delete only

]

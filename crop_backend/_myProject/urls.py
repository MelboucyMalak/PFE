# my project/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('dev/', admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
    path('', include('user.urls')),
    #path('crop_api/', include('crop.urls')),
    path('/api/map/data/', include('recommendation.urls')),

]

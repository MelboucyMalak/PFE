# my project/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('dev/', admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
    path('', include('user.urls')),
    path('',include('crop.urls')),
    path('', include('recommendation.urls')),
    path('api/field/', include('Field.urls')),
]

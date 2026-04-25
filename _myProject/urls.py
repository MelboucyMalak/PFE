# my project/urls.py
from django.contrib import admin
from django.urls import path, include

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.urls import path
from django.urls import re_path
from rest_framework.permissions import AllowAny

schema_view = get_schema_view(
   openapi.Info(
      title="Your API",
      default_version='v1',
      description="API documentation",
   ),
   public=True,
   permission_classes=[AllowAny],
)

urlpatterns = [

    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0)),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0)),
    path('dev/', admin.site.urls),
   # path("api-auth/", include("rest_framework.urls")),
    # your routes...
    path('', include('user.urls')),
    path('',include('crop.urls')),
    path('', include('recommendation.urls')),
    path('api/field/', include('Field.urls')),
]

# my project/urls.py
from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework.permissions import AllowAny

def public_endpoint(view_func):
    view_func = csrf_exempt(view_func)
    return view_func
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

    path('swagger/', public_endpoint(schema_view.with_ui('swagger', cache_timeout=0))),
    path('redoc/', public_endpoint(schema_view.with_ui('redoc', cache_timeout=0))),
    path('dev/', admin.site.urls),
   # path("api-auth/", include("rest_framework.urls")),
    # your routes...
    path('', include('user.urls')),
    path('',include('crop.urls')),
    path('', include('recommendation.urls')),
    path('api/field/', include('Field.urls')),
]

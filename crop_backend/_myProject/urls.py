from django.contrib import admin
from django.urls import path, include

from core import urls as core_urls
from crop import urls as crop_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include(core_urls)),
    path('cropManagments/',include(crop_urls)),
]

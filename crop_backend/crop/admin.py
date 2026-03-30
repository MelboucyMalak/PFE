from django.contrib import admin
from .models import Crop,CropClimate,Climate,CropSoilTexture
# Register your models here.
admin.site.register(Crop)
admin.site.register(CropClimate)
admin.site.register(CropSoilTexture)
admin.site.register(Climate)

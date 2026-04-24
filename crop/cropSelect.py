from django.db.models import Q

from .models import Crop


def Cropselect(ph, soil_texture, rainfall, temperature, humedity, koppen):

    return Crop.objects.filter(
        cropclimate__climate__climate_zone=koppen,

        temp_min__lte=temperature,# <=
        temp_max__gte=temperature,# >=

        water_min_mm__lte=rainfall,# <=
        water_max_mm__gte=rainfall,# >=

        humidity_min__lte=humedity,# <=
        humidity_max__gte=humedity,# >=

        cropsoiltexture__texture_name=soil_texture,

    ).filter(
        Q(ph_min__lte=ph, ph_max__gte=ph) |
        Q(ph_min__gte=ph + 0.5)
    ).distinct()

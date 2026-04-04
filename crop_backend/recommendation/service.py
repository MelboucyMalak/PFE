from rest_framework.exceptions import ValidationError

from .errors import NotInsideALgeria, NotSuitableLand, InvalidData
from .models import RecommendationSession,CropRecommendation
from rest_framework.exceptions import NotFound
from rest_framework.exceptions import NotFound

from .utils import is_inside_algeria, fetch_openlandmap_data,fetch_isda_data,fetch_environment_data,fetch_nasa_power_data

def is_ok(long,lat):
    if not is_inside_algeria(long,lat):
        raise NotInsideALgeria
    else:
        env=fetch_environment_data(long,lat)
        if env is None or env["Slope"] is None or env["land_cover"] is None:
            raise InvalidData
        if env["slope"] > 15:
            raise NotSuitableLand
        if env["land_cover"] == "Build-up":
            raise NotSuitableLand
    return env




"""def creatRecoomendation(long,lat,request):
    env=is_ok(long,lat)
    nasa = fetch_isda_data(long,lat)
    recommendation=RecommendationSession.objects.create(
        user= request.user.id,
        lat = lat,
        lon = long,
        n_total_raw_ppm =
        p_extractable_raw_ppm =
        k_extractable_raw_ppm =
        soil_texture_initial =
        soil_ph_initial =
        slope_angle =env["slope"],
        land_cover = env["land_cover"],
        rainfall_avg = env["rainfall"] if env["rainfall"] is not None else -1,
        temperature_avg =nasa["temperature_avg"] if env["temperature_avg"] is not None else -1,
        humidity_avg = nasa ["humidity_avg"] if env["humidity_avg"] is not None else -1,
        koppen = env["koppen"] if  env["koppen"] is not None else "",
    )
"""






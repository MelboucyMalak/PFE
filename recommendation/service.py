from .errors import NotInsideALgeria, NotSuitableLand, InvalidData
from .models import RecommendationSession,CropRecommendation
from .utils import is_inside_algeria, fetch_openlandmap_data, fetch_isda_data, fetch_environment_data, \
    fetch_nasa_power_data, initEE

initEE()
def is_ok(long,lat):
    if not is_inside_algeria(long,lat):
        raise NotInsideALgeria
    else:
        env=fetch_environment_data(long,lat)
        if env is None or env["slope"] is None or env["land_cover"] is None:
            raise InvalidData
        if env["slope"] > 15:
            raise NotSuitableLand
        if env["land_cover"] == "Build-up":
            raise NotSuitableLand
    return env



def creatRecomendation(request):
    lon=float( request.data.get("lon"))
    lat=float( request.data.get("lat"))
    # maybe the object already exist why create again
    maybe_exist=RecommendationSession.objects.filter(lat=lat,lon=lon).first()
    if maybe_exist:
        return maybe_exist
    # fetch the data
    env=is_ok(lon,lat)
    isda = fetch_isda_data(lon,lat)
    nasa = fetch_nasa_power_data(lon,lat)
    opnl = fetch_openlandmap_data(lon,lat)
    recommendation=RecommendationSession.objects.create(
        user= request.user,
        lat = float( request.data.get("lat")),
        lon = float( request.data.get("lon")),
        n_total_raw_ppm = isda["n"] if isda["n"] is not None else -1,
        p_extractable_raw_ppm = isda["p"] if isda["p"] is not None else -1,
        k_extractable_raw_ppm = isda["k"] if isda["k"] is not None else -1,
        soil_texture_initial = opnl["soil_texture"]if opnl["soil_texture"] is not None else "Unknown",
        soil_ph_initial = opnl["ph"] if opnl["ph"] is not None else -1,
        slope_angle =env["slope"],
        land_cover = env["land_cover"],
        rainfall_avg = env["rainfall"] if env["rainfall"] is not None else -1,
        temperature_avg =nasa["temperature_avg"] if nasa["temperature_avg"] is not None else -1,
        humidity_avg = nasa ["humidity_avg"] if nasa["humidity_avg"] is not None else -1,
        koppen = env["koppen"] if  env["koppen"] is not None else "Unknown"
    )
    return recommendation






from crop.cropSelect import Cropselect
from crop.models import CropClimate, CropSoilTexture, Crop
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
        if env["slope"] > 23:
            raise NotSuitableLand
        if env["land_cover"] == "Build-up":
            raise NotSuitableLand
    return env



def creatRecomendation(lat,lon):
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
        lat = float(lat),
        lon = float(lon),
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

def generate_CropRecommendations(id):
    recommendation=RecommendationSession.objects.get(pk=id)
    #ph, soil_texture, rainfall, temperature, humedity, koppen
    #
    crops=Cropselect(recommendation.soil_ph_initial,
               recommendation.soil_texture_initial,
               recommendation.rainfall_avg,
               recommendation.temperature_avg,
               recommendation.humidity_avg,
               recommendation.koppen)
    if not crops:
        return {}
    for data_crop in crops:
        crop=Crop.objects.get(crop_name=data_crop["crop_name"])
        if crop.ph_min <= recommendation.soil_ph_initial <= crop.ph_max:
            ph_score=1
        else:
            ph_score=0.5
        crop_climate = CropClimate.objects.get(crop=crop,climate__climate_zone=recommendation.koppen)
        climate_score = crop_climate.rating
        crop_soil = CropSoilTexture.objects.get(crop=crop,soil_texture__texture_class=recommendation.soil_texture_initial)
        soil_score = crop_soil. suitability_rank
        score= ph_score + climate_score + soil_score
        CropRecommendation.objects.create(
            recommendation=recommendation,
            crop=crop,
            compatibility_score=score,
        )
    crops=CropRecommendation.objects.filter(recommendation=recommendation)
    return crops




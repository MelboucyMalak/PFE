from _myProject.Errors.responses import error_response, AppError
from crop.cropSelect import Cropselect
from crop.models import CropClimate, CropSoilTexture
from .models import RecommendationSession,CropRecommendation
from .ExternalApiService import is_inside_algeria, fetch_openlandmap_data, fetch_isda_data, fetch_environment_data, \
    fetch_nasa_power_data
from concurrent.futures import ThreadPoolExecutor



def is_ok(long,lat):# check if point in algeria and if the slope land cover ysal7o using extAPI
    if not is_inside_algeria(long,lat):
        raise AppError("OUTSIDE_ALGERIA")
    else:
        env=fetch_environment_data(long,lat)
        if  env["slope"] == -1 or env["land_cover"] == "Unknown":
            raise AppError("INVALID_LAND_DATA")
        if env["slope"] > 23:
            raise AppError("NOT_SUITABLE_LAND")
        if env["land_cover"] == "Build-up":
            raise AppError("NOT_SUITABLE_LAND")
    return env


def createRecommendation(request):
    lat = float(request.data.get('lat'))
    lon = float(request.data.get('lon'))
    user = request.user

    maybe_exist = RecommendationSession.objects.filter(lat=lat, lon=lon, user=user).first()
    if maybe_exist:
        return maybe_exist

    env = is_ok(lon, lat)

    with ThreadPoolExecutor() as executor:# hadi fetch like in parellel bach nrba7 wa9t
        future_isda = executor.submit(fetch_isda_data, lon, lat)
        future_nasa = executor.submit(fetch_nasa_power_data, lon, lat)
        future_opnl = executor.submit(fetch_openlandmap_data, lon, lat)

        isda = future_isda.result()
        nasa = future_nasa.result()
        opnl = future_opnl.result()


    recommendation = RecommendationSession.objects.create(
        user=user,
        lat=float(lat),
        lon=float(lon),
        n_total_raw_ppm=isda['n'],
        p_extractable_raw_ppm=isda["p"],
        k_extractable_raw_ppm=isda["k"],
        bulk_density=isda.get("bulk_density", 1.3),
        soil_texture_initial=opnl["soil_texture"],
        soil_ph_initial=opnl["ph"],
        slope_angle=env["slope"],
        land_cover=env["land_cover"],
        rainfall_avg=env["rainfall"],
        temperature_avg=nasa["temperature_avg"],
        humidity_avg=nasa["humidity_avg"],
        koppen=env["koppen"]
    )
    return recommendation

def generate_CropRecommendations(id):
    crop_recommendation = CropRecommendation.objects.filter(recommendation_id=id)
    if crop_recommendation.exists():
        return crop_recommendation
    recommendation = RecommendationSession.objects.get(pk=id)
    #ph, soil_texture, rainfall, temperature, humedity, koppen
    crops=Cropselect(recommendation.soil_ph_initial,
               recommendation.soil_texture_initial,
               recommendation.rainfall_avg,
               recommendation.temperature_avg,
               recommendation.humidity_avg,
               recommendation.koppen)
    if not crops:
        return CropRecommendation.objects.none()
    for crop in crops:
        score=calculate_compatibility_score(crop,recommendation,recommendation.soil_texture_initial)
        CropRecommendation.objects.create(
            recommendation=recommendation,
            crop=crop,
            compatibility_score=score,
        )
    return CropRecommendation.objects.filter(recommendation=recommendation)

def calculate_compatibility_score(crop,session,soil):
    if crop.ph_min <= session.soil_ph_initial <= crop.ph_max:
        ph_score = 1
    else:
        ph_score = 0.5
    crop_climate = CropClimate.objects.get(crop=crop, climate__climate_zone=session.koppen)
    climate_score = crop_climate.rating
    crop_soil = CropSoilTexture.objects.get(
        crop=crop,
        texture_name=soil
    )
    soil_score = crop_soil.suitability_rank
    score = ph_score * 0.1 + climate_score * 0.6 * 1/8 + soil_score * 0.3 * 1/5
    return score * 100





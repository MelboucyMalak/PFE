import ee
import requests

def initEE():
    try:
        ee.Initialize(project='alpha-earth-test-486217')
    except Exception as e:
        print(f"Earth Engine not available: {e}")

def get_algeria():
    countries = ee.FeatureCollection("USDOS/LSIB_SIMPLE/2017")
    algeria = countries.filter(ee.Filter.eq('country_na', 'Algeria'))
    return algeria, algeria.geometry()

def is_inside_algeria(long,lat):
    algeria, x = get_algeria()
    point = ee.Geometry.Point(long, lat)
    # check if point is inside algeria
    is_inside = algeria.filterBounds(point).size().getInfo()
    if is_inside == 0:
         return False
    return True

def fetch_isda_data(long,lat):
    algeria, x = get_algeria()
    point=ee.Geometry.Point(long, lat)
    n_total = ee.Image("ISDASOIL/Africa/v1/nitrogen_total").select('mean_0_20')
    p_ext = ee.Image("ISDASOIL/Africa/v1/phosphorus_extractable").select('mean_0_20')
    k_ext = ee.Image("ISDASOIL/Africa/v1/potassium_extractable").select('mean_0_20')
    N_final = n_total.clip(algeria).rename('Nitrogen_mg_kg')
    P_final = p_ext.clip(algeria).rename('Phosphorus_mg_kg')
    K_final = k_ext.clip(algeria).rename('Potassium_mg_kg')
    combined = ee.Image.cat([N_final, P_final, K_final])
    sample = combined.sample(point, 30).first()
    if sample is None:
        return None
    def _get(name):
        try:
            return sample.get(name).getInfo()
        except:
            return None
    n_val =_get('Nitrogen_mg_kg')
    p_val = _get('Phosphorus_mg_kg')
    k_val = _get('Potassium_mg_kg')
    if n_val is None and p_val is None and k_val is None:
        return None
    return  {'n': n_val,'p': p_val,'k': k_val}

def fetch_openlandmap_data(long,lat):
    algeria, x = get_algeria()
    point = ee.Geometry.Point(long, lat)
    texture_classes = {
        1: 'Sand', 2: 'Loamy Sand', 3: 'Sandy Loam', 4: 'Loam',
        5: 'Silt Loam', 6: 'Silt', 7: 'Sandy Clay Loam', 8: 'Clay Loam',
        9: 'Silty Clay Loam', 10: 'Sandy Clay', 11: 'Silty Clay', 12: 'Clay'
    }
    # Load images
    soil_texture = ee.Image("OpenLandMap/SOL/SOL_TEXTURE-CLASS_USDA-TT_M/v02").select('b0')
    soil_ph = ee.Image("OpenLandMap/SOL/SOL_PH-H2O_USDA-4C1A2A_M/v02").select('b30')

    # Combine into one image
    combined = ee.Image.cat([soil_texture, soil_ph]).clip(algeria)

    # Sample once
    sample = combined.sample(point, 30).first()
    if sample is None:
        return None

    try:
        info = sample.getInfo()['properties']
    except:
        info = None

    class_number = info['b0']
    ph_value = info['b30'] / 10.0  # Divide by 10 as required

    if class_number is None and ph_value is None :
        return None
    soil_texture_name = texture_classes.get(class_number, "Unknown")

    return {"soil_texture": soil_texture_name, "ph": round(ph_value, 2)}

def fetch_nasa_power_data(long, lat):
    algeria, x = get_algeria()
    url = (
        f"https://power.larc.nasa.gov/api/temporal/monthly/point"
        f"?parameters=T2M,RH2M"
        f"&community=ag"
        f"&longitude={long}"
        f"&latitude={lat}"
        f"&start=2015"
        f"&end=2020"
        f"&format=JSON"
    )
    try:
        response = requests.get(url, timeout=10)
        data = response.json()
        params = data['properties']['parameter']
        def avg_param(name):
            values_dict = params.get(name)
            if not values_dict:
                return None
            values = [v for v in values_dict.values() if v is not None and v != -999]
            if not values:
                return None
            return round(sum(values) / len(values), 2)

        if avg_param('RH2M') is None and  avg_param("T2M") is None :
            return None

        return {
            "temperature_avg": avg_param("T2M"),
            "humidity_avg": avg_param("RH2M")
        }

    except Exception as e:
        print("NASA API Error:", e)
        return None

def fetch_environment_data(long, lat):
    algeria, x = get_algeria()
    point = ee.Geometry.Point(long, lat)

    # ----- Load datasets -----
    landCover = ee.Image("ESA/WorldCover/v200/2021").rename('land_cover')
    srtm = ee.Image("USGS/SRTMGL1_003")
    slope = ee.Terrain.slope(srtm).rename('slope')
    rainfall = ee.Image("WORLDCLIM/V1/BIO").select('bio12').rename('rainfall')

    # ----- Combine raster datasets into one -----
    combined = ee.Image.cat([landCover, slope, rainfall]).clip(algeria)

    # Sample at the point once
    sample = combined.sample(point, scale=30).first()
    if sample is None:
        return None

    # Get all raster info in one go
    info = sample.getInfo()['properties']

    # Land Cover lookup
    lc_lookup = {
        10: 'Trees', 20: 'Shrubland', 30: 'Grassland', 40: 'Cropland',
        50: 'Built-up', 60: 'Bare / Sparse vegetation', 70: 'Snow and Ice',
        80: 'Water', 90: 'Wetland'
    }
    land_cover_name = lc_lookup.get(info['land_cover'])
    slope_degrees = info['slope']
    rain_value = info['rainfall']

    # ----- Köppen Climate (vector) -----
    climate = ee.FeatureCollection("RESOLVE/ECOREGIONS/2017").filterBounds(point)
    feature = climate.first()
    if feature:
        f_info = feature.getInfo()['properties']
        eco_name = f_info.get('ECOREGION')
        bio_name = f_info.get('BIOME_NAME')
        name_used = eco_name or bio_name
        koppen_lookup = {
            'Sahara desert': 'BWh',
            'North Saharan steppe and woodlands': 'BWh',
            'West Saharan montane xeric woodlands': 'BWh',
            'South Saharan steppe and woodlands': 'BWh',
            'Saharan halophytics': 'BWk',
            'Deserts & Xeric Shrublands': 'BWh',
            'Flooded Grasslands & Savannas': 'BWk',
            'Mediterranean dry woodlands and steppe': 'BSh',
            'Mediterranean acacia-argania dry woodlands and succulent thickets': 'BSh',
            'Tropical & Subtropical Grasslands, Savannas & Shrublands': 'BSh',
            'Mediterranean High Atlas juniper steppe': 'BSk',
            'Montane Grasslands & Shrublands': 'BSk',
            'Mediterranean woodlands and forests': 'Csa',
            'Mediterranean conifer and mixed forests': 'Csa',
            'Mediterranean North African forests': 'Csa',
            'Mediterranean Forests, Woodlands & Scrub': 'Csa',
            'Temperate Conifer Forests': 'Csb'
        }
        koppen = koppen_lookup.get(name_used)
    else:
        koppen = None

    return {
        "land_cover": land_cover_name,
        "slope": slope_degrees,
        "rainfall": rain_value,
        "koppen": koppen
    }
#def meteo():
"""
lat = 
lon = 
if is_inside_algeria(lon,lat):
    nasa = fetch_nasa_power_data(lon,lat)
    opn= fetch_openlandmap_data(lon,lat)
    isda = fetch_isda_data(lon,lat)
    env = fetch_environment_data(lon,lat)
    print(nasa, opn, isda, env)
else:
    print("sorry")
"""
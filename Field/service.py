import math
from recommendation.service import calculate_compatibility_score
from recommendation.utils import fetch_openlandmap_data
from recommendation.models import CropRecommendation
from crop.models import CropSoilTexture
from .models import FieldAnalysis, DetectedTexture


class FieldAnalyzerService:

    @staticmethod
    def calculate_diagonal(polygon_coords):
        if not polygon_coords or len(polygon_coords) < 2:
            return 0
        max_dist = 0
        for i, p1 in enumerate(polygon_coords):
            for p2 in polygon_coords[i+1:]:
                dist = math.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2)
                if dist > max_dist:
                    max_dist = dist
        return max_dist

    @staticmethod
    def generate_sampling_points(coords, diagonal, step=10):
        if not coords or len(coords) < 3:
            return []
        lats = [c[0] for c in coords]
        lons = [c[1] for c in coords]
        min_lat, max_lat = min(lats), max(lats)
        min_lon, max_lon = min(lons), max(lons)
        center_lat = (min_lat + max_lat) / 2
        center_lon = (min_lon + max_lon) / 2
        lat_dist = (max_lat - min_lat) * 0.25
        lon_dist = (max_lon - min_lon) * 0.25
        return [
            [round(center_lat, 6), round(center_lon, 6)],
            [round(min_lat + lat_dist, 6), round(min_lon + lon_dist, 6)],
            [round(max_lat - lat_dist, 6), round(min_lon + lon_dist, 6)],
            [round(min_lat + lat_dist, 6), round(max_lon - lon_dist, 6)],
            [round(max_lat - lat_dist, 6), round(max_lon - lon_dist, 6)],
        ]

    @staticmethod
    def calculate_homogeneity(texture_list):
        if not texture_list:
            return 0.0
        max_coverage = max([t.coverage_percent for t in texture_list])
        return max_coverage / 100.0

    @staticmethod
    def analyze_field(crop_rec_id, coords, area):
        # STEP 1: getCropRecommendation → getCrop
        try:
            crop_rec = CropRecommendation.objects.get(id=crop_rec_id)
            target_crop = crop_rec.crop
            session = crop_rec.recommendation
        except CropRecommendation.DoesNotExist:
            return None, "Valid crop recommendation not found"

        # STEP 2: calculateSamplingPoints(polygon)
        diagonal = FieldAnalyzerService.calculate_diagonal(coords)
        sampling_points = FieldAnalyzerService.generate_sampling_points(coords, diagonal)

        # STEP 3: save(fieldAnalysis)
        analysis = FieldAnalysis.objects.create(
            recommendation_session=session,
            polygon_coords=coords,
            surface_area_m2=area
        )

        # STEP 4: loop [each point] → getSoilTexture(point, depth)
        texture_results = []
        for point in sampling_points:
            data = fetch_openlandmap_data(point[1], point[0])
            if data and data.get('soil_texture'):
                texture_results.append(data['soil_texture'])

        # STEP 5: processTextures + save(DetectedTextures)
        detected_textures_response = []
        dominant = None
        dominant_coverage = 0
        homogeneity_index = 0
        overall_score = None

        if texture_results:
            unique_textures = set(texture_results)
            total_points = len(texture_results)

            for tex_name in unique_textures:
                count = texture_results.count(tex_name)
                coverage = round((count / total_points) * 100, 2)

                try:
                    soil_score = CropSoilTexture.objects.get(
                        crop=target_crop,
                        texture_name=tex_name
                    ).suitability_rank
                except CropSoilTexture.DoesNotExist:
                    soil_score = None

                DetectedTexture.objects.create(
                    field_analysis=analysis,
                    texture_name=tex_name,
                    coverage_percent=coverage,
                    rescored_value=soil_score
                )

                detected_textures_response.append({
                    "texture_name": tex_name,
                    "coverage_percent": coverage,
                    "texture_score": soil_score,
                })

            # Dominant texture
            dominant = max(unique_textures, key=lambda t: texture_results.count(t))
            dominant_coverage = round((texture_results.count(dominant) / total_points) * 100, 2)
            homogeneity_index = round(texture_results.count(dominant) / total_points, 2)

            # STEP 6: calculateCropScore — called ONCE using dominant texture
            try:
                overall_score = round(
                    calculate_compatibility_score(target_crop, session, dominant),
                    2
                )
            except Exception:
                overall_score = None

        return {
            "field_analysis_id": analysis.id,
            "crop": target_crop.crop_name,

            "sampling_points": sampling_points,
            "detected_textures": detected_textures_response,
            "dominant_texture": dominant,
            "dominant_coverage_percent": dominant_coverage,
            "homogeneity_index": homogeneity_index,
            "overall_score": overall_score,
        }, None


class NutrientCalculatorService:
    @staticmethod
    def convert_ppm_to_kg_ha(ppm, depth, density=1.3):
        return ppm * (depth / 10) * density * 10

    @staticmethod
    def get_mineralization_factor(koppen):
        factors = {"Af": 0.05, "Am": 0.04, "Aw": 0.03}
        return factors.get(koppen, 0.02)

    @staticmethod
    def calculate_percentage(total_n, p_extr, k_extr, depth):
        return {"N": total_n * 0.1, "P": p_extr * 0.2, "K": k_extr * 0.2}

    @staticmethod
    def calculate_deficit(available, needed):
        return {
            "n_deficit": max(0, needed.get('n', 0) - available.get('n', 0)),
            "p_deficit": max(0, needed.get('p', 0) - available.get('p', 0)),
            "k_deficit": max(0, needed.get('k', 0) - available.get('k', 0)),
        }
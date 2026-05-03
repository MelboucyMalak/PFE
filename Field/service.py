import math


class FieldAnalyzerService:

    @staticmethod
    def point_in_polygon(lat, lon, polygon_coords):
        """Ray casting algorithm to check if point is inside polygon."""
        n = len(polygon_coords)
        inside = False
        x, y = lon, lat
        j = n - 1
        for i in range(n):
            xi, yi = polygon_coords[i][1], polygon_coords[i][0]
            xj, yj = polygon_coords[j][1], polygon_coords[j][0]
            if ((yi > y) != (yj > y)) and (x < (xj - xi) * (y - yi) / (yj - yi) + xi):
                inside = not inside
            j = i
        return inside

    @staticmethod
    def hectares_to_m2(hectares):
        return hectares * 10000

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
        from recommendation.service import calculate_compatibility_score
        from recommendation.ExternalApiService import fetch_openlandmap_data
        from recommendation.models import CropRecommendation
        from crop.models import CropSoilTexture
        from .models import FieldAnalysis, DetectedTexture

        try:
            crop_rec = CropRecommendation.objects.get(id=crop_rec_id)
            target_crop = crop_rec.crop
            session = crop_rec.recommendation
        except CropRecommendation.DoesNotExist:
            return None, "Valid crop recommendation not found"
        # Validate that session coordinates are inside the polygon
        if not FieldAnalyzerService.point_in_polygon(session.lat, session.lon, coords):
            return None, "SESSION_OUTSIDE_POLYGON"

        diagonal = FieldAnalyzerService.calculate_diagonal(coords)
        sampling_points = FieldAnalyzerService.generate_sampling_points(coords, diagonal)

        # Convert hectares to m² before saving
        area_m2 = FieldAnalyzerService.hectares_to_m2(area)

        analysis = FieldAnalysis.objects.create(
            crop_recommendation=crop_rec,
            polygon_coords=coords,
            surface_area_m2=area
        )

        texture_results = []
        for point in sampling_points:
            data = fetch_openlandmap_data(point[1], point[0])
            if data and data.get('soil_texture'):
                texture_results.append(data['soil_texture'])

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

            dominant = max(unique_textures, key=lambda t: texture_results.count(t))
            dominant_coverage = round((texture_results.count(dominant) / total_points) * 100, 2)
            homogeneity_index = round(texture_results.count(dominant) / total_points, 2)

            try:
                overall_score = round(
                    calculate_compatibility_score(target_crop, session, dominant), 2
                )
            except Exception:
                overall_score = None

        return {
            "field_analysis_id": analysis.id,
            "crop": target_crop.crop_name,
            "overall_score": overall_score,
            "sampling_points": sampling_points,
            "detected_textures": detected_textures_response,
            "dominant_texture": dominant,
            "dominant_coverage_percent": dominant_coverage,
            "homogeneity_index": homogeneity_index
        }, None




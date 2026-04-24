from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import FieldAnalysis, DetectedTexture
from .serializers import FieldAnalysisSerializer
from .service import FieldAnalyzerService
from recommendation.utils import fetch_openlandmap_data
from recommendation.models import CropRecommendation
from crop.models import CropSoilTexture, CropClimate


class FieldAnalysisViewSet(viewsets.ModelViewSet):
    queryset = FieldAnalysis.objects.all()
    serializer_class = FieldAnalysisSerializer

    def create(self, request, *args, **kwargs):
        coords = request.data.get('polygon_coords')
        area_from_ui = request.data.get('surface_area_m2')
        crop_rec_id = request.data.get('crop_recommendation')

        # STEP 1: getCropRecommendation(idCropRec) → getCrop(cropRec.cropId)
        try:
            crop_rec = CropRecommendation.objects.get(id=crop_rec_id)
            target_crop = crop_rec.crop
            session = crop_rec.recommendation
        except CropRecommendation.DoesNotExist:
            return Response({"error": "Valid crop recommendation not found"}, status=404)

        # STEP 2: calculateSamplingPoints(polygon)
        diagonal = FieldAnalyzerService.calculate_diagonal(coords)
        sampling_points = FieldAnalyzerService.generate_sampling_points(coords, diagonal)

        # STEP 3: save(fieldAnalysis)
        analysis = FieldAnalysis.objects.create(
            recommendation_session=session,
            polygon_coords=coords,
            surface_area_m2=area_from_ui
        )

        # ph_score from session (same logic as service.py)
        if target_crop.ph_min <= session.soil_ph_initial <= target_crop.ph_max:
            ph_score = 1
        else:
            ph_score = 0.5

        # climate_score from session.koppen (same logic as service.py)
        try:
            crop_climate = CropClimate.objects.get(
                crop=target_crop,
                climate__climate_zone=session.koppen
            )
            climate_score = crop_climate.rating
        except CropClimate.DoesNotExist:
            climate_score = 0  # no data for this zone

        # STEP 4: loop [each point] → getSoilTexture(point, depth)
        texture_results = []
        for point in sampling_points:
            data = fetch_openlandmap_data(point[1], point[0])
            if data and data.get('soil_texture'):
                texture_results.append(data['soil_texture'])

                # STEP 5: processTextures + calculateCropScore per texture
                detected_textures_response = []

                if texture_results:
                    unique_textures = set(texture_results)
                    total_points = len(texture_results)

                    for tex_name in unique_textures:
                        count = texture_results.count(tex_name)
                        coverage = round((count / total_points) * 100, 2)

                        try:
                            soil_suitability = CropSoilTexture.objects.get(
                                crop=target_crop,
                                texture_name=tex_name
                            )
                            soil_score = soil_suitability.suitability_rank
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

                    # Overall score calculated ONCE using dominant texture
                    try:
                        dominant_soil = CropSoilTexture.objects.get(
                            crop=target_crop,
                            texture_name=dominant
                        )
                        dominant_soil_score = dominant_soil.suitability_rank
                        normalized_climate = (climate_score + 3) / 8
                        normalized_texture = dominant_soil_score / 5
                        normalized_ph = ph_score / 1
                        overall_score = round(
                            (normalized_climate * 0.6) +
                            (normalized_texture * 0.3) +
                            (normalized_ph * 0.1),
                            4
                        )
                    except CropSoilTexture.DoesNotExist:
                        overall_score = None

                else:
                    dominant = None
                    dominant_coverage = 0
                    homogeneity_index = 0
                    overall_score = None

                # STEP 6: Final response
                return Response({
                    "status": "success",
                    "field_analysis_id": analysis.id,
                    "crop": target_crop.crop_name,
                    "sampling_points": sampling_points,
                    "detected_textures": detected_textures_response,
                    "dominant_texture": dominant,
                    "dominant_coverage_percent": dominant_coverage,
                    "homogeneity_index": homogeneity_index,
                    "ph_score": ph_score,
                    "climate_score": climate_score,
                    "overall_score": overall_score,
                }, status=status.HTTP_201_CREATED)
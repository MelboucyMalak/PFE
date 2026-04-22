from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import FieldAnalysis, DetectedTexture
from .serializers import FieldAnalysisSerializer
from .service import FieldAnalyzerService
from recommendation.utils import fetch_openlandmap_data
from recommendation.models import RecommendationSession
from crop.models import CropSoilTexture


class FieldAnalysisViewSet(viewsets.ModelViewSet):
    queryset = FieldAnalysis.objects.all()
    serializer_class = FieldAnalysisSerializer

    def create(self, request, *args, **kwargs):
        coords = request.data.get('polygon_coords')
        area_from_ui = request.data.get('surface_area_m2')
        session_id = request.data.get('recommendation_session')

        # 1.  getCropRecommendation / getCrop
        try:
            session = RecommendationSession.objects.get(id=session_id)
            # We need the crop to calculate the suitability rank later
            # Assuming your session links to a selected crop
            target_crop = session.crop
        except Exception:
            return Response({"error": "Valid session not found"}, status=404)

        # 2.  calculateSamplingPoints
        diagonal = FieldAnalyzerService.calculate_diagonal(coords)
        sampling_points = FieldAnalyzerService.generate_sampling_points(coords, diagonal)

        # 3. save(fieldAnalysis)
        analysis = FieldAnalysis.objects.create(
            recommendation_session=session,
            polygon_coords=coords,
            surface_area_m2=area_from_ui
        )

        # 4.  loop [each point] -> getSoilTexture
        texture_results = []
        for point in sampling_points:
            data = fetch_openlandmap_data(point[1], point[0])
            if data and data.get('soil_texture'):
                texture_results.append(data['soil_texture'])

        if texture_results:
            unique_textures = set(texture_results)
            total_points = len(texture_results)

            for tex_name in unique_textures:
                count = texture_results.count(tex_name)
                coverage = (count / total_points) * 100

                # Diagram: calculateCropScore(texture)
                try:
                    soil_suitability = CropSoilTexture.objects.get(
                        crop=target_crop,
                        texture_name=tex_name  # Using the string field
                    )
                    score = soil_suitability.suitability_rank
                except CropSoilTexture.DoesNotExist:
                    score = 1  # "Avoid" as a safe fallback

                #  save(DetectedTextures)
                DetectedTexture.objects.create(
                    field_analysis=analysis,
                    texture_name=tex_name,
                    coverage_percent=coverage,
                    rescored_value=score
                )

        # 7. Final Response (Affichage des textures, % et scores)
        return Response({
            "status": "success",
            "field_analysis_id": analysis.id,
            "sampling_points": sampling_points,
            "message": "Full analysis sequence complete and saved."
        }, status=status.HTTP_201_CREATED)
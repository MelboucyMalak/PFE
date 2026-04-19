from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import FieldAnalysis
from .serializers import FieldAnalysisSerializer
from .service import FieldAnalyzerService


class FieldAnalysisViewSet(viewsets.ModelViewSet):
    queryset = FieldAnalysis.objects.all()
    serializer_class = FieldAnalysisSerializer

    def create(self, request, *args, **kwargs):
        # 1. Get data from the UI
        coords = request.data.get('polygon_coords')
        area_from_ui = request.data.get('surface_area_m2')  # Area sent by frontend
        session_id = request.data.get('recommendation_session')

        if not coords or not area_from_ui:
            return Response(
                {"error": "Missing coordinates or surface area from frontend"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2.  calculate diagonal and sampling points
        diagonal = FieldAnalyzerService.calculate_diagonal(coords)
        sampling_points = FieldAnalyzerService.generate_sampling_points(coords, diagonal)

        # 3. Save to DB
        analysis = FieldAnalysis.objects.create(
            recommendation_session_id=session_id,
            polygon_coords=coords,
            surface_area_m2=area_from_ui  # Using the value from frontend
        )

        # 4. Response (Displaying textures, scores, and homogeneity index)
        serializer = self.get_serializer(analysis)
        return Response({
            "status": "success",
            "surface_area_m2": area_from_ui,
            "diagonal": diagonal,
            "sampling_points": sampling_points,  # This is the list of [lat, lon] pairs
            "points_count": len(sampling_points)
        }, status=status.HTTP_201_CREATED)
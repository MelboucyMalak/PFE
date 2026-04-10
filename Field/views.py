from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import FieldAnalysis
from .serializers import FieldAnalysisSerializer
from .services import FieldAnalyzerService


class FieldAnalysisViewSet(viewsets.ModelViewSet):
    queryset = FieldAnalysis.objects.all()
    serializer_class = FieldAnalysisSerializer

    def create(self, request, *args, **kwargs):
        coords = request.data.get('polygon_coords')
        if not coords:
            return Response({"error": "No coordinates provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Use our service to do the math
        area = FieldAnalyzerService.calculate_surface_area(coords)

        # Save to DB
        analysis = FieldAnalysis.objects.create(
            recommendation_session_id=request.data.get('recommendation_session'),
            polygon_coords=coords,
            surface_area_m2=area
        )

        serializer = self.get_serializer(analysis)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
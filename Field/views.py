from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import FieldAnalysis
from .serializers import FieldAnalysisSerializer
from .service import FieldAnalyzerService


class FieldAnalysisViewSet(viewsets.ModelViewSet):
    queryset = FieldAnalysis.objects.all()
    serializer_class = FieldAnalysisSerializer

    def create(self, request, *args, **kwargs):
        coords = request.data.get('polygon_coords')
        area = request.data.get('surface_area_m2')
        crop_rec_id = request.data.get('crop_recommendation')

        result, error = FieldAnalyzerService.analyze_field(crop_rec_id, coords, area)

        if error:
            return Response({"error": error}, status=status.HTTP_404_NOT_FOUND)

        return Response({"status": "success", **result}, status=status.HTTP_201_CREATED)
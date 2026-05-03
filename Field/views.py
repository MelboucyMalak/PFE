from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import FieldAnalysis, GenericFertilizationRecommendation, PersonalizedFertilizationRecommendation
from .serializers import FieldAnalysisSerializer
from .service import FieldAnalyzerService
from Field.NutrientCalculator import convert_ppm_to_kg_ha, get_mineralization_factor
from recommendation.models import CropRecommendation
from _myProject.Errors.responses import error_response


class FieldAnalysisViewSet(viewsets.ModelViewSet):
    queryset = FieldAnalysis.objects.all()
    serializer_class = FieldAnalysisSerializer

    def create(self, request, *args, **kwargs):
        coords = request.data.get('polygon_coords')
        area = request.data.get('surface_area_m2')
        crop_rec_id = request.data.get('crop_recommendation')

        # Validate required fields
        if not coords or area is None or not crop_rec_id:
            return error_response("FIELD_MISSING_FIELDS")

        # Validate surface area
        try:
            area = float(area)
            if area <= 0:
                return error_response("INVALID_SURFACE_AREA")
        except (ValueError, TypeError):
            return error_response("INVALID_SURFACE_AREA")

        result, error = FieldAnalyzerService.analyze_field(crop_rec_id, coords, area)

        if error == "Valid crop recommendation not found":
            return error_response("CROP_RECOMMENDATION_NOT_FOUND")
        if error == "SESSION_OUTSIDE_POLYGON":
            return error_response("SESSION_OUTSIDE_POLYGON")
        if error == "NO_TEXTURE_DETECTED":
            return error_response("NO_TEXTURE_DETECTED")
        if error:
            return error_response("UNKNOWN_ERROR")

        return Response({"status": "success", **result}, status=status.HTTP_201_CREATED)


class GenericFertilizationView(APIView):
    def post(self, request):
        crop_rec_id = request.data.get('crop_recommendation')

        if not crop_rec_id:
            return error_response("FIELD_MISSING_FIELDS")

        try:
            crop_rec = CropRecommendation.objects.get(id=crop_rec_id)
            crop = crop_rec.crop
            session = crop_rec.recommendation
        except CropRecommendation.DoesNotExist:
            return error_response("CROP_RECOMMENDATION_NOT_FOUND")

        depth = crop.sampling_depth_cm
        bulk = session.bulk_density if session.bulk_density else 1.3
        mineral_factor = get_mineralization_factor(session.koppen)

        def valid(val):
            return val is not None and val != -1

        try:
            n_available = round(convert_ppm_to_kg_ha(session.n_total_raw_ppm, depth, bulk) * mineral_factor, 2) if valid(session.n_total_raw_ppm) else None
            p_available = round(convert_ppm_to_kg_ha(session.p_extractable_raw_ppm, depth, bulk), 2) if valid(session.p_extractable_raw_ppm) else None
            k_available = round(convert_ppm_to_kg_ha(session.k_extractable_raw_ppm, depth, bulk), 2) if valid(session.k_extractable_raw_ppm) else None
        except Exception:
            return error_response("SOIL_API_FAILED")

        n_deficit = round(max(0, crop.n_kg_ha - n_available), 2) if n_available is not None else None
        p_deficit = round(max(0, crop.p_kg_ha - p_available), 2) if p_available is not None else None
        k_deficit = round(max(0, crop.k_kg_ha - k_available), 2) if k_available is not None else None

        n_percent = round(min(100, (n_available / crop.n_kg_ha) * 100), 2) if n_available and crop.n_kg_ha and crop.n_kg_ha > 0 else None
        p_percent = round(min(100, (p_available / crop.p_kg_ha) * 100), 2) if p_available and crop.p_kg_ha and crop.p_kg_ha > 0 else None
        k_percent = round(min(100, (k_available / crop.k_kg_ha) * 100), 2) if k_available and crop.k_kg_ha and crop.k_kg_ha > 0 else None

        GenericFertilizationRecommendation.objects.update_or_create(
            crop_recommendation=crop_rec,
            defaults={
                'n_available_kg_ha': n_available,
                'p_available_kg_ha': p_available,
                'k_available_kg_ha': k_available,
                'n_deficit_kg_ha': n_deficit,
                'p_deficit_kg_ha': p_deficit,
                'k_deficit_kg_ha': k_deficit,
                'n_percent': n_percent,
                'p_percent': p_percent,
                'k_percent': k_percent,
            }
        )

        return Response({
            "status": "success",
            "crop": crop.crop_name,
            "depth_used_cm": depth,
            "bulk_density_used": bulk,
            "available_in_soil_kg_ha": {"N": n_available, "P": p_available, "K": k_available},
            "crop_needs_kg_ha": {"N": crop.n_kg_ha, "P": crop.p_kg_ha, "K": crop.k_kg_ha},
            "deficit_to_add_kg_ha": {"N": n_deficit, "P": p_deficit, "K": k_deficit},
            "soil_coverage_percent": {"N": n_percent, "P": p_percent, "K": k_percent},
        }, status=status.HTTP_201_CREATED)


class PersonalizedFertilizationView(APIView):
    def post(self, request):
        field_analysis_id = request.data.get('field_analysis')
        ph = request.data.get('ph_entered')
        n_ppm = request.data.get('n_entered_ppm')
        p_ppm = request.data.get('p_entered_ppm')
        k_ppm = request.data.get('k_entered_ppm')

        # Validate required fields
        if not all([field_analysis_id, ph is not None, n_ppm is not None, p_ppm is not None, k_ppm is not None]):
            return error_response("FERTILIZATION_MISSING_FIELDS")

        # Validate numeric values
        try:
            ph_entered = float(ph)
            n_ppm = float(n_ppm)
            p_ppm = float(p_ppm)
            k_ppm = float(k_ppm)
        except (ValueError, TypeError):
            return error_response("INVALID_NUMBER")

        try:
            analysis = FieldAnalysis.objects.get(id=field_analysis_id)
            crop_rec = analysis.crop_recommendation
            crop = crop_rec.crop
            session = crop_rec.recommendation
        except FieldAnalysis.DoesNotExist:
            return error_response("FIELD_ANALYSIS_NOT_FOUND")

        depth = crop.sampling_depth_cm
        bulk = session.bulk_density if session.bulk_density else 1.3
        surface_ha = analysis.surface_area_m2
        mineral_factor = get_mineralization_factor(session.koppen)

        try:
            n_available_ha = convert_ppm_to_kg_ha(n_ppm, depth, bulk) * mineral_factor
            p_available_ha = convert_ppm_to_kg_ha(p_ppm, depth, bulk)
            k_available_ha = convert_ppm_to_kg_ha(k_ppm, depth, bulk)
        except Exception:
            return error_response("UNKNOWN_ERROR")

        n_deficit_ha = max(0, crop.n_kg_ha - n_available_ha)
        p_deficit_ha = max(0, crop.p_kg_ha - p_available_ha)
        k_deficit_ha = max(0, crop.k_kg_ha - k_available_ha)

        n_total = round(n_deficit_ha * surface_ha, 2)
        p_total = round(p_deficit_ha * surface_ha, 2)
        k_total = round(k_deficit_ha * surface_ha, 2)

        n_percent = round(min(100, (n_available_ha / crop.n_kg_ha) * 100), 2) if crop.n_kg_ha and crop.n_kg_ha > 0 else None
        p_percent = round(min(100, (p_available_ha / crop.p_kg_ha) * 100), 2) if crop.p_kg_ha and crop.p_kg_ha > 0 else None
        k_percent = round(min(100, (k_available_ha / crop.k_kg_ha) * 100), 2) if crop.k_kg_ha and crop.k_kg_ha > 0 else None

        if crop.ph_min <= ph_entered <= crop.ph_max:
            ph_note = f"pH {ph_entered} is ideal for {crop.crop_name} (range: {crop.ph_min}-{crop.ph_max})"
        elif ph_entered < crop.ph_min:
            ph_note = f"pH {ph_entered} is too acidic for {crop.crop_name}. Consider adding lime."
        else:
            ph_note = f"pH {ph_entered} is too alkaline for {crop.crop_name}. Consider adding sulfur."

        PersonalizedFertilizationRecommendation.objects.update_or_create(
            field_analysis=analysis,
            defaults={
                'ph_entered': ph_entered,
                'n_entered_ppm': n_ppm,
                'p_entered_ppm': p_ppm,
                'k_entered_ppm': k_ppm,
                'n_total_kg': n_total,
                'p_total_kg': p_total,
                'k_total_kg': k_total,
                'n_percent': n_percent,
                'p_percent': p_percent,
                'k_percent': k_percent,
                'ph_note': ph_note,
            }
        )

        return Response({
            "status": "success",
            "crop": crop.crop_name,
            "surface_ha": round(surface_ha, 4),
            "ph_note": ph_note,
            "soil_coverage_percent": {"N": n_percent, "P": p_percent, "K": k_percent},
            "total_to_add_for_field_kg": {"N": n_total, "P": p_total, "K": k_total},
        }, status=status.HTTP_201_CREATED)
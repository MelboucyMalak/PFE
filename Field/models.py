from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class FieldAnalysis(models.Model):
    # Link to CropRecommendation 
    crop_recommendation = models.ForeignKey(
        'recommendation.CropRecommendation',
        on_delete=models.CASCADE,
        related_name='field_analyses'
    )
    polygon_coords = models.JSONField(help_text="List of coordinates [[lat, lon], ...]")
    surface_area_m2 = models.FloatField(validators=[MinValueValidator(0.0)])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Analysis {self.id} - {self.surface_area_m2}m²"


class DetectedTexture(models.Model):
    field_analysis = models.ForeignKey(
        FieldAnalysis,
        on_delete=models.CASCADE,
        related_name='detected_textures'
    )
    texture_name = models.CharField(max_length=50)
    coverage_percent = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)]
    )
    rescored_value = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.texture_name} ({self.coverage_percent}%)"




class FertilizationBase(models.Model):
    """Shared fields for both types of recommendations"""
    n_percent = models.FloatField(null=True, blank=True)
    p_percent = models.FloatField(null=True, blank=True)
    k_percent = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True


class GenericFertilizationRecommendation(FertilizationBase):
    crop_recommendation = models.OneToOneField(
        'recommendation.CropRecommendation',
        on_delete=models.CASCADE,
        related_name='generic_fertilization'
    )
    # Per-hectare stats from APIs
    n_available_kg_ha = models.FloatField(null=True, blank=True)
    p_available_kg_ha = models.FloatField(null=True, blank=True)
    k_available_kg_ha = models.FloatField(null=True, blank=True)
    n_deficit_kg_ha = models.FloatField(null=True, blank=True)
    p_deficit_kg_ha = models.FloatField(null=True, blank=True)
    k_deficit_kg_ha = models.FloatField(null=True, blank=True)


class PersonalizedFertilizationRecommendation(FertilizationBase):
    field_analysis = models.OneToOneField(
        FieldAnalysis,
        on_delete=models.CASCADE,
        related_name='personalized_fertilization'
    )
    # Manual data from the farmer
    ph_entered = models.FloatField()
    n_entered_ppm = models.FloatField()
    p_entered_ppm = models.FloatField()
    k_entered_ppm = models.FloatField()
    # Field-wide totals (calculated using bulk_density and surface_area)
    n_total_kg = models.FloatField(null=True, blank=True)
    p_total_kg = models.FloatField(null=True, blank=True)
    k_total_kg = models.FloatField(null=True, blank=True)
    ph_note = models.CharField(max_length=100, null=True, blank=True)




class FertilizationHistoryBase(models.Model):
    n_percent = models.FloatField(null=True, blank=True)
    p_percent = models.FloatField(null=True, blank=True)
    k_percent = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True
        ordering = ['-created_at']


class GenericFertilizationHistory(FertilizationHistoryBase):
    crop_recommendation = models.ForeignKey(
        'recommendation.CropRecommendation',
        on_delete=models.CASCADE,
        related_name='generic_fertilization_history'
    )
    n_available_kg_ha = models.FloatField(null=True, blank=True)
    p_available_kg_ha = models.FloatField(null=True, blank=True)
    k_available_kg_ha = models.FloatField(null=True, blank=True)
    n_deficit_kg_ha   = models.FloatField(null=True, blank=True)
    p_deficit_kg_ha   = models.FloatField(null=True, blank=True)
    k_deficit_kg_ha   = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"Generic history #{self.id} — crop_rec {self.crop_recommendation_id} @ {self.created_at:%Y-%m-%d %H:%M}"


class PersonalizedFertilizationHistory(FertilizationHistoryBase):
    field_analysis = models.ForeignKey(
        FieldAnalysis,
        on_delete=models.CASCADE,
        related_name='personalized_fertilization_history'
    )
    ph_entered    = models.FloatField()
    n_entered_ppm = models.FloatField()
    p_entered_ppm = models.FloatField()
    k_entered_ppm = models.FloatField()
    n_total_kg    = models.FloatField(null=True, blank=True)
    p_total_kg    = models.FloatField(null=True, blank=True)
    k_total_kg    = models.FloatField(null=True, blank=True)
    ph_note       = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"Personalized history #{self.id} — analysis {self.field_analysis_id} @ {self.created_at:%Y-%m-%d %H:%M}"
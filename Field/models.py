from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class FieldAnalysis(models.Model):
    recommendation_session = models.ForeignKey(
        'recommendation.RecommendationSession',
        on_delete=models.CASCADE,
        related_name='field_analyses'
    )

    polygon_coords = models.JSONField(help_text="List of coordinates [[lat, lon], ...]")
    surface_area_m2 = models.FloatField(validators=[MinValueValidator(0.0)])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Analysis {self.id} - Area: {self.surface_area_m2}m²"


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
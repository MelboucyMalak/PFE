from rest_framework import serializers
from .models import FieldAnalysis, DetectedTexture

class DetectedTextureSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetectedTexture
        fields = '__all__'

class FieldAnalysisSerializer(serializers.ModelSerializer):
    detected_textures = DetectedTextureSerializer(many=True, read_only=True)

    class Meta:
        model = FieldAnalysis
        fields = '__all__'


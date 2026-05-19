from rest_framework import serializers
from .models import FieldAnalysis, DetectedTexture
from .models import GenericFertilizationHistory, PersonalizedFertilizationHistory


class DetectedTextureSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetectedTexture
        fields = '__all__'

class FieldAnalysisSerializer(serializers.ModelSerializer):
    detected_textures = DetectedTextureSerializer(many=True, read_only=True)

    class Meta:
        model = FieldAnalysis
        fields = '__all__'



class GenericFertilizationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GenericFertilizationHistory
        fields = '__all__'

class PersonalizedFertilizationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalizedFertilizationHistory
        fields = '__all__'
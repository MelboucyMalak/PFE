from rest_framework import serializers
from recommendation.models import RecommendationSession, CropRecommendation
from crop.serializers import CropSerializer

class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecommendationSession
        fields = '__all__'


class CropRecommendationSerializer(serializers.ModelSerializer):
    crop = CropSerializer(read_only=True)   # nested display of crop data

    class Meta:
        model = CropRecommendation
        fields = ['id', 'recommendation', 'crop', 'compatibility_score']
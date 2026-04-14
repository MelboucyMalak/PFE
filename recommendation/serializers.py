from rest_framework import serializers

from recommendation.models import RecommendationSession, CropRecommendation


class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecommendationSession
        fields = '__all__'

class CropRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropRecommendation
        fields = '__all__'
from rest_framework import serializers

from recommendation.models import RecommendationSession


class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecommendationSession
        fields = '__all__'

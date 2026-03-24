from rest_framework import serializers
from recommendation.models import Recommendation, Plan


class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model=Recommendation
        fields = '__all__'

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model=Plan
        fields = '__all__'
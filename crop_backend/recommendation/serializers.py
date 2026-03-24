from rest_framework import serializers
from recommendation.models import Recommendation, Plan


class RecommendationSerializer(serializers.ModelSerializer):
    model=Recommendation
    fields = '__all__'

class PlanSerializer(serializers.ModelSerializer):
    model=Plan
    fields = '__all__'
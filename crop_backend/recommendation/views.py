"""# like view
from rest_framework.response import Response
from .models import Recommendation, Plan
from .serializers import RecommendationSerializer, PlanSerializer
from rest_framework.decorators import api_view


@api_view(['GET'])
def recommendation_list_api(request):
    recommendations = Recommendation.objects.all()
    data = RecommendationSerializer(recommendations, many=True).data
    return Response({'recommendations': data})


@api_view(['GET'])
def plan_list_api(request):
    plans = Plan.objects.all()
    data = PlanSerializer(plans, many=True).data
    return Response({'plans': data})"""

# like view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import RecommendationSession, CropRecommendation
from .serializers import RecommendationSerializer
from rest_framework.decorators import api_view, permission_classes

from .service import createRecommendationSession


@api_view(['GET'])
def recommendation_list_api(request):
    recommendations = RecommendationSession.objects.all()
    data = RecommendationSerializer(recommendations, many=True).data
    return Response({'recommendations': data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def recommendation_api_view(request):
   recommendations = createRecommendationSession(request)
   data = RecommendationSerializer(recommendations, many=False).data
   return Response({'recommendations': data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def recommendation_api_view(request):


'''
 to send choice to frontend i use 
 get_<field_name>_display() django auto creat it :D
'''
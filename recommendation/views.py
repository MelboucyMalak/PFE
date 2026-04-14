# like view
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import RecommendationSession, CropRecommendation
from .serializers import RecommendationSerializer, CropRecommendationSerializer
from rest_framework.decorators import api_view, permission_classes

from .service import creatRecomendation, generate_CropRecommendations


@api_view(['GET'])
def recommendation_list_api(request):
    recommendations = RecommendationSession.objects.all()
    data = RecommendationSerializer(recommendations, many=True).data
    return Response({'recommendations': data},status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def recommendation_api_view(request):
    lat=float(request.data.get('lat'))
    lon=float(request.data.get('lon'))
    if lat==None or lon==None :
        return Response({'error':'Latitude or longitude is required'},status=status.HTTP_400_BAD_REQUEST)
    recommendations = creatRecomendation(lat,lon)
    data = RecommendationSerializer(recommendations, many=False).data
    return Response({'recommendations': data},status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def croplist_api_view(request):
    session_id=request.data.get('session_id')
    if not session_id:
        return Response({'error':'session_id is required'},status=status.HTTP_400_BAD_REQUEST)
    recommendations = RecommendationSession.objects.filter(pk=session_id).exists()
    if not recommendations:
        return Response({'error':'session_id is invalid'},status=status.HTTP_400_BAD_REQUEST)
    crops=  generate_CropRecommendations(session_id)
    data=  CropRecommendationSerializer(crops, many=True).data
    return Response({'Crop List': data},status=status.HTTP_200_OK)

'''
 to send choice to frontend i use 
 get_<field_name>_display() django auto creat it :D
'''
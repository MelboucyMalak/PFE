from venv import create

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import RecommendationSession
from .serializers import RecommendationSerializer, CropRecommendationSerializer
from rest_framework.decorators import api_view, permission_classes
from .service import createRecommendation, generate_CropRecommendations


@api_view(['GET'])
def recommendation_list_api(request):
    recommendations = RecommendationSession.objects.all()
    data = RecommendationSerializer(recommendations, many=True).data
    return Response({'recommendations': data},status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def recommendation_api_view(request):
    lat = request.data.get('lat')
    lon = request.data.get('lon')
    if lat==None or lon==None :
        return Response({'error':'Latitude or longitude is required'},status=status.HTTP_400_BAD_REQUEST)
    recommendations = createRecommendation(request)
    data = RecommendationSerializer(recommendations, many=False).data
    return Response({'recommendations': data},status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def croplist_api_view(request):
    session_id= request.data.get('session_id')
    if not session_id:
        return Response({'error':'session_id is required'},status=status.HTTP_400_BAD_REQUEST)
    try:
        session_id = int( request.data.get('session_id'))
    except:
        return Response({'error':'session_id must be an integer'},status=status.HTTP_400_BAD_REQUEST)
    recommendation = RecommendationSession.objects.filter(pk=session_id).exists()
    if not recommendation:
        return Response({'error':'session_id is invalid'},status=status.HTTP_400_BAD_REQUEST)
    crops=  generate_CropRecommendations(session_id)
    data = CropRecommendationSerializer(crops, many=True).data
    return Response({'Crop List': data},status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def favorite_api_view(request):
    session_id = request.data.get('session_id')
    if not session_id:
        return Response({'error': 'session_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        session_id = int( request.data.get('session_id'))
    except:
        return Response({'error':'session_id must be an integer'},status=status.HTTP_400_BAD_REQUEST)
    recommendation = RecommendationSession.objects.filter(pk=session_id).exists()
    if not recommendation:
        return Response({'error': 'session_id is invalid'}, status=status.HTTP_400_BAD_REQUEST)
    recommendation =  RecommendationSession.objects.get(pk=session_id)
    if recommendation.favorite == False:
        recommendation.favorite = True
        recommendation.save()
        return Response({'message': 'Recommendation added to favorite'}, status=status.HTTP_200_OK)
    else:
        recommendation.favorite = False
        recommendation.save()
        return Response({'message': 'Recommendation removed from favorite'},status=status.HTTP_200_OK)
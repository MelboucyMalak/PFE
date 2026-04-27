<<<<<<< HEAD
from django.http import JsonResponse
=======
from venv import create

>>>>>>> 6f7eb695a30bb2034d83514c02d090de670d6f60
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from _myProject.Errors.responses import error_response
from .ExternalApiService import get_weather_data, is_inside_algeria
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
<<<<<<< HEAD
        return error_response("MISSING_COORDINATES")
    recommendations = creatRecommendation(request)
=======
        return Response({'error':'Latitude or longitude is required'},status=status.HTTP_400_BAD_REQUEST)
    recommendations = createRecommendation(request)
>>>>>>> 6f7eb695a30bb2034d83514c02d090de670d6f60
    data = RecommendationSerializer(recommendations, many=False).data
    return Response({'recommendations': data},status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def croplist_api_view(request):
    session_id= request.data.get('session_id')
    if not session_id:
        return error_response("SESSION_ID_REQUIRED")
    try:
        session_id = int( request.data.get('session_id'))
    except:
        return error_response("SESSION_ID_INTEGER")
    recommendation = RecommendationSession.objects.filter(pk=session_id).exists()
    if not recommendation:
        return error_response("SESSION_ID_INVALID")
    crops=  generate_CropRecommendations(session_id)
    data = CropRecommendationSerializer(crops, many=True).data
    return Response({'Crop List': data},status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def favorite_api_view(request):
    session_id = request.data.get('session_id')
    if not session_id:
        return error_response("SESSION_ID_REQUIRED")
    try:
        session_id = int( request.data.get('session_id'))
    except:
        return error_response("SESSION_ID_INTEGER")
    recommendation = RecommendationSession.objects.filter(pk=session_id).exists()
    if not recommendation:
        return error_response("SESSION_ID_INVALID")
    recommendation =  RecommendationSession.objects.get(pk=session_id)
    if recommendation.favorite == False:
        recommendation.favorite = True
        recommendation.save()
        return Response({'message': 'Recommendation added to favorite'}, status=status.HTTP_200_OK)
    else:
        recommendation.favorite = False
        recommendation.save()
        return Response({'message': 'Recommendation removed from favorite'},status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_meteo(request):
    lat = request.data.get('lat')
    lon = request.data.get('lon')
    if lat==None or lon==None :
        return error_response("MISSING_COORDINATES")
    try:
        val=is_inside_algeria(lon,lat)
    except Exception:
        return error_response("GEE_FAILED")
    if not val:
        return error_response("OUTSIDE_ALGERIA")
    try:
            data=get_weather_data(lat, lon)
    except Exception:
            return error_response("WEATHER_API_FAILED")
    return  JsonResponse(data)
from django.http import JsonResponse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from _myProject.Errors.responses import error_response
from .ExternalApiService import get_weather_data, is_inside_algeria,get_place_name
from .models import RecommendationSession, CropRecommendation
from .serializers import RecommendationSerializer, CropRecommendationSerializer
from rest_framework.decorators import api_view, permission_classes
from .service import createRecommendation, generate_CropRecommendations


@api_view(['GET'])
@permission_classes([IsAuthenticated])
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
        return error_response("MISSING_COORDINATES")
    recommendations = createRecommendation(request)
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
    recommendation = RecommendationSession.objects.filter(pk=session_id,user=request.user)
    if not recommendation.exists():
        return error_response("SESSION_ID_INVALID")
    crops=  generate_CropRecommendations(session_id)
    data = CropRecommendationSerializer(crops, many=True).data
    return Response({'Crop List': data},status=status.HTTP_200_OK)


@api_view(['PATCH'])
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
        return error_response("USER_NOT_FOUND_BY_ID")
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
    except Exception as e:
            print(f"Weather error: {e}")
            return error_response("WEATHER_API_FAILED")
    return  JsonResponse(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommondation_favorite(request):
    user = request.user
    recommendations = RecommendationSession.objects.filter(user=user,favorite=True)
    if not recommendations:
        return Response({'recommendations': []},status=status.HTTP_200_OK)
    data = RecommendationSerializer(recommendations, many=True).data
    return Response({'recommendations': data},status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommondation_history(request):
    user = request.user
    recommendations = RecommendationSession.objects.filter(user=user)
    if not recommendations:
        return Response({'recommendations': []},status=status.HTTP_200_OK)
    data = RecommendationSerializer(recommendations, many=True).data
    return Response({'recommendations': data},status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def crop_recommondation_history(request,pk):
    try:
        recommendation = RecommendationSession.objects.get(pk=pk, user=request.user)
    except RecommendationSession.DoesNotExist:
        return error_response("RECOMMENDATION_NOT_FOUND")

    crop_recommendations = CropRecommendation.objects.filter(recommendation_id=pk)
    if not crop_recommendations.exists():
        return Response({'crop_recommendations': []}, status=status.HTTP_200_OK)

    data = CropRecommendationSerializer(crop_recommendations, many=True).data
    return Response({'crop_recommendations': data},status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_place(request):
    lat = request.data.get('lat')
    lon = request.data.get('lon')
    if lat == None or lon == None:
        return error_response("MISSING_COORDINATES")
    data = get_place_name(lat, lon)
    return Response({'place_name': data},status=status.HTTP_200_OK)
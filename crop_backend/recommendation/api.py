
@api_view(['GET'])
def recommendation_list_api(request):
    recommendations = Recommendation.objects.all()
    data = RecommendationSerializer(recommendations,many=True).data
    return Response({'recommendation':data})

@api_view(['GET'])
def plan_list_api(request):
    plans = Plan.objects.all()
    data = PlanSerializer(plans,many=True).data
    return Response({'recommendation':data})
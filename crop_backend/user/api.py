from django.contrib.auth.models import User
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework.decorators import api_view

@api_view(['GET'])
def user_list_api(request):
    users = User.objects.all()
    data = UserSerializer(users,many=True).data
    return Response({'users':data})

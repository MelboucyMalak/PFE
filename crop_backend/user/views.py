# like view
from django.contrib.auth.models import User
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework.decorators import api_view, permission_classes


@api_view(['GET'])
@permission_classes([IsAdminUser])
def user_list(request):
    users = User.objects.all()
    data = UserSerializer(users,many=True).data
    return Response({'users':data})

@api_view(['GET'])
@permission_classes([IsAdminUser])
def user_details(request,id):
    user = User.objects.get(id=id)
    data = UserSerializer(user).data
    return Response({'user':data})
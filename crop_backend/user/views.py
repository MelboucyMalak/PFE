# like view
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

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


@api_view(['POST'])
def login(request):
    username = User.objects.get(username=request.data['username'])
    user = authenticate(username=username,password=request.data['password'])
    if user is not None:
        token,created = Token.objects.get_or_create(user=user)
        return Response({'massage':'Login Success','token':token.key},status=status.HTTP_200_OK)
    else:
        return Response({'massage':'Login Failed'})

@api_view(['POST'])
def logout(request):
    Response('logout page')

@api_view(['POST'])
def register(request):
    Response('register page')
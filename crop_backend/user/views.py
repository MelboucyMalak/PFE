# like view
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
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
    user = authenticate(username=request.data['username'],password=request.data['password'])
    if user is not None:
        token,created = Token.objects.get_or_create(user=user)
        return Response({'massage':'Login Success','token':token.key},status=status.HTTP_200_OK)
    else:
        return Response({'massage':'Login Failed'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    if request.method == 'POST':
        try:
            # Delete the user's token to logout
            request.user.auth_token.delete()
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        user = UserSerializer(data=request.data)
        if user.is_valid():
            user.save()
            return Response(user.data, status=status.HTTP_201_CREATED)
        return Response(user.errors, status=status.HTTP_400_BAD_REQUEST)
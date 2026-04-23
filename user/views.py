# user/views.py
from django.utils import timezone
from django.contrib.auth.models import User
from django_rest_passwordreset.models import ResetPasswordToken
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from recommendation.models import RecommendationSession

from .serializers import UserSerializer, ChangePasswordSerializer
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate, update_session_auth_hash
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
    EorU = request.data.get('username') or request.data.get('email') # email OR username
    password = request.data.get('password')

    # we try to find the user by email
    user_obj = User.objects.filter(email=EorU).first()
    if user_obj: # if not null
        username = user_obj.username
    else:# then it is username
        username = EorU

    user = authenticate(username=username, password=password) # we try to log in the user

    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        return Response({'message':'Login Success','token': token.key, 'admin':user.is_staff },status=status.HTTP_200_OK)
    else:
        return Response({'message':'Login Failed'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
        try:
            # Delete the user's token to logout
            token = Token.objects.get(user=request.user)
            token.delete()
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Token.DoesNotExist:
            return Response({'error': 'Token not found.'}, status=400)


@api_view(['POST'])
def register(request):
        user = UserSerializer(data=request.data)
        if user.is_valid():
            user.save()
            return Response(user.data, status=status.HTTP_201_CREATED)
        return Response(user.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    if request.method == 'POST':
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if user.check_password(serializer.data.get('old_password')):
                user.set_password(serializer.data.get('new_password'))
                user.save()
                update_session_auth_hash(request, user)  # To update session after password change
                return Response({'message': 'Password changed successfully.'}, status=status.HTTP_200_OK)
            return Response({'error': 'Incorrect old password.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def testcode(request):
    token = request.data.get('code')

    if token : # see if user really insert a token means token <> null
        try:
             token_obj = ResetPasswordToken.objects.get(key=token)
             time = token_obj.created_at + timezone.timedelta(minutes=10) # the exact expiry time
             if timezone.now() < time: # mazal ma l7a9na l time
                 return Response({'message':'Code is valid'}, status=status.HTTP_200_OK)
             else:
                 return Response({'message':'Code is expired'}, status=status.HTTP_400_BAD_REQUEST)
        except ResetPasswordToken.DoesNotExist:
            return Response({'message':'Code not found.'}, status=404)
    else:
        return Response({'message':'Code must insert'}, status=status.HTTP_400_BAD_REQUEST)








# user/views.py
import secrets
from django.utils import timezone
from django.contrib.auth.models import User
from django_rest_passwordreset.models import ResetPasswordToken
from django_rest_passwordreset.signals import reset_password_token_created
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from _myProject.Errors.responses import error_response
from .serializers import UserSerializer, ChangePasswordSerializer ,UserUpdateSerializer
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate, update_session_auth_hash
from rest_framework.authtoken.models import Token


@api_view(['GET'])
@permission_classes([IsAdminUser])
def user_list(request):
    users = User.objects.all()
    data = UserSerializer(users,many=True).data
    return Response({'users':data})

@api_view(['GET','PUT', 'PATCH'])
@permission_classes([IsAdminUser])
def user_details(request,id):
    try:
        user = User.objects.get(id=id)
    except User.DoesNotExist:
        return error_response("USER_NOT_FOUND_BY_ID")
    if request.method == 'GET':
        data = UserSerializer(user).data
        return Response({'user':data})
    else:
        serializer = UserUpdateSerializer(user, data=request.data, partial=request.method == 'PATCH')
        if serializer.is_valid():
            serializer.save()
            return Response({'user': serializer.data}, status=status.HTTP_200_OK)
        return error_response("VALIDATION_ERROR")


@api_view(['POST'])
def login(request):
    E= request.data.get('email') # email OR username
    password = request.data.get('password')

    # we try to find the user by email
    user_obj = User.objects.filter(email=E).first()
    if user_obj: # if not null
        username = user_obj.username
    else:
        return error_response("USER_NOT_FOUND_BY_Email")

    user = authenticate(username=username, password=password) # we try to log in the user

    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        return Response({'message':'Login Success','token': token.key, 'admin':user.is_staff },status=status.HTTP_200_OK)
    else:
        return error_response("LOGIN_FAILED",http_status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
        try:
            # Delete the user's token to logout
            token = Token.objects.get(user=request.user)
            token.delete()
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Token.DoesNotExist:
            return error_response("TOKEN_NOT_FOUND")


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
            if not user.check_password(serializer.data.get('old_password')):
                return error_response("INCORRECT_OLD_PASSWORD")
            user.set_password(serializer.data.get('new_password'))
            user.save()
            update_session_auth_hash(request, user)  # To update session after password change
            return Response({'message': 'Password changed successfully.'}, status=status.HTTP_200_OK)
        return error_response("VALIDATION_ERROR")

@api_view(['POST'])
def testcode(request):
    token = request.data.get('code')
    if not token:
            return error_response("RESET_CODE_MISSING")
    try:
            token_obj = ResetPasswordToken.objects.get(key=token)
    except ResetPasswordToken.DoesNotExist:
            return error_response("RESET_CODE_NOT_FOUND")

    expiry_time = token_obj.created_at + timezone.timedelta(minutes=10)

    if timezone.now() > expiry_time:
        token_obj.delete()
        return error_response("RESET_CODE_EXPIRED")

    return Response({'message': 'Code is valid'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def forgot_password(request):
    email = request.data.get('email')
    if not email:
        return error_response("REQUIRED_FIELD_MISSING")

    user = User.objects.filter(email=email).first()
    if not user:
        return error_response("USER_NOT_FOUND_BY_EMAIL")
    token = ResetPasswordToken.objects.create(
        user=user,
        key=secrets.token_hex(20)
    )

    # Send the email via signal
    reset_password_token_created.send(
        sender=ResetPasswordToken,
        instance=None,
        reset_password_token=token
    )

    return Response({'status': 'OK'}, status=status.HTTP_200_OK)



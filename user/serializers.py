#user/serializers.py
## model data ---> json

from django.contrib.auth.models import User
from rest_framework import serializers

from _myProject.Errors.responses import error_response

'''class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"'''

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'is_staff', 'is_active']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise error_response("EMAIL_ALREADY_EXISTS")
        return value
    def create(self, validated_data): ##redefinition de class create 5trach
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class ResetPasswordEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

## model data ---> json
from django.contrib.auth.models import User
from rest_framework import serializers
from _myProject.Errors.responses import error_response, serializer_error


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username', 'email', 'password', 'is_staff', 'is_active', 'date_joined']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},  # not required on update
            'id': {'read_only': True},
            'is_staff': {'read_only': True},
            'is_active': {'read_only': True},
            'date_joined': {'read_only': True},
            'username': {'validators': []},
            'email': {'validators': []},
        }

    def validate_email(self, value):
        instance = self.instance  # in create it is null , in update it is user
        user_filter_email = User.objects.filter(email=value) # we get the user that has that email
        if instance:# if update
            # zineb update and let email be the same when i filter the users i shouldn't select zineb her self
            user_filter_email = user_filter_email.exclude(pk=instance.pk)
        if user_filter_email.exists():
            serializer_error("EMAIL_ALREADY_EXISTS")# then we are sure that another user have this email
        return value

    def validate_username(self, value):
        instance = self.instance
        user_filter_username = User.objects.filter(username=value)
        if instance:
            user_filter_username = user_filter_username.exclude(pk=instance.pk)
        if user_filter_username.exists():
            serializer_error("USERNAME_ALREADY_EXISTS")
        return value

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


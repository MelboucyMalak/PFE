## model data ---> json
from django.contrib.auth.models import User
from rest_framework import serializers

'''class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"'''

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data): ##redefinition de class create 5trach
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

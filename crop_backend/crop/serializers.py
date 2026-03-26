## model data ---> json
from rest_framework import serializers
from crop.models import Crop


class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Crop
        fields = '__all__'
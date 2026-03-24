## model data ---> json
## model data ---> json
from rest_framework import serializers

from crop.models import Crop


class CropSerializer(serializers.ModelSerializer):
    class Meta:
        crops = Crop.objects.all()
        fields = '__all__'
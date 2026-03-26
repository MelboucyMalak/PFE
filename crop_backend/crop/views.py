from rest_framework.response import Response
from .models import Crop
from .serializers import CropSerializer
from rest_framework.decorators import api_view

@api_view(['GET'])
def crop_list_api(request):
    crops = Crop.objects.all()
    data = CropSerializer(crops,many=True).data
    return Response({'crops':data})
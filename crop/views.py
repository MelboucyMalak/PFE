from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .models import Crop
from .serializers import CropSerializer
from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

# farmer methods can only read
@api_view(['GET'])
def crop_list(request):
    crops = Crop.objects.all()
    data = CropSerializer(crops,many=True).data
    return Response({'crops':data})

@api_view(['GET'])
def crop_detail(request,pk):
    crop = Crop.objects.get(pk=pk)
    data = CropSerializer(crop).data
    return Response({'crop':data})


# admin methods can CRUD
class CropViewSet(viewsets.ModelViewSet):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    permission_classes = [IsAdminUser]




from rest_framework.response import Response
from _myProject.Errors.responses import error_response
from .models import Crop
from .serializers import CropSerializer
from rest_framework.decorators import api_view
from rest_framework import viewsets, status
from rest_framework.permissions import IsAdminUser

# farmer methods can only read
@api_view(['GET'])
def crop_list(request):
    crops = Crop.objects.all()
    data = CropSerializer(crops,many=True).data
    return Response({'crops':data})

@api_view(['GET'])
def crop_detail(request,pk):
    try:
        crop = Crop.objects.get(pk=pk)
    except Crop.DoesNotExist:
        return error_response("CROP_NOT_FOUND")
    data = CropSerializer(crop).data
    return Response({'crop':data})


# admin methods can CRUD
class CropViewSet(viewsets.ModelViewSet):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    permission_classes = [IsAdminUser]
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"detail": f"Crop '{instance.crop_name}' deleted successfully."},
            status=status.HTTP_200_OK
        )

    def update(self, request,partial=False, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(
            {"detail": f"Crop '{serializer.instance.crop_name}' updated successfully."},
            status=status.HTTP_200_OK
        )


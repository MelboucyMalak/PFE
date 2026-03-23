from django.shortcuts import render
from django.http import HttpResponse

from crop.models import Crop


# Create your views here.
def crops_list(request):
    crops = Crop.objects.all()
    return  HttpResponse("here you can see crop list (all)")

def crop(request,name):
    crop = Crop.objects.get(name=name)
    return HttpResponse(f"here you can see {crop.name} blabla")
from django.http import HttpResponse
from django.shortcuts import redirect
from django.contrib.auth import  login, authenticate,logout


# Create your views here.
def log_in(request):
    login(request)
    return HttpResponse('log in page ')

def log_out(request):
    logout(request)
    return redirect('home')
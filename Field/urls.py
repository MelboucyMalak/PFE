from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FieldAnalysisViewSet, GenericFertilizationView, PersonalizedFertilizationView

router = DefaultRouter()
router.register(r'analysis', FieldAnalysisViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('fertilization/generic/', GenericFertilizationView.as_view()),
    path('fertilization/personalized/', PersonalizedFertilizationView.as_view()),
]
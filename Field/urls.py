from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FieldAnalysisViewSet, GenericFertilizationView, PersonalizedFertilizationView
from .views import (
    FieldAnalysisViewSet,
    GenericFertilizationView,
    PersonalizedFertilizationView,
    GenericFertilizationHistoryView,       # add
    PersonalizedFertilizationHistoryView,  # add
)
router = DefaultRouter()
router.register(r'analysis', FieldAnalysisViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('fertilization/generic/',                    GenericFertilizationView.as_view()),
    path('fertilization/generic/history/<int:crop_recommendation_id>/',
         GenericFertilizationHistoryView.as_view()),
    path('fertilization/personalized/',               PersonalizedFertilizationView.as_view()),
    path('fertilization/personalized/history/<int:field_analysis_id>/',
         PersonalizedFertilizationHistoryView.as_view()),
]
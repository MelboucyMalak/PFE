from django.apps import AppConfig

from recommendation.ExternalApiService import initEE


class RecommendationConfig(AppConfig):
    name = 'recommendation'
    def ready(self):
        initEE()
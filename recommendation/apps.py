from django.apps import AppConfig




class RecommendationConfig(AppConfig):
    name = 'recommendation'
    def ready(self):
        from .ExternalApiService import initEE
        initEE()
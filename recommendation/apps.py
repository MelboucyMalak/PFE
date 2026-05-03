from django.apps import AppConfig




class RecommendationConfig(AppConfig):
    name = 'recommendation'
    def ready(self):
        import os
        if os.environ.get('RUN_MAIN') != 'true':
            return
        from .ExternalApiService import initEE
        initEE()
from django.contrib.auth.models import User
from django.db import models
from crop.models import Crop


# Create your models here.

class Recommendation(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    lat=models.FloatField()
    long=models.FloatField()
    created_at=models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.user.get_full_name() or self.user.username

#---------------------------------------------------------

class Plan (models.Model):
    pk = models.CompositePrimaryKey("recommendation_id", "crop_id")
    recommendation_id=models.ForeignKey(Recommendation, on_delete=models.CASCADE)
    crop_id=models.ForeignKey(Crop, on_delete=models.CASCADE)
    Note=models.TextField(max_length=1000)
    def __str__(self):
        return self.crop_id.crop_name
    class Meta:
        unique_together=("recommendation_id","crop_id")
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Q
from django.utils import timezone
from django.db import models
from crop.models import Crop



# 𝗖𝗟𝗔𝗦𝗦 𝗥𝗘𝗖𝗢𝗠𝗠𝗘𝗡𝗗𝗔𝗧𝗜𝗢𝗡 𝗦𝗘𝗦𝗦𝗜𝗢𝗡
class RecommendationSession(models.Model):
    date=models.DateTimeField(default=timezone.now)
    lat=models.FloatField(validators=[MinValueValidator(-90), MaxValueValidator(90)])
    lon=models.FloatField(validators=[MinValueValidator(-180), MaxValueValidator(180)])
    n_total_raw_ppm=models.FloatField()
    p_extractable_raw_ppm=models.FloatField()
    k_extractable_raw_ppm=models.FloatField()
    soil_texture_initial = models.CharField(max_length=20)
    soil_ph_initial = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(14.0)])
    slope_angle=models.FloatField()
    land_cover = models.CharField(max_length=50)
    rainfall_avg=models.FloatField()
    temperature_avg=models.FloatField()
    humidity_avg=models.FloatField()
    koppen = models.CharField(max_length=10)
    usefull=models.BooleanField(default=False)

    def __str__(self):
        return f"Session {self.id} ({self.lat}, {self.lon})"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['lat', 'lon'],
                name='unique_lat_lon'
            )
        ]


# 𝗖𝗟𝗔𝗦𝗦 𝗖𝗥𝗢𝗣 𝗥𝗘𝗖𝗢𝗠𝗠𝗘𝗡𝗗𝗔𝗧𝗜𝗢𝗡
class CropRecommendation (models.Model):
    recommendation=models.ForeignKey(RecommendationSession, on_delete=models.CASCADE)
    crop=models.ForeignKey(Crop, on_delete=models.CASCADE)
    compatibility_score = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)])

    def __str__(self):
        return self.crop.crop_name

    class Meta:
        models.UniqueConstraint(
            fields=['recommendation', 'crop'],
            name='unique_crop_per_session'
        ),
class History(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE) # relation User--History 1.n on delete cascade
    recommendation=models.ForeignKey(RecommendationSession, on_delete=models.CASCADE)
    def __str__(self):
        return self.user.get_full_name() or self.user.username

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'recommendation'],
                name='unique_user_recommendation'
            )
        ]

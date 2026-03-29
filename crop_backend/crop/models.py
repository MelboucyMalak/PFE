from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.db.models import Q,F

SOWING_MONTH_CHOICES = [
    (1, "January"), (2, "February"), (3, "March"),
    (4, "April"), (5, "May"), (6, "June"),
    (7, "July"), (8, "August"), (9, "September"),
    (10, "October"), (11, "November"), (12, "December"),
]

# Create your models here.
class Crop(models.Model):
    crop_name = models.CharField(max_length=50)
    PH_Min= models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(14.0)]) #PH BETWEEN 0-14
    PH_Max = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(14.0)])  # PH BETWEEN 0-14
    Duration_Days=models.IntegerField(default=0)
    Temp_Min=models.FloatField()
    Temp_Max = models.FloatField()
    Water_Min_mm= models.FloatField()
    Water_Max_mm= models.FloatField()
    Humidity_Min= models.FloatField()
    Humidity_Max= models.FloatField()
    N_kg_Ha= models.FloatField()
    P_kg_Ha= models.FloatField()
    K_kg_Ha= models.FloatField()
    Soil_Moisture = models.CharField
    Root_Depth_cm = models.FloatField()
    Sampling_Depth_cm = models.FloatField()
    Sampling_Shape= models.CharField()
    Sowing_Month_start=models.IntegerField(choices=SOWING_MONTH_CHOICES) # should modify it later ?
    Sowing_Month_end = models.IntegerField(choices=SOWING_MONTH_CHOICES)
    Note= models.CharField()
    def __str__(self):
        return self.crop_name
    class Meta:
        constraints = [
            models.CheckConstraint(condition=Q(PH_Min__gte=0.0) & Q(PH_Min__lte=14.0),
                                   name='ph_min_between_0_and_14'),
            models.CheckConstraint(condition=Q(PH_Max__gte=0.0) & Q(PH_Max__lte=14.0),
                                   name='ph_max_between_0_and_14')
        ] # gte: greater or =  //  lte: less or =

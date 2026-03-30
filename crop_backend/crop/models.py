from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.db.models import Q,F

SOWING_MONTH_CHOICES = [
    (1, "January"), (2, "February"), (3, "March"),
    (4, "April"), (5, "May"), (6, "June"),
    (7, "July"), (8, "August"), (9, "September"),
    (10, "October"), (11, "November"), (12, "December"),
]

SUITABILITY_CHOICES = [
    (1, "Avoid"), (2, "Difficult"), (3, "Acceptable"),
    (4, "Good"), (5, "Ideal")
]
# CLASS CROP
class Crop(models.Model):
    crop_name = models.CharField(max_length=50)
    ph_min= models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(14.0)])
    ph_max = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(14.0)])
    duration_Days=models.IntegerField(default=0)
    temp_min=models.FloatField()
    temp_max = models.FloatField()
    water_min_mm= models.FloatField()
    water_max_mm= models.FloatField()
    humidity_min= models.FloatField()
    humidity_max= models.FloatField()
    n_kg_ha= models.FloatField()
    p_kg_ha= models.FloatField()
    k_kg_ha= models.FloatField()
    root_depth_min_cm = models.FloatField()
    root_depth_max_cm = models.FloatField()
    sampling_depth_cm = models.FloatField()
    sampling_shape= models.CharField(default='', max_length=50)
    sowing_month_start=models.IntegerField(choices=SOWING_MONTH_CHOICES)
    sowing_month_end = models.IntegerField(choices=SOWING_MONTH_CHOICES)
    note = models.CharField(default='', max_length=100)

    def __str__(self):
        return self.crop_name

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=Q(ph_min__lte=F('ph_max')),
                name='ph_min_less_than_max'
            ),
            models.CheckConstraint(
                condition=Q(temp_min__lte=F('temp_max')),
                name='temp_min_less_than_max'
            ),
            models.CheckConstraint(
                condition=Q(water_min_mm__lte=F('water_max_mm')),
                name='water_min_less_than_max'
            ),
            models.CheckConstraint(
                condition=Q(humidity_min__lte=F('humidity_max')),
                name='humidity_min_less_than_max'
            ),
            models.CheckConstraint(
                condition=Q(ph_min__gte=0.0) & Q(ph_min__lte=14.0),
                name='ph_min_between_0_and_14'
            ),
            models.CheckConstraint(
                condition=Q(ph_max__gte=0.0) & Q(ph_max__lte=14.0),
                name='ph_max_between_0_and_14'
            )
        ] # gte: greater or =  //  lte: less or =




#CLASS CLIMATE
class Climate(models.Model):
    climate_zone= models.CharField(default='', max_length=50)
    mineralization_factor= models.FloatField(default=0.0)
    def __str__(self):
        return self.climate_zone

    class Meta:#no constraint for now
        pass




#CLASS CROP-CLIMATE
class CropClimate(models.Model):
    crop= models.ForeignKey(Crop,on_delete=models.CASCADE)
    climate= models.ForeignKey(Climate,on_delete=models.CASCADE)
    rating= models.IntegerField(choices=SUITABILITY_CHOICES)# i will see later if i need to change
    Note= models.CharField(default='', max_length=100)
    def __str__(self):
        return f"{self.crop} - {self.climate}"
    class Meta:# no constraint ?
        constraints = [
            models.UniqueConstraint(fields=['crop', 'climate'], name='unique_crop_climate')
        ]

# CLASS SOIL TEXTURE
class SoilTexture(models.Model):
    texture_class= models.CharField(default='', max_length=50)
    def __str__(self):
        return self.texture_class

# CLASS CROP-SOIL-TEXTURE
class CropSoilTexture(models.Model):
    crop= models.ForeignKey(Crop,on_delete=models.CASCADE)
    soil_texture= models.ForeignKey(SoilTexture,on_delete=models.CASCADE)
    suitability_rank= models.IntegerField(choices=SUITABILITY_CHOICES)
    note= models.CharField(default='', max_length=100)
    class Meta:
        pass

'''
 to send choice to frontend i use 
 get_<field_name>_display() django auto creat it :D
'''

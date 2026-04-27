from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.db.models import Q,F


SUITABILITY_CHOICES = [
    (1, "Avoid"), (2, "Difficult"), (3, "Acceptable"),
    (4, "Good"), (5, "Ideal")
]

SOWING_MONTH_CHOICES = [
    (1, "January"), (2, "February"), (3, "March"),
    (4, "April"), (5, "May"), (6, "June"),
    (7, "July"), (8, "August"), (9, "September"),
    (10, "October"), (11, "November"), (12, "December"),
]

# 𝗖𝗟𝗔𝗦𝗦 𝗖𝗥𝗢𝗣
class Crop(models.Model):
    crop_name = models.CharField(max_length=50,unique=True)
    ph_min= models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(14.0)])
    ph_max = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(14.0)])
    duration_days=models.IntegerField(default=0)
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
    image = models.ImageField(upload_to='crops/', null=True, blank=True)

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
            ),
            models.CheckConstraint(
                condition=Q(duration_days__gte=0),
                name='duration_positive'
            ),
            models.CheckConstraint(
                condition=Q(root_depth_min_cm__lte=F('root_depth_max_cm')),
                name='root_depth_valid'
            ),
            models.CheckConstraint(
                condition=Q(root_depth_min_cm__gte=0),
                name='root_depth_positive'
            ),
            models.CheckConstraint(
                condition=Q(sampling_depth_cm__gte=0),
                name='sampling_depth_positive'
            )
        ] # gte: greater or =  //  lte: less or =


# 𝗖𝗟𝗔𝗦𝗦 𝗖𝗟𝗜𝗠𝗔𝗧𝗘
class Climate(models.Model):
    climate_zone = models.CharField(max_length=50, unique=True)
    mineralization_factor= models.FloatField(default=0.0)
    def __str__(self):
        return self.climate_zone

    class Meta:#no constraint for now
        models.CheckConstraint(
            condition=Q(mineralization_factor__gte=0),
            name='mineralization_positive'
        ),


# 𝗖𝗟𝗔𝗦𝗦 𝗖𝗥𝗢𝗣 𝗖𝗟𝗜𝗠𝗔𝗧𝗘
class CropClimate(models.Model):
    crop= models.ForeignKey(Crop,on_delete=models.CASCADE,related_name='crop_climates')
    climate= models.ForeignKey(Climate,on_delete=models.CASCADE)
    rating= models.IntegerField(choices=SUITABILITY_CHOICES)# I will see later if I need to change
    note= models.CharField(default='', max_length=100)

    def __str__(self):
        return f"{self.crop} - {self.climate}"

    class Meta:# no constraint ?
        constraints = [
            models.UniqueConstraint(fields=['crop', 'climate'], name='unique_crop_climate'),
            models.CheckConstraint(
                condition=Q(rating__gte=1) & Q(rating__lte=5),
                name='rating_between_1_and_5'
            )
        ]


# 𝗖𝗟𝗔𝗦𝗦 𝗖𝗥𝗢𝗣 𝗦𝗢𝗜𝗟 𝗧𝗘𝗫𝗧𝗨𝗥𝗘
class CropSoilTexture(models.Model):
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE,related_name='crop_soil_textures')
    texture_name = models.CharField(max_length=50)
    suitability_rank = models.IntegerField(choices=SUITABILITY_CHOICES)
    note = models.CharField(default='', max_length=100)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['crop', 'texture_name'],
                name='unique_crop_soil_name'
            )
        ]


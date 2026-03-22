from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.db.models import Q


# Create your models here.
class Crop(models.Model):
    crop = models.CharField(max_length=50)
    PH= models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(14.0)]) #PH BETWEEN 0-14
    P= models.FloatField()
    K= models.FloatField()
    N= models.FloatField()
    def __str__(self):
        return self.crop
    class Meta:
        constraints = [
            models.CheckConstraint(check=Q(ph__gte=0.0) & Q(ph__lte=14.0),name='ph_between_0_and_14')
        ] # gte: greater or =  //  lte: less or =

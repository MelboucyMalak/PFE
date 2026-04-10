from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Profile(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE) # relation User--Profile 1.1 on delete cascade
    def __str__(self):
        return self.user.get_full_name() or self.user.username




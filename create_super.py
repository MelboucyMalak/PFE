import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', '_myProject.settings')

import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'zineb')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'berrachedizineb5@gmail.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'zineb2005')

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"✅ Superuser '{username}' created!")
else:
    print(f"⚠️ Superuser '{username}' already exists.")
#!/usr/bin/env python
"""update_crop_images.py – Set the image field for existing Crop records
based on files already placed in media/crops/"""

import os
import sys

# Django setup – adjust '_myProject.settings' to your actual project name
os.environ.setdefault('DJANGO_SETTINGS_MODULE', '_myProject.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import django
django.setup()

from django.conf import settings
from crop.models import Crop

# ----------------------------------------------------------------------
# Manual mapping for filenames that don't exactly match crop_name
# (key = filename stem with underscores replaced by spaces, lowercase)
MANUAL_MAP = {
    "chayote": "Chowchow",          # Chayote.png -> Chowchow
    "chili": "Chilie",             # Chili.png -> Chilie (CSV name)
    "sugarcanne": "Sugarcane",     # Sugarcanne.png -> Sugarcane

    # Add more here if needed
}

def update_images():
    crops_dir = os.path.join(settings.MEDIA_ROOT, 'crops')
    if not os.path.isdir(crops_dir):
        print(f"Directory not found: {crops_dir}")
        return

    updated = 0
    missing = 0

    # Load all crops once, indexed by lowercase name for fast lookup
    crops_by_name = {c.crop_name.lower(): c for c in Crop.objects.all()}

    for filename in os.listdir(crops_dir):
        if filename.startswith('.'):       # skip hidden files
            continue
        full_path = os.path.join(crops_dir, filename)
        if not os.path.isfile(full_path):
            continue

        # Extract the crop name from the filename
        stem, _ = os.path.splitext(filename)          # e.g. "Ash gourd"
        lookup_name = stem.replace('_', ' ').lower()  # normalise

        # Check manual overrides
        crop_name = MANUAL_MAP.get(lookup_name)
        if crop_name:
            crop_obj = crops_by_name.get(crop_name.lower())
        else:
            crop_obj = crops_by_name.get(lookup_name)

        if crop_obj:
            # Set the image field to the relative path (as expected by ImageField)
            relative_path = f"crops/{filename}"
            crop_obj.image.name = relative_path
            crop_obj.save(update_fields=['image'])
            print(f"✅ Updated {crop_obj.crop_name} → {relative_path}")
            updated += 1
        else:
            print(f"⚠️  No crop found for file: {filename}")
            missing += 1

    print(f"\nDone → {updated} updated, {missing} missing/non‑matched files.")

if __name__ == '__main__':
    update_images()
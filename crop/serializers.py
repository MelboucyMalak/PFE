## model data ---> json
from django.utils.text import normalize_newlines
from rest_framework import serializers
from crop.models import Crop


class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Crop
        fields = '__all__'
    def validate(self, data):
            errors = {}
            if data.get('crop_name') is None:
                errors['crop_name'] = 'Field is required'
            Fields = [
            'ph_min', 'ph_max',
            'temp_min', 'temp_max',
            'water_min_mm', 'water_max_mm',
            'humidity_min', 'humidity_max',
            'n_kg_ha', 'p_kg_ha', 'k_kg_ha',
            'root_depth_min_cm', 'root_depth_max_cm',
            'sampling_depth_cm',
            'sowing_month_start', 'sowing_month_end',
            "duration_days"
        ]
            for field in Fields:
                if data.get(field) is None :
                    errors[field] = "Field is required"
                elif data.get(field) <= 0:
                    errors[field] = "Field must be greater than or equal to 0"

            pairs = [
                ('ph_min', 'ph_max'),
                ('temp_min', 'temp_max'),
                ('water_min_mm', 'water_max_mm'),
                ('humidity_min', 'humidity_max'),
                ('root_depth_min_cm', 'root_depth_max_cm'),
            ]
            for min, max in pairs:
                min_val = data.get(min)
                max_val = data.get(max)
                if min_val is not None and max_val is not None and min_val > max_val:
                    errors[min] = f"Must be less than or equal to {min}"
                    errors[max] = f"Must be greater than or equal to {max}"
            if errors:
                raise serializers.ValidationError(errors)

            return data
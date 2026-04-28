## model data ---> json
from rest_framework import serializers
from crop.models import Crop, Climate, CropSoilTexture, CropClimate , SOWING_MONTH_CHOICES
import json

class MonthChoiceField(serializers.IntegerField):
    def to_representation(self, value):
        for num, name in SOWING_MONTH_CHOICES:
            if num == value:
                return name
        return value

class ClimateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Climate
        fields = ['id','climate_zone']

class  CropSoilTextureSerializer(serializers.ModelSerializer):
    class Meta:
        model  =  CropSoilTexture
        fields = ['texture_name','suitability_rank','note']
        extra_kwargs = {'id': {'read_only': True}}

class  CropClimateSerializer(serializers.ModelSerializer):
    climate = serializers.CharField(source='climate.climate_zone', read_only=True)
    climate_id = serializers.IntegerField(write_only=True)

    class Meta:
        model  =  CropClimate
        fields = ['climate','rating','note','climate_id']
        extra_kwargs = {'id': {'read_only': True}}
    def validate_climate_id(self, value):
        if not Climate.objects.filter(id=value).exists():
            raise serializers.ValidationError(f"Climate with id {value} does not exist.")
        return value

    def create(self, validated_data):
        climate_id = validated_data.pop('climate_id')
        climate = Climate.objects.get(id=climate_id)
        return CropClimate.objects.create(climate=climate, **validated_data)

    def update(self, instance, validated_data):
        climate_id = validated_data.pop('climate_id', None)
        if climate_id:
            climate = Climate.objects.get(id=climate_id)
            instance.climate = climate
        instance.rating = validated_data.get('rating', instance.rating)
        instance.note = validated_data.get('note', instance.note)
        instance.save()
        return instance

class CropSerializer(serializers.ModelSerializer):
    sowing_month_start = MonthChoiceField()
    sowing_month_end = MonthChoiceField()
    crop_climates = CropClimateSerializer(many=True,required=False)
    crop_soil_textures = CropSoilTextureSerializer(many=True,required=False)
    class Meta:
        model  = Crop
        fields = '__all__'
    def to_internal_value(self, data):
        new_data = data.dict() if hasattr(data, 'dict') else dict(data)
        for field in ['crop_climates', 'crop_soil_textures']:
            val = new_data.get(field)
            if isinstance(val, str):
                try:
                    new_data[field] = json.loads(val)
                except json.JSONDecodeError:
                    raise serializers.ValidationError({field: "Invalid JSON"})
        return super().to_internal_value(new_data)
    def validate(self, data):
            errors = {}
            partial = self.partial
            if not partial and data.get('crop_name') is None:
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
                if partial and field not in data:
                    continue
                val = data.get(field)
                if val is None:
                    errors[field] = "Field is required"
                elif isinstance(val, (int, float)) and val < 0:
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
    def create(self, validated_data):
        climates_data = validated_data.pop('crop_climates', [])
        textures_data = validated_data.pop('crop_soil_textures', [])
        crop = Crop.objects.create(**validated_data)

        for item in climates_data:
            CropClimateSerializer().create({**item, 'crop': crop})
        for item in textures_data:
            CropSoilTexture.objects.create(crop=crop, **item)
        return crop
    def update(self, instance, validated_data):
        climates_data = validated_data.pop('crop_climates', None)
        textures_data = validated_data.pop('crop_soil_textures', None)

        # Update crop fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Replace nested lists if provided
        if climates_data is not None:
            instance.crop_climates.all().delete()
            for item in climates_data:
                CropClimateSerializer().create({**item, 'crop': instance})
        if textures_data is not None:
            instance.crop_soil_textures.all().delete()
            for item in textures_data:
                CropSoilTexture.objects.create(crop=instance, **item)

        return instance


from rest_framework import serializers
from TrueImage.views import *
from TrueImage.models import *


class CropSerializerGET(serializers.ModelSerializer):
    
    class Meta:
        model = CroppedArea
        fields = '__all__'
       



class CropSerializerPost(serializers.ModelSerializer):
    class Meta:
        model = CroppedArea
        fields = '__all__'
from rest_framework.serializers import ModelSerializer
from GreenBuildingManagement.models import BmsGreenBuildingManageDevice,BmsGreenBuildingData,BmsGreenBuildingDatass

from rest_framework import serializers


class BmsGreenBuildingManageDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BmsGreenBuildingManageDevice
        # fields = '__all__'
        fields=['id','device_name','model_no']
        
class BmsGreenBuildingManageDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = BmsGreenBuildingData
        fields = '__all__'
        # fields=['id','device_name','model_no']
        
        
class BmsGreenBuildingManageDataSerializersss(serializers.ModelSerializer):
    class Meta:
        model = BmsGreenBuildingDatass
        # fields = '__all__'
        fields=['id','manage_device','leed_data','created_at']
        
        

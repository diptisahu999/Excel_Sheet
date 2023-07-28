from django.db import models
from django.utils import timezone
from datetime import datetime

def get_formatted_datetime():
    now = datetime.now()
    formatted_datetime = now.strftime("%H:%M %d/%m/%y")
    return formatted_datetime

# Create your models here.

class BmsGreenBuildingManageDevice(models.Model):
    STATUS= [
        ("Active","Active"),
        ("In-Active","In-Active"),
    ]
    
    SOURCETYPE= [
        ("Air Quality","Air Quality"),
        ("DGVCL Energy","DGVCL Energy"),
        ("Solar Energy","Solar Energy"),
        ("Rain Water","Rain Water"),
    ]
    
    source_type=models.CharField(max_length=333,choices=SOURCETYPE)
    user_name=models.CharField(max_length=222,blank=True)
    password=models.CharField(max_length=222,blank=True)
    api_key=models.CharField(max_length=344,blank=True)
    device_name=models.CharField(max_length=223,blank=True)
    model_no=models.CharField(max_length=343,blank=True)
    area_name=models.CharField(max_length=333,blank=True)
    status = models.CharField(max_length=100,choices=STATUS,default=STATUS[0][0])
    created_at=models.DateTimeField(default=timezone.now)
    updated_at=models.DateTimeField(auto_now=True)
    
    
    def __str__(self):
        return self.device_name
    
    class Meta():
        db_table='bms_green_building_manage_device'
        
        
        
class BmsGreenBuildingData(models.Model):
    
    
    manage_device=models.ForeignKey(BmsGreenBuildingManageDevice,on_delete=models.CASCADE,blank=True,null=True)
    temperature=models.CharField(max_length=222,blank=True)
    pm10=models.CharField(max_length=222,blank=True)
    voc=models.CharField(max_length=222,blank=True)
    humidity=models.CharField(max_length=222,blank=True)
    time=models.DateTimeField(auto_now=True)
    aqi=models.CharField(max_length=111,blank=True)
    pm25=models.CharField(max_length=222,blank=True)
    viral_index=models.CharField(max_length=232,blank=True)
    
    
    def __str__(self):
        return self.temperature
    
    class Meta():
        db_table='bms_green_building_data'
        
        
        
        
class BmsGreenBuildingDatass(models.Model):
    
    
    manage_device=models.ForeignKey(BmsGreenBuildingManageDevice,on_delete=models.CASCADE,blank=True,null=True)
    leed_data=models.JSONField()
    created_at=models.CharField(default=str(get_formatted_datetime()),max_length=999,null=True,blank=True)
    # temperature=models.CharField(max_length=222,blank=True)
    # pm10=models.CharField(max_length=222,blank=True)
    # voc=models.CharField(max_length=222,blank=True)
    # humidity=models.CharField(max_length=222,blank=True)
    # time=models.DateTimeField(auto_now=True)
    # aqi=models.CharField(max_length=111,blank=True)
    # pm25=models.CharField(max_length=222,blank=True)
    # viral_index=models.CharField(max_length=232,blank=True)
    
    
    def __str__(self):
        return str(self.id)
    
    class Meta():
        db_table='bms_green_building_datass'

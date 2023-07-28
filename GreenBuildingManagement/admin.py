from django.contrib import admin
from GreenBuildingManagement.models import *

# Register your models here.

@admin.register(BmsGreenBuildingData)
class GreenAdmin(admin.ModelAdmin):
    list_display=['id','temperature']
    
    
@admin.register(BmsGreenBuildingManageDevice)
class GreenAdmin(admin.ModelAdmin):
    list_display=['id','device_name','source_type']
    
    
@admin.register(BmsGreenBuildingDatass)
class GreendataAdmin(admin.ModelAdmin):
    list_display=['id']


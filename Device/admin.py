from django.contrib import admin
from .models import *

# Register your models here.


@admin.register(BmsBuildingMaster)
class Bms_building_masterAdmin(admin.ModelAdmin):
    list_display = ['id', 'tower_name', 'created_at', 'updated_at']


@admin.register(BmsFloorMaster)
class Bms_floor_masterAdmin(admin.ModelAdmin):
    list_display = ['id', 'floor_name', 'created_at', 'updated_at']


# @admin.register(BmsDepartmentMaster)
# class Bms_department_masterAdmin(admin.ModelAdmin):
#     list_display = ['id', 'department_name', 'created_at', 'updated_at']


@admin.register(BmsAreaMaster)
class bms_area_master_admin(admin.ModelAdmin):
    list_display = ['id', 'area_name', 'created_at', 'updated_at']


@admin.register(BmsSubAreaMaster)
class Bms_sub_area_masterAdmin(admin.ModelAdmin):
    list_display = ['id', 'sub_area_name',
                    'width', 'height', 'seating_capacity', 'created_at', 'updated_at']


@admin.register(BmsLocker)
class Bms_lockerAdmin(admin.ModelAdmin):
    list_display = ['id', 'locker_name', 'category',
                    'status', 'created_at', 'updated_at']


@admin.register(BmsAccessControlRfidMaster)
class Bms_access_control_rfid_masterAdmin(admin.ModelAdmin):
    list_display = ['id', 'rfid_no', 'card_type', 'status',
                    'access_start_time', 'access_end_time', 'created_at', 'updated_at']


@admin.register(BmsHistory)
class Bms_historyAdmin(admin.ModelAdmin):
    list_display = ['id', 'type',
                    'description', 'status', 'created_at']


@admin.register(BmsSettings)
class Bms_settingsAdmin(admin.ModelAdmin):
    list_display = ['id', 'setting_data', 'created_at']


@admin.register(BmsDeviceInformation)
class Bms_deviceAdmin(admin.ModelAdmin):
    list_display = ['id', 'device_name', 'create_at', 'device_informations',
                    'status', 'is_used', 'updated_at']



@admin.register(BmsDeviceTypeMaster)
class Bms_device_type_admin(admin.ModelAdmin):
    list_display = ['id',
                    'name',
                    'created_at',
                    ]


@admin.register(BmsDeviceStatusHistory)
class Bms_device_status_history_admin(admin.ModelAdmin):
    list_display = ['device_data',
                    'device_status',
                    'date_time']


@admin.register(BmsUserAreaCardsList)
class Bms_user_area_cards_list_admin(admin.ModelAdmin):
    list_display = ['id',
                    'card_id',
                    'user_card_name',
                    'created_at',
                    'status']
    

@admin.register(BmsScenes)
class SencesAdmin(admin.ModelAdmin):
    list_display=[
        'scene_name',
        'status','created_at'
    ]
    
    
@admin.register(BmsTriggers)
class TriggersAdmin(admin.ModelAdmin):
    list_display=[
        'trigger_name','action_type','trigger_data'
    ]


@admin.register(BmsSceneAppliancesDetails)
class BmsSceneAppliancesDetailsAdmin(admin.ModelAdmin):
    list_display=[
        'id'
    ]
    
    
    
@admin.register(BmsHardwareTypeMaster)
class BmsHardwareTypeMasterAdmin(admin.ModelAdmin):
    list_display=[
        'id'
    ]
    
    

@admin.register(BmsHardWareDetails)
class BmsHardWareDetailsAdmin(admin.ModelAdmin):
    list_display=[
        'id','hardware_name','hardware_details','status',
    ]
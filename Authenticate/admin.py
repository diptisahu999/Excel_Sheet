from django.contrib import admin
from Authenticate.models import *
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


# Register your models here.


@admin.register(BmsModuleMaster)
class ModuleAdmin(admin.ModelAdmin):
    list_display=['id','module_name','module_slug','status','created_at','updated_at']
    
    
@admin.register(BmsRole)
class ModuleAdmin(admin.ModelAdmin):
    list_display=['id','role_name','created_at','updated_at']
    
@admin.register(BmsUserType)
class ModuleAdmin(admin.ModelAdmin):
    list_display=['id','created_at']
    
    
@admin.register(BmsUser)
class ModuleAdmin(admin.ModelAdmin):
    list_display=['id','user_email','user_password','status','created_at','updated_at']
    

@admin.register(BmsUsersDetail)
class ModuleAdmin(admin.ModelAdmin):
    list_display=['id','first_name','phone_no','dob','address','created_at','updated_at']
    
    
    
@admin.register(BmsUserWallet)
class UserwalletAdmin(admin.ModelAdmin):
    list_display=['id','wallet_balance','created_at']


# @admin.register(BmsRolesDeviceInformation)
# class RoleDeviceInformationAdmin(admin.ModelAdmin):
#     list_display=['id','created_date','updatated_date']
    
    
@admin.register(BmsUserHasAreaAcces)
class BmsUserHasAreaAccesAdmin(admin.ModelAdmin):
    list_display=['id','user_details_id','building_id']
    
    
@admin.register(BmsRolesDevicesInformation)
class BmsRolesDevicesInformationAdmin(admin.ModelAdmin):
    list_display=['id','role_data']
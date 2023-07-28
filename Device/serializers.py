from rest_framework import serializers
from Device.models import *
from rest_framework.validators import UniqueValidator
from Authenticate.models import BmsRole

# GET Building


class BmsBuildingMasterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=100, validators=[UniqueValidator(queryset=BmsBuildingMaster.objects.all())])
    class Meta:
        model = BmsBuildingMaster
        fields = '__all__'
        depth=10

class BmsBuildingMasterSerializerPost(serializers.ModelSerializer):
    # name = serializers.CharField(max_length=100, validators=[UniqueValidator(queryset=BmsBuildingMaster.objects.all())])
    class Meta:
        model = BmsBuildingMaster
        fields = '__all__'
        # depth=10

# GET Floor

class BmsBuildingMasterSerializer1111(serializers.ModelSerializer):
    class Meta:
        model = BmsBuildingMaster
        fields = ['id','tower_name','created_at','updated_at']
        depth = 10


# GET Floor


class BmsBuildingMasterSerializer1111(serializers.ModelSerializer):
    class Meta:
        model = BmsBuildingMaster
        fields = ['id','tower_name','created_at','updated_at']
        depth = 10


class TowerDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = BmsBuildingMaster
        exclude = ['is_deleted']


class BmsFloorMasterSerializer(serializers.ModelSerializer):
    # tower_details = BmsBuildingMasterSerializer1111(source='tower_data', read_only=True)
    tower_data = TowerDataSerializer()
    class Meta:
        model = BmsFloorMaster
        # fields ='__all__'
        fields=['id','floor_name','status','created_at','updated_at','tower_data']
        depth = 10
        

# post Floor


class BmsFloorMasterSerializerPost(serializers.ModelSerializer):
    class Meta:
        model = BmsFloorMaster
        fields ='__all__'
        # depth=10

# GET  Department
class BmsDepartmentMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = BmsDepartmentMaster
        fields ='__all__'
        depth = 10

# post Department


class BmsDepartmentMasterSerializerPost(serializers.ModelSerializer):
    class Meta:
        model = BmsDepartmentMaster
        fields = '__all__'
        depth=10

# GET area

# GET area
class TowerDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = BmsBuildingMaster
        exclude = ['is_deleted']
        depth=10


class FloorDataSerializer(serializers.ModelSerializer):
    
    
    class Meta:
        tower_data=TowerDataSerializer()
        model = BmsFloorMaster
        exclude = ['is_deleted']
        depth=10

class BmsAreaMasterSerializer(serializers.ModelSerializer):
    # floor_details=BmsFloorMasterSerializer(source='floor_data',read_only=True)
    floor_data = FloorDataSerializer()
    class Meta:
        model = BmsAreaMaster
        # fields = '__all__'
        fields=['id','area_name','status','created_at','updated_at','floor_data']
        depth = 10



class BmsSubAreaMasterSerializerPut(serializers.ModelSerializer):
    class Meta:
        model = BmsSubAreaMaster
        fields ='__all__'   
        # depth = 10



    
class SencesSerializersPost(serializers.ModelSerializer):
    class Meta:
        model=BmsScenes
        fields='__all__'   
        
class SencesSerializers(serializers.ModelSerializer):
    class Meta:
        model=BmsScenes
        fields='__all__' 
        depth = 1
        
class BmsTriggerSerializers(serializers.ModelSerializer):
    class Meta:
        model = BmsTriggers
        # fields = ['user_data','card_id','user_card_name','devices_details','card_slug','status','created_at']
        # fields='__all__'
        fields = ['id','trigger_name','action_type','status','scene','trigger_data']
        # depth = 1

        
class BmsTriggerSerializersSchedules(serializers.ModelSerializer):
    
    class Meta:
        model = BmsTriggers
        # fields = ['user_data','card_id','user_card_name','devices_details','card_slug','status','created_at']
        # fields='__all__'
        fields = ['id','trigger_name','action_type','status','trigger_data','scene']
        depth = 10


# POST        
class BmsTriggerSerializersPost(serializers.ModelSerializer):
    # user_data = serializers.IntegerField(source='user_id')
    class Meta:
        model = BmsTriggers
        fields = '__all__'
        # depth = 1 
        
        
        


# post area
class BmsAreaMasterSerializerPost(serializers.ModelSerializer):
    class Meta:
        model = BmsAreaMaster
        fields = '__all__'
        # depth=10


# GET Sub_area

class BmsDeviceInformationSerializerPo(serializers.ModelSerializer):
    class Meta:
        model = BmsDeviceInformation
        # fields = '__all__'
        fields=['id','device_name','on_crop_image_path','device_type','is_used','status','create_at','updated_at','device_informations']


# GET Sub_area

class BmsDeviceInformationSerializerPo(serializers.ModelSerializer):
    class Meta:
        model = BmsDeviceInformation
        # fields = '__all__'
        fields=['id','device_name','on_crop_image_path','device_type','is_used','status','create_at','updated_at','device_informations']

class TowerDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = BmsBuildingMaster
        exclude = ['is_deleted']
        depth=10


class FloorDataSerializer(serializers.ModelSerializer):
    
    class Meta:
        tower_data=TowerDataSerializer()
        model = BmsFloorMaster
        exclude = ['is_deleted']
        depth=10
        
        
class AreaDataSerializer(serializers.ModelSerializer):
    
    class Meta:
        floor_data=FloorDataSerializer()
        model = BmsAreaMaster
        exclude = ['is_deleted']
        depth=10

class BmsSubAreaMasterSerializer(serializers.ModelSerializer):
    devices_details=BmsDeviceInformationSerializerPo(many=True)
    area_data = AreaDataSerializer()
    # area_details=BmsAreaMasterSerializer(source='area_data', read_only=True)
    class Meta:
        model = BmsSubAreaMaster
        # fields = '__all__'
        fields = ['id','sub_area_name','off_image_path','on_image_path','width','height','seating_capacity','status','area_data','devices_details']
        depth = 10



# post Sub_area
class BmsSubAreaMasterSerializerPost(serializers.ModelSerializer):
    class Meta:
        model = BmsSubAreaMaster
        fields = '__all__'
        


# GET Locker
class BmsLockerSerializer(serializers.ModelSerializer):
    # sub_area_id = BmsSubAreaMasterSerializer(many=True, read_only=True)
    class Meta:
        model = BmsLocker
        fields = '__all__'
        depth = 10


# post Locker
class BmsLockerSerializerPost(serializers.ModelSerializer):
    class Meta:
        model = BmsLocker
        fields ='__all__'


# GET
class BmsHardwareTypeMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = BmsHardwareTypeMaster
        fields = '__all__'
        depth = 10


# GET Device Type
class BmsDeviceTypeMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = BmsDeviceTypeMaster
        fields = '__all__'
        depth = 10


# Post Device type
class BmsDeviceTypeMasterSerializerPost(serializers.ModelSerializer):
    class Meta:
        model = BmsDeviceTypeMaster
        fields = '__all__'


# GET Device informations
#8 june 2023 nighwork
class BmsDeviceInformationSerializer(serializers.ModelSerializer):
    hardware_type_id = serializers.SerializerMethodField()
    hardware_name = serializers.SerializerMethodField()
    hardware_type_name = serializers.SerializerMethodField()

    class Meta:
        model = BmsDeviceInformation
        fields = ['id',
                  'on_crop_image_path',
                  'device_name',
                  'device_type',
                  "hardware_details_id",
                  'hardware_type_id',
                  'hardware_type_name',
                  'hardware_name',
                  'is_used',
                  'is_deleted',
                  "crop_object",
                  'device_informations',
                  'status',
                  "index_number"
                  ]
        # depth = 10

    def get_hardware_type_id(self, obj):
        if obj.hardware_details_id:
            return obj.hardware_details_id.hardware_type_id
        return None
    
    def get_hardware_name(self, obj):
        if obj.hardware_details_id:
            return obj.hardware_details_id.hardware_name
        return None
    def get_hardware_type_name(self, obj):
        if obj.hardware_details_id:
            return obj.hardware_details_id.hardware_type.hardware_type_name
        return None
    
# post Device Informations


# class BmsDeviceInformationSerializerPost(serializers.ModelSerializer):
#     class Meta:
#         model = BmsDeviceInformation
#         fields = '__all__'

    # def create(self, validated_data):
    #     device_data = validated_data.pop('device_data', [])  # Remove device_data from validated_data
    #     device_information = BmsDeviceInformation.objects.create(**validated_data)  # Create the device_information object
        
    #     existing_role = BmsRole.objects.get(pk=1)
    #     all_devices = BmsDeviceInformation.objects.all()
    #     existing_role.device_data.set(all_devices)

class BmsDeviceInformationSerializerPost(serializers.ModelSerializer):
    # ...
    class Meta:
        model = BmsDeviceInformation
        fields = '__all__'

class BmsDeviceInformationSerializerPosts(serializers.ModelSerializer):
    # ...
    def validate_device_informations(self, value):
        device_id = value.get('device_id')
        channel_id = value.get('channel_id')
        if device_id:
            existing_devices = BmsDeviceInformation.objects.filter(device_informations__device_id=device_id,device_informations__channel_id=channel_id, is_deleted='No')
            if existing_devices.exists():
                raise serializers.ValidationError("Device with the same ID already exists.")
        return value

    class Meta:
        model = BmsDeviceInformation
        fields = '__all__'

# GET
class BmsDeviceStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BmsDeviceStatusHistory
        fields = '__all__'
        depth = 10

# GET

# class BmsUserAreaCardsListSerializer(serializers.ModelSerializer):
    
#     class Meta:
#         model = BmsUserAreaCardsList
#         # fields = ['user_data','card_id','user_card_name','device_details','card_slug','status','created_at']
#         fields='__all__'
#         depth = 1


class BmsUserAreaCardsListSerializer(serializers.ModelSerializer):
    # device_details = BmsDeviceInformationSerializer(many=True)
    class Meta:
        model = BmsUserAreaCardsList
        # fields = ['card_id','user_card_name','card_slug','status','created_at','user_data','device_details']
        fields='__all__'
        depth = 1


# POST        
class BmsUserAreaCardsListSerializerPost(serializers.ModelSerializer):
    # user_data = serializers.IntegerField(source='user_id')
    class Meta:
        model = BmsUserAreaCardsList
        fields = '__all__'
        # depth = 1
        
        
# Put 


class BmsUserAreaCardsListSerializerPut(serializers.ModelSerializer):
    # user_data = serializers.IntegerField(source='user_id')
    class Meta:
        model = BmsUserAreaCardsList
        fields = '__all__'
        # depth = 1



## 4/5/2023 




# class BmsSubAreaMasterSerializers(serializers.ModelSerializer):
#     # floor_id = BmsFloorMasterSerializer(many=True, read_only=True)
#     # area_id = BmsAreaMasterSerializer(many=True, read_only=True)
#     class Meta:
#         model = BmsSubAreaMaster
#         fields = ['id','sub_area_name','width','height','status','on_image_path','off_image_path','devices_details']
#         depth = 10


# class BmsDeviceInformationSerializerPo(serializers.ModelSerializer):
#     class Meta:
#         model = BmsDeviceInformation
#         # fields = '__all__'
#         fields=['id','device_name',"on_crop_image_path",'device_type','is_used','status','create_at','updated_at','device_informations']

class BmsSubAreaMasterSerializers(serializers.ModelSerializer):
    devices_details=BmsDeviceInformationSerializerPo(many=True)
    class Meta:
        model = BmsSubAreaMaster
        # fields = '__all__'
        fields = ['id','sub_area_name','off_image_path','width','height','seating_capacity','status','is_deleted','devices_details']
        depth = 10





class BmsAreaMasterSerializers(serializers.ModelSerializer):
    sub_areas_data=BmsSubAreaMasterSerializers(many=True)
    class Meta:
        model = BmsAreaMaster
        fields = ['id','area_name','status','is_deleted','created_at','updated_at','sub_areas_data']
        # fields='__all__'
        # depth = 10

    def create(self, validated_data):
        user_hobby = validated_data.pop('sub_areas_data')
        profile_instance = BmsAreaMaster.objects.create(**validated_data)
        for hobby in user_hobby:
            BmsSubAreaMaster.objects.create(user=profile_instance,**hobby)
        return profile_instance
         
class BmsFloorMasterSerializers(serializers.ModelSerializer):
    areas_data=BmsAreaMasterSerializers(many=True)
    class Meta:

        model = BmsFloorMaster
        # fields ='__all__'
        fields=['id','floor_name','status','is_deleted','created_at','updated_at','areas_data']
        # depth = 10
        
    def create(self, validated_data):
        user_hobby = validated_data.pop('areas_data')
        profile_instance = BmsFloorMaster.objects.create(**validated_data)
        for hobby in user_hobby:
            BmsAreaMaster.objects.create(user=profile_instance,**hobby)
        return profile_instance
        
     
class ProfileSerializer(serializers.ModelSerializer):
    floor_data = BmsFloorMasterSerializers(many=True)

    class Meta:
        model = BmsBuildingMaster
        # fields = '__all__'
        fields=['id','tower_name','status','is_deleted','created_at','updated_at','floor_data']
        # depth = 10

    def create(self, validated_data):
        user_hobby = validated_data.pop('floor_data')
        profile_instance = BmsBuildingMaster.objects.create(**validated_data)
        for hobby in user_hobby:
            BmsFloorMaster.objects.create(user=profile_instance,**hobby)
        return profile_instance
    




## scence serializer




class SencesSerializers(serializers.ModelSerializer):
    class Meta:
        model=BmsSceneAppliancesDetails
        # fields='__all__' 
        fields=['id','component_name','device_type_slug','component_id','operation_type','operation_value']
        # depth = 1


## put is_deleted

class SceneSerializerssss(serializers.ModelSerializer):
    scene_appliance_details = SencesSerializers(many=True)

    class Meta:
        model = BmsScenes
        fields = '__all__'
        # fields=['id','scene_name','status','created_at','updated_at','scene_appliance_details']
        depth = 10


class SceneSerializersPUT(serializers.ModelSerializer):
    # scene_appliance_details = SencesSerializers(many=True)

    class Meta:
        model = BmsScenes
        fields = '__all__'
        # fields=['id','scene_name','status','created_at','updated_at','scene_appliance_details']
        # depth = 10


        
class ProfileSerializerssss(serializers.ModelSerializer):
    scene_appliance_details = SencesSerializers(many=True)

    class Meta:
        model = BmsScenes
        # fields = '__all__'
        fields=['id','scene_name','status','created_at','updated_at','scene_appliance_details']
        depth = 10

    def create(self, validated_data):
        scene_appliance_details = validated_data.pop('scene_appliance_details')
        scene_instance = BmsScenes.objects.create(**validated_data)
        for detail in scene_appliance_details:
            BmsSceneAppliancesDetails.objects.create(scene=scene_instance, **detail)
        return scene_instance
    


class ProfileSerializerss(serializers.ModelSerializer):
    scene_appliance_details = SencesSerializers(many=True)

    class Meta:
        model = BmsScenes
        fields = ['id', 'scene_name', 'status', 'created_at', 'updated_at', 'scene_appliance_details']
        depth = 10

    def create(self, validated_data):
        scene_appliance_details = validated_data.pop('scene_appliance_details')
        scene_instance = BmsScenes.objects.create(**validated_data)
        for detail in scene_appliance_details:
            BmsSceneAppliancesDetails.objects.create(scene=scene_instance, **detail)
        return scene_instance

    def update(self, instance, validated_data):
        scene_appliance_details_data = validated_data.pop('scene_appliance_details')
        scene_appliance_details = instance.scene_appliance_details.all()
        scene_appliance_details = list(scene_appliance_details)

        instance = super().update(instance, validated_data)

        for detail_data in scene_appliance_details_data:
            if scene_appliance_details:
                detail = scene_appliance_details.pop(-1)
                detail.scene = instance
                detail.save()
            else:
                BmsSceneAppliancesDetails.objects.create(scene=instance, **detail_data)

        for detail in scene_appliance_details:
            detail.delete()

        return instance
    
    

    
    
    
    
    
## user History


class UserHistorySerializers(serializers.ModelSerializer):
    class Meta:
        model=BmsHistory
        fields='__all__' 
        # fields=['device_type_slug','component_id','operation_type','operation_value']
        # depth = 1
 
 
### 08/06/2024       
        
class BmsHardwareTypeMasterSerializers(serializers.ModelSerializer):
    
    class Meta:
        model=BmsHardwareTypeMaster
        # fields='__all__'
        fields=['id','hardware_type_name','status']


class BmsHardwareTypeMasterSerializersPut(serializers.ModelSerializer):
    
    class Meta:
        model=BmsHardwareTypeMaster
        fields='__all__'
        # fields=['id','hardware_type_name','status']
        
        
class BmsHardWareDetailsSerializers(serializers.ModelSerializer):
    hardware_type_name = serializers.SerializerMethodField()
    hardware_type_id= serializers.SerializerMethodField()
    

    class Meta:
        model = BmsHardWareDetails
        fields = ['id', 'hardware_type_name','hardware_type_id', 'hardware_name', 'hardware_details', 'status', 'updated_at']

    def get_hardware_type_name(self, obj):
        if obj.hardware_type:
            return obj.hardware_type.hardware_type_name
        return None
    
    def get_hardware_type_id(self, obj):
        if obj.hardware_type:
            return obj.hardware_type.id
        return None

        
        
class BmsHardWareDetailsSerializersPost(serializers.ModelSerializer):
    # hardware_type_data = BmsHardwareTypeMasterSerializers(source='hardware_type', read_only=True)
     # hardware_type= serializers.PrimaryKeyRelatedField(queryset=BmsHardwareTypeMaster.objects.all())
    
    class Meta:
        model=BmsHardWareDetails
        # fields='__all__'
        fields=['id','hardware_name','hardware_details','status','updated_at','hardware_type']


class BmsHardWareDetailsSerializersPut(serializers.ModelSerializer):
    # hardware_type_data = BmsHardwareTypeMasterSerializers(source='hardware_type', read_only=True)
     # hardware_type= serializers.PrimaryKeyRelatedField(queryset=BmsHardwareTypeMaster.objects.all())
    
    class Meta:
        model=BmsHardWareDetails
        fields='__all__'
        # fields=['id','hardware_name','hardware_details','status','updated_at','hardware_type']





class BmsHistoryDetailsSerializers(serializers.ModelSerializer):
    class Meta:
        model=BmsHistoryDetail
        fields='__all__' 

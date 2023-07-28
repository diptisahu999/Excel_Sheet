from rest_framework import serializers
from Authenticate.models import BmsModuleMaster, BmsRole, BmsUserType, BmsUser, BmsUsersDetail, BmsRolesDevicesInformation
from Device.models import BmsDepartmentMaster, BmsLocker, BmsUserAreaCardsList,BmsDeviceInformation
from Device.serializers import BmsUserAreaCardsListSerializer


class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = BmsModuleMaster
        fields = ["id",
                  "module_name",
                  "module_slug",
                  'is_deleted',
                  "module_icon",
                  "status",]
# GET Role

class BmsDeviceInformationSerializerPo(serializers.ModelSerializer):
    class Meta:
        model = BmsDeviceInformation
        # fields = '__all__'
        fields=['id','device_name','device_type','is_used','status','create_at','updated_at','device_informations']


class RoleSerializer(serializers.ModelSerializer):
    device_data=BmsDeviceInformationSerializerPo(many=True)
    
    class Meta:
        model = BmsRole
        fields = ['id','role_name','created_at','updated_at','modules_permission','device_data']
        depth = 10

# class RoleSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = BmsRole
#         fields = '__all__'
#         depth = 10


class RoleSerializerPost(serializers.ModelSerializer):
    class Meta:
        model = BmsRole
        fields = '__all__'
        # depth= 10


# class RoleSerializerPost(serializers.ModelSerializer):
#     device_data = BmsDeviceInformationSerializerPo(many=True)

#     class Meta:
#         model = BmsRole
#         fields = ['id', 'role_name', 'created_at', 'updated_at', 'modules_permission', 'device_data']
#         depth = 10

#     def create(self, validated_data):
#         device_data = validated_data.pop('device_data', [])  # Remove device_data from validated_data
#         role = BmsRole.objects.create(**validated_data)  # Create the role object
#         existing_roles_count = BmsRole.objects.get(pk=1)
#         # Add all existing device_data to the role
#         for device in BmsDeviceInformation.objects.all():
#             existing_roles_count.device_data.add(device)
        
#         return role
        
        

class RoleSerializerPut(serializers.ModelSerializer):
    class Meta:
        model = BmsRole
        fields = '__all__'
        # depth= 10


class UserTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BmsUserType
        fields = '__all__'


class DepertmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BmsDepartmentMaster
        fields = '__all__'


class lockerSerializer(serializers.ModelSerializer):
    class Meta:
        model = BmsLocker
        fields = '__all__'


class BmsUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BmsUsersDetail
        fields = '__all__'
        # fields = ['id','first_name','last_name','image','phone_no','dob','wallet_balance','has_vehicle']
        depth = 10
#4 june work on sunday
class BmsUserSerializerss(serializers.ModelSerializer):
    class Meta:
        model = BmsUsersDetail
        # fields = '__all__'
        fields = ['id','first_name','last_name','image','phone_no','dob','wallet_balance','has_vehicle','locker_data',]
        # depth = 10

# class BmsUserDetailsSerializer(serializers.ModelSerializer):
#     user_details = serializers.SerializerMethodField()
#     user_type_name = serializers.SerializerMethodField()
#     role_name = serializers.SerializerMethodField()


#     class Meta:
#         model = BmsUser
#         fields = ['id','user_type_name','role_name','user_email', 'domain_type', 'status', 'user_details']
#         # fields='__all__'
#         depth = 10

#     def get_user_details(self, obj):
#         card_list = BmsUsersDetail.objects.filter(user_data__id=obj.id)
#         serializer = BmsUserSerializerss(instance=card_list, many=True)
#         return serializer.data

#     def get_user_type_name(self, obj):
#         if obj.user_type_data:
#             return obj.user_type_data.user_type_name
#         return None
    
#     def get_role_name(self, obj):
#         if obj.role_data:
#             return obj.role_data.role_name
#         return None



class BmsUserDetailsSerializer(serializers.ModelSerializer):
    user_details = serializers.SerializerMethodField()
    user_type_name = serializers.SerializerMethodField()
    role_name = serializers.SerializerMethodField()
    # role_id = serializers.SerializerMethodField()



    class Meta:
        model = BmsUser
        fields = ['id', 'user_type_id','user_type_name','role_name','role_id','user_email','domain_type', 'status', 'user_details']
        # depth = 1

    def get_user_details(self, obj):
        card_list = BmsUsersDetail.objects.filter(user_data__id=obj.id).first()
        serializer = BmsUserSerializerss(instance=card_list)
        return serializer.data if card_list else None

    def get_user_type_name(self, obj):
        if obj.user_type_id:
            return obj.user_type_id.user_type_name
        return None

    def get_role_name(self, obj):
        if obj.role_id:
            return obj.role_id.role_name
        return None
    
    # def get_role_name(self, obj):
    #     if obj.role_data:
    #         return obj.role_data.role_id
    #     return None
        

class BmsUserDetailsSerializers(serializers.ModelSerializer):

    class Meta:
        role_data = RoleSerializer(many=True, read_only=True)
        model = BmsUser
        fields = ['id', 'user_email', 'user_password', 'domain_type', 'status','role_data',
                  'created_at',
                  'updated_at',
                  ]
        # depth = 10


class BmsUserDetailsSerializerPost(serializers.ModelSerializer):

    class Meta:
        # role_data = RoleSerializer(many=True, read_only=True)
        model = BmsUser
        # fields = ['is_deleted']
        fields ='__all__'
             
                
        # depth = 10


class LoginSerializer(serializers.ModelSerializer):

    class Meta:
        model = BmsUser
        fields = '__all__'
        # depth = 10
 

##  26/05/2023

class GetUserCardList(serializers.ModelSerializer):
    class Meta:
        model = BmsUserAreaCardsList
        fields = ['id',
            'card_id',
                  'card_slug',
                  'column_no',
                  'user_card_name',
                  'card_title',
                  'device_details',
                  ]
        depth =10 
        


class RoleSerializerss(serializers.ModelSerializer):
    class Meta:
        model = BmsRole
        fields = ['id','role_name','modules_permission']
        depth = 10

class BmsUserDetailsSerializers(serializers.ModelSerializer):
    role_data = RoleSerializerss(source='role_id', read_only=True)
    user_details = serializers.SerializerMethodField()
    user_cards_data = serializers.SerializerMethodField()
    class Meta:
        model = BmsUser
        fields = ['id', 'user_email', 'domain_type', 'status',
                  'created_at', 'updated_at','user_cards_data',
                  'role_data','user_details'
                  ]
        depth = 10

    def get_user_cards_data(self, obj):
        card_list = BmsUserAreaCardsList.objects.filter(user_data__id=obj.id)
        serializer = GetUserCardList(instance=card_list, many=True)
        return serializer.data
   
    def get_user_details(self, obj):
        card_list = BmsUsersDetail.objects.filter(user_data__id=obj.id).first()
        serializer = BmsUserSerializerss(instance=card_list)
        return serializer.data if card_list else None




# user Views
class Manage_user_view(serializers.ModelSerializer):
    class Meta:
        model = '__all__'


class RolesDeviceInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = BmsRolesDevicesInformation
        # fields = '__all__'
        fields = '__all__'

        depth = 10


class RolesDeviceInformationSerializerPost(serializers.ModelSerializer):
    class Meta:
        model = BmsRolesDevicesInformation
        # fields = '__all__'
        fields = '__all__'
        # depth=10


# get_tower_id Serializer API
class BmsUserSerializer_DeviceDetails(serializers.ModelSerializer):
    class Meta:
        model = BmsUser
        fields = '__all__'
        depth = 10



class LoginSerializer(serializers.ModelSerializer):

    class Meta:
        model = BmsUser
        fields = ['id', 'user_email', 'user_password', 'domain_type', 'status',
                  'created_at',
                  'updated_at',
                  #   'modules_data',
                  #     'role_name',
                  ]
        
        # fields='__all__'
        # depth = 10


class BmsUserSerializerUser(serializers.ModelSerializer):
    class Meta:
        model = BmsUsersDetail
        fields = '__all__'
        # fields = ['user_data','first_name','last_name','image','phone_no','dob','wallet_balance','has_vehicle']
        # depth = 10


class BmsUserTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BmsUserType
        fields = ['id','user_type_name','has_role','status']
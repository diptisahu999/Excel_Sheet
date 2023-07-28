from rest_framework import serializers
from .models import BmsVisitorActivity
# from Authenticate.models import Bms_Usersss
from Authenticate.serializers import *


## Get


# class BmsVisitorDetailsSerializer(serializers.ModelSerializer):
#     # user_data=BmsUserDetailsSerializer(source='user',read_only=True)

#     class Meta:
#         model = BmsVisitorActivity
#         fields='__all__'
#         # fields = ['id']

       
# class BmsVisitorDetailsSerializer(serializers.ModelSerializer):
#     # user_data=BmsUserDetailsSerializer(source='user',read_only=True)
#     user_id = serializers.SerializerMethodField()

#     class Meta:
#         model = BmsVisitorActivity
#         fields = ['id','meeting_person', 'department_name', 'user_id']

#     def get_user_id(self, obj):
#         if obj.user:
#             return obj.user.id
#         return None



## POST
       
class BmsVisitorActivitySerializer(serializers.ModelSerializer):
    # user_id=BmsUserDetailsSerializer(many=True,read_only=True)
    class Meta:
        model = BmsVisitorActivity
        # fields = ['meeting_time','meeting_purpose','in_time','out_time','out_remark','rfid_id','access_from_time','access_to_time','user']
        fields='__all__'
        
class BmsUserSerializersVisitor(serializers.ModelSerializer):
    class Meta:
        model = BmsUsersDetail
        # fields = '__all__'
        fields = ['id','first_name','last_name','image','phone_no','dob','wallet_balance','has_vehicle','locker_data',]        


class BmsVisitorActivitySerializerGETT(serializers.ModelSerializer):
    # visitor_name = serializers.SerializerMethodField()

    class Meta:
        model = BmsVisitorActivity
        fields='__all__'




## GET
class BmsVisitorActivitySerializerGET(serializers.ModelSerializer):
    visitor_name = serializers.SerializerMethodField()

    class Meta:
        model = BmsVisitorActivity
        fields = [
            'id', 'visitor_name', 'meeting_time', 'meeting_purpose', 'in_time', 'out_time', 'out_remark',
            'to_meet_user', 'rfid_id', 'access_from_time', 'access_to_time', 
        ]

    def get_visitor_name(self, obj):
        # visitor = BmsVisitorActivity.objects.filter().values()[0]
        # print(visitor)
        card_list = BmsUser.objects.filter(user_type_id__user_type_name="Visitor").values()[0]
        print(card_list)
        id = card_list['id']
        print(id)
        details = BmsUsersDetail.objects.filter(user_data=int(id)).values()[0]
        # print(details)
        visitor_name = f"{details['first_name']} {details['last_name']}"
        return visitor_name
        
        # serializer = BmsUserSerializersVisitor(details, many=True)
        # serialized_data = serializer.data if details else None
        # print(serialized_data)
        # if serialized_data:
        #     for data in serialized_data:
        #         # print(data)
        #         data['visitor_name'] = f"{data['first_name']} {data['last_name']}"

        # return serialized_data

    # def get_first_name(self, obj):
    #     card_list = BmsUsersDetail.objects.filter(id=obj.id).first()
    #     if card_list:
    #         return card_list.first_name
    #     return None

    # def get_last_name(self, obj):
    #     card_list = BmsUsersDetail.objects.filter(user_data=obj.id).first()
    #     if card_list:
    #         return card_list.last_name
    #     return None

    

        
            
class BmsUserDetailsSerializerVisitor(serializers.ModelSerializer):
    user_details = serializers.SerializerMethodField()
    user_type_name = serializers.SerializerMethodField()
    role_name = serializers.SerializerMethodField()

    class Meta:
        model = BmsUser
        fields = ['id', 'user_type_id', 'user_type_name', 'role_name', 'user_email', 'domain_type', 'status',
                  'user_details']

    def get_user_details(self, obj):
        card_list = BmsUsersDetail.objects.filter(user_data__id=obj.id).first()
        serializer = BmsUserSerializersVisitor(instance=card_list)
        return serializer.data if card_list else None

    def get_user_type_name(self, obj):
        if obj.user_type_id:
            return obj.user_type_id.user_type_name
        return None

    def get_role_name(self, obj):
        if obj.role_id:
            return obj.role_id.role_name
        return None

    # def to_representation(self, instance):
    #     if instance.user_type_id.user_type_name == "Visitor":
    #         return super().to_representation(instance)
    

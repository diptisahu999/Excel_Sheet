from Device.models import BmsDeviceInformation,BmsUserAreaCardsList
import json
from django.core import serializers
from Device.serializers import *
# from channels.consumer import SyncConsumer , AsyncConsumer
# 
d_list = []

def getDeviceStatus():
    data = BmsDeviceInformation.objects.all()
    d_list.clear()
    for i in data:
        d = BmsDeviceInformation.objects.get(pk=int(i.pk))
        device_info = d.device_informations
        dump = []
        if device_info is not None:
            if str(d.device_type) == "LED":
                dump = {
                    "record_id": d.pk,
                    "device_name": d.device_name,
                    "device_type": d.device_type ,
                    "is_dimmable": device_info["is_dimmable"] if "is_dimmable" in device_info else None,
                    "device_id": device_info["device_id"] if "device_id" in device_info else None,
                    "channel_id": device_info["channel_id"] if "channel_id" in device_info else None,
                    "device_status": device_info["device_status"] if "channel_id" in device_info else None,
                    "delay_second": "0"
                }
               
            elif str(d.device_type) == "AC":
                dump = {
                    "record_id": d.pk,
                    "device_name": d.device_name,
                    "device_type": d.device_type ,
                    'device_id':  device_info["device_id"] if "device_id" in device_info else None,
                    'channel_id':  device_info["channel_id"] if "channel_id" in device_info else None,
                    'ac_temp':  device_info["ac_temp"] if "ac_temp" in device_info else None,
                    'rm_temp':  device_info["rm_temp"] if "rm_temp" in device_info else None,
                    'mode':  device_info["mode"] if "mode" in device_info else None,
                    'swing':  device_info["swing"] if "swing" in device_info else None,
                    'fspeed':  device_info["fspeed"] if "fspeed" in device_info else None,
                    'device_status':  device_info["device_status"] if "device_status" in device_info else None,
                    }
                
            d_list.append(dump)
    Device_list = json.dumps(d_list)
    return Device_list
# user_data__id=user_id

def getUserAreaCardList(user_id):
    # data = BmsUserAreaCardsList.objects.filter()
    data = BmsUserAreaCardsList.objects.filter(user_data__id=user_id,is_deleted="No")
    serialized_data = []
   
    for item in data:
        serialized_item = {
            "id": item.id,
            "user_data_id": item.user_data_id,
            "card_id": item.card_id,
            "column_no": item.column_no,
            "user_card_name": item.user_card_name,
            "card_title": item.card_title,
            "card_slug": item.card_slug,
            "status": item.status,
            "off_image_path":'',
            "device_details": []
        }
        
       
        devices = item.device_details.all()
        s = BmsDeviceInformationSerializer(devices, many=True)
    
        for device in s.data:
            # print(device , "my device listt")
            serialized_device = {
                "id": device['id'],
                "device_name": device['device_name'],
                "on_crop_image_path":device['on_crop_image_path'],
                "is_deleted": device['is_deleted'],
                "hardware_details_id":device['hardware_details_id'],
                "hardware_type_name":device['hardware_type_name'],
                "device_type":device['device_type'],
                "device_informations": device['device_informations'],
                "crop_object": device['crop_object'],
                "image_id":device['index_number']
                # Add other fields you want to include
            }
            serialized_item['device_details'].append(serialized_device)
            if item.card_slug == "area_card":
                print(device['id'])
                # subAreas = BmsSubAreaMasterSerializer()

                subAreas = BmsSubAreaMaster.objects.filter(devices_details__id = device['id']).values()[0]
                # print(subAreas)
                off_image_path = subAreas['off_image_path']
                serialized_item["off_image_path"]=off_image_path
        # print(serialized_item)
        serialized_data.append(serialized_item)
    user_card_listing =(json.dumps(serialized_data))
    return user_card_listing


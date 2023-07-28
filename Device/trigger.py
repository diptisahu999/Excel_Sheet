# from Device.models import BmsTriggers
# import json
# from django.core import serializers


data= {
            "id": 1,
            "trigger_name": "RJ Trigger",
            "action_type": "event",
            "status": "Active",
            "trigger_data": {
                "scene_id": 2,
                "device_id": "12",
                "device_type":"LED",
                "operation_type": "on",
                "operation_value": "on"
            }
        }

def trigger(data):
    if data['action_type'] == "event":
        action = data['trigger_data']
        device_id = action['device_id']
        device_type = action['device_type']
        operation_type = action['operation_type']
        operation_value = action['operation_value']
        print(device_id,operation_type,operation_value)


trigger(data)
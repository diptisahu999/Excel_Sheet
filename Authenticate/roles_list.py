# from Device.models import *


a ={'role_name': 'HR', 'device_information': [{'building_id': 1, 'floor_id': [1,2], 'area_id': 5, 'sub_area_id': 1,}], 'permissions_id': [1]}
role_list = []
for i in a['device_information']:
    i.update ( {
    "building_info": i['building_id'],
    "floor_info": "ASdasd",
    "area_info": "hey",
    "sub_area_info":i['sub_area_id'],
    })

print(a)
# for i in a['device_information']:
    
#     role_list.append({
#     "building_id": bms_building_master.objects.all(pk=i['building_id']),
#     "floor_id": bms_floor_master.objects.all(pk=i['floor_id']),
#     "area_id": bms_area_master.objects.all(pk=i['area_id']),
#     "sub_area_id":bms_sub_area_master.objects.all(pk=i['sub_area_id']),
#     })

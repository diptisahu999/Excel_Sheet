# a = [{"record_id": 1, "device_name": "Entry", "device_id": "61", "channel_id": "1", "device_status": "false"}, {"record_id": 2, "device_name": "IT workspace", "device_id": "61", "channel_id": "13", "device_status": "true"}]

# a =[{'record_id': 2, 'device_name': 'python AC', 'device_type': 'AC', 'device_id': '92', 'channel_id': '0', 'ac_temp': '25', 'rm_temp': '34', 'mode': 'F', 'swing': '', 'fspeed': 'L', 'device_status': 'true'}]

# for i in a:
#     if i["device_status"] =='true':
#         b = {"device_id": int(i['device_id'])}
                         
#         print(b)


# for i in a:
#     if i['device_status'] =="true":
#         param={"device_id":int(i.get('device_id')),
#         "channel_id":int(i.get('channel_id')),
#         "device_status":str(i.get("device_status"))}
#         print(param)
#     if i['device_status'] =="false":
#         param={"device_id":int(i.get('device_id')),
#         "channel_id":int(i.get('channel_id')),
#         "device_status":str(i.get("device_status"))}
#         print(param)
# a = [1,2,4]
# b =[5,6]
# for i in b:
#     a.append(i)
# print(a)

import numpy as np
a = {
    "id": 2,
    "first_name": "Divyesh",
    "last_name": "pandav",
    "image": None,
    "phone_no": "8975643232",
    "birthday": "2023-05-18",
    "address": "At-Surat",
    "id_proof": None,
    "visiting_card": None,
    "wallet_balance": "12321",
    "shift_start_time": "2023-05-19T06:41:15.928136Z",
    "shift_end_time": "2023-05-18T10:23:20Z",
    "has_vehicle": "YES",
    "status": "Active",
    "created_user_details_date": "2023-05-18T10:23:20Z",
    "updated_user_details_date": "2023-05-19T06:41:15.928136Z",
    "user_data": {
        "id": 3,
        "user_email": "divyesh@gmail.com",
        "user_password": "1234",
        "domain_type": "Residential",
        "status": True,
        "created_user_date": "2023-05-18T06:28:37Z",
        "updated_user_date": "2023-05-20T07:06:25.166024Z",
        "user_type_data": {
            "id": 4,
            "created_user_type_date": "2023-05-20T07:06:18Z",
            "role_data": {
                "id": 1,
                "created_date": "2023-05-17T05:56:25Z",
                "role_data": {
                    "id": 2,
                    "role_name": "Admin",
                    "created_role_date": "2023-05-15T07:12:23Z",
                    "updated_role_date": "2023-05-20T07:14:26.107929Z",
                    "modules_data": [
                        {
                            "id": 2,
                            "module_name": "Settings",
                            "module_slug": "Unknown",
                            "status": "Active",
                            "created_module_date": "2023-05-15T07:12:25Z",
                            "updated_module_date": "2023-05-18T10:15:59.758391Z"
                        }
                    ]
                },
                "subarea_data": [
                    {
                        "id": 1,
                        "sub_area_name": "React Teams",
                        "on_image_path": "image/13_on_MyTesting_Room_j0cVat.jpg",
                        "off_image_path": "image/13_off_My_Testing_Room_j0cVat.jpg",
                        "width": "1300",
                        "height": "233",
                        "seating_capacity": 1,
                        "status": "Active",
                        "created_at": "2023-05-13T10:15:08.455013Z",
                        "updated_at": "2023-05-13T10:15:08.455013Z",
                        "area_data": {
                            "id": 1,
                            "area_name": "IT Department",
                            "status": "Active",
                            "created_at": "2023-05-13T10:12:34.040350Z",
                            "updated_at": "2023-05-13T10:12:34.040350Z",
                            "floor_data": {
                                "id": 1,
                                "floor_name": "First floor",
                                "status": "Active",
                                "created_at": "2023-05-13T10:12:32.447207Z",
                                "updated_at": "2023-05-13T10:12:32.447207Z",
                                "tower_data": {
                                    "id": 1,
                                    "tower_name": "Tower1",
                                    "status": "Active",
                                    "created_at": "2023-05-13T10:12:29.561658Z",
                                    "updated_at": "2023-05-13T10:12:29.561658Z"
                                }
                            }
                        },
                        "devices_details": [
                            {
                                "id": 1,
                                "device_name": "Light",
                                "device_type": "LED",
                                "is_used": "No",
                                "device_informations": {
                                    "is_dimmable": "true",
                                    "isFan": "false",
                                    "device_id": "3",
                                    "channel_id": "18",
                                    "device_status": "12",
                                    "image_id": "2",
                                    "delay_second": "0"
                                },
                                "status": "Active",
                                "create_at": "2023-05-01T13:13:34Z",
                                "updated_user_details_date": "2023-05-18T12:03:59.810211Z"
                            },
                            {
                                "id": 2,
                                "device_name": "CEMARA",
                                "device_type": "AC",
                                "is_used": "No",
                                "device_informations": {
                                    "device_id": "92",
                                    "channel_id": "0",
                                    "ac_temp": "25",
                                    "rm_temp": "34",
                                    "mode": "F",
                                    "swing": "",
                                    "fspeed": "L",
                                    "device_status": "false"
                                },
                                "status": "Active",
                                "create_at": "2023-05-13T10:14:19Z",
                                "updated_user_details_date": "2023-05-18T12:22:42.601043Z"
                            },
                            {
                                "id": 14,
                                "device_name": "Light 8",
                                "device_type": "LED",
                                "is_used": "No",
                                "device_informations": None,
                                "status": "Active",
                                "create_at": "2023-05-17T13:38:56Z",
                                "updated_user_details_date": "2023-05-20T05:23:34.949977Z"
                            },
                            {
                                "id": 15,
                                "device_name": "Light 9",
                                "device_type": "LED",
                                "is_used": "No",
                                "device_informations": None,
                                "status": "Active",
                                "create_at": "2023-05-17T13:39:04Z",
                                "updated_user_details_date": "2023-05-20T05:23:27.620882Z"
                            }
                        ]
                    },
                    {
                        "id": 2,
                        "sub_area_name": "Python Teams",
                        "on_image_path": "image/13_on_MyTesting_Room_j0cVat.jpg",
                        "off_image_path": "image/13_off_My_Testing_Room_j0cVat.jpg",
                        "width": "1300",
                        "height": "233",
                        "seating_capacity": 12,
                        "status": "Active",
                        "created_at": "2023-05-18T08:30:33.735623Z",
                        "updated_at": "2023-05-18T08:30:33.735623Z",
                        "area_data": {
                            "id": 1,
                            "area_name": "IT Department",
                            "status": "Active",
                            "created_at": "2023-05-13T10:12:34.040350Z",
                            "updated_at": "2023-05-13T10:12:34.040350Z",
                            "floor_data": {
                                "id": 1,
                                "floor_name": "First floor",
                                "status": "Active",
                                "created_at": "2023-05-13T10:12:32.447207Z",
                                "updated_at": "2023-05-13T10:12:32.447207Z",
                                "tower_data": {
                                    "id": 1,
                                    "tower_name": "Tower1",
                                    "status": "Active",
                                    "created_at": "2023-05-13T10:12:29.561658Z",
                                    "updated_at": "2023-05-13T10:12:29.561658Z"
                                }
                            }
                        },
                        "devices_details": [
                            {
                                "id": 5,
                                "device_name": "Light 1",
                                "device_type": "LED",
                                "is_used": "Yes",
                                "device_informations": {},
                                "status": "Active",
                                "create_at": "2023-05-17T13:36:05Z",
                                "updated_user_details_date": "2023-05-18T12:27:13.556399Z"
                            },
                            {
                                "id": 6,
                                "device_name": "Light 2",
                                "device_type": "LED",
                                "is_used": "Yes",
                                "device_informations": None,
                                "status": "Active",
                                "create_at": "2023-05-17T13:36:53Z",
                                "updated_user_details_date": "2023-05-17T14:07:08.827494Z"
                            }
                        ]
                    },
                    {
                        "id": 3,
                        "sub_area_name": "HR Cabin",
                        "on_image_path": "image/13_on_MyTesting_Room_j0cVat.jpg",
                        "off_image_path": "image/13_off_My_Testing_Room_j0cVat.jpg",
                        "width": "1300",
                        "height": "233",
                        "seating_capacity": 12,
                        "status": "Active",
                        "created_at": "2023-05-18T08:31:13.053204Z",
                        "updated_at": "2023-05-18T08:31:13.053204Z",
                        "area_data": {
                            "id": 2,
                            "area_name": "R&D Department",
                            "status": "Active",
                            "created_at": "2023-05-18T08:27:54.764037Z",
                            "updated_at": "2023-05-18T08:27:54.764037Z",
                            "floor_data": {
                                "id": 9,
                                "floor_name": "First floor",
                                "status": "Active",
                                "created_at": "2023-05-16T09:48:13.049315Z",
                                "updated_at": "2023-05-16T09:48:13.049315Z",
                                "tower_data": {
                                    "id": 2,
                                    "tower_name": "Tower2",
                                    "status": "Active",
                                    "created_at": "2023-05-16T05:22:36.078337Z",
                                    "updated_at": "2023-05-16T05:22:36.078337Z"
                                }
                            }
                        },
                        "devices_details": [
                            {
                                "id": 9,
                                "device_name": "Light 4",
                                "device_type": "LED",
                                "is_used": "Yes",
                                "device_informations": None,
                                "status": "Active",
                                "create_at": "2023-05-17T13:37:21Z",
                                "updated_user_details_date": "2023-05-17T13:40:22.497827Z"
                            },
                            {
                                "id": 12,
                                "device_name": "Light 7",
                                "device_type": "LED",
                                "is_used": "Yes",
                                "device_informations": None,
                                "status": "Active",
                                "create_at": "2023-05-17T13:37:50Z",
                                "updated_user_details_date": "2023-05-17T13:38:17.283481Z"
                            }
                        ]
                    },
                    {
                        "id": 4,
                        "sub_area_name": "Manager Cabin",
                        "on_image_path": "image/13_on_MyTesting_Room_j0cVat.jpg",
                        "off_image_path": "image/13_off_My_Testing_Room_j0cVat.jpg",
                        "width": "1300",
                        "height": "233",
                        "seating_capacity": 32,
                        "status": "Active",
                        "created_at": "2023-05-18T08:31:33.570314Z",
                        "updated_at": "2023-05-18T08:31:33.570314Z",
                        "area_data": {
                            "id": 4,
                            "area_name": "R&D Department",
                            "status": "Active",
                            "created_at": "2023-05-18T08:30:03.792280Z",
                            "updated_at": "2023-05-18T08:30:03.792280Z",
                            "floor_data": {
                                "id": 10,
                                "floor_name": "Second floor",
                                "status": "Active",
                                "created_at": "2023-05-16T09:48:13.067305Z",
                                "updated_at": "2023-05-16T09:48:13.067305Z",
                                "tower_data": {
                                    "id": 2,
                                    "tower_name": "Tower2",
                                    "status": "Active",
                                    "created_at": "2023-05-16T05:22:36.078337Z",
                                    "updated_at": "2023-05-16T05:22:36.078337Z"
                                }
                            }
                        },
                        "devices_details": [
                            {
                                "id": 2,
                                "device_name": "CEMARA",
                                "device_type": "AC",
                                "is_used": "No",
                                "device_informations": {
                                    "device_id": "92",
                                    "channel_id": "0",
                                    "ac_temp": "25",
                                    "rm_temp": "34",
                                    "mode": "F",
                                    "swing": "",
                                    "fspeed": "L",
                                    "device_status": "false"
                                },
                                "status": "Active",
                                "create_at": "2023-05-13T10:14:19Z",
                                "updated_user_details_date": "2023-05-18T12:22:42.601043Z"
                            }
                        ]
                    }
                ],
                "device_information_data": [
                    {
                        "id": 1,
                        "device_name": "Light",
                        "device_type": "LED",
                        "is_used": "No",
                        "device_informations": {
                            "is_dimmable": "true",
                            "isFan": "false",
                            "device_id": "3",
                            "channel_id": "18",
                            "device_status": "12",
                            "image_id": "2",
                            "delay_second": "0"
                        },
                        "status": "Active",
                        "create_at": "2023-05-01T13:13:34Z",
                        "updated_user_details_date": "2023-05-18T12:03:59.810211Z"
                    },
                    {
                        "id": 2,
                        "device_name": "CEMARA",
                        "device_type": "AC",
                        "is_used": "No",
                        "device_informations": {
                            "device_id": "92",
                            "channel_id": "0",
                            "ac_temp": "25",
                            "rm_temp": "34",
                            "mode": "F",
                            "swing": "",
                            "fspeed": "L",
                            "device_status": "false"
                        },
                        "status": "Active",
                        "create_at": "2023-05-13T10:14:19Z",
                        "updated_user_details_date": "2023-05-18T12:22:42.601043Z"
                    },
                    {
                        "id": 5,
                        "device_name": "Light 1",
                        "device_type": "LED",
                        "is_used": "Yes",
                        "device_informations": {},
                        "status": "Active",
                        "create_at": "2023-05-17T13:36:05Z",
                        "updated_user_details_date": "2023-05-18T12:27:13.556399Z"
                    },
                    {
                        "id": 6,
                        "device_name": "Light 2",
                        "device_type": "LED",
                        "is_used": "Yes",
                        "device_informations": None,
                        "status": "Active",
                        "create_at": "2023-05-17T13:36:53Z",
                        "updated_user_details_date": "2023-05-17T14:07:08.827494Z"
                    },
                    {
                        "id": 7,
                        "device_name": "Light 3",
                        "device_type": "LED",
                        "is_used": "Yes",
                        "device_informations": None,
                        "status": "Active",
                        "create_at": "2023-05-17T13:37:02Z",
                        "updated_user_details_date": "2023-05-17T13:37:09.759144Z"
                    },
                    {
                        "id": 8,
                        "device_name": "Light 3",
                        "device_type": "LED",
                        "is_used": "Yes",
                        "device_informations": None,
                        "status": "Active",
                        "create_at": "2023-05-17T13:37:12Z",
                        "updated_user_details_date": "2023-05-17T13:37:19.274884Z"
                    },
                    {
                        "id": 9,
                        "device_name": "Light 4",
                        "device_type": "LED",
                        "is_used": "Yes",
                        "device_informations": None,
                        "status": "Active",
                        "create_at": "2023-05-17T13:37:21Z",
                        "updated_user_details_date": "2023-05-17T13:40:22.497827Z"
                    },
                    {
                        "id": 10,
                        "device_name": "Light 5",
                        "device_type": "LED",
                        "is_used": "Yes",
                        "device_informations": None,
                        "status": "Active",
                        "create_at": "2023-05-17T13:37:37Z",
                        "updated_user_details_date": "2023-05-17T13:40:45.701722Z"
                    },
                    {
                        "id": 11,
                        "device_name": "Light 6",
                        "device_type": "LED",
                        "is_used": "Yes",
                        "device_informations": None,
                        "status": "Active",
                        "create_at": "2023-05-17T13:37:43Z",
                        "updated_user_details_date": "2023-05-17T13:38:53.680687Z"
                    },
                    {
                        "id": 12,
                        "device_name": "Light 7",
                        "device_type": "LED",
                        "is_used": "Yes",
                        "device_informations": None,
                        "status": "Active",
                        "create_at": "2023-05-17T13:37:50Z",
                        "updated_user_details_date": "2023-05-17T13:38:17.283481Z"
                    },
                    {
                        "id": 13,
                        "device_name": "Light 8",
                        "device_type": "LED",
                        "is_used": "Yes",
                        "device_informations": None,
                        "status": "Active",
                        "create_at": "2023-05-17T13:38:01Z",
                        "updated_user_details_date": "2023-05-17T13:38:09.333118Z"
                    },
                    {
                        "id": 14,
                        "device_name": "Light 8",
                        "device_type": "LED",
                        "is_used": "No",
                        "device_informations": None,
                        "status": "Active",
                        "create_at": "2023-05-17T13:38:56Z",
                        "updated_user_details_date": "2023-05-20T05:23:34.949977Z"
                    },
                    {
                        "id": 15,
                        "device_name": "Light 9",
                        "device_type": "LED",
                        "is_used": "No",
                        "device_informations": None,
                        "status": "Active",
                        "create_at": "2023-05-17T13:39:04Z",
                        "updated_user_details_date": "2023-05-20T05:23:27.620882Z"
                    }
                ]
            }
        }
    },
    "department_data": None,
    "locker_data": {
        "id": 1,
        "category": "Normal",
        "locker_name": "Locker1",
        "status": "Active",
        "created_at": "2023-05-15T07:13:31.282551Z",
        "updated_at": "2023-05-15T07:13:31.282551Z",
        "sub_area_data": {
            "id": 1,
            "sub_area_name": "React Teams",
            "on_image_path": "image/13_on_MyTesting_Room_j0cVat.jpg",
            "off_image_path": "image/13_off_My_Testing_Room_j0cVat.jpg",
            "width": "1300",
            "height": "233",
            "seating_capacity": 1,
            "status": "Active",
            "created_at": "2023-05-13T10:15:08.455013Z",
            "updated_at": "2023-05-13T10:15:08.455013Z",
            "area_data": {
                "id": 1,
                "area_name": "IT Department",
                "status": "Active",
                "created_at": "2023-05-13T10:12:34.040350Z",
                "updated_at": "2023-05-13T10:12:34.040350Z",
                "floor_data": {
                    "id": 1,
                    "floor_name": "First floor",
                    "status": "Active",
                    "created_at": "2023-05-13T10:12:32.447207Z",
                    "updated_at": "2023-05-13T10:12:32.447207Z",
                    "tower_data": {
                        "id": 1,
                        "tower_name": "Tower1",
                        "status": "Active",
                        "created_at": "2023-05-13T10:12:29.561658Z",
                        "updated_at": "2023-05-13T10:12:29.561658Z"
                    }
                }
            },
            "devices_details": [
                {
                    "id": 1,
                    "device_name": "Light",
                    "device_type": "LED",
                    "is_used": "No",
                    "device_informations": {
                        "is_dimmable": "true",
                        "isFan": "false",
                        "device_id": "3",
                        "channel_id": "18",
                        "device_status": "12",
                        "image_id": "2",
                        "delay_second": "0"
                    },
                    "status": "Active",
                    "create_at": "2023-05-01T13:13:34Z",
                    "updated_user_details_date": "2023-05-18T12:03:59.810211Z"
                },
                {
                    "id": 2,
                    "device_name": "CEMARA",
                    "device_type": "AC",
                    "is_used": "No",
                    "device_informations": {
                        "device_id": "92",
                        "channel_id": "0",
                        "ac_temp": "25",
                        "rm_temp": "34",
                        "mode": "F",
                        "swing": "",
                        "fspeed": "L",
                        "device_status": "false"
                    },
                    "status": "Active",
                    "create_at": "2023-05-13T10:14:19Z",
                    "updated_user_details_date": "2023-05-18T12:22:42.601043Z"
                },
                {
                    "id": 14,
                    "device_name": "Light 8",
                    "device_type": "LED",
                    "is_used": "No",
                    "device_informations": None,
                    "status": "Active",
                    "create_at": "2023-05-17T13:38:56Z",
                    "updated_user_details_date": "2023-05-20T05:23:34.949977Z"
                },
                {
                    "id": 15,
                    "device_name": "Light 9",
                    "device_type": "LED",
                    "is_used": "No",
                    "device_informations": None,
                    "status": "Active",
                    "create_at": "2023-05-17T13:39:04Z",
                    "updated_user_details_date": "2023-05-20T05:23:27.620882Z"
                }
            ]
        }
    }
}

devices_details = (a["user_data"]["user_type_data"]['role_data']['device_information_data'])
floor_data = (a["user_data"]["user_type_data"]['role_data']['subarea_data'])
# subarea_data ,area_data ,floor_data['subarea_data'],['area_data']['floor_data']
area_data = []
for i in floor_data:
    floor_data = (i['area_data'])
    # print(floor_data)
    tower_id = floor_data['floor_data']['id']
    if floor_data['floor_data']['id'] == 9:
        del floor_data['floor_data']
        area_data.append(floor_data)
print(area_data)
#     tower_data.append(floor_data['tower_data'])
    
#         # tower_name = i['tower_data']
#         # print(tower_name)

# unique_values = [dict(t) for t in {tuple(d.items()) for d in tower_data}]
# print(unique_values)

# b = {'id': 10, 'floor_name': 'Second floor', 'status': 'Active', 'created_at': '2023-05-16T09:48:13.067305Z', 'updated_at': '2023-05-16T09:48:13.067305Z', 'tower_data': {'id': 2, 'tower_name': 'Tower2', 'status': 'Active', 'created_at': '2023-05-16T05:22:36.078337Z', 'updated_at': '2023-05-16T05:22:36.078337Z'}}
 
# print(b.pop('tower_data'))
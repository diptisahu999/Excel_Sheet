data =[
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
      "device_status": "false",
      "image_id": "2",
      "delay_second": "0"
    },
    "status": "Active",
    "create_at": "2023-05-01T13:13:34Z",
    "updated_user_details_date": "2023-05-31T13:20:01.416498Z"
  }
]
for i in data:
    print(i['id'])
    print(type(i["device_informations"]["device_id"]))


# a =  [{'x': 521, 'y': 157}, {'x': 641, 'y': 160}, {'x': 635, 'y': 271}, {'x': 517, 'y': 268}]
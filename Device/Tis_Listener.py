from Device.models import *
from Device.serializers import *
import socket
import logging
import six
from struct import pack
import binascii
from BMS import urls
import time
from Device.consumer import MySyncConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import json
from django.core.serializers import serialize
import asyncio
from Device.device_status import getUserAreaCardList
import threading



a = MySyncConsumer.connected_clients

def send_message(websocket_consumer, message):
    async_to_sync(websocket_consumer.channel_layer.send)(
        websocket_consumer.channel_name,
        {
            'type': 'websocket.send',
            'text': message
        }
    )
# def send_message(ws, message):
#     ws.send(message)
# m=socket(AF_INET, SOCK_DGRAM)
# m.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)

# m.bind(('0.0.0.0', 6000)) 
# 
def CardListStatus():
    channel_layer = get_channel_layer()
    clinet_list = MySyncConsumer.connected_clients
    # print("Connected User_ID: ",clinet_list)
    for i in clinet_list.keys():
        user_id = (int(i))
        # print(f"Connected user_id:{i}")
        User_cards= getUserAreaCardList(user_id)
        async_to_sync(channel_layer.group_send)(
            str(i),{
            'type':'chat.message',
            'message': User_cards
            }
        ) 

def crc16_ccitt(data, crc=0):
        CRC16_CCITT_TAB = \
            [
                0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7,
                0x8108, 0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef,
                0x1231, 0x0210, 0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6,
                0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de,
                0x2462, 0x3443, 0x0420, 0x1401, 0x64e6, 0x74c7, 0x44a4, 0x5485,
                0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d,
                0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6, 0x5695, 0x46b4,
                0xb75b, 0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d, 0xc7bc,
                0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823,
                0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b,
                0x5af5, 0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12,
                0xdbfd, 0xcbdc, 0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a,
                0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41,
                0xedae, 0xfd8f, 0xcdec, 0xddcd, 0xad2a, 0xbd0b, 0x8d68, 0x9d49,
                0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70,
                0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a, 0x9f59, 0x8f78,
                0x9188, 0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e, 0xe16f,
                0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067,
                0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e,
                0x02b1, 0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256,
                0xb5ea, 0xa5cb, 0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d,
                0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405,
                0xa7db, 0xb7fa, 0x8799, 0x97b8, 0xe75f, 0xf77e, 0xc71d, 0xd73c,
                0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634,
                0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9, 0xb98a, 0xa9ab,
                0x5844, 0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882, 0x28a3,
                0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a,
                0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92,
                0xfd2e, 0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9,
                0x7c26, 0x6c07, 0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1,
                0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8,
                0x6e17, 0x7e36, 0x4e55, 0x5e74, 0x2e93, 0x3eb2, 0x0ed1, 0x1ef0,
            ]

        tab = CRC16_CCITT_TAB  # minor optimization (now in locals)
        crc = 0x0000
        for byte in six.iterbytes(data):
            index = ((crc >> 8)) ^ byte
            crc = (((crc << 8) & 0xFFFF) ^ tab[index])
        return crc & 0xffff

def getter(packet, detail):
    print(packet)
    if detail == "D":
        device_id = packet[36:]
        device_id = device_id[:2]
        return int(device_id, 16)
        
    if detail == "C":
        channel_id = packet[50:]
        channel_id = channel_id[:2]
        return int(channel_id, 16)
        
    if detail == "O":  
        channel_id = packet[54:]
        if channel_id[:2] == '64':
            return "true"
        elif channel_id[:2] == '00':
            return "false"
        else:
            return int(channel_id[:2], 16)
dlist = []
def main_update():
    print("Device Status Getting  Wait ... ")
    while True:
        try:
            pakage = urls.m.recvfrom(4096)
            for data in pakage:
                # print(data.hex())
                if data.hex().find('3401fe') != -1:
                    dlist.clear()
                    for data in pakage:
                        device_id = getter(data.hex(), "D")
                        channel_id = getter(data.hex(), "C")
                        operation = getter(data.hex(), "O")
                        pack_recv = str(data.hex())
                        ab = pack_recv[52:-4]
                        result = [ab[i:i+2] for i in range(0, len(ab), 2)]  
                        # enumerated_list = list(enumerate(result, 1))
                        # print(enumerated_list)
                        # print(result)
                        DeviceUpdate = BmsDeviceInformation.objects.filter(device_informations__device_id=str(device_id),is_deleted="No").values()
                       
                        for i in DeviceUpdate:
                            # print(i['device_informations']['channel_id'])
                            dlist.append(i['device_informations']['channel_id'])
                        for i in dlist:
                            # print(i)
                            output = result[int(i)-1]
                            # print(output)
                            DeviceUpdate = BmsDeviceInformation.objects.filter(device_informations__channel_id=str(i),is_deleted="No").values()[0]
                            # print(DeviceUpdate)
                            if output == '64':
                                id= int(DeviceUpdate['id'])
                                device_name = DeviceUpdate['device_name']
                                DeviceUpdated = {
                                                "id": DeviceUpdate['id'],
                                                "device_name":  DeviceUpdate['device_name'], 
                                                "device_type":  DeviceUpdate['device_type'],
                                                "hardware_details_id_id": DeviceUpdate['hardware_details_id_id'],
                                                "is_used":  DeviceUpdate['is_used'], 
                                                "device_informations": {
                                                    "is_dimmable": DeviceUpdate['device_informations']['is_dimmable'],
                                                    "isFan": DeviceUpdate['device_informations']['isFan'],
                                                    "device_id": DeviceUpdate['device_informations']['device_id'],
                                                    "channel_id": DeviceUpdate['device_informations']['channel_id'],
                                                    "device_status": "true",
                                                    "image_id": DeviceUpdate['device_informations']['image_id'],
                                                    "delay_second": DeviceUpdate['device_informations']['delay_second']
                                                }
                                            }
                                Device= BmsDeviceInformation.objects.get(pk=id)
                                devices_serializer = BmsDeviceInformationSerializerPost(Device, data=DeviceUpdated) 
                                # a = [DeviceUpdated]
                                # print(a)
                                if devices_serializer.is_valid(): 
                                    devices_serializer.save()
                                print("device_status: True")

                            if output == '00':
                                id= int(DeviceUpdate['id'])
                                device_name = DeviceUpdate['device_name']
                                DeviceUpdated = {
                                                "id": DeviceUpdate['id'],
                                                "device_name":  DeviceUpdate['device_name'], 
                                                "device_type":  DeviceUpdate['device_type'],
                                                "hardware_details_id_id": DeviceUpdate['hardware_details_id_id'],
                                                "is_used":  DeviceUpdate['is_used'], 
                                                "device_informations": {
                                                    "is_dimmable": DeviceUpdate['device_informations']['is_dimmable'],
                                                    "isFan": DeviceUpdate['device_informations']['isFan'],
                                                    "device_id": DeviceUpdate['device_informations']['device_id'],
                                                    "channel_id": DeviceUpdate['device_informations']['channel_id'],
                                                    "device_status": "false",
                                                    "image_id": DeviceUpdate['device_informations']['image_id'],
                                                    "delay_second": DeviceUpdate['device_informations']['delay_second']
                                                }
                                            }
                                                
                                Device= BmsDeviceInformation.objects.get(pk=id)
                                devices_serializer = BmsDeviceInformationSerializerPost(Device, data=DeviceUpdated) 
                                # a = [DeviceUpdated]
                                # print(a)
                                if devices_serializer.is_valid(): 
                                    devices_serializer.save()
                                print("device_status: false")
                            
                        # print(dlist)
                        # id= int(DeviceUpdate['id'])
                        # device_name = DeviceUpdate['device_name']
                        # DeviceUpdated = {
                        #                 "id": DeviceUpdate['id'],
                        #                 "device_name":  DeviceUpdate['device_name'], 
                        #                 "device_type":  DeviceUpdate['device_type'],
                        #                 "hardware_details_id_id": DeviceUpdate['hardware_details_id_id'],
                        #                 "is_used":  DeviceUpdate['is_used'], 
                        #                 "device_informations": {
                        #                     "is_dimmable": DeviceUpdate['device_informations']['is_dimmable'],
                        #                     "isFan": DeviceUpdate['device_informations']['isFan'],
                        #                     "device_id": DeviceUpdate['device_informations']['device_id'],
                        #                     "channel_id": DeviceUpdate['device_informations']['channel_id'],
                        #                     "device_status": str(operation),
                        #                     "image_id": DeviceUpdate['device_informations']['image_id'],
                        #                     "delay_second": DeviceUpdate['device_informations']['delay_second']
                        #                 }
                        #             }
                                        
                        # Device= BmsDeviceInformation.objects.get(pk=id)
                        # devices_serializer = BmsDeviceInformationSerializerPost(Device, data=DeviceUpdated) 
                        # a = [DeviceUpdated]
                        # print(a)
                        # if devices_serializer.is_valid(): 
                        #     devices_serializer.save()
                
                if data.hex().find('32ffff') != -1:
                    # print("hey")
                    device_id = getter(data.hex(), "D")
                    channel_id = getter(data.hex(), "C")
                    operation = getter(data.hex(), "O")
                    print(device_id)
                    print(channel_id)
                    print(operation)
                   
                    DeviceUpdate= BmsDeviceInformation.objects.filter(device_informations__device_id=str(device_id),device_informations__channel_id=str(channel_id),is_deleted="No").values()[0]
                    print(DeviceUpdate)
                    id= int(DeviceUpdate['id'])
                    device_name = DeviceUpdate['device_name']
                    DeviceUpdated = {
                                    "id": DeviceUpdate['id'],
                                    "device_name":  DeviceUpdate['device_name'], 
                                    "device_type":  DeviceUpdate['device_type'],
                                    "hardware_details_id_id": DeviceUpdate['hardware_details_id_id'],
                                    "is_used":  DeviceUpdate['is_used'], 
                                    "device_informations": {
                                        "is_dimmable": DeviceUpdate['device_informations']['is_dimmable'],
                                        "isFan": DeviceUpdate['device_informations']['isFan'],
                                        "device_id": DeviceUpdate['device_informations']['device_id'],
                                        "channel_id": DeviceUpdate['device_informations']['channel_id'],
                                        "device_status": str(operation),
                                        "image_id": DeviceUpdate['device_informations']['image_id'],
                                        "delay_second": DeviceUpdate['device_informations']['delay_second']
                                    }
                                }
                                    
                    Device= BmsDeviceInformation.objects.get(pk=id)
                    devices_serializer = BmsDeviceInformationSerializerPost(Device, data=DeviceUpdated) 
                    a = [DeviceUpdated]
                    print(a)
                    if devices_serializer.is_valid(): 
                        devices_serializer.save()
                    first_name = "Switch On/Off"
                    last_name = "by Manually"
                    BmsHistoryData= {
                    "user_name":first_name + " " + last_name,
                    "component_name": str(device_name),
                    "opetation_type": str(operation),}            
                    print(BmsHistoryData)
                    module_serializer = BmsHistoryDetailsSerializers(data=BmsHistoryData)
                    if module_serializer.is_valid():
                        module_serializer.save()
                        print("pass")
                    else:
                        print(devices_serializer.errors)

                    T1 = threading.Thread(target=CardListStatus) 
                    T1.start()
                    T1.join()      
        except Exception as e:
            # print("An error occurred:", e)
            pass
       
            # print(packets,"packets=>>>>")
            #     for i in devies_data:
            #         if data.hex().find('3401fe') != -1 and str(device_id) == i.device_object["device_id"]:
            #             logging.info("Receieved status of : " +  i.device_object["device_id"])
            #             res = data 
            #             sample_str = res.hex()
            #             newstr = ''

            #             if len(sample_str) == 184:
            #                 newstr = sample_str[-132:]
            #                 get = newstr[0:-4]
            #                 n = 2
            #                 arr = [(get[i:i+n]) for i in range(0, len(get), n)]
            #                 resp = (arr, i.device_object["device_id"])
            #                 # resp = relay_data_dimmer(arr, i.device_object["device_id"])
            #                 # [{'device_id': id, 'channel_id': str(cn), 'device_status' : 'true',}]
            #                 for r in resp:
            #                     if str(r["device_id"]) == i.device_object["device_id"] and str(r["channel_id"]) == i.device_object["channel_id"]:
            #                         update_data = BmsDeviceInformation.objects.get(pk=i.pk)
            #                         update_data.device_object["device_status"]=r["device_id"]
            #                         update_data.save()
            #                         logging.info("Saving status of relay: " +  i.device_object["device_id"])
                            
            #             else:
            #                 if len(sample_str) == 104:
            #                     newstr = sample_str[-52:]
            #                 elif len(sample_str) == 80:
            #                     newstr = sample_str[-28:]
            #                 elif len(sample_str) == 68:
            #                     newstr = sample_str[-16:]
                                
            #                 get = newstr[0:-4]
            #                 n = 2
            #                 cn=1
            #                 arr = [(get[i:i+n]) for i in range(0, len(get), n)]
            #                 resp = relay_data(arr, i.device_object["device_id"])
            #                 {'device_id': id, 'channel_id': str(cn), 'device_status' : 'true',}
            #                 for r in resp:
            #                     if str(r["device_id"]) == i.device_object["device_id"] and str(r["channel_id"]) == i.device_object["channel_id"]:
            #                         update_data = BmsDeviceInformation.objects.get(pk=i.pk)
            #                         update_data.device_object["device_status"]=r["device_id"]
            #                         update_data.save()
            #                         logging.info("Saving status of relay: " +  i.device_object["device_id"])

            # # Relay opertaions change receiver
            # if data.hex().find('32ffff') != -1:
            #     device_id = getter(data.hex(), "D")
            #     channel_id = getter(data.hex(), "C")
            #     operation = getter(data.hex(), "O")

            #     logging.info("Success Operation on " + str(device_id) + " on channel id " + str(channel_id) + " Operation " + str(operation) + "------- Success")
            #     param.logUpdate("Relay Operation : Operation on " + str(device_id) + " on channel id " + str(channel_id) + " Operation " + str(operation))
            #     ## devices_data = json_opr.getJson(param.site_json)
            #     # check_event_triggers(device_id, channel_id, operation) #not completed

            #     devies_data = Devices.objects.filter(device_object__device_id=str(device_id))
            #     for i in devies_data:
            #         if i.device_type == "RL" and i.app_type=="L":
            #             if i.device_object["device_id"] == str(device_id) and i.device_object["channel_id"] ==  str(channel_id):
            #                 update_data = Devices.objects.get(pk=i.pk)
            #                 update_data.device_object["device_status"]=str(operation)
            #                 update_data.save()
            #                 t1 = threading.Thread(target=GetAllSTatus)
            #                 t1.start()
            #                 t1.join()

            # # AC Panel Status receiver
            # if data.hex().find('e0ed') != -1:
            #     logging.info("...................AC status updating...................")
            #     ac_data = ac_panel_opr.set_panel_ac_status(data.hex())
            #     logging.info("Recevied status of AC Panel : " + ac_data['device_id'] + " AC No. " + ac_data['channel_id'])
            #     devies_data = Devices.objects.filter(device_object__device_id=str(ac_data['device_id']))
            #     for i in devies_data:
            #         if i.device_type=="RL" and i.app_type=="AC" and str(i.device_object['device_id']) == str(ac_data['device_id']) and str(i.device_object['channel_id']) == str(ac_data['channel_id'][1:]):
            #             update_data = Devices.objects.get(pk=i.pk)
            #             update_data.device_object['device_status'] = ac_data['device_status']
            #             update_data.device_object['ac_temp'] = ac_data['ac_temp']
            #             update_data.device_object['rm_temp'] = ac_data['rm_temp']
            #             update_data.device_object['mode'] = ac_data['mode']
            #             update_data.device_object['swing'] = ac_data['swing']
            #             update_data.device_object['fspeed'] = ac_data['fspeed']
            #             update_data.save()
            #             t1 = threading.Thread(target=GetAllSTatus)
            #             t1.start()
            #             t1.join()

            # # AC Panel operation change receiver
            # if data.hex().find('e3d9') != -1:
            #     # logging.info("data.hex(): : " +  str(data.hex()))
            #     ac_data = ac_panel_opr.set_onchange_status(data.hex())
            #     # {device_id' : deviceId,'param': 'device_status','channel_id': '1','param_value': device_status}
            #     devies_data = Devices.objects.filter(device_object__device_id=str(ac_data['device_id']))
            #     for i in devies_data:
            #         if i.device_type == "RL" and i.app_type == "AC" and  i.device_object["channel_id"] == str(ac_data["channel_id"])  and i.device_object["device_id"] == str(ac_data['device_id']):
            #             update_data = Devices.objects.get(pk=i.pk)
            #             if ac_data['param'] == 'device_status':
            #                 update_data.device_object['device_status'] = ac_data['param_value']
            #             if ac_data['param'] == 'ac_temp':
            #                 update_data.device_object['ac_temp'] = ac_data['param_value']
            #             if ac_data['param'] == 'mode':
            #                 update_data.device_object['mode'] = ac_data['param_value']
            #             if ac_data['param'] == 'fspeed':
            #                 update_data.device_object['fspeed'] = ac_data['param_value']
            #             update_data.save()
            #             t1 = threading.Thread(target=GetAllSTatus)
            #             t1.start()
            #             t1.join()
        
        


#  00 -- False
#  64  --  true       
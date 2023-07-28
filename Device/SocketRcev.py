import json
from Device.device_control import relay_opr
from Device.Schedule import triggerEvent
from Device.serializers import *
from Device.models import *
from Device.coolmaster import CoolMaster_opr
from Authenticate.serializers import *
from Authenticate.models import *

# from BMS.urls import triggerDevice
# TriggerDeviceList = trigerDeviceListGet()
def ClientConfigSocket(data,user_id):
    y = json.dumps(data)
    i = json.loads(y)
    i= i[0]
    id = i['id']
    if i["device_type"] == "LED":
        if i['device_informations']['device_status'] == "true":
            param = {"device_id": int(i['device_informations']['device_id']),
                        "channel_id": int(i['device_informations']['channel_id']),
                        "device_status": str(i['device_informations']['device_status']),
                        # "delay_second":10,
                        }
            relay_opr(param)
            # try:
            #     if id in triggerDevice:
            #         triggerEvent(id)
            # except:
                # pass
            try:
                print(id)
                opr ="on"
                triggerEvent(id,opr)
            except Exception as e:
                pass
            # # triggerEvent()

            name  = BmsUsersDetail.objects.filter(id=user_id)
            user_name = BmsUserSerializer(name,many=True)      
            if len(user_name.data) > 0:
                first_name = user_name.data[0].get('first_name')
                last_name = user_name.data[0].get('last_name')

                BmsHistoryData= {
                "user_name":first_name + " " + last_name,
                "component_name":i["device_name"],
                "opetation_type": "on",
            }
                
            else:
                first_name = "Switch off"
                last_name = "by Manually"
                BmsHistoryData= {
                "user_name":first_name + " " + last_name,
                "component_name":i["device_name"],
                "opetation_type": "on",
            }
            
         
            # print(BmsHistoryData)
            module_serializer = BmsHistoryDetailsSerializers(data=BmsHistoryData)
            if module_serializer.is_valid():
                module_serializer.save()
            # # triggerEvent()user_name
            


        elif i['device_informations']['device_status'] == "false":
            param = {"device_id": int(i['device_informations']['device_id']),
                        "channel_id": int(i['device_informations']['channel_id']),
                        "device_status": str(i['device_informations']['device_status']),
                        # "delay_second":10,
                        }
            relay_opr(param)
            try:
                print(id)
                opr ="off"
                triggerEvent(id,opr)
               
            except Exception as e:
                print("Scene Error",e)
            # triggerEvent()3
            # try:
            #     if id in triggerDevice:
            #         triggerEvent(id)
            # except:
            #     pass



            name  = BmsUsersDetail.objects.filter(id=user_id)
            user_name = BmsUserSerializer(name,many=True)      
            if len(user_name.data) > 0:
                print("User found.")

                first_name = user_name.data[0].get('first_name')
                last_name = user_name.data[0].get('last_name')

                BmsHistoryData= {
                "user_name":first_name + " " + last_name,
                "component_name":i["device_name"],
                "opetation_type": "on",
            }
                
            else:
                print("User not found.")
                first_name = "Switch off"
                last_name = "by Manually"
                BmsHistoryData= {
                "user_name":first_name + " " + last_name,
                "component_name":i["device_name"],
                "opetation_type": "on",
            }
                

            # print(BmsHistoryData)
            module_serializer = BmsHistoryDetailsSerializers(data=BmsHistoryData)
            if module_serializer.is_valid():
                module_serializer.save()



        else:
            param = {"device_id": int(i['device_informations']['device_id']),
                        "channel_id":  int(i['device_informations']['channel_id']),
                        "device_status": str(i['device_informations']['device_status'])}
            relay_opr(param)
            try:
                triggerEvent(id)
            except Exception as e:
                print("Scene Error",e)
            # triggerEvent()
            # try:
            #     if id in triggerDevice:
            #         triggerEvent(id)
            # except:
            #     pass
   
    
        building = BmsDeviceInformation.objects.get(pk=int(id)) 
        del i['on_crop_image_path']
        # print(i['on_crop_image_path'], "meta data")
        building_serializer = BmsDeviceInformationSerializerPost(building, data=i) 
        try:
            building_serializer.is_valid()
            building_serializer.save() 
        except Exception as e:
            pass
    # user_id=3
    # getUserAreaCardList(user_id)

    if i["device_type"] == "AC":
     
        if i['device_informations']['device_status'] == "true":
            # print(i, "i am in ac turn on status")
            param = {
                    "ip":  str(i['device_informations']['ip']),
                    "port": str(i['device_informations']['port']),
                    "device_id": str(i['device_informations']['device_id']),
                    "channel_id": str(i['device_informations']['channel_id']),
                    "ac_temp": str(i['device_informations']['ac_temp']),
                    "rm_temp": str(i['device_informations']['rm_temp']),
                    "mode": str(i['device_informations']['mode']),  
                    "swing": str(i['device_informations']['swing']),
                    "fspeed": str(i['device_informations']['fspeed']),
                    "device_status":str(i['device_informations']['device_status'])}
            # print(param,"AC device status True")
            CoolMaster_opr(param)
            try:
                triggerEvent(id)
            except Exception as e:
                pass
            # triggerEvent()
            # pannel_ac_control(dict(param))
            # try:
            #     if id in triggerDevice:
            #         triggerEvent(id)
            # except:
            #     pass
            name  = BmsUsersDetail.objects.filter(id=user_id)
            user_name = BmsUserSerializer(name,many=True)      
            if len(user_name.data) > 0:
                first_name = user_name.data[0].get('first_name')
                last_name = user_name.data[0].get('last_name')
                
            else:
                first_name = "Switch off"
                last_name = "by Manually"
            
            BmsHistoryData= {
                "user_name":first_name + " " + last_name,
                "component_name":i["device_name"],
                "opetation_type": "on",
            }
            # print(BmsHistoryData)
            module_serializer = BmsHistoryDetailsSerializers(data=BmsHistoryData)
            if module_serializer.is_valid():
                module_serializer.save()


        elif i['device_informations']['device_status'] == "false":
            # print(i, "i am in ac turn Off status")
            param = {
                    "ip":  str(i['device_informations']['ip']),
                    "port": str(i['device_informations']['port']),
                    "device_id": str(i['device_informations']['device_id']),
                    "channel_id": str(i['device_informations']['channel_id']),
                    "ac_temp": str(i['device_informations']['ac_temp']),
                    "rm_temp": str(i['device_informations']['rm_temp']),
                    "mode": str(i['device_informations']['mode']),  
                    "swing": str(i['device_informations']['swing']),
                    "fspeed": str(i['device_informations']['fspeed']),
                    "device_status":str(i['device_informations']['device_status'])}
            CoolMaster_opr(param)
            try:
                triggerEvent(id)
            except Exception as e:
                pass
            # triggerEvent()
            # pannel_ac_control(dict(param))
            # try:
            #     if id in triggerDevice:
            #         triggerEvent(id)
            # except:
            #     pass

        # print(i['id'])


            name  = BmsUsersDetail.objects.filter(id=user_id)
            user_name = BmsUserSerializer(name,many=True)      
            if len(user_name.data) > 0:
                first_name = user_name.data[0].get('first_name')
                last_name = user_name.data[0].get('last_name')
                
            else:
                first_name = "Switch off"
                last_name = "by Manually"
            
            BmsHistoryData= {
                "user_name":first_name + " " + last_name,
                "component_name":i["device_name"],
                "opetation_type": "off",
            }
            # print(BmsHistoryData)
            module_serializer = BmsHistoryDetailsSerializers(data=BmsHistoryData)
            if module_serializer.is_valid():
                module_serializer.save()


        building = BmsDeviceInformation.objects.get(pk=int(id)) 
    
        # print(i, "meta data")
        building_serializer = BmsDeviceInformationSerializerPost(building, data=i) 
        try:
            building_serializer.is_valid()
            building_serializer.save() 
        except Exception as e:
            pass
        # print("I am AC")
    # if i["device_type"]=="CURTAIN":
    #     if i['opr']=='curtain_opr_o':
    #     # if i['device_status']=='false':
    #         param={
    #                 "device_id":str(i['device_id']),
    #                 "channel_open":str(i['channel_open']),
    #                 "device_status":str(i['device_status']),
    #                 "opr":str(['opr'])
    #             }
    #         curtain_relay_opr(dict(param), 'curtain_opr_o')
                
    #     # elif i['device_status']=='false':
    #     elif i['opr']=='curtain_opr_c':
    #         param={
    #                 "device_id":str(i['device_id']),
    #                 "channel_close":str(i['channel_close']),
    #                 "device_status":str(i['device_status']),
    #                 "opr":str(i['opr'])
    #             }
    #         curtain_relay_opr(dict(param), 'curtain_opr_c')
                
    #     # elif i['device_status']=='false':
    #     elif i['opr']=='curtain_opr_s':
    #         param={
    #                 "device_id":str(i['device_id']),
    #                 "channel_open":str(i['channel_open']),
    #                 "channel_close":str(i['channel_close']),
    #                 "device_status":str(i['device_status']),
    #                 "opr":str(i['opr'])
    #             }
    #         curtain_relay_opr(dict(param), 'curtain_opr_s')
import schedule
import time
from Device.models import *
from Device.serializers import *
from datetime import datetime
from Device.device_control import relay_opr
from Device.coolmaster import CoolMaster_opr
import calendar

def trigger_schedule():
    bms_module = BmsTriggers.objects.filter(is_deleted="No")
    trigger_data = BmsTriggerSerializersSchedules(bms_module,many=True)
    for trigger in trigger_data.data:
        if trigger['status'] =="Active":
            if trigger['action_type'] == "schedule":
                if trigger['trigger_data']['schedule_type']== "Once":
                    if trigger['trigger_data']['date'] == str(datetime.now().strftime("%d/%m/%Y")):
                        if trigger['trigger_data']['time'] == str(datetime.now().strftime("%H:%M")):
                            # print(i['scene']['id'])
                            ScenePerform =  BmsSceneAppliancesDetails.objects.filter(scene=int(trigger['scene']['id']),is_deleted="No")
                            SencesSerializersData= SencesSerializers(ScenePerform,many=True)
                            for ScenePerform in SencesSerializersData.data:
                                device_list= BmsDeviceInformation.objects.filter(id=int(ScenePerform['component_id']),is_deleted="No")
                                device_informations = BmsDeviceInformationSerializerPost(device_list,many=True)
                                for device in device_informations.data:
                                    if ScenePerform['device_type_slug']=="LED":
                                    # param = (i['device_informations'])
                                        if ScenePerform['operation_type']=="on":
                                            param =  {"device_id": int(device['device_informations']['device_id']),
                                                        "channel_id": int(device['device_informations']['channel_id']),
                                                        "device_status":"true",
                                                        # "delay_second":10,
                                                        }
                                            relay_opr(param)
                                        if ScenePerform['operation_type']=="off":
                                            param =  {"device_id": int(device['device_informations']['device_id']),
                                                        "channel_id": int(device['device_informations']['channel_id']),
                                                        "device_status":"false",
                                                        # "delay_second":10,
                                                        }
                                            relay_opr(param) 

                                    if ScenePerform['device_type_slug']=="AC":
                                        if ScenePerform['operation_type']=="on":
                                            # print("hey")
                                            # print(ScenePerform['operation_value'])
                                                # print(device['device_informations']['device_status'])
                                                # if device['device_informations']['device_status'] == "true":
                                                    param = {
                                                            "ip":  str(device['device_informations']['ip']),
                                                            "port": str(device['device_informations']['port']),
                                                            "device_id": str(device['device_informations']['device_id']),
                                                            "channel_id": str(device['device_informations']['channel_id']),
                                                            "ac_temp": str(ScenePerform['operation_value']),
                                                            "rm_temp": str(device['device_informations']['rm_temp']),
                                                            "mode": str(device['device_informations']['mode']),  
                                                            "swing": str(device['device_informations']['swing']),
                                                            "fspeed": str(device['device_informations']['fspeed']),
                                                            "device_status":"true"}
                                                    CoolMaster_opr(param)

                                        if ScenePerform['operation_type']=="off":
                                            # print("hey")
                                            # print(ScenePerform['operation_value'])
                                                # print(device['device_informations']['device_status'])
                                                # if device['device_informations']['device_status'] == "true":
                                                    param = {
                                                            "ip":  str(device['device_informations']['ip']),
                                                            "port": str(device['device_informations']['port']),
                                                            "device_id": str(device['device_informations']['device_id']),
                                                            "channel_id": str(device['device_informations']['channel_id']),
                                                            "ac_temp": str(ScenePerform['operation_value']),
                                                            "rm_temp": str(device['device_informations']['rm_temp']),
                                                            "mode": str(device['device_informations']['mode']),  
                                                            "swing": str(device['device_informations']['swing']),
                                                            "fspeed": str(device['device_informations']['fspeed']),
                                                            "device_status":"false"}
                                                    CoolMaster_opr(param)

                if trigger['trigger_data']['schedule_type'] == "Daily":
                #    if trigger['trigger_data']['date'] == str(datetime.now().strftime("%d/%m/%Y")):
                        # print("hello",'iam daily')
                        if trigger['trigger_data']['time'] == str(datetime.now().strftime("%H:%M")):
                            # print(i['scene']['id'])
                            ScenePerform =  BmsSceneAppliancesDetails.objects.filter(scene=int(trigger['scene']['id']),is_deleted="No")
                            SencesSerializersData= SencesSerializers(ScenePerform,many=True)
                            for ScenePerform in SencesSerializersData.data:
                                device_list= BmsDeviceInformation.objects.filter(id=int(ScenePerform['component_id']),is_deleted="No")
                                device_informations = BmsDeviceInformationSerializerPost(device_list,many=True)
                                for device in device_informations.data:
                                    if ScenePerform['device_type_slug']=="LED":
                                    # param = (i['device_informations'])
                                        if ScenePerform['operation_type']=="on":
                                            param =  {"device_id": int(device['device_informations']['device_id']),
                                                        "channel_id": int(device['device_informations']['channel_id']),
                                                        "device_status":"true",
                                                        # "delay_second":10,
                                                        }
                                            relay_opr(param)
                                        if ScenePerform['operation_type']=="off":
                                            param =  {"device_id": int(device['device_informations']['device_id']),
                                                        "channel_id": int(device['device_informations']['channel_id']),
                                                        "device_status":"false",
                                                        # "delay_second":10,
                                                        }
                                            relay_opr(param) 

                                    if ScenePerform['device_type_slug']=="AC":
                                        if ScenePerform['operation_type']=="on":
                                            # print("hey")
                                            # print(ScenePerform['operation_value'])
                                                # print(device['device_informations']['device_status'])
                                                # if device['device_informations']['device_status'] == "true":
                                                    param = {
                                                            "ip":  str(device['device_informations']['ip']),
                                                            "port": str(device['device_informations']['port']),
                                                            "device_id": str(device['device_informations']['device_id']),
                                                            "channel_id": str(device['device_informations']['channel_id']),
                                                            "ac_temp": str(ScenePerform['operation_value']),
                                                            "rm_temp": str(device['device_informations']['rm_temp']),
                                                            "mode": str(device['device_informations']['mode']),  
                                                            "swing": str(device['device_informations']['swing']),
                                                            "fspeed": str(device['device_informations']['fspeed']),
                                                            "device_status":"true"}
                                                    CoolMaster_opr(param)

                                        if ScenePerform['operation_type']=="off":
                                            # print("hey")
                                            # print(ScenePerform['operation_value'])
                                                # print(device['device_informations']['device_status'])
                                                # if device['device_informations']['device_status'] == "true":
                                                    param = {
                                                            "ip":  str(device['device_informations']['ip']),
                                                            "port": str(device['device_informations']['port']),
                                                            "device_id": str(device['device_informations']['device_id']),
                                                            "channel_id": str(device['device_informations']['channel_id']),
                                                            "ac_temp": str(ScenePerform['operation_value']),
                                                            "rm_temp": str(device['device_informations']['rm_temp']),
                                                            "mode": str(device['device_informations']['mode']),  
                                                            "swing": str(device['device_informations']['swing']),
                                                            "fspeed": str(device['device_informations']['fspeed']),
                                                            "device_status":"false"}
                                                    CoolMaster_opr(param)                     
                if trigger['trigger_data']['schedule_type'] == "Weekly":
                #    if trigger['trigger_data']['date'] == str(datetime.now().strftime("%d/%m/%Y")):
                    if trigger['trigger_data']['day'] == calendar.day_name[datetime.today().weekday()]: 
                        
                        if trigger['trigger_data']['time'] == str(datetime.now().strftime("%H:%M")):
                            # print("hey")
                            ScenePerform =  BmsSceneAppliancesDetails.objects.filter(scene=int(trigger['scene']['id']),is_deleted="No")
                            SencesSerializersData= SencesSerializers(ScenePerform,many=True)
                            for ScenePerform in SencesSerializersData.data:
                                device_list= BmsDeviceInformation.objects.filter(id=int(ScenePerform['component_id']),is_deleted="No")
                                device_informations = BmsDeviceInformationSerializerPost(device_list,many=True)
                                for device in device_informations.data:
                                    if ScenePerform['device_type_slug']=="LED":
                                    # param = (i['device_informations'])
                                        if ScenePerform['operation_type']=="on":
                                            param =  {"device_id": int(device['device_informations']['device_id']),
                                                        "channel_id": int(device['device_informations']['channel_id']),
                                                        "device_status":"true",
                                                        # "delay_second":10,
                                                        }
                                            relay_opr(param)
                                        if ScenePerform['operation_type']=="off":
                                            param =  {"device_id": int(device['device_informations']['device_id']),
                                                        "channel_id": int(device['device_informations']['channel_id']),
                                                        "device_status":"false",
                                                        # "delay_second":10,
                                                        }
                                            relay_opr(param) 

                                    if ScenePerform['device_type_slug']=="AC":
                                        if ScenePerform['operation_type']=="on":
                                            # print("hey")
                                            # print(ScenePerform['operation_value'])
                                                # print(device['device_informations']['device_status'])
                                                # if device['device_informations']['device_status'] == "true":
                                                    param = {
                                                            "ip":  str(device['device_informations']['ip']),
                                                            "port": str(device['device_informations']['port']),
                                                            "device_id": str(device['device_informations']['device_id']),
                                                            "channel_id": str(device['device_informations']['channel_id']),
                                                            "ac_temp": str(ScenePerform['operation_value']),
                                                            "rm_temp": str(device['device_informations']['rm_temp']),
                                                            "mode": str(device['device_informations']['mode']),  
                                                            "swing": str(device['device_informations']['swing']),
                                                            "fspeed": str(device['device_informations']['fspeed']),
                                                            "device_status":"true"}
                                                    CoolMaster_opr(param)

                                        if ScenePerform['operation_type']=="off":
                                            # print("hey")
                                            # print(ScenePerform['operation_value'])
                                                # print(device['device_informations']['device_status'])
                                                # if device['device_informations']['device_status'] == "true":
                                                    param = {
                                                            "ip":  str(device['device_informations']['ip']),
                                                            "port": str(device['device_informations']['port']),
                                                            "device_id": str(device['device_informations']['device_id']),
                                                            "channel_id": str(device['device_informations']['channel_id']),
                                                            "ac_temp": str(ScenePerform['operation_value']),
                                                            "rm_temp": str(device['device_informations']['rm_temp']),
                                                            "mode": str(device['device_informations']['mode']),  
                                                            "swing": str(device['device_informations']['swing']),
                                                            "fspeed": str(device['device_informations']['fspeed']),
                                                            "device_status":"false"}
                                                    CoolMaster_opr(param)                     
                    
                # def day_of_week(x):
                #     fod_is_mon = True
                #     if fod_is_mon:
                #         return {
                #             '0': 'Monday',
                #             '1': 'Tuesday',
                #             '2': 'Wednesday',
                #             '3': 'Thursday',
                #             '4': 'Friday',
                #             '5': 'Saturday',
                #             '6': 'Sunday',
                #         }.get(x, "Something is wrong")
                #     else:
                #         return {
                #             '0': 'Sunday',
                #             '1': 'Monday',
                #             '2': 'Tuesday',
                #             '3': 'Wednesday',
                #             '4': 'Thursday',
                #             '5': 'Friday',
                #             '6': 'Saturday',
                #         }.get(x, "Something is wrong")   
                    

                if trigger['trigger_data']['schedule_type'] == "Monthly":
                    if trigger['trigger_data']['date'] == str(datetime.now().strftime("%d/%m/%Y")):
                            if trigger['trigger_data']['time'] == str(datetime.now().strftime("%H:%M")):   
                                ScenePerform =  BmsSceneAppliancesDetails.objects.filter(scene=int(trigger['scene']['id']),is_deleted="No")
                                SencesSerializersData= SencesSerializers(ScenePerform,many=True)
                                for ScenePerform in SencesSerializersData.data:
                                    device_list= BmsDeviceInformation.objects.filter(id=int(ScenePerform['component_id']),is_deleted="No")
                                    device_informations = BmsDeviceInformationSerializerPost(device_list,many=True)
                                    for device in device_informations.data:
                                        if ScenePerform['device_type_slug']=="LED":
                                        # param = (i['device_informations'])
                                            if ScenePerform['operation_type']=="on":
                                                param =  {"device_id": int(device['device_informations']['device_id']),
                                                            "channel_id": int(device['device_informations']['channel_id']),
                                                            "device_status":"true",
                                                            # "delay_second":10,
                                                            }
                                                relay_opr(param)
                                            if ScenePerform['operation_type']=="off":
                                                param =  {"device_id": int(device['device_informations']['device_id']),
                                                            "channel_id": int(device['device_informations']['channel_id']),
                                                            "device_status":"false",
                                                            # "delay_second":10,
                                                            }
                                                relay_opr(param) 
                                        

                                        if ScenePerform['device_type_slug']=="AC":
                                            if ScenePerform['operation_type']=="on":
                                                # print("hey")
                                                # print(ScenePerform['operation_value'])
                                                    # print(device['device_informations']['device_status'])
                                                    # if device['device_informations']['device_status'] == "true":
                                                        param = {
                                                                "ip":  str(device['device_informations']['ip']),
                                                                "port": str(device['device_informations']['port']),
                                                                "device_id": str(device['device_informations']['device_id']),
                                                                "channel_id": str(device['device_informations']['channel_id']),
                                                                "ac_temp": str(ScenePerform['operation_value']),
                                                                "rm_temp": str(device['device_informations']['rm_temp']),
                                                                "mode": str(device['device_informations']['mode']),  
                                                                "swing": str(device['device_informations']['swing']),
                                                                "fspeed": str(device['device_informations']['fspeed']),
                                                                "device_status":"true"}
                                                        CoolMaster_opr(param)

                                            if ScenePerform['operation_type']=="off":
                                                # print("hey")
                                                # print(ScenePerform['operation_value'])
                                                    # print(device['device_informations']['device_status'])
                                                    # if device['device_informations']['device_status'] == "true":
                                                        param = {
                                                                "ip":  str(device['device_informations']['ip']),
                                                                "port": str(device['device_informations']['port']),
                                                                "device_id": str(device['device_informations']['device_id']),
                                                                "channel_id": str(device['device_informations']['channel_id']),
                                                                "ac_temp": str(ScenePerform['operation_value']),
                                                                "rm_temp": str(device['device_informations']['rm_temp']),
                                                                "mode": str(device['device_informations']['mode']),  
                                                                "swing": str(device['device_informations']['swing']),
                                                                "fspeed": str(device['device_informations']['fspeed']),
                                                                "device_status":"false"}
                                                        CoolMaster_opr(param)
                                        time.sleep(1)
            # if trigger['status'] == "Active":
            #     if trigger['action_type'] == "event":
            #                     # if trigger['trigger_data']['schedule_type']== "Once":
            #                         # if trigger['trigger_data']['date'] == str(datetime.now().strftime("%d/%m/%Y")):
            #                             if trigger['trigger_data']:
            #                                 device_list= BmsDeviceInformation.objects.filter(id=int(trigger['trigger_data']['device_id']),is_deleted="No")
            #                                 device_informations = BmsDeviceInformationSerializerPost(device_list,many=True)
            #                                 for device in device_informations.data:
                                               
            #                                     if trigger['trigger_data']['operation_type']=="on":
            #                                         param =  {"device_id": int(device['device_informations']['device_id']),
            #                                                     "channel_id": int(device['device_informations']['channel_id']),
            #                                                     "device_status":"true",
            #                                                     # "delay_second":10,
            #                                                     }
            #                                         relay_opr(param)
            #                                         ScenePerform =  BmsSceneAppliancesDetails.objects.filter(scene=int(trigger['scene']['id']),is_deleted="No")                                               
            #                                         SencesSerializersData= SencesSerializers(ScenePerform,many=True)
            #                                         for ScenePerform in SencesSerializersData.data:
            #                                             device_list= BmsDeviceInformation.objects.filter(id=int(ScenePerform['component_id']),is_deleted="No")
            #                                             device_informations = BmsDeviceInformationSerializerPost(device_list,many=True)
            #                                             if ScenePerform['operation_type'] =='on':
            #                                                 for device in device_informations.data:
            #                                                     if trigger['trigger_data']['operation_type']=="on":
            #                                                         param =  {"device_id": int(device['device_informations']['device_id']),
            #                                                                     "channel_id": int(device['device_informations']['channel_id']),
            #                                                                     "device_status":"true",
            #                                                                     # "delay_second":10,
            #                                                                     }
            #                                                         relay_opr(param)
            #                                             if ScenePerform['operation_type'] =='off':
            #                                                 for device in device_informations.data:
            #                                                     if trigger['trigger_data']['operation_type']=="on":
            #                                                         param =  {"device_id": int(device['device_informations']['device_id']),
            #                                                                     "channel_id": int(device['device_informations']['channel_id']),
            #                                                                     "device_status":"false",
            #                                                                     # "delay_second":10,
            #                                                                     }
            #                                                         relay_opr(param)
                                                        

            #                                     if trigger['trigger_data']['operation_type']=="off":
            #                                         param =  {"device_id": int(device['device_informations']['device_id']),
            #                                                     "channel_id": int(device['device_informations']['channel_id']),
            #                                                     "device_status":"false",
            #                                                     # "delay_second":10,
            #                                                     }
            #                                         relay_opr(param)
            #                                         ScenePerform =  BmsSceneAppliancesDetails.objects.filter(scene=int(trigger['scene']['id']),is_deleted="No")                                               
            #                                         SencesSerializersData= SencesSerializers(ScenePerform,many=True)
            #                                         for ScenePerform in SencesSerializersData.data:
            #                                             print(ScenePerform['component_id'])
            #                                             device_list= BmsDeviceInformation.objects.filter(id=int(ScenePerform['component_id']),is_deleted="No")
            #                                             device_informations = BmsDeviceInformationSerializerPost(device_list,many=True)
            #                                             if ScenePerform['operation_type'] =='on':
            #                                                 for device in device_informations.data:
            #                                                     if trigger['trigger_data']['operation_type']=="on":
            #                                                         param =  {"device_id": int(device['device_informations']['device_id']),
            #                                                                     "channel_id": int(device['device_informations']['channel_id']),
            #                                                                     "device_status":"true",
            #                                                                     # "delay_second":10,
            #                                                                     }
            #                                                         relay_opr(param)
            #                                             if ScenePerform['operation_type'] =='off':
            #                                                 for device in device_informations.data:
            #                                                     if trigger['trigger_data']['operation_type']=="on":
            #                                                         param =  {"device_id": int(device['device_informations']['device_id']),
            #                                                                     "channel_id": int(device['device_informations']['channel_id']),
            #                                                                     "device_status":"false",
            #                                                                     # "delay_second":10,
            #                                                                     }
            #                                                         relay_opr(param)

                    
# def job():
#     print("I'm working...")
# schedule.every().day.at("13:56").do(job).tag('once').tag('15-Jun-2023') # onces


# # schedule.every().day.at("13:01", "Asia/Kolkata").do(job)  

# def job_with_argument(name):
#     print(f"I am {name}")


def check_schedule():
    schedule.every().minute.at(":01").do(trigger_schedule)
    # schedule.every(1).minutes.do(self.time_check)
    while True:
        schedule.run_pending()
        time.sleep(0.5)


def triggerEvent(id,opr):
    print("trigger _id",id)
    print("trigger _action",opr)
    bms_module = BmsTriggers.objects.filter(trigger_data__device_id=id,trigger_data__operation_type=opr,is_deleted="No")
    # print("i m done")
    trigger_data = BmsTriggerSerializersSchedules(bms_module,many=True)
    for trigger in trigger_data.data:
        if trigger['status'] == "Active":
            if trigger['action_type'] == "event":
                            # if trigger['trigger_data']['schedule_type']== "Once":
                                # if trigger['trigger_data']['date'] == str(datetime.now().strftime("%d/%m/%Y")):
                                    if trigger['trigger_data']:
                                        device_list= BmsDeviceInformation.objects.filter(id=int(trigger['trigger_data']['device_id']),is_deleted="No")
                                        device_informations = BmsDeviceInformationSerializerPost(device_list,many=True)
                                        for device in device_informations.data:
                                            # print("hello")
                                            if trigger['trigger_data']['operation_type']== "on":
                                                param =  {"device_id": int(device['device_informations']['device_id']),
                                                            "channel_id": int(device['device_informations']['channel_id']),
                                                            "device_status":"true",
                                                            # "delay_second":10,
                                                            }
                                                print(param)
                                                relay_opr(param)
                                                ScenePerform =  BmsSceneAppliancesDetails.objects.filter(scene=int(trigger['scene']['id']),is_deleted="No")                                               
                                                SencesSerializersData= SencesSerializers(ScenePerform,many=True)
                                                for ScenePerform in SencesSerializersData.data:
                                                    device_list= BmsDeviceInformation.objects.filter(id=int(ScenePerform['component_id']),is_deleted="No")
                                                    device_informations = BmsDeviceInformationSerializerPost(device_list,many=True)
                                                    if ScenePerform['operation_type'] =='on':
                                                        for device in device_informations.data:
                                                            # if trigger['trigger_data']['operation_type']=="on":
                                                                param =  {"device_id": int(device['device_informations']['device_id']),
                                                                            "channel_id": int(device['device_informations']['channel_id']),
                                                                            "device_status":"true",
                                                                            # "delay_second":10,
                                                                            }
                                                                print(param)
                                                                relay_opr(param)
                                                    if ScenePerform['operation_type'] == 'off':
                                                        for device in device_informations.data:
                                                            # if trigger['trigger_data']['operation_type']=="on":
                                                                param =  {"device_id": int(device['device_informations']['device_id']),
                                                                            "channel_id": int(device['device_informations']['channel_id']),
                                                                            "device_status":"false",
                                                                            # "delay_second":10,
                                                                            }
                                                                print(param)
                                                                relay_opr(param)
                                                    time.sleep(1)     

                                            if trigger['trigger_data']['operation_type']== "off":
                                                param =  {"device_id": int(device['device_informations']['device_id']),
                                                            "channel_id": int(device['device_informations']['channel_id']),
                                                            "device_status":"false",
                                                            # "delay_second":10,
                                                            }
                                                print(param)
                                                relay_opr(param)
                                                ScenePerform =  BmsSceneAppliancesDetails.objects.filter(scene=int(trigger['scene']['id']),is_deleted="No")                                               
                                                SencesSerializersData= SencesSerializers(ScenePerform,many=True)
                                                for ScenePerform in SencesSerializersData.data:
                                                    print(ScenePerform['component_id'])
                                                    device_list= BmsDeviceInformation.objects.filter(id=int(ScenePerform['component_id']),is_deleted="No")
                                                    device_informations = BmsDeviceInformationSerializerPost(device_list,many=True)
                                                    if ScenePerform['operation_type'] =='on':
                                                        for device in device_informations.data:
                                                            # if trigger['trigger_data']['operation_type']=="on":
                                                                param =  {"device_id": int(device['device_informations']['device_id']),
                                                                            "channel_id": int(device['device_informations']['channel_id']),
                                                                            "device_status":"true",
                                                                            # "delay_second":10,
                                                                            }
                                                                print(param)
                                                                relay_opr(param)
                                                    if ScenePerform['operation_type'] =='off':
                                                        for device in device_informations.data:
                                                            # if trigger['trigger_data']['operation_type']=="on":
                                                                param =  {"device_id": int(device['device_informations']['device_id']),
                                                                            "channel_id": int(device['device_informations']['channel_id']),
                                                                            "device_status":"false",
                                                                            # "delay_second":10,
                                                                            }
                                                                print(param)
                                                                relay_opr(param)

                                                    time.sleep(1)




                                                         
                                                         





                                        # ScenePerform =  BmsSceneAppliancesDetails.objects.filter(scene=int(trigger['scene']['id']))                                               
                                        # SencesSerializersData= SencesSerializers(ScenePerform,many=True)
                                        # for ScenePerform in SencesSerializersData.data:
                                        #         print(ScenePerform)
                                        #         device_list= BmsDeviceInformation.objects.filter(id=int(trigger['trigger_data']['device_id']))
                                        #         device_informations = BmsDeviceInformationSerializerPost(device_list,many=True)
                                        #         for device in device_informations.data:
                                        #                 if ScenePerform['device_type_slug']=="LED":
                                        #                 # param = (i['device_informations'])
                                        #                     if ScenePerform['operation_type']=="on":
                                        #                         param =  {"device_id": int(device['device_informations']['device_id']),
                                        #                                     "channel_id": int(device['device_informations']['channel_id']),
                                        #                                     "device_status":"true",
                                        #                                     # "delay_second":10,
                                        #                                     }
                                        #                         relay_opr(param)
                                        #                         device_list= BmsDeviceInformation.objects.filter(id=int(ScenePerform['component_id']))
                                        #                         device_informations = BmsDeviceInformationSerializerPost(device_list,many=True)
                                        #                         param =  {"device_id": int(device['device_informations']['device_id']),
                                        #                                     "channel_id": int(device['device_informations']['channel_id']),
                                        #                                     "device_status":"true",
                                        #                                     # "delay_second":10,
                                        #                                     }
                                        #                         relay_opr(param)
                                                                
                                                 

                                        # print(i['scene']['id'])
                                        

                                       
                                           


                                                #     if ScenePerform['operation_type']=="off":
                                                #         param =  {"device_id": int(device['device_informations']['device_id']),
                                                #                     "channel_id": int(device['device_informations']['channel_id']),
                                                #                     "device_status":"false",
                                                #                     # "delay_second":10,
                                                #                     }
                                                #         relay_opr(param) 

                                                # if ScenePerform['device_type_slug']=="AC":
                                                #     if ScenePerform['operation_type']=="on":
                                                #         # print("hey")
                                                #         # print(ScenePerform['operation_value'])
                                                #         if ScenePerform['operation_value']:
                                                #             # print(device['device_informations']['device_status'])
                                                #             # if device['device_informations']['device_status'] == "true":
                                                #                 param = {
                                                #                         "ip":  str(device['device_informations']['ip']),
                                                #                         "port": str(device['device_informations']['port']),
                                                #                         "device_id": str(device['device_informations']['device_id']),
                                                #                         "channel_id": str(device['device_informations']['channel_id']),
                                                #                         "ac_temp": str(ScenePerform['operation_value']),
                                                #                         "rm_temp": str(device['device_informations']['rm_temp']),
                                                #                         "mode": str(device['device_informations']['mode']),  
                                                #                         "swing": str(device['device_informations']['swing']),
                                                #                         "fspeed": str(device['device_informations']['fspeed']),
                                                #                         "device_status":"true"}
                                                #                 CoolMaster_opr(param)

                                                #     if ScenePerform['operation_type']=="off":
                                                #         # print("hey")
                                                #         # print(ScenePerform['operation_value'])
                                                #         if ScenePerform['operation_value']:
                                                #             # print(device['device_informations']['device_status'])
                                                #             # if device['device_informations']['device_status'] == "true":
                                                #                 param = {
                                                #                         "ip":  str(device['device_informations']['ip']),
                                                #                         "port": str(device['device_informations']['port']),
                                                #                         "device_id": str(device['device_informations']['device_id']),
                                                #                         "channel_id": str(device['device_informations']['channel_id']),
                                                #                         "ac_temp": str(ScenePerform['operation_value']),
                                                #                         "rm_temp": str(device['device_informations']['rm_temp']),
                                                #                         "mode": str(device['device_informations']['mode']),  
                                                #                         "swing": str(device['device_informations']['swing']),
                                                #                         "fspeed": str(device['device_informations']['fspeed']),
                                                #                         "device_status":"false"}
                                                #                 CoolMaster_opr(param)






# schedule.every(1).seconds.do(job)
# schedule.every(10).minutes.do(job)
# schedule.every().hour.do(job)
# schedule.every().day.at("10:30").do(job) #daily
# schedule.every(5).to(10).minutes.do(job)
# schedule.every().monday.do(job)
# schedule.every().wednesday.at("13:15").do(job)
# schedule.every().minute.at(":17").do(job)



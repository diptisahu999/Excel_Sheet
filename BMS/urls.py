from django.contrib import admin
import json
from django.urls import path, include
import threading ,time
from socket import *
# import socket
import requests
import json
from Authenticate import views
import public_ip as ip
from django.shortcuts import render
from getmac import get_mac_address as gma
from Device.device_status import getUserAreaCardList
from django.conf import settings
from django.conf.urls.static import static
from Device.Schedule import check_schedule
from Device.Schedule import trigger_schedule
from Device.Schedule import triggerEvent
from Device.models import *
from Device.serializers import *
from Device.Tis_Listener import main_update
# from GreenBuildingManagement.views import greenBuilding

from dump.database import get_devices_status
loads= json.dumps('init.json')

# getUserAreaCardList

try:
    s = socket(AF_INET,SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    ip_address = (s.getsockname()[0])
    # print("my public ip: ",ip.get())
    # macaddr = gma().upper()
    # url = "http://bms.bi-team.in/api/licenseKeyStored"
    # headers = {'Content-type': 'application/json', 'Accept': '*/*','Connection':'keep-alive','Accept-Encoding':'gzip, deflate, br','User-Agent':'PostmanRuntime/7.32.2',"Access-Control-Allow-Origin":''}
    # get_auth_token= {
    # "license_key":"BI25052023",
    # "mac_address":str(macaddr),
    # "ip_address":str(ip_address),
    # }
    # t = requests.post(url, json=get_auth_token ,headers = headers)
    # res = json.loads(t.text)
    # print(res['status'])
    s=socket(AF_INET, SOCK_DGRAM)
    s.setsockopt(SOL_SOCKET, SO_BROADCAST, 1)
    m=socket(AF_INET, SOCK_DGRAM)
    m.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)
    m.bind(('0.0.0.0', 6000))
except:
    print ("Socket Error")


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('Authenticate.urls')),
    path('', include('Device.urls')),
    # path('',include('Inventory.urls')),
    path('', include('Camera.urls')),
    path('', include('TrueImage.urls')),
    path('', include('Visitor.urls')),
    path('', include('GreenBuildingManagement.urls')),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# def get_user_area_card_list_thread():
#     while True:
#         user_id = 3
#         getUserAreaCardList(user_id)
#         time.sleep(1)

# status = threading.Thread(target=get_user_area_card_list_thread)
# status.start()
# while True:
#     # Wait for 1 second
#     time.sleep(1)

#     # Check if the thread is still alive
#     if not status.is_alive():
#         # If the thread has completed, start it again
#         status = threading.Thread(target=get_user_area_card_list_thread)
#         status.start()

# print(myip)
# def index(request):
#     if request.method == 'POST':
#         input_text = request.POST.get('input-text')
#         print(input_text)
#         url = "http://tracker.bi-team.in/api/index.php"
#         headers = {'Content-type': 'application/json', 'Accept': '*/*', 'Connection': 'keep-alive',
#                    'Accept-Encoding': 'gzip, deflate, br', 'User-Agent': 'PostmanRuntime/7.32.2', "Access-Control-Allow-Origin": ''}
#         get_auth_token = {
#             "user_id": '2',
#             "license_key": str(input_text),
#             "mac_address": str(macaddr),
#             "ip_address": str(ip.get()),
#             "action": 'add_license_information'
#         }
#         t = requests.post(url, json=get_auth_token, headers=headers)
#         res = json.loads(t.text)
#         if res['status'] == "True":
#             urlpatterns =[]
#             url_list = [path('', include('Authenticate.urls')),
#                         path('', include('Device.urls')),]
#             for i in url_list:
#                 urlpatterns.append(i)
#             my_variable = "Login Succesfully"
#             return render(request, 'loginSuccess.html', {'my_variable': my_variable})

#         else:
#             my_variable = "Login Unsuccesfull"
#             urlpatterns = [
#                         path('', index, name ='index'),]
#             return render(request, 'Loginfail.html', {'my_variable': my_variable})

#         # Do something with the input_text value
#     return render(request, 'index.html')


# device_control.main_config()
# jsonUpdator = threading.Thread(target=device_control.client_main_config())
# jsonUpdator.start()
# device_control.client_main_config()
# threading.Thread(target=device_status.getDeviceStatus())

# device_status.getDeviceStatus()


# # triggerEvent()
# triggerDevice= []

# def trigerDeviceListGet():
#     triggerDevice= []
#     bms_module = BmsTriggers.objects.all()
#     trigger_data = BmsTriggerSerializersSchedules(bms_module,many=True)
#     for trigger in trigger_data.data:
#         if trigger['status'] == "Active":
#             if trigger['action_type'] == "event":
#                 triggerDevice.append(trigger['trigger_data']['device_id'])
#     return triggerDevice

# triggerDevice = trigerDeviceListGet()
# print(triggerDevice)

# check_schedules = threading.Thread(target=main_update) 
# check_schedules.start()


# check_schedules = threading.Thread(target=check_schedule) 
# check_schedules.start()


# check_schedules = threading.Thread(target=get_devices_status) 
# check_schedules.start()


# check_schedules = threading.Thread(target=updatedate) 
# check_schedules.start()


# check_schedules = threading.Thread(target=greenBuilding) 
# check_schedules.start()


# def schedule_greenBuilding():
#     while True:
#         greenBuilding()
#         # Wait for 15 minutes (900 seconds) before calling the function again
#         time.sleep(3600)

# # Start the thread
# check_schedules = threading.Thread(target=schedule_greenBuilding)
# check_schedules.start()
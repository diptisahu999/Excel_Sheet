
from Device.models import *
from Device.serializers import *
from rest_framework.response import Response 
from rest_framework.decorators import api_view
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser 
from rest_framework import status
# from django.http.response import StreamingHttpResponse
# from Device.device_control import client_main_config
from django.http import HttpResponse
# from Device.camera import LiveWebCam
import requests
from Authenticate.serializers import *
from django.db.models import Q


# import cv2

# # maskNet = load_model(os.path.join(settings.BASE_DIR,'face_detector/mask_detector.model'))

# class LiveWebCam(object):
# 	def __init__(self):
# 		self.url = cv2.VideoCapture("rtsp://admin:Admin@1234@192.168.1.248/cam/realmonitor?channel=1&subtype=1&authbasic=YWRtaW46QWRtaW4lNDAxMjM0")

# 	def __del__(self):
# 		cv2.destroyAllWindows()

# 	def get_frame(self):
# 		success,imgNp = self.url.read()
# 		resize = cv2.resize(imgNp, (640, 480), interpolation = cv2.INTER_LINEAR) 
# 		ret, jpeg = cv2.imencode('.jpg', resize)
# 		return jpeg.tobytes()

# building crud


# building crud
@api_view(['GET', 'POST', 'DELETE'])
def building_list(request):
    if request.method == 'GET':
        building = BmsBuildingMaster.objects.filter(is_deleted="No")
        building_serializer = ProfileSerializer(building, many=True)

        # Exclude floor_data with is_deleted='Yes'
        for building_data in building_serializer.data:
            building_data['floor_data'] = [
                floor_data for floor_data in building_data['floor_data']
                if floor_data['is_deleted'] == 'No'
            ]
            for floor_data in building_data['floor_data']:
                floor_data['areas_data'] = [
                    area_data for area_data in floor_data['areas_data']
                    if area_data['is_deleted'] == 'No'
                ]
                for area_data in floor_data['areas_data']:
                    area_data['sub_areas_data'] = [
                        sub_area_data for sub_area_data in area_data['sub_areas_data']
                        if sub_area_data['is_deleted'] == 'No'
                    ]

        return Response({
            "data": "true",
            "status_code": 200,
            "message": "Building Lists",
            "response": building_serializer.data
        }, status=status.HTTP_200_OK)
        
        
        
    # elif request.method == 'POST':    
    #     building_serializer = BmsBuildingMasterSerializer(data=request.data)
    #     if building_serializer.is_valid(): 
    #         building_serializer.save()
    #         return Response({"data":"true","status_code": 200, "message": "Building Added Successfully", "response":building_serializer.data})
    #     return Response({"status_code":401,"responce":building_serializer.errors},status=status.HTTP_400_BAD_REQUEST)
    
    # elif request.method == 'DELETE':
    #     count = BmsBuildingMaster.objects.all().delete()
    #     return Response({'message': '{} Building Deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)    
    
    
    elif request.method == 'POST':
        role_serializer = BmsBuildingMasterSerializerPost(data=request.data)
        if role_serializer.is_valid():
            tower_name = role_serializer.validated_data.get('tower_name')
            
            # Check if a role with the same name already exists
            if BmsBuildingMaster.objects.filter(tower_name=tower_name,is_deleted="No").exists():
                return Response({
                    "status_code": 400,
                    "message": "Building with the same name already exists."
                },status=status.HTTP_400_BAD_REQUEST)
            
            role_serializer.save()
            return Response({
                "data": "true",
                "status_code": 200,
                "message": "Building Added Successfully!!",
                "response": role_serializer.data
            },status=status.HTTP_201_CREATED)
        
        return Response({
            "status_code": 400,
            "response": role_serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
        
        
                                                                                                                                                                                                                            
@api_view(['GET', 'PUT', 'DELETE'])
def buildings(request, pk):
    try: 
        building = BmsBuildingMaster.objects.get(pk=pk) 
    except BmsBuildingMaster.DoesNotExist: 
        return Response({'message': 'Building does not exist'}, status=status.HTTP_404_NOT_FOUND) 
    
    if request.method == 'GET': 
        building_serializer = ProfileSerializer(building)
        return Response({"data":"true","status_code": 200, "message": "Get data Successfully", "response":building_serializer.data},status=status.HTTP_200_OK) 
 
    elif request.method == 'PUT':  
        building_serializer = BmsBuildingMasterSerializerPost(building, data=request.data) 
        if building_serializer.is_valid(): 
            building_serializer.save() 
            return Response({"data":"true","status_code": 200, "message": "Building Updated Successfully", "response":building_serializer.data})
            
        return Response({"status_code":401,"responce":building_serializer.errors},status=status.HTTP_400_BAD_REQUEST) 
 
    elif request.method == 'DELETE': 
        building.delete() 
        return Response({'message': 'Building was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)

# Bms_floor_master crud

@api_view(['GET', 'POST', 'DELETE'])
def floor_list(request):
    if request.method == 'GET':
        
        # Floors = BmsFloorMaster.objects.filter(tower_data__is_deleted="No",is_deleted="No")
        Floors=BmsFloorMaster.objects.filter(Q(tower_data__is_deleted="No") & Q(is_deleted="No"))
        Floors_serializer = BmsFloorMasterSerializer(Floors, many=True,read_only=True)
        return Response({"data":"true","status_code": 200, "message": "Floor Lists", "response":Floors_serializer.data},status=status.HTTP_200_OK)
              
    elif request.method == 'POST':
       
        data = request.data
        tower_ids = data['tower_id']
        for tower_id in tower_ids:
            tower = dict(data)
            tower.update({'tower_data': tower_id})
            print(tower)
            if BmsFloorMaster.objects.filter(floor_name=data['floor_name'],tower_data__id=tower['tower_data'],is_deleted="No").exists():
                continue
            
            serializer = BmsFloorMasterSerializerPost(data=tower)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
         
        return Response({'data': 'true', 'status_code': 200, 'message': 'Floor added successfully'},status=status.HTTP_201_CREATED)
    
    # elif request.method == 'DELETE':
    #     count = BmsFloorMaster.objects.all().delete()
    #     return Response({'message': '{} Floor was deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)    




@api_view(['GET', 'PUT', 'DELETE'])
def floor_details(request, pk):
    try: 
        Floors = BmsFloorMaster.objects.get(pk=pk) 
    except BmsFloorMaster.DoesNotExist: 
        return Response({'message': 'Floor does not exist'}, status=status.HTTP_404_NOT_FOUND) 
 
    if request.method == 'GET': 
        Floors_serializer = BmsFloorMasterSerializer(Floors) 
        return Response({"data":"true","status_code": 200, "message": "Get data Successfully", "response":Floors_serializer.data},status=status.HTTP_200_OK) 
 
    elif request.method == 'PUT': 
        data = request.data
        try:
             data['tower_data'] = data['tower_id']
        except: 
            pass
        Floors_serializer = BmsFloorMasterSerializerPost(Floors, data=request.data) 

        if Floors_serializer.is_valid(): 
            Floors_serializer.save() 
            return Response({"data":"true","status_code": 200, "message": "Floor Updated Successfully", "response":Floors_serializer.data})
            
        return Response({"status_code":401,"responce":Floors_serializer.errors},status=status.HTTP_400_BAD_REQUEST) 
 
    elif request.method == 'DELETE': 
        Floors.delete() 
        return Response({'message': 'Floor was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)





#Bms_Deperament_master crud


@api_view(['GET', 'POST', 'DELETE'])
def department_list(request):
    if request.method == 'GET':
        department = BmsDepartmentMaster.objects.all()
        department_serializer =  BmsDepartmentMasterSerializer(department, many=True)
        return Response({"data":"true","status_code": 200, "message": "Department lists", "response":department_serializer.data},status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        department_serializer = BmsDepartmentMasterSerializerPost(data=request.data)
        if department_serializer.is_valid():
            department_serializer.save()
            return Response({"data":"true","status_code": 200, "message": "Department Added Successfully", "response":department_serializer.data}) 
        return Response({"status_code":401,"responce":department_serializer.errors},status=status.HTTP_400_BAD_REQUEST)
    
    # elif request.method == 'DELETE':
    #     count =  BmsDepartmentMaster.objects.all().delete()
    #     return Response({'message': '{} Department was deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)    




@api_view(['GET', 'PUT', 'DELETE'])
def department(request, pk):
    try: 
        departments = BmsDepartmentMaster.objects.get(pk=pk) 
    except BmsDepartmentMaster.DoesNotExist: 
        return Response({'message': 'The Department does not exist'}, status=status.HTTP_404_NOT_FOUND) 
 
    if request.method == 'GET': 
        departments_serializer =  BmsDepartmentMasterSerializer(departments) 
        return Response({"data":"true","status_code": 200, "message": "Get data Successfully", "response":departments_serializer.data},status=status.HTTP_200_OK) 
 
    elif request.method == 'PUT':  
        departments_serializer = BmsDepartmentMasterSerializerPost(departments, data=request.data) 
        if departments_serializer.is_valid(): 
            departments_serializer.save() 
            return Response({"data":"true","status_code": 200, "message": "Department Update Successfully", "response":departments_serializer.data})
            
        return Response({"status_code":401,"responce":departments_serializer.errors},status=status.HTTP_400_BAD_REQUEST) 
 
    elif request.method == 'DELETE': 
        departments.delete() 
        return Response({'message': 'Department was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT) 
    
    
# Bms_sub_area_master crud

@api_view(['GET', 'POST', 'DELETE'])
def bms_sub_area_list(request):
    if request.method == 'GET':
        # subare=BmsSubAreaMaster.objects.all()
        subare = BmsSubAreaMaster.objects.filter(is_deleted="No",area_data__is_deleted="No",area_data__floor_data__is_deleted="No",area_data__floor_data__tower_data__is_deleted="No")
        subarea_serializer = BmsSubAreaMasterSerializer(subare, many=True)
        return Response({"data":"true","status_code": 200, "message": "Sub Area Lists", "response":subarea_serializer.data},status=status.HTTP_200_OK)
        
        
    elif request.method == 'POST':
        
        data = request.data
        print(data)
        try:
            # data['devices_id'] = data.pop('devices_details')
            data['devices_details'] = data.pop('devices_id')
        except:
            pass
            # return Response({"data":"true","status_code": 405, "message": "device_id does not exist"})
        Floor_ids = data['area_id']
        # print(Floor_ids)
        for Floor_id in Floor_ids:
            floor = dict(data)
            floor.update({'area_data': Floor_id})
            # print(floor)
            if BmsSubAreaMaster.objects.filter(sub_area_name=data['sub_area_name'],area_data__id=floor['area_data'],is_deleted="No").exists():
                # print("test")
                # if BmsFloorMaster.objects.filter(tower_data__id=tower['tower_data'],is_deleted="No").exists():
                return Response({
                    "status_code": 400,
                    "message": "Building with the same name already exists."
                },status=status.HTTP_400_BAD_REQUEST)    
            serializer = BmsSubAreaMasterSerializerPost(data=floor)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({'data': 'true', 'status_code': 200, 'message': 'Sub area added successfully'},status=status.HTTP_201_CREATED) 
        # return Response({"data":"true","status_code": 200, "message": "Building Added Successfully", "response":building_serializer.data})
         
    elif request.method == 'DELETE':
        count = BmsSubAreaMaster.objects.all().delete()
        return Response({'message': '{} Sub Area was deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)    

@api_view(['GET', 'PUT', 'DELETE'])
def bms_sub_area(request, pk):
    try: 
        subarea = BmsSubAreaMaster.objects.get(pk=pk) 
    except BmsSubAreaMaster.DoesNotExist: 
        return Response({'message': 'The Sub Area does not exist'}, status=status.HTTP_404_NOT_FOUND) 
 
    if request.method == 'GET': 
        subarea_serializer =  BmsSubAreaMasterSerializer(subarea) 
        return Response({"data":"true","status_code": 200, "message": "Get data Successfully", "response":subarea_serializer.data},status=status.HTTP_200_OK) 
 
    
    elif request.method == 'PUT': 
        data = request.data
        print(data)
        try:
             data['area_data'] = data['area_id']
        except: 
            pass
        try:
            if  data['remove_device_details'] == []:
                print("iam here")
                Devices_ids = data['devices_details']
                for i in Devices_ids:
                    devices = BmsDeviceInformation.objects.get(pk=i)
                    devices.is_used= 'No'
                    devices.save()
                subarea_serializer = BmsSubAreaMasterSerializerPut(subarea,  data=request.data) 
                if subarea_serializer.is_valid(): 
                    subarea_serializer.save() 
                Floor_ids = data['devices_details']
                for i in Floor_ids:
                    devices = BmsDeviceInformation.objects.get(pk=i)
                    devices.is_used= 'Yes'
                    devices.save()
        except:
            pass
        
                # device_data = {'devices_details': [i]}
            
            # print(subarea_serializer.data)
                # if devices_serializer.is_valid():
                #     devices_serializer.save()
        try:
            if  data['remove_device_details']:
                Floor_ids = data['remove_device_details']
                print("iam here 2")
                for i in Floor_ids:
                    devices = BmsDeviceInformation.objects.get(pk=i)
                    devices.is_used= 'No'
                    devices.save()
                Devices_ids = data['devices_details']
                for i in Devices_ids:
                    devices = BmsDeviceInformation.objects.get(pk=i)
                    devices.is_used= 'No'
                    devices.save()
                subarea_serializer = BmsSubAreaMasterSerializerPut(subarea,  data=request.data) 
                if subarea_serializer.is_valid(): 
                    subarea_serializer.save() 
                for i in Devices_ids:
                    devices = BmsDeviceInformation.objects.get(pk=i)
                    devices.is_used= 'Yes'
                    devices.save()
        except:
            pass
                    
        return Response({"data": "true", "status_code": 200, "message": "Sub Area Update Successfully"},status=status.HTTP_200_OK)
        # except:
        #    return Response({"data": "true", "status_code": 200, "message": subarea_serializer.errors},status=status.HTTP_200_OK)
        # subarea_serializer = BmsSubAreaMasterSerializerPut(subarea, data=request.data) 
        # if subarea_serializer.is_valid(): 
        #     subarea_serializer.save() 
        #     return Response({"data": "true", "status_code": 200, "message": "Sub Area Update Successfully"})

        return Response({"status_code": 401, "response": subarea_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    
    elif request.method == 'DELETE': 
        subarea.delete() 
        return Response({'message': 'Sub Area was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
    
    
    
# Bms_locker crud
    

@api_view(['GET', 'POST', 'DELETE'])
def bms_locker_list(request):
    if request.method == 'GET':
        lockers = BmsLocker.objects.all()
        lockers_serializer = BmsLockerSerializer(lockers, many=True)
        return Response({"data":"true","status_code": 200, "message": "Locker lists", "response":lockers_serializer.data},status=status.HTTP_200_OK)
        
        
        
    elif request.method == 'POST':
        lockers_serializer = BmsLockerSerializerPost(data=request.data)
        if lockers_serializer.is_valid():
            lockers_serializer.save()
            return Response({"data":"true","status_code": 200, "message": "Locker Added Successfully", "response":lockers_serializer.data},status=status.HTTP_201_CREATED)     
        return Response({"status_code":401,"responce":lockers_serializer.errors},status=status.HTTP_400_BAD_REQUEST) 
    
    elif request.method == 'DELETE':
        count = BmsLocker.objects.all().delete()
        return Response({'message': '{} Locker was deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)    




@api_view(['GET', 'PUT', 'DELETE'])
def bms_locker_list_details(request, pk):
    try: 
        lockers = BmsLocker.objects.get(pk=pk) 
    except BmsLocker.DoesNotExist: 
        return Response({'message': 'The Locker does not exist'}, status=status.HTTP_404_NOT_FOUND) 
 
    if request.method == 'GET': 
        lockers_serializer = BmsLockerSerializer(lockers) 
        return Response({"data":"true","status_code": 200, "message": "Get data Successfully", "response":lockers_serializer.data},status=status.HTTP_200_OK) 
 
    elif request.method == 'PUT':
        lockers_serializer = BmsLockerSerializerPost(lockers, data=request.data) 
        if lockers_serializer.is_valid(): 
            lockers_serializer.save() 
            return Response({"data":"true","status_code": 200, "message": "Locker Update Successfully", "response":lockers_serializer.data})
            
        return Response({"status_code":401,"responce":lockers_serializer.errors},status=status.HTTP_400_BAD_REQUEST) 
 
    elif request.method == 'DELETE': 
        lockers.delete() 
        return Response({'message': 'Locker was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)




# Device API LIST

@api_view(['GET', 'POST','DELETE'])
def device_list(request):
    if request.method == 'GET':
        # devices = BmsDeviceInformation.objects.filter(devices_details__is_used="Yes")
        devices = BmsDeviceInformation.objects.filter(is_deleted="No")
        devices_serializer = BmsDeviceInformationSerializer(devices, many=True)
        # return JsonResponse(tutorials_serializer.data, safe=False)
        return Response({"data":"true","status_code": 200, "message": "Device Information Lists", "response":devices_serializer.data},status=status.HTTP_200_OK)       
        
    elif request.method == 'POST':
        devices_serializer = BmsDeviceInformationSerializerPosts(data=request.data)
        if devices_serializer.is_valid():
            devices_serializer.save()
            # print(tutorial_serializer.data)
            return Response({"data":"true","status_code": 200, "message": "Device Information Added Successfully!", "response":devices_serializer.data},status=status.HTTP_201_CREATED) 
        return Response({"status_code":401,"responce":devices_serializer.errors},status=status.HTTP_400_BAD_REQUEST) 
    
    elif request.method == 'DELETE':
        count = BmsDeviceInformation.objects.all().delete()
        return Response({'message': '{} Device information was deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)    
    


@api_view(['GET', 'PUT', 'DELETE'])
def device_list_details(request, pk):
    try: 
        devices = BmsDeviceInformation.objects.get(pk=pk) 
    except BmsDeviceInformation.DoesNotExist: 
        return Response({'message': 'The device information does not exist'}, status=status.HTTP_404_NOT_FOUND) 
 
    if request.method == 'GET': 
        devices_serializer = BmsDeviceInformationSerializer(devices) 
        return Response({"data":"true","status_code": 200, "message": "Get data Successfully", "response":devices_serializer.data},status=status.HTTP_200_OK) 
 
    elif request.method == 'PUT':
        devices_serializer = BmsDeviceInformationSerializerPost(devices, data=request.data) 
        
        if devices_serializer.is_valid(): 
            devices_serializer.save() 
            # client_main_config()
            # return Response({"data":"true","status_code": 200, "message": "Device Information Successfully", "response":devices_serializer.data})
            return Response({"data":"true","status_code": 200, "message": "Device Information Successfully"})
            
        return Response({"status_code":401,"responce":devices_serializer.errors},status=status.HTTP_400_BAD_REQUEST) 
 
    elif request.method == 'DELETE': 
        devices.delete() 
        return Response({'message': 'Device information was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
    

# Area master crud

@api_view(['GET', 'POST', 'DELETE'])
def bms_area_list(request):
    if request.method == 'GET':
        areas = BmsAreaMaster.objects.filter(floor_data__is_deleted="No",floor_data__tower_data__is_deleted='No',is_deleted='No')
        # areas=BmsFloorMaster.objects.filter(Q(floor_data__is_deleted="No") & Q(floor_data__tower_data__is_deleted="No") & Q(is_deleted="No"))
        areas_serializer = BmsAreaMasterSerializer(areas, many=True)
        # return JsonResponse(tutorials_serializer.data, safe=False)
        return Response({"data":"true","status_code": 200, "message": "Area Lists", "response":areas_serializer.data},status=status.HTTP_200_OK)
      
    elif request.method == 'POST':
       
        data = request.data
        area_ids = data['floor_id']
        print(area_ids)
        for area_id in area_ids:
            area = dict(data)
            # tower_ids = data['tower_id']
            area.update({'floor_data': area_id})
            del area['floor_id']
            # area['floor_data'] = area_id
            print(area)
            if BmsAreaMaster.objects.filter(area_name=data['area_name'],floor_data__id=area['floor_data'],is_deleted="No").exists():
                # print("test")
                # if BmsFloorMaster.objects.filter(tower_data__id=tower['tower_data'],is_deleted="No").exists():
                return Response({
                    "status_code": 400,
                    "message": "Building with the same name already exists."
                },status=status.HTTP_400_BAD_REQUEST)
                
            serializer = BmsAreaMasterSerializerPost(data=area)
            if serializer.is_valid():
                serializer.save()
                bms_role = BmsRole.objects.filter(is_deleted="No")
                bms_role_serializer = RoleSerializer(bms_role, many=True)
                existing_role = BmsRole.objects.first()
                all_devices = BmsDeviceInformation.objects.all()
                existing_role.device_data.set(all_devices)

            else:
                bms_role = BmsRole.objects.filter(is_deleted="No")
                bms_role_serializer = RoleSerializer(bms_role, many=True)
                existing_role = BmsRole.objects.first()
                all_devices = BmsDeviceInformation.objects.all()
                existing_role.device_data.set(all_devices)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({'data': 'true', 'status_code': 200, 'message': 'Data added successfully'},status=status.HTTP_201_CREATED)  
        
    # elif request.method == 'POST':
    #     areas_serializer = BmsAreaMasterSerializerPost(data=request.data)
    #     if areas_serializer.is_valid():
    #         areas_serializer.save()
    #         return Response({"data":"true","status_code": 200, "message": "Area Added Successfully", "response":areas_serializer.data})    
    #     return Response({"status_code":401,"responce":areas_serializer.errors},status=status.HTTP_400_BAD_REQUEST) 
    
    # elif request.method == 'DELETE':
    #     count = BmsAreaMaster.objects.all().delete()
    #     return Response({'message': '{} Area were deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)    



@api_view(['GET', 'PUT', 'DELETE'])
def bms_area_list_1(request, pk):
    try: 
        areas = BmsAreaMaster.objects.get(pk=pk) 
    except BmsAreaMaster.DoesNotExist: 
        return Response({'message': 'The area does not exist',"status_code": 404}, status=status.HTTP_404_NOT_FOUND) 
 
    if request.method == 'GET': 
        areas_serializer = BmsAreaMasterSerializer(areas) 
        return Response({"data":"true","status_code": 200, "message": "Get data Successfully", "response":areas_serializer.data},status=status.HTTP_200_OK) 
 
    elif request.method == 'PUT':  
        data = request.data
        try:
             data['floor_data'] = data['floor_id']
        except: 
            pass
        # area_ids = data['floor_id']
        # # print(Floor_ids)
        # for area_id in area_ids:
        #     area = dict(data)
        #     area.update({'floor_data': area_id})
        areas_serializer = BmsAreaMasterSerializerPost(areas, data=request.data)
        if areas_serializer.is_valid(): 
            areas_serializer.save() 
            return Response({"data":"true","status_code": 200, "message": "Area Update Successfully", "response":areas_serializer.data},status=status.HTTP_201_CREATED)
            
        return Response({"status_code":401,"responce":areas_serializer.errors},status=status.HTTP_400_BAD_REQUEST)  
 
    elif request.method == 'DELETE': 
        areas.delete() 
        return Response({'response': 'Area was deleted successfully!',"status_code": 200}, status=status.HTTP_204_NO_CONTENT)
    


# BMS_USER_AREA_CARD_LIST


@api_view(['GET', 'POST', 'DELETE'])
def bms_user_area_card_list(request):
    if request.method == 'GET':

        try:
            data = request.data
            data['user_id']
            # print(data)
        except:
            return Response({"data":"true","status_code": 405, "response": "User Id not found"},status=status.HTTP_400_BAD_REQUEST)

        area_card = BmsUserAreaCardsList.objects.filter(user_data__id=data['user_id'],is_deleted="No")  
        area_card_serializer = BmsUserAreaCardsListSerializer(area_card, many=True)
        # return JsonResponse(tutorials_serializer.data, safe=False)
        return Response({"data":"true","status_code": 200, "message": "User Card Lists", "response":area_card_serializer.data},status=status.HTTP_200_OK)
        
        
    elif request.method == 'POST':
        data=request.data
        # a = input("stop")
        try:
            data['user_data'] = data.pop('user_id')
        except:
            return Response({"data":"true","status_code": 405, "message": "user_id does not exist"})
        # print(data)
        # a = input("hello")
        area_card_serializer = BmsUserAreaCardsListSerializerPost(data=data)
        if area_card_serializer.is_valid():
            area_card_serializer.save()
            return Response({"data":"true","status_code": 200, "message": "Card Added Successfully", "response":area_card_serializer.data},status=status.HTTP_201_CREATED)
            
        return Response({"status_code":401,"responce":area_card_serializer.errors},status=status.HTTP_400_BAD_REQUEST)
    
    # elif request.method == 'DELETE':
    #     count = BmsUserAreaCardsList.objects.all().delete()
    #     return Response({'message': '{} Card was deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)    


#13 june 2023 Changed at 23.31

@api_view(['GET', 'PUT', 'DELETE'])
def bms_user_area_card_list_details(request, pk):
    try: 
        area_card = BmsUserAreaCardsList.objects.get(pk=pk) 
    except BmsUserAreaCardsList.DoesNotExist: 
        return Response({'message': 'The card does not exist',"status_code": 404}, status=status.HTTP_404_NOT_FOUND) 
 
    if request.method == 'GET': 
        area_card_serializer = BmsUserAreaCardsListSerializer(area_card) 
        return Response({"data":"true","status_code": 200, "message": "Get data Successfully", "response":area_card_serializer.data},status=status.HTTP_200_OK) 
 
    elif request.method == 'PUT': 
        data=request.data
        print(data)
        # try:
        #     data['user_data'] = data.pop('user_id')
        # except:
        #     return Response({"data":"true","status_code": 405, "message": "user_id does not exist"})
        area_card_serializer = BmsUserAreaCardsListSerializerPut(area_card, data=data) 
        if area_card_serializer.is_valid(): 
            area_card_serializer.save() 
            return Response({"data":"true","status_code": 200, "message": "Card Update Successfully"})
            
        if 'device_details' in data:
            area_card_serializer=BmsUserAreaCardsListSerializer(area_card)
            data=area_card_serializer.data['device_details']   
            return Response({"data":"true","status_code": 200, "message": "Devices Saved to card Successfully", "response":data})
        
        
        # elif 'used_id' in data:
            
              
            
        return Response({"status_code":401,"responce":area_card_serializer.errors},status=status.HTTP_400_BAD_REQUEST)
 
    elif request.method == 'DELETE': 
        area_card.delete() 
        return Response({'response': 'Card was deleted successfully!',"status_code": 200}, status=status.HTTP_204_NO_CONTENT)
    
    
    
    
    
    
    
 ## bms_device_type_master
    
@api_view(['GET','POST','DELETE'])
def Bms_device_type_master_list(request):
    if request.method=='GET':
        devices=BmsDeviceTypeMaster.objects.all()
        device_serialiser=BmsDeviceTypeMasterSerializer(devices,many=True)
        return Response({"data":"true","status_code": 200, "message": "Device type lists", "response":device_serialiser.data},status=status.HTTP_200_OK)
        
    elif request.method=='POST':
        device_serialisers=BmsDeviceTypeMasterSerializer(data=request.data)
        if device_serialisers.is_valid():
            device_serialisers.save()
            return Response({"data":"true","status_code": 200, "message": "Device type Updated Successfully", "response":device_serialisers.data},status=status.HTTP_201_CREATED)
        else:
            return Response({"status_code":401,"responce":device_serialisers.errors},status=status.HTTP_400_BAD_REQUEST) 
        
    elif request.method=='DELETE':
        count=BmsDeviceTypeMaster.objects.all().delete()
        return Response({'message': '{} device type were deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)
    
    
@api_view(['GET','PUT','DELETE'])
def bms_device_type_master_details(request,self,pk):
    try:
        device=BmsDeviceTypeMaster.objects.get(pk=pk)
    except BmsDeviceTypeMaster.DoesNotExist:
        return Response({'message': 'device type does not exist',"status_code": 404}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method=='GET':
        devicee_serializer=BmsDeviceTypeMasterSerializer(device)
        return Response({"data":"true","status_code": 200, "message": "Get data Successfully", "response":devicee_serializer.data},status=status.HTTP_200_OK)
        
    elif request.method=='PUT':
        device_serializers=BmsDeviceTypeMasterSerializer(device,data=request.data)
        if device_serializers.is_valid():
            device_serializers.save()
            return Response({"data":"true","status_code": 200, "message": "Bulding Updated Successfully", "response":device_serializers.data})      
        return Response({"status_code":401,"responce":device_serializers.errors},status=status.HTTP_400_BAD_REQUEST) 
 
 
    elif request.method=='DELETE':
        device.delete()
        return Response({'response': 'Device type deleted successfully!',"status_code": 200}, status=status.HTTP_204_NO_CONTENT)
    



@api_view(['GET','POST','DELETE'])
# @permission_classes([IsAuthenticated])
def sence_list(request):
    if request.method=='GET':
        sences=BmsScenes.objects.filter(is_deleted='No')
        
        sences_serializers=ProfileSerializerssss(sences,many=True)
        
        return Response({"data":"true","status_code": 200, "message": "scences Lists", "response":sences_serializers.data},status=status.HTTP_200_OK)
    
    
    elif request.method=='POST':
        data = request.data
        # print(data)
        # try:
        #     pk = (data['id'])
        #     print(pk)
        #     # a = input("debug")
        # except:
        #     data = request.data
        # # a= input("debug")
        # if pk:
        #     Scences=BmsSceneAppliancesDetails.objects.filter(scene=int(pk))
        #     Scences.delete()
        #     data = request.data
        #     scene_appliance_details = data['scene_appliance_details']
        #     print(scene_appliance_details)


        #     a = input("heyy")
        #     for i in scene_appliance_details:
        #     # print(i['id'],"loop 1")
        #         BmsSceneAppliancesDetail =BmsSceneAppliancesDetails.objects.get(pk=i['id'])
        #         SceneAppliances = SencesSerializers(BmsSceneAppliancesDetail,data= i)
        #         SceneAppliances.is_valid()
        #         SceneAppliances.save()

        # a = input("debug")


        
        # Scences.delete()

        # try:
        #     data['devices_details'] = data.pop('devices_id')
        # except:
        #     return Response({"data":"true","status_code": 405, "message": "devices_id does not exist"})
        
        sence_serializer=ProfileSerializerssss(data=request.data)
        
        print(sence_serializer)
        
        if sence_serializer.is_valid():
            sence_serializer.save()
            return Response({"data":"true","status_code": 200, "message": "scences added successfully!!!", "response":sence_serializer.data},status=status.HTTP_201_CREATED)
        
        else:
            return Response({"status_code":401,"responce":sence_serializer.errors},status=status.HTTP_400_BAD_REQUEST)
        
        
    # elif request.method=='DELETE':
    #     count=BmsScenes.objects.all().delete()
    #     return Response({'message': '{} scences were deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)
    
    
    
@api_view(['GET','PUT','DELETE'])
# @permission_classes([IsAuthenticated])
def sences_datails(request,pk):
    try:
        sence=BmsScenes.objects.get(pk=pk)
        
    except BmsScenes.DoesNotExist:
        return Response({'message': 'scences does not exist',"status_code": 404}, status=status.HTTP_404_NOT_FOUND)
    
    
    if request.method=='GET':
        scence_serializers=ProfileSerializerssss(sence)
        return Response({"data":"true","status_code": 200, "message": "scences data Successfully", "response":scence_serializers.data},status=status.HTTP_200_OK)
    
    elif request.method=='PUT':
        data = request.data
        print(data)
        try:
            if data['is_deleted']:
                bms_uses_serializer = SceneSerializersPUT(sence, data=data)
                bms_uses_serializer.is_valid()
                bms_uses_serializer.save()
                return Response({"data":"true","status_code": 200, "message": "scences Updated Successfully"},status=status.HTTP_201_CREATED)  
        except:
            pass
        # print(data)
        # a = input("hey")
        # try:
        #     data['devices_details'] = data.pop('devices_id')
        # except:
        #     return Response({"data":"true","status_code": 405, "message": "devices_id does not exist"})
        try:
            if data['id']:
                a = BmsSceneAppliancesDetails.objects.filter(scene=data['id'])
                a.delete()
        except:
            pass
        sences_serializer=ProfileSerializerss(sence,data=request.data)
        # sences_serializer.is_valid()
        # sences_serializer.save()
        # scene_appliance_details = data['scene_appliance_details']
        # print(scene_appliance_details)

        # for i in scene_appliance_details:
        #     # print(i['id'],"loop 1")

        #     BmsSceneAppliancesDetail =BmsSceneAppliancesDetails.objects.get(pk=i['id'])
        #     SceneAppliances = SencesSerializers(BmsSceneAppliancesDetail,data= i)
        #     SceneAppliances.is_valid()
        #     SceneAppliances.save()


        if sences_serializer.is_valid():
            sences_serializer.save()
            return Response({"data":"true","status_code": 200, "message": "scences Updated Successfully"})      
        return Response({"status_code":401,"responce":sences_serializer.errors},status=status.HTTP_400_BAD_REQUEST) 
    
    
    elif request.method=='DELETE':
        sence.delete()
        return Response({'response': 'scences deleted successfully!',"status_code": 200}, status=status.HTTP_204_NO_CONTENT)
    
    
    
@api_view(['GET', 'POST', 'DELETE'])
# @permission_classes([IsAuthenticated])
def trigger(request):
    if request.method == 'GET':
        bms_module = BmsTriggers.objects.filter(is_deleted='No')        
        bms_module_serializer = BmsTriggerSerializers(bms_module, many=True)
        return Response({"data":"true","status_code": 200, "message": "Trigger List ", "response":bms_module_serializer.data},status=status.HTTP_200_OK)
    
 
    elif request.method == 'POST':
        data= request.data
        print(data)
        try:
            data['scene'] = data.pop('scene_id')
        except:
            pass
        #     return Response({"data":"true","status_code": 405, "message": "scene_id does not exist"})

        
        module_serializer = BmsTriggerSerializersPost(data=request.data)
        if module_serializer.is_valid():
            module_serializer.save()
            return Response({"data":"true","status_code": 200, "message": "Trigger Added Sucessfuly!!","response":module_serializer.data},status=status.HTTP_201_CREATED) 
        return Response({"status_code":401,"responce":module_serializer.errors},status=status.HTTP_400_BAD_REQUEST) 
    
    elif request.method == 'DELETE':
        count = BmsTriggers.objects.all().delete()
        return Response({'message': '{} Trigger was deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)
    
    
 
@api_view(['GET', 'PUT', 'DELETE'])
# @permission_classes([IsAuthenticated])
def trigger_details(request, pk):
    try: 
        bms_module = BmsTriggers.objects.get(pk=pk) 
    except BmsTriggers.DoesNotExist: 
        return Response({'message': 'The Trigger does not exist'}, status=status.HTTP_404_NOT_FOUND) 
         
 
    if request.method == 'GET': 
        module_serializer = BmsTriggerSerializers(bms_module) 
        return Response({"data":"true","status_code": 200, "message": "Trigger Get Successfully", "response":module_serializer.data},status=status.HTTP_200_OK)  
 
    elif request.method == 'PUT': 
        data= request.data
        try:
            data['scene_details'] = data.pop('scene_id')
        except:
            # return Response({"data":"true","status_code": 405, "message": "scene_id does not exist"})
            pass

        module_serializer = BmsTriggerSerializersPost(bms_module, data=request.data) 
        if module_serializer.is_valid(): 
            module_serializer.save() 
            return Response({"data":"true","status_code": 200, "message": "Trigger updated Sucessfuly!!"},status=status.HTTP_201_CREATED)
            # return Response({"data":"true","status_code": 200, "message": "Trigger updated Sucessfuly!!","response":module_serializer.data},status=status.HTTP_201_CREATED) 
         
        return Response({"status_code":401,"responce":module_serializer.errors},status=status.HTTP_400_BAD_REQUEST)  
         
 
    elif request.method == 'DELETE': 
        bms_module.delete() 
        return Response({'message': 'Trigger was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
    
    
    
    
## Bms User History

@api_view(['GET', 'POST', 'DELETE'])
# @permission_classes([IsAuthenticated])
def user_history(request):
    if request.method == 'GET':
        bms_history = BmsHistory.objects.all()        
        bms_history_serializer = UserHistorySerializers(bms_history, many=True)
        return Response({"data":"true","status_code": 200, "message": "List ", "response":bms_history_serializer.data},status=status.HTTP_200_OK)
    
 
    elif request.method == 'POST':
        history_serializer = UserHistorySerializers(data=request.data)
        if history_serializer.is_valid():
            history_serializer.save()
            return Response({"data":"true","status_code": 200, "message": "Trigger Added Sucessfuly!!","response":history_serializer.data},status=status.HTTP_201_CREATED) 
        return Response({"status_code":401,"responce":history_serializer.errors},status=status.HTTP_400_BAD_REQUEST) 
    
    # elif request.method == 'DELETE':
    #     count = BmsTriggers.objects.all().delete()
    #     return Response({'message': '{} Trigger was deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)
    
    
    
    
### 08/06/2024



@api_view(['GET', 'POST', 'DELETE'])
# @permission_classes([IsAuthenticated])
def hardware_master(request):
    if request.method == 'GET':
        bms_module = BmsHardwareTypeMaster.objects.filter(is_deleted='No')        
        bms_module_serializer = BmsHardwareTypeMasterSerializers(bms_module, many=True)
        return Response({"data":"true","status_code": 200, "message": "Hardware type Lists ", "response":bms_module_serializer.data},status=status.HTTP_200_OK)
    
 
    elif request.method == 'POST':
        
        module_serializer = BmsHardwareTypeMasterSerializers(data=request.data)
        if module_serializer.is_valid():
            module_serializer.save()
            return Response({"data":"true","status_code": 200, "message": "Hardware type Added Sucessfuly!!","response":module_serializer.data},status=status.HTTP_201_CREATED) 
        return Response({"status_code":401,"responce":module_serializer.errors},status=status.HTTP_400_BAD_REQUEST) 
    
    # elif request.method == 'DELETE':
    #     count = BmsHardwareTypeMaster.objects.all().delete()
    #     return Response({'message': '{} Trigger was deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)
    
    
 
@api_view(['GET', 'PUT', 'DELETE'])
# @permission_classes([IsAuthenticated])
def hardware_type_master(request, pk):
    try: 
        bms_module = BmsHardwareTypeMaster.objects.get(pk=pk) 
    except BmsHardwareTypeMaster.DoesNotExist: 
        return Response({'message': 'The Hardware type does not exist'}, status=status.HTTP_404_NOT_FOUND) 
         
 
    if request.method == 'GET': 
        module_serializer = BmsHardwareTypeMasterSerializers(bms_module) 
        return Response({"data":"true","status_code": 200, "message": "Hardware type Get Successfully", "response":module_serializer.data},status=status.HTTP_200_OK)  
 
    elif request.method == 'PUT': 
        data= request.data
        module_serializer = BmsHardwareTypeMasterSerializersPut(bms_module, data=request.data) 
        if module_serializer.is_valid(): 
            module_serializer.save() 
            return Response({"data":"true","status_code": 200, "message": "Hardware type updated Sucessfuly!!"},status=status.HTTP_201_CREATED)
            # return Response({"data":"true","status_code": 200, "message": "Hardware type updated Sucessfuly!!","response":module_serializer.data},status=status.HTTP_201_CREATED) 
             
        return Response({"status_code":401,"responce":module_serializer.errors},status=status.HTTP_400_BAD_REQUEST)  
         
 
    elif request.method == 'DELETE': 
        bms_module.delete() 
        return Response({'message': 'Hardware type was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
    
    
    
    

@api_view(['GET', 'POST', 'DELETE'])
# @permission_classes([IsAuthenticated])
def hardware_details(request):
    if request.method == 'GET':
        bms_module = BmsHardWareDetails.objects.filter(is_deleted='No')        
        bms_module_serializer = BmsHardWareDetailsSerializers(bms_module, many=True)
        return Response({"data":"true","status_code": 200, "message": "Hardware Details Lists ", "response":bms_module_serializer.data},status=status.HTTP_200_OK)
    
 
    elif request.method == 'POST':
        data = request.data
        try:
            # data['devices_id'] = data.pop('devices_details')
            data['hardware_type'] = data.pop('hardware_type_id')
        except:
            pass
        
        module_serializer = BmsHardWareDetailsSerializersPost(data=request.data)
        if module_serializer.is_valid():
            module_serializer.save()
            return Response({"data":"true","status_code": 200, "message": "Hardware Details Added Sucessfuly!!"},status=status.HTTP_201_CREATED) 
            # return Response({"data":"true","status_code": 200, "message": "Hardware Details Added Sucessfuly!!","response":module_serializer.data},status=status.HTTP_201_CREATED) 
        return Response({"status_code":401,"responce":module_serializer.errors},status=status.HTTP_400_BAD_REQUEST) 
    
    # elif request.method == 'DELETE':
    #     count = BmsHardwareTypeMaster.objects.all().delete()
    #     return Response({'message': '{} Trigger was deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)
    
    
 
@api_view(['GET', 'PUT', 'DELETE'])
# @permission_classes([IsAuthenticated])
def hardware_details_master(request, pk):
    try: 
        bms_module = BmsHardWareDetails.objects.get(pk=pk) 
    except BmsHardWareDetails.DoesNotExist: 
        return Response({'message': 'The Hardware Details does not exist'}, status=status.HTTP_404_NOT_FOUND) 
         
 
    if request.method == 'GET': 
        module_serializer = BmsHardWareDetailsSerializers(bms_module) 
        return Response({"data":"true","status_code": 200, "message": "Hardware Details Get Successfully", "response":module_serializer.data},status=status.HTTP_200_OK)  
 
    elif request.method == 'PUT':  
        data = request.data
        try:
            # data['devices_id'] = data.pop('devices_details')
            data['hardware_type'] = data.pop('hardware_type_id')
        except:
            pass
        module_serializer = BmsHardWareDetailsSerializersPut(bms_module, data=request.data) 
        if module_serializer.is_valid(): 
            module_serializer.save() 
            return Response({"data":"true","status_code": 200, "message": "Hardware Details updated Sucessfuly!!"},status=status.HTTP_201_CREATED) 
            # return Response({"data":"true","status_code": 200, "message": "Hardware Details updated Sucessfuly!!","response":module_serializer.data},status=status.HTTP_201_CREATED) 
        return Response({"status_code":401,"responce":module_serializer.errors},status=status.HTTP_400_BAD_REQUEST)  
         
 
    elif request.method == 'DELETE': 
        bms_module.delete() 
        return Response({'message': 'Hardware Details was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)



@api_view(['PUT'])
# @permission_classes([IsAuthenticated])
def triggerAction(request,pk):
    if request.method == 'PUT':
        try: 
            bms_module = BmsTriggers.objects.get(pk=pk) 
        except BmsTriggers.DoesNotExist: 
            return Response({'message': 'The Trigger does not exist'}, status=status.HTTP_404_NOT_FOUND) 
        #     return Response({"data":"true","status_code": 405, "message": "scene_id does not exist"})

        
        module_serializer = BmsTriggerSerializersPost(bms_module, data=request.data) 

        if module_serializer.is_valid(): 
            module_serializer.save()

            return Response({"data":"true","message": "Event work Successfully "},status=status.HTTP_201_CREATED)
            # return Response({"data":"true","status_code": 200, "message": "Trigger updated Sucessfuly!!","response":module_serializer.data},status=status.HTTP_201_CREATED) 
         
        return Response({"status_code":401,"responce":module_serializer.errors},status=status.HTTP_400_BAD_REQUEST)  
    



@api_view(['GET', 'POST', 'DELETE'])
# @permission_classes([IsAuthenticated])
def bms_history_details(request):
    if request.method == 'GET':
        bms_module = BmsHistoryDetail.objects.all()  
              
        bms_module_serializer = BmsHistoryDetailsSerializers(bms_module, many=True)
        return Response({"data":"true","status_code": 200, "message": "History Details Lists ", "response":bms_module_serializer.data},status=status.HTTP_200_OK)
    
 
    elif request.method == 'POST':
        # data = request.data
        # try:
        #     # data['devices_id'] = data.pop('devices_details')
        #     data['hardware_type'] = data.pop('hardware_type_id')
        # except:
        #     pass
        
        module_serializer = BmsHistoryDetailsSerializers(data=request.data)
        if module_serializer.is_valid():
            module_serializer.save()
            return Response({"data":"true","status_code": 200, "message": "Bms History Details Added Sucessfuly!!"},status=status.HTTP_201_CREATED) 
            # return Response({"data":"true","status_code": 200, "message": "Hardware Details Added Sucessfuly!!","response":module_serializer.data},status=status.HTTP_201_CREATED) 
        return Response({"status_code":401,"responce":module_serializer.errors},status=status.HTTP_400_BAD_REQUEST) 
    
    # elif request.method == 'DELETE':
    #     count = BmsHistoryDetail.objects.all().delete()
    #     return Response({'message': '{} Trigger was deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)





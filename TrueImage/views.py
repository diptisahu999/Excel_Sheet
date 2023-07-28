from django.shortcuts import render
import os
import cv2
import numpy as np
import os.path
from PIL import Image
from itertools import islice
import string
import random
import time
import requests
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response 
from TrueImage.serializers import *
from rest_framework import status
from TrueImage.models import *
from TrueImage.serializers import *
from Device.models import BmsAreaMaster,BmsSubAreaMaster
from TrueImage.CropImage import cropImage

def id_generator(size=6, chars=string.ascii_uppercase + string.digits + string.ascii_lowercase):
    return ''.join(random.choice(chars) for _ in range(size))


def Index(request):
    AreaMasterModel = BmsAreaMaster.objects.all() 
    SubareaMasterModel = BmsSubAreaMaster.objects.all()  # Fetching a single instance for example
    CropAreaModel= CroppedArea.objects.all()

    context = {'area_instance': AreaMasterModel, 
               'subarea_instance': SubareaMasterModel, 
               'crop_instance': CropAreaModel, 
               }
    return render(request, 'testNew.html', context)

def Index2(request):
    AreaMasterModel = BmsAreaMaster.objects.filter(floor_data__is_deleted="No",floor_data__tower_data__is_deleted='No',is_deleted='No')
    SubareaMasterModel = BmsSubAreaMaster.objects.filter(is_deleted="No",area_data__is_deleted="No",area_data__floor_data__is_deleted="No",area_data__floor_data__tower_data__is_deleted="No")  # Fetching a single instance for example
    for subarea_instance in SubareaMasterModel:
        devices_details = subarea_instance.devices_details.all()
    # CropAreaModel= CroppedArea.objects.all()

    context = {'area_instance': AreaMasterModel, 
               'devices_instance': devices_details, 
               "subarea_instance":SubareaMasterModel,
            #    'crop_instance': CropAreaModel, 
               }
    
    # print(request.data)
    return render(request, 'myindex.html', context)

def trueImage(request):
    return render(request, "imagemap.html" )


def MapImage(request):
    return render(request, "mapping.html" )

@api_view(['GET', 'POST', 'DELETE'])
# @permission_classes([IsAuthenticated])
def CropArea_list(request):
    if request.method == 'GET':
        bms_module = CroppedArea.objects.all()  
        MapImage(request)
        bms_module_serializer = CropSerializerGET(bms_module, many=True)
        return Response({"data":"true", "message": "CropArea Lists", "response":bms_module_serializer.data},status=status.HTTP_200_OK)
    
 
    elif request.method == 'POST':
        print(request.data)
        cropImage(request.data)
        return Response({"data":"true", "message": "CropDevice Added Sucessfuly!!"},status=status.HTTP_201_CREATED) 
        # return Response({"responce":module_serializer.errors},status=status.HTTP_400_BAD_REQUEST) 
    
    elif request.method == 'DELETE':
        count = CroppedArea.objects.all().delete()
        return Response({'message': '{} CropArea was deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)
    
    
 
@api_view(['GET', 'PUT', 'DELETE'])
# @permission_classes([IsAuthenticated])
def CropArea_Details(request, pk):
    try: 
        bms_module = CroppedArea.objects.get(pk=pk) 
    except CroppedArea.DoesNotExist: 
        return Response({'message': 'CropArea does not exist'}, status=status.HTTP_404_NOT_FOUND) 
         
 
    if request.method == 'GET': 
        module_serializer = CropSerializerGET(bms_module) 
        return Response({"data":"true","status_code": 200, "message": "CropArea Get Successfully", "response":module_serializer.data},status=status.HTTP_200_OK)  
 
    elif request.method == 'PUT': 
        module_serializer = CropSerializerPost(bms_module, data=request.data) 
        if module_serializer.is_valid(): 
            module_serializer.save() 
            return Response({"data":"true","status_code": 200, "message": "CropArea updated Sucessfuly!!","response":module_serializer.data},status=status.HTTP_201_CREATED) 
        return Response({"status_code":401,"responce":module_serializer.errors},status=status.HTTP_400_BAD_REQUEST)  
         
    elif request.method == 'DELETE': 
        bms_module.delete() 
        return Response({'message': 'CropArea was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)

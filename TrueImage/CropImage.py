from django.core.files import File
from PIL import Image
import cv2
import json
import os 
from Device.models import *
from Device.serializers import * 
import random
import string
import numpy as np
import compileall
from distutils.dir_util import copy_tree
import shutil
from colorama import init
from termcolor import colored
from PIL import Image, ImageDraw
init()
# {'points': [{'x': 5, 'y': 151}, {'x': 217, 'y': 230}, {'x': 206, 'y': 426}, {'x': 3, 'y': 443}], 'isOpened': False}
loads= json.dumps('init.json')

#shape configation for  loaded json with type of shape 

def compileProject(self):
        self.start_copy.setText("")
        self.stop_copy.setText("")
        self.statrt_compile.setText("")
        self.compile_done.setText("")
        self.start_replace.setText("")
        self.replace_done.setText("")

        source_path = self.lineEdit.text()
        project_path = self.project_path.text()

        newdir = os.path.basename(os.path.normpath(project_path))
        path = os.path.join(source_path, newdir)
        os.mkdir(path)

        self.start_copy.setText("1. Start copy project in destination path")
        copy_tree(project_path, path)
        self.stop_copy.setText("2. Copy project in destination path successfully.")

        
        self.statrt_compile.setText("3. Start project compilation.")
        compileall.compile_dir(path, force=True)
        self.compile_done.setText("4. Project compilation successfully.")
        
        def move_pyc(path):
            for i in os.listdir(path):
                if os.path.isdir(os.path.join(path, i)):
                    move_pyc(os.path.join(path, i))
            if os.path.exists(os.path.join(path, '__pycache__')):
                for name in os.listdir(os.path.join(path, '__pycache__')):
                    if(name[-6:-4] == "36"):
                        os.remove(os.path.join(path, '__pycache__', name))
                    if(name[-6:-4] == "37"):
                        os.remove(os.path.join(path, '__pycache__', name))
                    if(name[-6:-4] == "38"):
                        os.remove(os.path.join(path, '__pycache__', name))                    
                    if(name[-6:-4] == "39"):
                        file_name = name.split('.')[0]+'.py'
                        if os.path.exists(os.path.join(path, file_name)):
                            # Delete py files, be careful
                            os.remove(os.path.join(path, file_name))
                        shutil.move(os.path.join(path, '__pycache__', name), os.path.join(
                            path, name.replace('.cpython-39', '')))

                    if(name[-6:-4] != "39" and name[-6:-4] != "38" and name[-6:-4] != "37" and name[-6:-4] != "36"):
                        os.remove(os.path.join(path, '__pycache__', name))

                del_path = os.path.join(path, '__pycache__')
                os.rmdir(del_path)

        move_pyc(path)
        self.replace_done.setText("6. File replacing successfully.")

def generate_random_string(length):
    letters = string.ascii_letters
    random_string = ''.join(random.choice(letters) for _ in range(length))
    return random_string

def crop_image_to_polygon(image_path, polygon_points, output_path):

    image = Image.open(image_path)

    mask = Image.new('L', image.size, 0)

    draw = ImageDraw.Draw(mask)

    draw.polygon(polygon_points, outline=255, fill=255)

    masked_image = Image.new('RGBA', image.size)
    masked_image.paste(image, mask=mask)

    bbox = mask.getbbox()
    cropped_image = masked_image.crop(bbox)
    cropped_image.save(output_path, "PNG")

def cropImage(data):
    data = json.loads(data)
    path = os.getcwd()
    json.dumps(loads)
    print(data)
    onImgPath = str(path + data['OnimageUrl'])
    # D:\BMS\BMS-II-API\CropDeviceImg
    OnImg = onImgPath.replace('\\','/')
    device = data['device_id']
    area = data['areas']
    offImgPath =  data['img']
    all_point = []
    image_index = []
    unique_data1 = []

    
    for coords in area:
        crop_coodrs = coords['coords']
        poly_coords = crop_coodrs['points']
        all_point.append(poly_coords)
        if coords['type'] == 'rectangle':
            if coords['coords']:
                crop_coodrs = coords['coords']
                x = crop_coodrs['x']
                y = crop_coodrs['y']
                width = crop_coodrs['width']
                height = crop_coodrs['height']
                for coords in area:
                    crop_coodrs = coords['coords']
                    x = crop_coodrs['x']
                    y = crop_coodrs['y']
                    width = crop_coodrs['width']
                    height = crop_coodrs['height']
                    if coords['coords'] and crop_coodrs['x'] and crop_coodrs['y']:
                        image = cv2.imread(OnImg)
                        img2 = image[y:y+height, x:x+width]
                        file_name = f'{device}_div{generate_random_string(12)}yesh.png'
                        offImgPath = str(path +"\CropDeviceImg\\"+file_name)
                        OffImg = offImgPath.replace('\\','/')
                        # output_filename = "../CropDeviceImg/"+f"{device}_{generate_random_string(12)}.jpg"
                        cv2.imwrite(OffImg, img2)
            deviceId=  BmsDeviceInformation.objects.get(id=int(device))
            image_file = open(OffImg, 'rb')
            print(image_file)
            requestData= {
                "on_crop_image_path":File(image_file, name= file_name),
                "crop_object":{
                            "selection_area":coords['coords'],
                            "touch_obj": coords['coords']}
                            }
            devices_serializer =  BmsDeviceInformationSerializer(deviceId,requestData)
            if devices_serializer.is_valid(): 
                devices_serializer.save() 
                       
        if coords['type'] == 'polygon':
            
            
            crop_coodrs = coords['coords']
            
            # polygon_coords = crop_coodrs['points']
            file_name = f'{device}_div{generate_random_string(13)}yesh.png'
            offImgPath = str(path +"\CropDeviceImg\\"+file_name)
            OffImg = offImgPath.replace('\\','/')
            # for coords in area:
                
            device_index ={
                "device_id": int(crop_coodrs['device_id']),
                "index": surface_polygon(crop_coodrs['points'])
            }
            image_index.append(device_index)
            if crop_coodrs['points']:
                file_name = f'{device}_div{generate_random_string(13)}yesh.png'
                json.dumps(loads)
                offImgPath = str(path +"\CropDeviceImg\\"+file_name)
                OffImg = offImgPath.replace('\\','/')

            # unique_data = [dict(t) for t in {tuple(d.items()) for d in image_index}]
            # print(unique_data)
            
            image_path = OnImg
            output_filename = OffImg
            converted_coordinates = [(point['x'], point['y']) for point in crop_coodrs['points']]
            # print(polygon_coords)
            crop_image_to_polygon(image_path, converted_coordinates, output_filename)

            deviceId=  BmsDeviceInformation.objects.get(id=int(device))
            image_file = open(OffImg, 'rb')
            least_x = min(coords['coords']['points'], key=lambda item: item['x'])
            least_y = min(coords['coords']['points'], key=lambda item: item['y'])
            poly_coords = {
                "x":least_x['x'],
                "y":least_y['y']
            }
            # all_point.append(poly_coords)

            requestData= {
                "on_crop_image_path":File(image_file, name= file_name),
                "crop_object":{
                            "selection_area":poly_coords,
                            "touch_obj": poly_coords}
                            }
            devices_serializer =  BmsDeviceInformationSerializer(deviceId,requestData)
            if devices_serializer.is_valid(): 
                devices_serializer.save() 
            
        if coords['type'] == 'circle':
            crop_coodrs = coords['coords']
            print(crop_coodrs)
            for coords in area:
                if crop_coodrs['cx']:
                    x = crop_coodrs['cx'] - crop_coodrs["radius"]
                    if crop_coodrs['cy']:
                        y = crop_coodrs['cy'] - crop_coodrs["radius"]
                        if crop_coodrs["radius"]:
                            w = h = crop_coodrs["radius"] * 2
            if crop_coodrs['cx'] and crop_coodrs['cy'] and  crop_coodrs["radius"]:
                x = crop_coodrs['cx'] - crop_coodrs["radius"]
                y = crop_coodrs['cy'] - crop_coodrs["radius"]
                w = h = crop_coodrs["radius"] * 2
                image = cv2.imread(OnImg)
                img2 = image[y:y+h, x:x+w]
                file_name = f'{device}_div{generate_random_string(12)}yesh.png'
                offImgPath = str(path +"\CropDeviceImg\\"+file_name)
                OffImg = offImgPath.replace('\\','/')
                cv2.imwrite(OffImg, img2)
                print(OffImg)

            json.dumps(loads)
            x = crop_coodrs['cx'] - crop_coodrs["radius"]
            y = crop_coodrs['cy'] - crop_coodrs["radius"]
            w = h = crop_coodrs["radius"] * 2
            image = cv2.imread(OnImg)
            img2 = image[y:y+h, x:x+w]
            file_name = f'{device}_div{generate_random_string(12)}yesh.png'
            offImgPath = str(path +"\CropDeviceImg\\"+file_name)
            OffImg = offImgPath.replace('\\','/')
            cv2.imwrite(OffImg, img2)
            print(OffImg)


            deviceId=  BmsDeviceInformation.objects.get(id=int(device))
            image_file = open(OffImg, 'rb')
            print(image_file)
            requestData= {
                "on_crop_image_path":File(image_file, name= file_name),
                "crop_object":{
                            "selection_area":coords['coords'],
                            "touch_obj": coords['coords']}
                            }
            devices_serializer =  BmsDeviceInformationSerializer(deviceId,requestData)
            if devices_serializer.is_valid(): 
                devices_serializer.save() 
    
    
    unique_data = [dict(t) for t in {tuple(d.items()) for d in image_index}]
    max_index = max(unique_data, key=lambda x: x['index'])['index']
    index_counter = 1
    for item in unique_data:
        item['index'] = index_counter
        unique_data1.append(item)
        index_counter += 1
    print(unique_data)
    print(unique_data1)
 
        # return print(f"{coords['type']} Sharpe is successfully Cropped :", requestData)
    
    
        



# least_x = min(polygon_coords, key=lambda item: item['x'])
#     least_y = min(polygon_coords, key=lambda item: item['y'])
# "crop_object": {
#   "selection_area": {
#     "shape_type": "rectangle",
#     "x": 350,
#     "y": 450,
#     "width": "",
#     "height": ""
#   },
#   "touch_area": {
#     "shape_type": "rectangle",
#     "x": 350,
#     "y": 450,
#     "width": "",
#     "height": ""
#   }
# }



    

    # if data['rectangle']:
    #     img_path = 'SubAreasOnImage/46_on_Lounge_9jorek.jpg'
    #     img= Image.open(img_path)
    #     image = cv2.imread(img_path)
        # x = coords['x']
        # y = coords['y']
        # width = coords['width']
        # height = coords['height']
    #     img2 = image[y:y+height, x:x+width]
    #     output_filename = "cropped_image.jpg"
    #     cv2.imwrite(output_filename, img2)


def surface_polygon(points):
    area = 0
    n = len(points)

    for i in range(n):
        x1, y1 = points[i]['x'], points[i]['y']
        x2, y2 = points[(i + 1) % n]['x'], points[(i + 1) % n]['y']
        area += (x1 * y2 - x2 * y1)

    area = abs(area / 2)

    # print("Area:", area)
    return area
a =   {
                    "id": 13,
                    "device_name": "13-Light 3",
                    "crop_image_path": "/static/image/upload_image/3_My_Testing_Room_K5HE8B.png",
                    "moveto": "false",
                    "shape_type": "circle",
                    "isInteractive": "true",
                    "record_id": "3",
                    "real_img_x": 378,
                    "real_img_y": 15,
                    "real_img_r": 49,
                    "real_img_width": 98,
                    "real_img_height": 98,
                    "real_img_mx": "430",
                    "real_img_my": "67"
                  }
import cv2
import numpy as np
import os.path
from PIL import Image
from itertools import islice
import string
import random
import time
def id_generator(size=6, chars=string.ascii_uppercase + string.digits + string.ascii_lowercase):
    return ''.join(random.choice(chars) for _ in range(size))

def cropImage(data):
    # crid = croparea_max_index(data["floor_id"],data['departments_id'],data['subarea_id'])
    rand_string = str(id_generator())
    image_for_crop = str(data["arae_name"]).replace(" ","_")
    image_name = data["record_id"]+"_"+image_for_crop+"_"+rand_string+".png"
    image_name_demo = data["record_id"]+"_"+image_for_crop+"_demo_"+rand_string+".png"
    
    upload_img_path = os.path.dirname(os.path.realpath('static'))+"/static/image/upload_image"
    # path = str(data['img_path']).partition("8090")[2][:-1]
    path_tuple = str(data['img_path']).partition("8090")
    if '8090' in path_tuple:
        img_path = os.path.dirname(os.path.realpath('static'))+str(data['img_path']).partition("8090")[2][:-1]
    else:
        img_path = os.path.dirname(os.path.realpath('static'))+str(data['img_path']).partition("ngrok.io")[2][:-1]
    # img_path = os.path.dirname(os.path.realpath('static'))+str(data['img_path']).partition("8090")[2][:-1]
    interactive_areas = []
    if data["shape_type"]=="polygon":
        if(data["points"] != ''):
            
            points=str(data['points'])
            points_lst = points.split(" ")
        
            while("" in points_lst) :
                points_lst.remove("")

            p_lst = []
            for i in range(len(points_lst)):
                p_lst.append(int(points_lst[i]))

            length_to_split = []
            for i in range(int(len(points_lst))//2):
                # print(i)
                length_to_split.append(2)

            Inputt = iter(p_lst)
            Output = [list(islice(Inputt, elem))
            for elem in length_to_split]


            img = cv2.imread(img_path)
            
            newsize = (data['img_width'], data['img_height'])
            img = cv2.resize(img,newsize)                  
            pts = np.array(Output)
            
            ## (1) Crop the bounding rect
            rect = cv2.boundingRect(pts)
            x,y,w,h = rect
            croped = img[y:y+h, x:x+w].copy()

            ## (2) make mask
            pts = pts - pts.min(axis=0)
            mask = np.zeros(croped.shape[:2], np.uint8)
            cv2.drawContours(mask, [pts], -1, (255, 0, 0, 0), -1, cv2.LINE_AA)
            ## (3) do bit-op
            dst = cv2.bitwise_and(croped, croped, mask=mask)

            cv2.imwrite(upload_img_path+"/"+image_name_demo, dst)
            time.sleep(1)
            img = Image.open(upload_img_path+"/"+image_name_demo)
            rgba = img.convert("RGBA")
            datas = rgba.getdata()

            newData = []
            for item in datas:
                if item[0] == 0 and item[1] == 0 and item[2] == 0: # finding black colour by its RGB value
                    # storing a transparent value when we find a black colour
                    newData.append((255, 255, 255, 0))
                else:
                    newData.append(item) # other colours remain unchanged

            rgba.putdata(newData)
            rgba.save(upload_img_path+"/"+image_name, "PNG")
            time.sleep(1)


            obj = {
                "record_id": data["record_id"],
                "real_img_x":x,
                "real_img_y":y,
                "real_img_width":w,
                "real_img_height":h,
                "real_img_pints":data["points"]
            }
    if data["shape_type"] == "rectangle":
        # print(data)
        img = cv2.imread(img_path)
        x = int(float(data['rect_mx']))
        y= int(float(data['rect_my']))
        w= int(data['rect_width'])
        h= int(data['rect_height'])
        # print("x:",x,"   y:",y,"    w:",w,"     h:",h)
        newsize = (data['img_width'], data['img_height'])
        img = cv2.resize(img,newsize) 
        croped = img[y:y+h, x:x+w]

        cv2.imwrite(upload_img_path+"/"+image_name_demo, croped)
        time.sleep(1)
        img = Image.open(upload_img_path+"/"+image_name_demo)
        rgba = img.convert("RGBA")
        datas = rgba.getdata()

        newData = []
        for item in datas:
            if item[0] == 0 and item[1] == 0 and item[2] == 0: # finding black colour by its RGB value
                # storing a transparent value when we find a black colour
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item) # other colours remain unchanged

        rgba.putdata(newData)
        rgba.save(upload_img_path+"/"+image_name, "PNG")
        time.sleep(1)

        obj = {
                "record_id": data["record_id"],
                "real_img_x":x,
                "real_img_y":y,
                "real_img_width":w,
                "real_img_height":h,
                "real_img_mx":data["rect_mx"],
                "real_img_my":data["rect_my"]
            }

    if data["shape_type"] == "circle":
        img = cv2.imread(img_path,cv2.IMREAD_COLOR)
        x = int(float(data['circle_cx']))
        y= int(float(data['circle_cy']))
        r= int(data['circle_r'])
        # print("x:",x,"   y:",y,"    r:",r)
        x = x-r
        y = y-r
        # print("x:",x,"   y:",y,"    r:",r)
        newsize = (data['img_width'], data['img_height'])


        img = cv2.resize(img,newsize) 
        # crop image as a square
        img = img[y:y+r*2, x:x+r*2]
        # create a mask
        # cv2.imshow("Image Croped",img)
        mask = np.full((img.shape[0], img.shape[1]), 0, dtype=np.uint8) 
        # create circle mask, center, radius, fill color, size of the border
        cv2.circle(mask,(r,r), r, (255,255,255),-1)
        # get only the inside pixels
        fg = cv2.bitwise_or(img, img, mask=mask)

        mask = cv2.bitwise_not(mask)
        background = np.full(img.shape, 0, dtype=np.uint8)
        bk = cv2.bitwise_or(background, background, mask=mask)
        final = cv2.bitwise_or(fg, bk)
        # cv2.imshow('image',final)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()
        cv2.imwrite(upload_img_path+"/"+image_name_demo, final)
        time.sleep(1)
        img = Image.open(upload_img_path+"/"+image_name_demo)
        rgba = img.convert("RGBA")
        datas = rgba.getdata()

        newData = []
        for item in datas:
            if item[0] == 0 and item[1] == 0 and item[2] == 0: # finding black colour by its RGB value
                # storing a transparent value when we find a black colour
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item) # other colours remain unchanged

        rgba.putdata(newData)
        rgba.save(upload_img_path+"/"+image_name, "PNG")
        time.sleep(1)
        
        wh = r + r
        new_x =  int(float(data['circle_cx'])) - int(r)
        new_y = int(float(data['circle_cy'])) - int(r)
        obj = {
                "record_id": data["record_id"],
                "real_img_x":new_x,
                "real_img_y":new_y,
                "real_img_r":r,
                "real_img_width":wh,
                "real_img_height":wh,
                "real_img_mx":data["circle_mx"],
                "real_img_my":data["circle_my"]
            }

    if data["shape_type"] == "ellipse":

        img = cv2.imread(img_path,cv2.IMREAD_COLOR)
        
        rows = int(data['Ellipse_cx'])
        cols = int(data['Ellipse_cy'])
        rx = int(data['Ellipse_rx'])
        ry = int(data['Ellipse_ry'])
        x = int(data['Ellipse_cx'])
        y = int(data['Ellipse_cy'])
        newsize = (data['img_width'], data['img_height'])
        img = cv2.resize(img,newsize) 

        mask = np.zeros_like(img)
        mask =cv2.ellipse(mask, (rows,cols), (rx,ry), 0., 0.,360, (255,255,255),-1)
        result = np.bitwise_and(img,mask)

        x = x-rx
        y = y-ry
        result = result[y:y+ry*2, x:x+rx*2]
        # cv2.imshow("result",result)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()
        cv2.imwrite(upload_img_path+"/"+image_name_demo, result)
        time.sleep(1)
        img = Image.open(upload_img_path+"/"+image_name_demo)
        rgba = img.convert("RGBA")
        datas = rgba.getdata()

        newData = []
        for item in datas:
            if item[0] == 0 and item[1] == 0 and item[2] == 0: # finding black colour by its RGB value
                # storing a transparent value when we find a black colour
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item) # other colours remain unchanged

        rgba.putdata(newData)
        rgba.save(upload_img_path+"/"+image_name, "PNG")
        time.sleep(1)
        hi = ry + ry
        wi = rx + rx
        mx = int(data["Ellipse_cx"]) - int(data["Ellipse_rx"])
        my = int(data["Ellipse_cy"]) - int(data["Ellipse_ry"])
        obj = {
                "record_id": data["record_id"],
                "real_img_x":mx,
                "real_img_y":my,
                "real_img_rx":int(data["Ellipse_rx"]),
                "real_img_ry":int(data["Ellipse_ry"]),
                "real_img_width":wi,
                "real_img_height":hi,
                "real_img_mx":data["Ellipse_mx"],
                "real_img_my":data["Ellipse_my"]
            }
    sub_area_instance = SubArea.objects.get(id=int(data['subarea_id']))
    all_coppped_area = CroppedArea.objects.filter(sub_area__id=int(data['subarea_id'])).order_by('-index_number')
    if all_coppped_area:
        index_number = all_coppped_area[0].index_number+1
    else:
        index_number = 1
    crop_instance = CroppedArea(device_name=data["device_name"],crop_image_path="/static/image/upload_image/"+image_name,moveto=data["moveto"],shape_type=data["shape_type"],isInteractive=data["isInteractive"],crop_object=obj,sub_area=sub_area_instance,index_number=index_number)
    crop_instance.save()
    crop_instance.device_name = str(crop_instance.id)+'-'+data["device_name"]
    crop_instance.save()
    
# 30/01/2023 minesh
def deleteArea(request):
    if request.method != 'POST':
        return HttpResponse(json.dumps({"status": status.HTTP_400_BAD_REQUEST, "data": False, "response": "Method is not allowed.!"}), content_type="application/json")
    sub_area_id = request.POST['area_id']
    devices_instance = Devices.objects.filter(sub_area__id=int(sub_area_id))
    dev_status = False
    scene_device = []
    trigger_device = []
    for dev in devices_instance:
        dev_obj = {
            "record_id":dev.id,
            "device_name":dev.device_name,
            "device_type":dev.device_type,
            "app_type":dev.app_type
        }
    
        final_dev_obj = dev_obj | dev.device_object
        
        # check devices exist or not in scenes and trigger
        exist_in_trigger = Triggers.objects.filter(trigger_object__record_id=int(dev.id)).exists()
        exist_in_scenes = Appliances.objects.filter(devices__id = int(dev.id)).exists()
        
        if exist_in_trigger == True:
            dev_status = True
            trigger_device.append(final_dev_obj)
        elif exist_in_scenes == True:
            dev_status = True
            scene_device.append(final_dev_obj)
            
    if dev_status:
        return HttpResponse(json.dumps({"status": status.HTTP_200_OK, "data": False, "response": "This area has some device which is assigned to scenes or trigger please remove them first.","Devices":{"scene_device":scene_device,"trigger_device":trigger_device}}), content_type="application/json")
    #delete cropped area    
    crop_area_instance = CroppedArea.objects.filter(sub_area__id =str(sub_area_id)).exists()
    if crop_area_instance:
        del_cr_area = CroppedArea.objects.filter(sub_area__id =str(sub_area_id))
        for del_cr in del_cr_area:
            del_cr.delete()
   
    sub_area_instance = SubArea.objects.get(id=int(sub_area_id))
    sub_area_instance.delete()
    return HttpResponse(json.dumps({"status": status.HTTP_200_OK, "data": True, "response": "Area deleted."}), content_type="application/json")

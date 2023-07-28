import cv2
import numpy as np
from PIL import Image
import time

def crop_image_with_polygon(img_path, upload_img_path, image_name_demo, image_name, data):
    points = str(data['points'])
    points_lst = points.split(" ")
    while "" in points_lst:
        points_lst.remove("")

    p_lst = [int(x) for x in points_lst]
    length_to_split = [2] * (len(points_lst) // 2)

    output = [p_lst[i:i + 2] for i in range(0, len(p_lst), 2)]
    pts = np.array(output)

    img = cv2.imread(img_path)
    newsize = (data['img_width'], data['img_height'])
    img = cv2.resize(img, newsize)
    rect = cv2.boundingRect(pts)
    x, y, w, h = rect
    cropped = img[y:y + h, x:x + w].copy()

    pts = pts - pts.min(axis=0)
    mask = np.zeros(cropped.shape[:2], np.uint8)
    cv2.drawContours(mask, [pts], -1, (255, 0, 0, 0), -1, cv2.LINE_AA)
    dst = cv2.bitwise_and(cropped, cropped, mask=mask)

    cv2.imwrite(upload_img_path + "/" + image_name_demo, dst)
    time.sleep(1)

    img = Image.open(upload_img_path + "/" + image_name_demo)
    rgba = img.convert("RGBA")
    datas = rgba.getdata()

    new_data = []
    for item in datas:
        if item[0] == 0 and item[1] == 0 and item[2] == 0: 
            new_data.append((255, 255, 255, 0))  
        else:
            new_data.append(item)  # Other colors remain unchanged

    rgba.putdata(new_data)
    rgba.save(upload_img_path + "/" + image_name, "PNG")
    time.sleep(1)

# 'D:\BMS\BMS-II-API\SubAreaOffImage\\46_off_Lounge_9jorek_HzMQ0UI.jpg'



from PIL import Image, ImageDraw
def crop_image_to_polygon(image_path, polygon_points, output_path):
    # Open the image
    image = Image.open(image_path)

    # Create a blank mask with the same size as the image
    mask = Image.new('L', image.size, 0)

    # Create a draw object
    draw = ImageDraw.Draw(mask)

    # Draw the polygon on the mask
    draw.polygon(polygon_points, outline=255, fill=255)

    # Apply the mask to the image
    masked_image = Image.new('RGBA', image.size)
    masked_image.paste(image, mask=mask)

    # Crop the image to the polygon bounds
    bbox = mask.getbbox()
    cropped_image = masked_image.crop(bbox)

    # Save the cropped image as PNG
    cropped_image.save(output_path, "PNG")

# Example usage
image_path = 'D:\BMS\BMS-II-API\SubAreaOffImage\\46_off_Lounge_9jorek_HzMQ0UI.jpg'
polygon_points = [(100, 100), (200, 50), (300, 200), (150, 300)]
output_path = 'output_image.jpg'

crop_image_to_polygon(image_path, polygon_points, output_path)
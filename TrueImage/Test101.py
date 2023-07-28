from PIL import Image
import cv2
import json
import os

# Get the current working directory
# path = os.getcwd()

# Print the current working directory

# Image path
# image_path = path + '/SubAreaOnImage/46_on_Lounge_9jorek.jpg'

# Join the paths
# img_path = os.path.join(path, image_path)

# Print the joined path
# print(image_path.replace('\\','/'))
# img_path = '../SubAreaOnImage/46_on_Lounge_9jorek.jpg'
# # # "img":"http://localhost:8888/SubAreasOnImage/46_on_Lounge_9jorek.jpg
# img= Image.open(img_path)
# image = cv2.imread(img_path)
# cv2.imshow("Image", image)
# cv2.waitKey(0)
# cv2.destroyAllWindows()


a = {'points': [{'x': 5, 'y': 151}, {'x': 217, 'y': 230}, {'x': 206, 'y': 426}, {'x': 3, 'y': 443}], 'isOpened': False}

print(a['points'])
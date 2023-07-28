from django.shortcuts import render
from django.http.response import StreamingHttpResponse
from Camera.camera import  LiveWebCam
from django.http import HttpResponse
import imutils,cv2
import numpy as np
# import torch

hog = cv2.HOGDescriptor()
hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())
# Create your views here.
# model = torch.hub.load('ultralytics/yolov5', 'custom', path='path_to_yolov5n6.pt')


def index(request):
	# render(request, 'streamapp/home.html')
	# HttpResponse(request)
	return render(request, 'streamapp/home.html')

def gen(camera):
    camera = cv2.VideoCapture("rtsp://admin:Admin@1234@192.168.1.248/cam/realmonitor?channel=1&subtype=1&authbasic=YWRtaW46QWRtaW4lNDAxMjM0")
    while True:
        ret, frame = camera.read()
        if not ret:
            break
        else:
            frame = imutils.resize(frame, width=640)
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            # Detect people using HOG
            regions, _ = hog.detectMultiScale(gray, winStride=(4, 4), padding=(4, 4), scale=1.4)

            for (x, y, w, h) in regions:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)
            
            # Reduce image quality
            _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 50])
            frame = buffer.tobytes()
            
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

					
def livecam_feed(request):
	a = StreamingHttpResponse(gen(LiveWebCam()),
					content_type='multipart/x-mixed-replace; boundary=frame')
	return a

def gen_frames():
    cap = cv2.VideoCapture("rtsp://admin:Admin@1234@192.168.1.248/cam/realmonitor?channel=1&subtype=1&authbasic=YWRtaW46QWRtaW4lNDAxMjM0")
    # cap = cv2.VideoCapture(0)
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        else:
            frame = imutils.resize(frame, width=640)
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/png\r\n\r\n' + frame + b'\r\n')

def camera_feed(request):
    return StreamingHttpResponse(gen_frames(),
                                 content_type='multipart/x-mixed-replace; boundary=frame')



import cv2,os
from django.conf import settings

# maskNet = load_model(os.path.join(settings.BASE_DIR,'face_detector/mask_detector.model'))

class LiveWebCam(object):
	def __init__(self):
		self.url = cv2.VideoCapture("rtsp://admin:Admin@1234@192.168.1.248/cam/realmonitor?channel=1&subtype=1&authbasic=YWRtaW46QWRtaW4lNDAxMjM0")
		# self.url = cv2.VideoCapture(0)


	def __del__(self):
		cv2.destroyAllWindows()

	def get_frame(self):
		success,imgNp = self.url.read()
		resize = cv2.resize(imgNp, (640, 480), interpolation = cv2.INTER_LINEAR) 
		ret, jpeg = cv2.imencode('.jpeg', resize)
		return jpeg.tobytes()

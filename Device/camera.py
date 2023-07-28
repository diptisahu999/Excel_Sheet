
import cv2
from django.http.response import StreamingHttpResponse
from django.http import HttpResponse
# maskNet = load_model(os.path.join(settings.BASE_DIR,'face_detector/mask_detector.model'))

class LiveWebCam(object):
	def __init__(self):
		self.url = cv2.VideoCapture("rtsp://admin:Admin@1234@192.168.1.248/cam/realmonitor?channel=1&subtype=1&authbasic=YWRtaW46QWRtaW4lNDAxMjM0")

	def __del__(self):
		cv2.destroyAllWindows()

	def get_frame(self):
		success,imgNp = self.url.read()
		resize = cv2.resize(imgNp, (640, 480), interpolation = cv2.INTER_LINEAR) 
		ret, jpeg = cv2.imencode('.jpg', resize)
		return jpeg.tobytes()


def index(request):
	# render(request, 'streamapp/home.html')
	return HttpResponse(request)


def gen(camera):
	while True:
		frame = camera.get_frame()
		yield (b'--frame\r\n'
				b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

					
def livecam_feed(request):
	a = StreamingHttpResponse(gen(LiveWebCam()),
					content_type='multipart/x-mixed-replace; boundary=frame')
	return a
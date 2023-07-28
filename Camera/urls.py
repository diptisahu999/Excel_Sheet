from django.urls import path, include
from Camera import views
from .views import camera_feed


urlpatterns = [
    path('index/', views.index, name='index'),
	path('livecam_feed/', views.livecam_feed, name='livecam_feed'),
    path('camera1/', camera_feed, name='camera-feed'),
    ]

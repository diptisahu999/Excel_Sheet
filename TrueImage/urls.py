from django.urls import path, include
from TrueImage import views
from .views import *
from colorama import init
from termcolor import colored

# print(colored('TrueImage init.... Passed Successfully', 'green'))
urlpatterns = [
     # path('MyModel', views.Index),
     path('imageMap/trueimage', views.Index2),
     path('imageMap/trueimage/<int:pk>', views.Index2),

#     path('imageMap/trueimage/', views.trueImage),
     path('CropAreasList', views.CropArea_list),
#     path('CropAreasList/<int:pk>', views.CropArea_Details),
    ]

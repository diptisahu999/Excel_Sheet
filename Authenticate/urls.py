
from django.urls import include, path,re_path
from Authenticate import views
from django.contrib import admin 
# from corsheaders.views import cors_exempt
# import Lookup
from .views import LoginView
# Lookup.Test_Authenticate()
urlpatterns = [        
    path('manage_user_type_list', views.UserTypeList),

    path('manage_user_list', views.user_list),
    path('manage_user_list/<int:pk>', views.user),
    
    path('get_employee_user_list', views.get_user_list),
    
    path('manage_user_profile', views.user_details_list),
    path('manage_user_profile/<int:pk>', views.user_detail),
     
    path('login/',LoginView.as_view(),name='login'),
       # path('login/',views.user),
    path('manage_role_list', views.role_list),
    path('manage_role_list/<int:pk>', views.role_detail),
    
    path('manage_module_list', views.module_list),
    path('manage_module_list/<int:pk>', views.module_detail),

    path('manage_role_device_information_list', views.role_device_information_list),
    path('manage_role_device_information_list/<int:pk>', views.role_device_information_details),

    path('get_tower_list',views.get_tower_list ),
    path('get_tower_device_data',views.get_tower_device_data ),
    path('get_floor_device_data',views.get_floor_device_data),
    path('get_area_device_data',views.get_area_device_data),
    path('get_device_data',views.get_device_data),

    path('get_device_filter',views.get_device)

]

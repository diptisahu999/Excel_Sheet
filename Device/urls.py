from django.urls import path
from Device import views 



 
urlpatterns = [ 
      
             
    path('manage_building_master', views.building_list),
    path('manage_building_master/<int:pk>', views.buildings),
    
    path('manage_bms_floor', views.floor_list),
    path('manage_bms_floor/<int:pk>', views.floor_details),
    
    path('manage_bms_department', views.department_list),
    path('manage_bms_department/<int:pk>', views.department),

    path('manage_bms_area', views.bms_area_list),
    path('manage_bms_area/<int:pk>', views.bms_area_list_1),

    path('manage_bms_subarea', views.bms_sub_area_list),
    path('manage_bms_subarea/<int:pk>', views.bms_sub_area),
    
    path('manage_bms_locker', views.bms_locker_list),
    path('manage_bms_locker/<int:pk>', views.bms_locker_list_details),

    path('manage_bms_devices', views.device_list),
    path('manage_bms_devices/<int:pk>', views.device_list_details),

    
    path('manage_user_area_card_list', views.bms_user_area_card_list),
    path('manage_user_area_card_list/<int:pk>', views.bms_user_area_card_list_details),

    path('manage_bms_device_type_master_list', views.Bms_device_type_master_list),
    path('manage_bms_device_type_master_list/<int:pk>', views.bms_device_type_master_details),

    path('manage_scences_list', views.sence_list),
    path('manage_scences_list/<int:pk>', views.sences_datails),
    
    path('manage_bms_triggers', views.trigger),
    path('manage_bms_triggers/<int:pk>', views.trigger_details),
    path('manage_trigger_event/<int:pk>', views.triggerAction),

    
    
    # path('manage_bms_user_history', views.user_history),
    
    
    path('manage_bms_hardware_type', views.hardware_master),
    path('manage_bms_hardware_type/<int:pk>', views.hardware_type_master),
    
    path('manage_bms_hardware_details', views.hardware_details),
    path('manage_bms_hardware_details/<int:pk>', views.hardware_details_master),


    path('manage_bms_history_details', views.bms_history_details),
    
    # path('get_bms_all_list/', views.bms_building_floor_area_subarea_device_Serializer_list),
	# path('livecam_feed/', camera.livecam_feed, name='livecam_feed'),

]



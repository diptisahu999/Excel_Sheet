from django.urls import path
from GreenBuildingManagement import views
from .views import export_as_excel_airveda

urlpatterns = [        
    path('get_gbm_devices_list', views.Green_list),
    # path('green_building_manage_device_list/<int:pk>', views.green_detail),
    
    path('get_token_of_airveda', views.GetToken),
    
    path('get_refresh_token_of_airveda', views.refrece_token),
    
    # path('get_last_hour_data_of_airveda', views.lastData),
    
    path('get_last_hour_data_of_airveda', views.lastDeviceData),   #### Refresh data api
    
    
    path('Green_data_list', views.Green_data_list),
    path('fetch_last_entry_airveda', views.Green_last_data_list),
    
    path('export-excel_airveda/', views.export_as_excel_airveda),
    
    
    # path('get_last_data_aura', views.lastDatassss),
    path('fetch_last_entry_aura', views.Green_last_data_list_aura),

    # path('get_hour_all_data_aura_store', views.lastDeviceDatasss),    #### Refresh data api
    
    path('Green_data_list_Aura', views.Green_data_list_Aura),
    
    path('export-excel_aura/', views.export_as_excel_aura),
    
    
    
     
]
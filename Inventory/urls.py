from django.urls import path
from Inventory import views

urlpatterns = [
    path('addviewcategory/', views.Bms_InventoryListView),
    path('deleteupdatecategory/<int:pk>', views.Bms_InventoryDetailView),
    
    path('addviewitems/', views.Bms_ItemListView),
    path('deleteupdateitems/<int:pk>', views.Bms_ItemDetailView),
    
    path('addviewmanagestock/', views.Bms_manage_inventoryListView),
    path('deleteupdatemanagestock/<int:pk>', views.Bms_manage_inventoryDetailView),
    
]


# {
#     "device_name":"LIGHT_FL_1",
#     "device_informations": {
#             "is_dimmable": "true",
#             "isFan": "false",
#             "device_id": "3",
#             "channel_id": "18",
#             "device_status": "false",
#             "image_id": "1",
#             "delay_second": "0"
#         }
# }
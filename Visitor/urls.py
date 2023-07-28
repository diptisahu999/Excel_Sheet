from django.urls import path
from .import views


urlpatterns = [

    path('manage_bms_visitor_activity',views.bms_visitor_activity_list),
    path('manage_bms_visitor_activity/<int:pk>',views.bms_visitors_list),

]


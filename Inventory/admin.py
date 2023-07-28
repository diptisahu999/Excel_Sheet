from django.contrib import admin
from .models import Bms_inventory_category,Bms_item_details,Bms_manage_inventory_stock

# Register your models here.
@admin.register(Bms_inventory_category)
class Bms_inventory_categoryAdmin(admin.ModelAdmin):
    list_display=['id','category_name','category_image','status','created_at']
    
@admin.register(Bms_item_details)
class Bms_item_detailsAdmin(admin.ModelAdmin):
    list_display=['id','item_name','item_description','item_image','price','unit','stock_quantity','minimum_quantity','order_from','status','created_at']

@admin.register(Bms_manage_inventory_stock)
class Bms_manage_inventory_stockAdmin(admin.ModelAdmin):
    list_display=['id','supplier_name','stock_quantity','unit','price','total','grand_total','created_at']
    

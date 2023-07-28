from rest_framework import serializers
from .models import Bms_inventory_category,Bms_item_details,Bms_manage_inventory_stock

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model=Bms_inventory_category
        fields='__all__'
        
class Bms_item_detailsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Bms_item_details
        filds=['id','item_name','item_description','item_image','price','unit','stock_quantity','minimum_quantity','order_from','status','category_id']

class Manage_inventorySerializer(serializers.ModelSerializer):
    class Meta:
        model=Bms_manage_inventory_stock
        fields=['id','supplier_name','stock_quantity','unit','price','total','grand_total','item_id']
    
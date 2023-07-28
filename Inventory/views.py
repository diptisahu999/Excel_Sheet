from django.shortcuts import render
from .models import Bms_inventory_category, Bms_item_details, Bms_manage_inventory_stock
from .serializers import InventorySerializer, Bms_item_detailsSerializer, Manage_inventorySerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http.response import JsonResponse

# Create your views here.
# Inventory Category api
@api_view(['GET' , 'POST'])
def Bms_InventoryListView(request):
    if request.method == 'GET':
        inventories = Bms_inventory_category.objects.all()
        serializer = InventorySerializer(inventories, many=True)
        return Response({"data":"true","status_code":200,"message":"Inventory Category list","response":serializer.data})
    
    elif request.method == 'POST':
        serializer = InventorySerializer(data = request.data)
        if serializer.is_valid():
            print(serializer.data)
            return Response({"data":"true","status_code":200,"message":"Inventory Category created successfully"})
            #return JsonResponse(serializer.data)
        else:
            return JsonResponse(serializer.errors)
    
    
@api_view(['DELETE' , 'GET' , 'PUT'])
def Bms_InventoryDetailView(request , pk):

    try:
        inventories=Bms_inventory_category.objects.get(pk=pk)
    except Bms_inventory_category.DoesNotExist:
        return Response(status=404)

    if request.method == 'DELETE':
        inventories.delete()
        return Response({"data":"true","status_code":200,"message":"Inventory Category deleted successfully"})
        
    elif request.method == 'GET':
        serializer = InventorySerializer(inventories)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = InventorySerializer(inventories, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"data":"true","status_code":200,"message":"Inventory Category Updated successfully"})
        else:
            return Response(serializer.errors)
        

# Item Detail Api
@api_view(['GET' , 'POST'])
def Bms_ItemListView(request):
    if request.method == 'GET':
        inventories = Bms_item_details.objects.all()
        serializer = Bms_item_detailsSerializer(inventories, many=True)
        return Response({"data":"true","status_code":200,"message":"Item Detail list","response":serializer.data})
    
    elif request.method == 'POST':
        serializer = Bms_item_detailsSerializer(data = request.data)
        if serializer.is_valid():
            print(serializer.data)
            return Response({"data":"true","status_code":200,"message":"Item Detail created successfully"})
            #return JsonResponse(serializer.data)
        else:
            return JsonResponse(serializer.errors)
    
    
@api_view(['DELETE' , 'GET' , 'PUT'])
def Bms_ItemDetailView(request , pk):

    try:
        items=Bms_item_details.objects.get(pk=pk)
    except Bms_item_details.DoesNotExist:
        return Response(status=404)

    if request.method == 'DELETE':
        items.delete()
        return Response({"data":"true","status_code":200,"message":"Item Detail deleted successfully"})
        
    elif request.method == 'GET':
        serializer = Bms_item_detailsSerializer(items)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = Bms_item_detailsSerializer(items, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"data":"true","status_code":200,"message":"Item Detail Updated successfully"})
        else:
            return Response(serializer.errors)
        
        
# Manage Inventory Stock Api

@api_view(['GET' , 'POST'])
def Bms_manage_inventoryListView(request):
    if request.method == 'GET':
        inventories = Bms_manage_inventory_stock.objects.all()
        serializer = Manage_inventorySerializer(inventories, many=True)
        return Response({"data":"true","status_code":200,"message":"Manage Inventory stock list","response":serializer.data})
    
    elif request.method == 'POST':
        serializer = Manage_inventorySerializer(data = request.data)
        if serializer.is_valid():
            print(serializer.data)
            return Response({"data":"true","status_code":200,"message":"Manage Inventory Stock created successfully"})
            #return JsonResponse(serializer.data)
        else:
            return JsonResponse(serializer.errors)
    
    
@api_view(['DELETE' , 'GET' , 'PUT'])
def Bms_manage_inventoryDetailView(request , pk):

    try:
        items=Bms_manage_inventory_stock.objects.get(pk=pk)
    except Bms_manage_inventory_stock.DoesNotExist:
        return Response(status=404)

    if request.method == 'DELETE':
        items.delete()
        return Response({"data":"true","status_code":200,"message":"Manage Inventory Stock deleted successfully"})
        
    elif request.method == 'GET':
        serializer = Manage_inventorySerializer(items)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = Manage_inventorySerializer(items, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"data":"true","status_code":200,"message":"Manage Inventory Stock Updated successfully"})
        else:
            return Response(serializer.errors)
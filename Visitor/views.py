from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import BmsVisitorActivity
from .serializers import *
from django.http.response import JsonResponse
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework import status
from Authenticate.serializers import *
from django.utils import timezone
from datetime import datetime



# Create your views here.

# ## Bms Visitor Details

# @api_view(['GET', 'POST', 'DELETE'])
# # @permission_classes([IsAuthenticated])
# def bms_visitor_list(request):
#     if request.method == 'GET':
#         bms_visiter = BmsVisitorActivity.objects.all()
#         # bms_visiter = BmsVisiterDetail.objects.filter(is_deleted='No')               
#         bms_visiter_serializer = BmsVisitorActivitySerializerGETT(bms_visiter, many=True)
#         return Response({"data":"true","status_code": 200, "message": "Visitor Details Lists ", "response":bms_visiter_serializer.data},status=status.HTTP_200_OK)
    
 
#     elif request.method == 'POST':
#         data = request.data
#         try:
#             # data['devices_id'] = data.pop('devices_details')
#             data['user'] = data.pop('user_id')
#         except:
#             pass
        
#         visiter_serializer = BmsVisitorActivitySerializer(data=request.data)
#         if visiter_serializer.is_valid():
#             visiter_serializer.save()
#             return Response({"data":"true","status_code": 200, "message": "Visitor Details Added Sucessfuly!!"},status=status.HTTP_201_CREATED) 
#             # return Response({"data":"true","status_code": 200, "message": "Visitor Details Added Sucessfuly!!","response":module_serializer.data},status=status.HTTP_201_CREATED) 
#         return Response({"status_code":401,"responce":visiter_serializer.errors},status=status.HTTP_400_BAD_REQUEST) 
    
    # elif request.method == 'DELETE':
    #     count = BmsVisitorDetail.objects.all().delete()
    #     return Response({'message': '{} Visitor Details was deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)
    
    
 
# @api_view(['GET', 'PUT', 'DELETE'])
# # @permission_classes([IsAuthenticated])
# def bms_list(request, pk):
#     try: 
#         bms_visiter = BmsVisitorDetail.objects.get(pk=pk) 
#     except BmsVisitorDetail.DoesNotExist: 
#         return Response({'message': 'The Visitor Details does not exist'}, status=status.HTTP_404_NOT_FOUND) 
         
 
#     if request.method == 'GET': 
#         visiter_serializer = BmsVisitorDetailsSerializer(bms_visiter) 
#         return Response({"data":"true","status_code": 200, "message": "Visitor Details Get Successfully", "response":visiter_serializer.data},status=status.HTTP_200_OK)  
 
#     elif request.method == 'PUT':  
#         # data = request.data
#         # try:
#         #     # data['devices_id'] = data.pop('devices_details')
#         #     data['hardware_type'] = data.pop('hardware_type_id')
#         # except:
#         #     pass
#         data = request.data
#         try:
#             # data['devices_id'] = data.pop('devices_details')
#             data['user'] = data.pop('user_id')
#         except:
#             pass
#         visiters_serializer = BmsVisitorDetailsSerializerPost(bms_visiter, data=request.data) 
#         if visiters_serializer.is_valid(): 
#             visiters_serializer.save() 
#             return Response({"data":"true","status_code": 200, "message": "Visitor Details updated Sucessfuly!!"},status=status.HTTP_201_CREATED) 
#             # return Response({"data":"true","status_code": 200, "message": "Visitor Details updated Sucessfuly!!","response":module_serializer.data},status=status.HTTP_201_CREATED) 
#         return Response({"status_code":401,"responce":visiters_serializer.errors},status=status.HTTP_400_BAD_REQUEST)  
         
 
#     elif request.method == 'DELETE': 
#         bms_visiter.delete() 
#         return Response({'message': 'Visitor Details was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
    
    
    
  ## Bms Visitor Activity  


# @api_view(['GET', 'POST', 'DELETE'])
# def bms_visitor_activity_list(request):
#     if request.method == 'GET':
#         # Retrieve and serialize the data
#         bms_visitor = BmsVisitorActivity.objects.all()
#         bms_visitor_serializer = BmsVisitorActivitySerializerGET(bms_visitor, many=True)
#         return Response({"data": "true", "status_code": 200, "message": "Visitor Lists", "response": bms_visitor_serializer.data}, status=status.HTTP_200_OK)



@api_view(['GET', 'POST', 'DELETE'])
def bms_visitor_activity_list(request):
    if request.method == 'GET':
        # Retrieve and serialize the data
        # print(request.data)
        visitors = BmsVisitorActivity.objects.filter(is_deleted="No").values('id','to_meet_user')
        meet_user=[]
        # q=input('enter the number :')
        visitors1 = []
        for visitor in visitors:
            # print(visitor)
            visitors1.append(visitor['id'])
            meet_user.append(visitor['to_meet_user'])
            
        ids = sorted(visitors1)
        MeetUserids = sorted(meet_user)
        
        # visitor_id = visitor['id']
        visitor_details= []
        card_list = BmsUser.objects.filter(user_type_id__user_type_name="Visitor",is_deleted="No").values()
        # id = card_list['id']
        for i ,j,k in zip(card_list ,ids, MeetUserids):
            # print(i)
            details = BmsUsersDetail.objects.filter(user_data=int(i['id']),is_deleted="No").values()[0]
            MeetUserIDs = BmsUsersDetail.objects.filter(user_data=k,is_deleted="No").values()[0]
            # print(MeetUserIDs)
            bms_visitor = BmsVisitorActivity.objects.filter(id=int(j),is_deleted="No").values()[0]
            # bms=BmsVisitorActivity.objects.all()
            # print(details,"For naming")
            # print(bms_visitor,"my id listing")
            visitor_name = f"{details['first_name']} {details['last_name']}"
            print(visitor_name)
            meet_user_name= f"{MeetUserIDs['first_name']} {MeetUserIDs['last_name']}"
            # print(visitor_name)
            MeetUser= {
                "id":details['id'],
                "visitor_name":visitor_name,
                # "phone_no":details['phone_no'],
            }
            # print(MeetUser)
            
            viewers = {
                "id": j,
                "rfid_id":  bms_visitor['rfid_id'],
                "visitor_name": MeetUser,
                "meeting_time": bms_visitor['meeting_time'],
                "meeting_purpose": bms_visitor['meeting_purpose'],
                "to_meet_user": meet_user_name,
                 "visiter_type": bms_visitor['visiter_type'],
                "in_time":  bms_visitor['in_time'],
                "out_time":  bms_visitor['out_time'],
                # "is_deleted":bms_visitor['is_deleted'],
                "out_remark":  bms_visitor['out_remark'],
                "phone_no": details['phone_no'],
                "access_to_time":  bms_visitor['access_to_time'],
                "access_from_time":  bms_visitor['access_from_time'],
                "created_at":  bms_visitor['created_at'],
                "updated_at": bms_visitor['updated_at'],
            }
            visitor_details.append(viewers)
            
        # bms_users = BmsUser.objects.filter(is_deleted="No")
        # bms_users_serializer = BmsUserDetailsSerializerVisitor(bms_users, many=True)
        # bms_visitor = BmsVisitorActivity.objects.all()
        # bms_visitor_serializer = BmsVisitorActivitySerializerGET(bms_visitor, many=True)
        return Response({"data": "true", "status_code": 200, "message": "Visitor Lists", "response": visitor_details}, status=status.HTTP_200_OK)



    elif request.method == 'POST':
        # print(request.data)
        if request.data['user_email']:
            asa=BmsUserType.objects.filter(user_type_name="Visitor").values()[0]
            # print(asa['id'])
            data={   
                "user_type_id":int(asa['id']),
                "user_email": request.data['user_email']
             }
            user_serializer = BmsUserDetailsSerializerPost(data=data)
            if user_serializer.is_valid():
                user_email = user_serializer.validated_data.get('user_email')
            # Check if the user_email already exists
                if BmsUser.objects.filter(user_email=user_email,is_deleted="No").exists():
                    return Response({"status_code": 400, "message": "User with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)
            
            user = user_serializer.save()
            try:
                user_detail_data = {
                        'user_data': user.id,  # Set the foreign key to the newly created user
                        'first_name': request.data.get('first_name'),
                        'last_name': request.data.get('last_name'),
                        'phone_no': request.data.get('phone_no'),
                        'has_vehicle': request.data.get('has_vehicle'),
                        # 'user':request.data.get('user'),
                        'locker_data': request.data.get('locker_data'),
                        "address":request.data.get('address'),
                        "id_proof":request.data.get('id_proof'),
                        "visiting_card":request.data.get('visiting_card'),
                        "is_deleted":request.data.get('is_deleted'),        
                        # Add other fields as per your model
                    }
            except:
                # return Response('i am not pass')
                user_detail_data = {
                'user_data': user.id,  # Set the foreign key to the newly created user
                # Add other fields for BmsUsersDetail model
                # 'first_name': None ,
                # 'last_name': None ,
                'has_vehicle': None ,
            }


            user_detail_data = {k: v for k, v in user_detail_data.items() if v is not None}
            # print(user_detail_data,'passss')

            try:
                user_detail_serializer = BmsUserSerializerUser(data=user_detail_data)
                user_detail_serializer.is_valid(raise_exception=True)
                user_detail_serializer.save()
                print(user_detail_serializer.data)
            except serializers.ValidationError as e:
                return Response({"status_code": 400, "message": "Invalid data", "errors": e.detail}, status=status.HTTP_400_BAD_REQUEST)
        visitor_serializer = BmsVisitorActivitySerializer(data=request.data)
        if visitor_serializer.is_valid():
            visitor_serializer.save()
            print('pass3')
            return Response({"data": "true", "status_code": 200, "message": "Visitor Added Successfully!!"}, status=status.HTTP_201_CREATED)
        return Response({"status_code": 400, "response": visitor_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


 
@api_view(['GET', 'PUT', 'DELETE'])
# @permission_classes([IsAuthenticated])
def bms_visitors_list(request, pk):
    try: 
        bms_visiter = BmsVisitorActivity.objects.get(pk=pk) 
    except BmsVisitorActivity.DoesNotExist: 
        return Response({'message': 'The Visitor does not exist'}, status=status.HTTP_404_NOT_FOUND) 
         
 
    if request.method == 'GET': 
        visiter_serializer = BmsVisitorActivitySerializer(bms_visiter)
        visitors = BmsVisitorActivity.objects.filter(is_deleted="No").values('id','to_meet_user')
        meet_user=[]
        visitors1 = []
        for visitor in visitors:
            # print(visitor)
            visitors1.append(visitor['id'])
            meet_user.append(visitor['to_meet_user'])
            
        ids = sorted(visitors1)
        MeetUserids = sorted(meet_user)
        
        # visitor_id = visitor['id']
        visitor_details= []
        card_list = BmsUser.objects.filter(user_type_id__user_type_name="Visitor",is_deleted="No").values()
        # id = card_list['id']
        for i ,j,k in zip(card_list ,ids, MeetUserids):
            details = BmsUsersDetail.objects.filter(user_data=int(i['id']),is_deleted="No").values()[0]
            MeetUserIDs = BmsUsersDetail.objects.filter(user_data=k,is_deleted="No").values()[0]
            # print(MeetUserIDs)
            bms_visitor = BmsVisitorActivity.objects.filter(id=int(j),is_deleted="No").values()[0]
            # print(details,"For naming")
            # print(bms_visitor,"my id listing")
            visitor_name = f"{details['first_name']} {details['last_name']}"
            meet_user_name= f"{MeetUserIDs['first_name']} {MeetUserIDs['last_name']}"
            # print(visitor_name)
            MeetUser= {
                "id":details['id'],
                "visitor_name":visitor_name,
                "phone_no":details['phone_no'],
            }
            print(MeetUser)
            
            viewers = {
                "id": j,
                "rfid_id":  bms_visitor['rfid_id'],
                "visitor_name": MeetUser,
                "meeting_time": bms_visitor['meeting_time'],
                "meeting_purpose": bms_visitor['meeting_purpose'],
                "to_meet_user": meet_user_name,
                "visiter_type": bms_visitor['visiter_type'],
                "in_time":  bms_visitor['in_time'],
                "phone_no": details['phone_no'],
                "out_time":  bms_visitor['out_time'],
                # "is_deleted":bms_visitor['is_deleted'],
                "out_remark":  bms_visitor['out_remark'],
                "access_to_time":  bms_visitor['access_to_time'],
                "access_from_time":  bms_visitor['access_from_time'],
                "created_at":  bms_visitor['created_at'],
                "updated_at": bms_visitor['updated_at'],
            }
            visitor_details.append(viewers)
 
        return Response({"data":"true","status_code": 200, "message": "Visitor Get Successfully", "response":visiter_serializer.data},status=status.HTTP_200_OK)  
 
    elif request.method == 'PUT':
        print(request.data)
        # details = BmsUsersDetail.objects.filter(user_data=int(['id']),is_deleted="No").values()[0]
        # MeetUser= {
        #         "id":details['id'],
        #         "visitor_name":visitor_name
        #     }
          
        # data = request.data
        # try:
        #     # data['devices_id'] = data.pop('devices_details')
        #     data['hardware_type'] = data.pop('hardware_type_id')
        # except:
        #     pass
        visiters_serializer = BmsVisitorActivitySerializer(bms_visiter, data=request.data) 
        if visiters_serializer.is_valid(): 
            visiters_serializer.save() 
            return Response({"data":"true","status_code": 200, "message": "Visitor updated Sucessfuly!!"},status=status.HTTP_201_CREATED) 
            # return Response({"data":"true","status_code": 200, "message": "Visitor Details updated Sucessfuly!!","response":module_serializer.data},status=status.HTTP_201_CREATED) 
        return Response({"status_code":401,"responce":visiters_serializer.errors},status=status.HTTP_400_BAD_REQUEST)  
         
 
    elif request.method == 'DELETE': 
        bms_visiter.delete() 
        return Response({'message': 'Visitor was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    # elif request.method == 'POST':
    #     visiter_data = request.data.copy()
    #     user_data = visiter_data.pop('user')
    #     to_meet_user_data = visiter_data.pop('to_meet_user')
    #     enter_by_data = visiter_data.pop('enter_by')

    #     visiter_serializer = BmsVisitorActivitySerializer(data=visiter_data)
    #     if visiter_serializer.is_valid():
    #         user_serializer = BmsUserSerializer(data=user_data)
    #         to_meet_user_serializer = BmsUserDetailsSerializerPost(data=to_meet_user_data)
    #         enter_by_serializer = BmsUserDetailsSerializerPost(data=enter_by_data)

    #         if user_serializer.is_valid() and to_meet_user_serializer.is_valid() and enter_by_serializer.is_valid():
    #             user = user_serializer.save()
    #             to_meet_user = to_meet_user_serializer.save()
    #             enter_by = enter_by_serializer.save()

    #             visiter_serializer.save(user=user, to_meet_user=to_meet_user, enter_by=enter_by)
    #             return Response({"data": "true", "status_code": 200, "message": "Visitor Activity Added Successfully!!"}, status=status.HTTP_201_CREATED)
            
    #         errors = {}
    #         errors.update(visiter_serializer.errors)
    #         errors.update(user_serializer.errors)
    #         errors.update(to_meet_user_serializer.errors)
    #         errors.update(enter_by_serializer.errors)
    #         return Response({"status_code": 401, "response": errors}, status=status.HTTP_400_BAD_REQUEST)

    #     return Response({"status_code": 401, "response": visiter_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    
    

from channels.consumer import SyncConsumer , AsyncConsumer
from channels.exceptions import StopConsumer
from asgiref.sync import async_to_sync
import json
from Device.device_status import getDeviceStatus,getUserAreaCardList
from Device.SocketRcev import ClientConfigSocket
from channels.consumer import SyncConsumer , AsyncConsumer
from channels.exceptions import StopConsumer
import time
from channels.layers import get_channel_layer

class MyAsyncConsumer(SyncConsumer):
    connected_clients = set()
    def websocket_connect(self,event):
        # print("Websocket Connected...",event)
        user_id =24
        a = getUserAreaCardList(user_id)

        
        self.send({
                'type': 'websocket.accept',
            })
        self.send({
            'type': 'websocket.send',
            'text':  a,
            # "text": event['text']

        })
        # self.send({
        #     'type': 'websocket.send',
        #     'text':  event['text'],
        # })

        # websocket_receive
    def websocket_receive(self, event):
        # user_id =3
        # data= getUserAreaCardList(user_id)
        # self.send({
        #     "type": "websocket.send",
        #     "text": a,
        # })
        
        try : 
            data = json.loads(event['text'])
            print(data, "")
            ClientConfigSocket(data)
            user_id =24
            data= getUserAreaCardList(user_id)
            self.send_to_all(data, exclude=self)
            self.send({
            "type": "websocket.send",
            "text": data,
            })
            # self.send_to_all(data, exclude=self)
        except:
            user_id =24
            data= getUserAreaCardList(user_id)
            self.send({
            "type": "websocket.send",
            "text": data,
        })
             
       

        # self.send({
        #     "type": "websocket.send",
        #     "text": "Task finish",
        # })
       
    def send_to_all(self, message):
        # print(message)
        for client in self.connected_clients:
            client.send({
                'type': 'websocket.send',
                'text': message,
            })

    def chat_message(self,event):
        print("data" ,event)
        # print("event .. " ,event['message'])
        self.send({ 
            'type':'websocket.send',
            'text': event['message']
        }
        )

    def websocket_disconnect(self,event):
        print("Websocket Disconnected...",event)
        raise StopConsumer()
    


    
class Connected(AsyncConsumer):
    async def websocket_connect(self,event):
        print("Websocket Connected...",event)
        await self.send({
                'type': 'websocket.accept',
            })
        await self.send({
            'type': 'websocket.send',
            'text': "Welcome to Broadview-innovations server",
        })

    async def websocket_disconnect(self,event):
        print("Websocket Disconnected...",event)
        raise StopConsumer()
    


channel_layer = get_channel_layer()
# connected_clients = {}
class MySyncConsumer(SyncConsumer):
    connected_clients = {}

    def websocket_connect(self,event):
        self.group_name = self.scope['url_route']['kwargs']['groupnuname']
        self.channel_layer = get_channel_layer()
        print(f"Connected User_ID: {self.group_name}")
        user_id = int(self.group_name)
        a = getUserAreaCardList(user_id)
        group_list = [] 
        group_list.extend(self.group_name)
        async_to_sync(self.channel_layer.group_add)(self.group_name,self.channel_name)     #convert async function to sync funtion
        self.send({
            'type':'websocket.accept'
        })
        async_to_sync(self.channel_layer.group_send)(
                self.group_name,{
                'type':'chat.message',
                'message': a
                }
            )
       
        
        if self.group_name not in self.connected_clients:
            self.connected_clients[self.group_name] = []
            self.connected_clients[self.group_name].append(self.channel_name)
                
        # print(self.connected_clients[self.group_name])
    # print(connected_clients,"Connected User_ID Listing")
    def websocket_receive(self,event):
        # print(list(self.connected_clients.keys()),"my clinet rcv  key list")
        self.groups = str(self.scope['url_route']['kwargs']['groupnuname'])
        group_list= list(self.connected_clients.keys())
        self.group_name = self.scope['url_route']['kwargs']['groupnuname']
        user_id = int(self.group_name)
        try:
            print(event['text'],"msg recv from clinet")
            try:
                client_msg = (json.loads(event['text']))
                # print(type(client_msg))
                if client_msg[0]['message']== str("card_update"):
                    for i in group_list:
                        user_id = (int(i))
                        # print(f"Connected user_id:{i}")
                        User_cards= getUserAreaCardList(user_id)
                        async_to_sync(self.channel_layer.group_send)(
                            str(i),{
                            'type':'chat.message',
                            'message': User_cards
                            }
                        )
            except Exception as e:
                pass

            data = json.loads(event['text'])
            # print(data, "data recived from client")
            ClientConfigSocket(data,user_id)
            self.group_name = self.scope['url_route']['kwargs']['groupnuname']
            
            
            try:
                for i in group_list:
                    user_id = (int(i))
                    # print(f"Connected user_id:{i}")
                    User_cards= getUserAreaCardList(user_id)
                    async_to_sync(self.channel_layer.group_send)(
                        str(i),{
                        'type':'chat.message',
                        'message': User_cards
                        }
                    )
                    
            except:
                pass
        except Exception as e:
            print("device_information not found",e)
            for i in group_list:
                user_id = (int(i))
                # print(f"Connected user_id:{i}")
                User_cards= getUserAreaCardList(user_id)
                async_to_sync(self.channel_layer.group_send)(
                    str(i),{
                    'type':'chat.message',
                    'message': User_cards
                    }
                )
            
            #     async_to_sync(self.channel_layer.group_send)(
            #     self.group_name,{
            #     'type':'chat.message',
            #     'message': "device informations wrong"
            #     }
            # )


    def chat_message(self,event):
        # print(type(event['message']))
        # print(event['message'],"msg rcv from my main_update")
        # self.websocket_connect(self)
        self.send({ 
            'type':'websocket.send',
            'text': event['message']
        }
        )
    

    def websocket_disconnect(self,event):
        # print("Websocket Disconnected...",event)
        # print("Channel layer " , self.channel_layer) #get default channel layer
        # print("Channel name " , self.channel_name) #get default channel name
        async_to_sync(self.channel_layer.group_discard)(self.group_name,self.channel_name)
        raise StopConsumer()
    



class MyAsyncConsumer(SyncConsumer):
    connected_clients = set()
    def websocket_connect(self,event):
        # print("Websocket Connected...",event)
        user_id =24
        a = getUserAreaCardList(user_id)

        
        self.send({
                'type': 'websocket.accept',
            })
        self.send({
            'type': 'websocket.send',
            'text':  a,
            # "text": event['text']

        })
        # self.send({
        #     'type': 'websocket.send',
        #     'text':  event['text'],
        # })

        # websocket_receive
    def websocket_receive(self, event):
        # user_id =3
        # data= getUserAreaCardList(user_id)
        # self.send({
        #     "type": "websocket.send",
        #     "text": a,
        # })
        
        try : 
            data = json.loads(event['text'])
            print(data, "")
            ClientConfigSocket(data)
            user_id =24
            data= getUserAreaCardList(user_id)
            self.send_to_all(data, exclude=self)
            self.send({
            "type": "websocket.send",
            "text": data,
            })
            # self.send_to_all(data, exclude=self)
        except:
            user_id =24
            data= getUserAreaCardList(user_id)
            self.send({
            "type": "websocket.send",
            "text": data,
        })
             
       

        # self.send({
        #     "type": "websocket.send",
        #     "text": "Task finish",
        # })
       
    def send_to_all(self, message):
        # print(message)
        for client in self.connected_clients:
            client.send({
                'type': 'websocket.send',
                'text': message,
            })

    def chat_message(self,event):
        print("data" ,event)
        # print("event .. " ,event['message'])
        self.send({ 
            'type':'websocket.send',
            'text': event['message']
        }
        )

    def websocket_disconnect(self,event):
        print("Websocket Disconnected...",event)
        raise StopConsumer()
    
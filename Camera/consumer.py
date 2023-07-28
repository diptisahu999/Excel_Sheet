from channels.consumer import SyncConsumer , AsyncConsumer
from channels.exceptions import StopConsumer
from asgiref.sync import async_to_sync
import json
from Camera.views import camera_feed


class MyAsyncConsumer(SyncConsumer):
    def websocket_connect(self,event):
        # print("Websocket Connected...",event)
        a = camera_feed()
        self.send({
                'type': 'websocket.accept',
            })
        self.send({
            'type': 'websocket.send',
            'text':  a,
        })


    def websocket_receive(self, event):
        a = camera_feed()
        self.send({
            "type": "websocket.send",
            "text": event['text']
        })
        # self.send(text_data="Hello world!")
    

    def chat_message(self,event):
        # print("data" ,event)
        # print("event .. " ,event['message'])
        self.send({ 
            'type':'websocket.send'
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
            'text': "Connected to Server",
        })

    async def websocket_disconnect(self,event):
        print("Websocket Disconnected...",event)
        raise StopConsumer()
    
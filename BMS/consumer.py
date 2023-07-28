from channels.consumer import SyncConsumer , AsyncConsumer
from channels.exceptions import StopConsumer
from asgiref.sync import async_to_sync
import json
from Device.device_status import getDeviceStatus

d_list = getDeviceStatus()

print(d_list)
class MyAsyncConsumer(AsyncConsumer):
    async def websocket_connect(self,event):
        print("Websocket Connected...",event)
        await self.send({
                'type': 'websocket.accept',
            })
        await self.send({
            'type': 'websocket.send',
            'text': d_list,
        })


    # async def websocket_receive(self, event):
    #     await self.send({
    #         "type": "websocket.send",
    #         "text": event["text"],
    #     })
    #     # self.send(text_data="Hello world!")
    

    async def chat_message(self,event):
        print("data" ,event)
        print("event .. " ,event['message'])
        await self.send({ 
            'type':'websocket.send'
        }
        )

    async def websocket_disconnect(self,event):
        print("Websocket Disconnected...",event)
        raise StopConsumer()
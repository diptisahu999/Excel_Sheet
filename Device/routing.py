from django.urls import re_path,path
from . import consumer
websocket_urlpatterns=[
    # path('ws/sc/<str:groupnuname>/', consumers.MySyncConsumer.as_asgi()),
    re_path(r'^devices/$', consumer.MyAsyncConsumer.as_asgi()),
    re_path(r'^$', consumer.Connected.as_asgi()),
    path(r'devices/<str:groupnuname>/', consumer.MySyncConsumer.as_asgi()),
      
]

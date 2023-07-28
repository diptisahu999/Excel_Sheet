from django.urls import re_path
from . import consumer
websocket_urlpatterns=[
    # path('ws/sc/<str:groupnuname>/', consumers.MySyncConsumer.as_asgi()),
    re_path(r'^camera/$', consumer.MyAsyncConsumer.as_asgi()),
    re_path(r'^$', consumer.Connected.as_asgi()), # 
]
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter ,URLRouter
import Device.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "BMS.settings")
# application = get_asgi_application()
application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': URLRouter(
    Device.routing.websocket_urlpatterns
    )
})


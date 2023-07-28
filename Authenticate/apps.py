from django.apps import AppConfig


class AuthenticateConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Authenticate'



# var socket = new WebSocket('ws://127.0.0.1:8888/devices/');
# socket.onopen = function () {
#   setInterval(function() {
#     if (socket.bufferedAmount == 0)
#       socket.send("hey");
#   }, 50);
# };
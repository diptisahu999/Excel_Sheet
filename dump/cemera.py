import cv2

# RTSP info -- change these 4 values according to your RTSP URL
username = 'admin'
password = 'Admin@1234'
endpoint = 'cam/realmonitor?channel=1&subtype=1&authbasic=YWRtaW46QWRtaW4lNDAxMjM0'
ip = '192.168.1.248'
    # RTSP_URL =  "rtsp://admin:Admin@1234@192.168.1.248/cam/realmonitor?channel=1&subtype=1&authbasic=YWRtaW46QWRtaW4lNDAxMjM0"

stream = cv2.VideoCapture("rtsp://admin:Admin@1234@192.168.1.248/cam/realmonitor?channel=1&subtype=1&authbasic=YWRtaW46QWRtaW4lNDAxMjM0")


try:
    while True:
        # Read the input live stream
        ret, frame = stream.read()
        height, width, layers = frame.shape
        frame = cv2.resize(frame, (width // 1, height // 1))
        # Show video frame
        cv2.imshow("camera", frame)

        # Quit when 'x' is pressed
        if cv2.waitKey(1) & 0xFF == ord('x'):
            break
        
except Exception as e:
    print("ERROR:", e)

# Main function
# if _name_ == "__main__":
#     Release and close stream





# import cv2
# import asyncio
# import websocket
# import base64

# async def process_frames(self):
#     # OpenCV video capture
#     # capture = cv2.VideoCapture(0)
#     username = 'admin'
#     password = 'Admin@1234'
#     endpoint = 'cam/realmonitor?channel=1&subtype=1&authbasic=YWRtaW46QWRtaW4lNDAxMjM0'
#     ip = '192.168.1.248'
#     # RTSP_URL =  "rtsp://admin:Admin@1234@192.168.1.248/cam/realmonitor?channel=1&subtype=1&authbasic=YWRtaW46QWRtaW4lNDAxMjM0"

#     stream = cv2.VideoCapture(f'rtsp://{username}:{password}@{ip}/{endpoint}')

#     while True:
#         # Read video frame
#         ret, frame = stream.read()

#         # Process the frame as needed
#         # ...

#         # Convert frame to base64-encoded string
#         _, encoded_frame = cv2.imencode('.jpg', frame)
#         encoded_frame_str = base64.b64encode(encoded_frame).decode('utf-8')

#         # Send the frame over the websocket
#         await websocket.send(encoded_frame_str)

# async def websocket_handler(websocket, path):
#     while True:
#         # Receive frames from the client
#         received_frame = await websocket.recv()

#         # Process the received frame
#         # ...

#         # Send data back to the client if needed
#         # ...

# start_server = websocket.serve(websocket_handler, 'localhost', 8070)

# asyncio.get_event_loop().run_until_complete(start_server)
# asyncio.get_event_loop().run_until_complete(process_frames())
# asyncio.get_event_loop().run_forever()
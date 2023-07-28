import socket,time
import threading	
#import re	


def CoolMaster_opr(data):
    param = data
    # print(data,"Cool Master API data")
    cm = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    host = data['ip']
    port = int(data['port'])


    device_opr = data['device_id']+"."+data['channel_id']
    # print(device_opr)


    def connectCoolMaster():
        try: 
            s.connect((host,port))
            s.setblocking(1)
            print(f"Success!!")
            return s
        except Exception as e:
            print(f"Error connecting Cool Master")




    def getStatusLine(device_opr):
        s.sendto(str(f"stat {device_opr}" + " \n").encode('utf-8'), (host,port))

    # def CoolMasterLineON(status,line,mode):

    #     s.sendto(str(f"on L1.018" + " \n").encode('utf-8'), (host,port))
    #     s.sendto(str(f"off L1.018" + " \n").encode('utf-8'), (host,port))
    #     s.sendto(str(f"temp L1.018 22" + " \n").encode('utf-8'), (host,port))





    def getStatusLine(device_opr):
        try:
            # print("CoolMaster Current Status")
            s.sendto(str(f"stat {device_opr}" + " \n").encode('utf-8'), (host,port))
            # print("Opperation Succesfully on CoolMaster Current Status")
        except Exception as e:
            print("CoolMaster Status not Found",e)


    def getSwing(device_opr, data):
        try:
            # s.connect((host,port))
            # s.setblocking(1)
            if data['swing']:
                # print("CoolMaster Sent Swing", data['swing'])
                s.sendto(str(f"swing {device_opr} {data['swing']}" + " \n").encode('utf-8'), (host,port))
                # print("Opperation Succesfully on CoolMaster Swing : ",data['swing'] )
        except Exception as e:
            print("CoolMaster Swings Status Error ", e)

    def getMode(device_opr, data):
        try:
            if data['mode']:
                s.sendto(str(f"{data['mode']} {device_opr}" + " \n").encode('utf-8'), (host,port))
                s.close()
        except Exception as e:
            print("CoolMaster Mode Status", e)

    


    def getFspeed(device_opr,data):
        try:
            if data['fspeed']:
                mode = data['fspeed']
                s.sendto(str(f"fspeed {device_opr} {mode}" + " \n").encode('utf-8'), (host,port))
        except Exception as e:
            print("CoolMaster Fspeed Error", e)


    def getACTemp(device_opr,data):
        try:
            # s.connect((host,port))
            # s.setblocking(1)
            if data['ac_temp']:
                temp_value = data['ac_temp']
                s.sendto(str(f"temp {device_opr} {temp_value}" + " \n").encode('utf-8'), (host,port))
                s.close()
        except Exception as e:
                print("CoolMaster ac_temp Error", e)

    def getRmTemp(device_opr,data):
        try:
            if data['rm_temp']:
                # print( "CoolMaster sent rm_temp", data['rm_temp'])
                s.sendto(str(f"temp {device_opr} {data['rm_temp']}" + " \n").encode('utf-8'), (host,port))
                # print("Opperation Succesfully on CoolMaster rm_temp : ",data['rm_temp'])
        except Exception as e:
            print("CoolMaster rm_temp Error",e)

    def CoolMasterDeviceStatus(device_opr, data):
        try:
            cm = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            host = data['ip']
            port = int(data['port'])
            device_opr = data['device_id']+"."+data['channel_id']
            # s.connect((host,port))
            # s.setblocking(1)
            if data['device_status'] =="true":
                
                cm.connect((host,port))
                cm.setblocking(1)
                cm.sendto(str(f"on {device_opr}" + " \n").encode('utf-8'), (host,port))
                print( f"CoolMaster Device status on {device_opr} Successfully")

                cm.close()
                
            if data['device_status'] =="true":
                cm = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                cm.connect((host,port))
                cm.setblocking(1)
                # print( "CoolMaster Device status Sent", data['device_status'],"for device On")
                # s.sendto(str(f"on {device_opr}" + " \n").encode('utf-8'), (host,port))
                # s.shutdown()

                # print(f"Success!!")
                # connectCoolMaster()
                cm.sendto(str(f"{data['mode']} {device_opr}" + " \n").encode('utf-8'), (host,port))
                print( f"CoolMaster Device {data['mode']} {device_opr} Successfully")

                # s.close()
                # connectCoolMaster()
                cm.sendto(str(f"temp {device_opr} {data['ac_temp']}" + " \n").encode('utf-8'), (host,port))
                print( f"CoolMaster Device temp {device_opr} {data['ac_temp']} Successfully")
                # s.close()
                # connectCoolMaster()
                cm.sendto(str(f"fspeed {device_opr} {data['fspeed']}" + " \n").encode('utf-8'), (host,port))
                print( f"CoolMaster Device fspeed {device_opr} {data['fspeed']} Successfully")
                # s.close()
                cm.close()

            

            if data['device_status'] =="false":  
                cm.connect((host,port))
                cm.setblocking(1)    
                # print("CoolMaster Device status Sent",data['device_status'], "for device Off")
                cm.sendto(str(f"off {device_opr}" + " \n").encode('utf-8'), (host,port))
                cm.close()
                # print("Opperation Succesfully on CoolMaster device_status : ",data['device_status'] )


        except Exception as e:
            print(e)
            pass


    #  h - horizontal
    # · v - vertical
    # · a - auto (swing)
    # · 3 - 30º
    # · 4 - 45º
    # · 6 - 60º



    def startListenr():
      
        counter = 1
        while True:
            data, sender = s.recvfrom(100240)
            results = data.split(b'\r\n')
            for ListAcResult in results:
                singleACresult = ListAcResult.decode()
                print(singleACresult)
                singleACresult.replace(">","")
                singleACresult = singleACresult.split(" ")
            time.sleep(0.1)

                
            


    # getStatusLine()
    # CoolMasterListener= threading.Thread(target=startListenr())
    # CoolMasterListener.start()
    
    # getACTemp(device_opr,param)
    try:
        # startListenr()
        # connectCoolMaster()
        # getStatusLine(device_opr)
        CoolMasterDeviceStatus(device_opr,param)
        # getMode(device_opr, param)
        # getFspeed(device_opr,param)
    except Exception as e:
        print("CoolMaster Information Wrong",e)
    
    
    # data=  {    
    #             "device_status": CoolMasterDeviceStatus(device_opr, param),
    #             "mode":  getMode(device_opr, param),
    #             "ac_temp":getACTemp(device_opr,param),
    #             "rm_temp": getRmTemp(device_opr,param),
    #             "swing": getSwing(device_opr, param),
    #             "fspeed":getFspeed(device_opr,param),
    #         }
    
    
    

# CoolMaster_opr(data)
import socket		
#import re	


def CoolMaster_opr(data):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    host = data['ip']
    port = int(data['port'])


    device_opr = data['device_id']+"."+data['channel_id']
    print(device_opr)


    def connectCoolMaster():
        try: 
            s.connect((host,port))
            s.setblocking(1)
            print(f"Success!!")
        except Exception as e:
            print(f"Error connecting Cool Master")




    def getStatusLine(device_opr):
        s.sendto(str(f"stat {device_opr}" + " \n").encode('utf-8'), (host,port))

    # def CoolMasterLineON(status,line,mode):

    #     s.sendto(str(f"on L1.018" + " \n").encode('utf-8'), (host,port))
    #     s.sendto(str(f"off L1.018" + " \n").encode('utf-8'), (host,port))
    #     s.sendto(str(f"temp L1.018 22" + " \n").encode('utf-8'), (host,port))

    def CoolMasterDeviceStatus(device_opr, data):
        print(data, "for device On or OFF")
        if data['device_status'] =="true":
            s.sendto(str(f"on {device_opr}" + " \n").encode('utf-8'), (host,port))
        
        if data['device_status'] =="false":      
            s.sendto(str(f"off {device_opr}" + " \n").encode('utf-8'), (host,port))


    def getStatusLine(device_opr):
        s.sendto(str(f"stat {device_opr}" + " \n").encode('utf-8'), (host,port))


    def getSwing(device_opr, data):
        print(data , "data for CoolMaster Swing")
        if data['swing']:
            s.sendto(str(f"swing {device_opr} {data['swing']}" + " \n").encode('utf-8'), (host,port))

    def getMode(device_opr, data):
        print(data ,"Data for CoolMaster Mode")
        if data['mode']:
            s.sendto(str(f"swing {device_opr} {data['mode']}" + " \n").encode('utf-8'), (host,port))


    def getFspeed(device_opr,data):
        print(data,"Data for Fspeed")
        if data['fspeed']:
            s.sendto(str(f"fspeed {device_opr} {data['fspeed']}" + " \n").encode('utf-8'), (host,port))


    def getACTemp(device_opr,data):
        print(data,"Data for AC temp")
        if data['ac_temp']:
            s.sendto(str(f"temp {device_opr} {data['ac_temp']}" + " \n").encode('utf-8'), (host,port))

    def getRmTemp(device_opr,data):
        print(data, "Data for rm temp")
        if data['rm_temp']:
            s.sendto(str(f"temp {device_opr} {data['rm_temp']}" + " \n").encode('utf-8'), (host,port))


    #  h - horizontal
    # · v - vertical
    # · a - auto (swing)
    # · 3 - 30º
    # · 4 - 45º
    # · 6 - 60º



    def startListenr():
        while True:
            data, sender = s.recvfrom(100240)
            #print(data)
            #regexPattern = '   - 0 |   # 0 | 0\r\n|0\r\nOK\r\n|OK\r\n>'
            results = data.split(b'\r\n')
            #print(results)
            for ListAcResult in results:
                singleACresult = ListAcResult.decode()
                print(singleACresult)
                singleACresult.replace(">","")
                singleACresult = singleACresult.split(" ")
                #print(singleACresult)


    # connectCoolMaster()
    # getStatusLine()

    data=  {
                "ac_temp":getACTemp(device_opr,data),
                "rm_temp": getRmTemp(device_opr,data),
                "mode":  getMode(device_opr, data),
                "swing": getSwing(device_opr, data),
                "fspeed":getFspeed(device_opr,data),
                "device_status": CoolMasterDeviceStatus(device_opr, data)
            }
    # startListenr()
    print(data['ac_temp'])

# CoolMaster_opr(data)
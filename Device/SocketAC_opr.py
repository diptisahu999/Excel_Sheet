import socket		
#import re	


s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
host = '172.16.3.253'
port = 10102


def connectCoolMaster():
    try: 
        s.connect((host,port))
        s.setblocking(1)
        print(f"Success!!")
    except Exception as e:
        print(f"Error connecting Cool Master")


def getStatusLine():
    device_opr = "L1.002"
    mode= "30"
    s.sendto(str(f"temp {device_opr} {mode}" + " \n").encode('utf-8'), (host,port))


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


connectCoolMaster()
# getStatusLine()
startListenr()
import six
import binascii
import logging
from struct import pack
from socket import *
# TIS CIRCUIT CONFIG


s=socket(AF_INET, SOCK_DGRAM)
s.setsockopt(SOL_SOCKET, SO_BROADCAST, 1)
m=socket(AF_INET, SOCK_DGRAM)
m.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)
m.bind(('0.0.0.0', 6000))

class RelayKeys:

    def __init__(self):
        """initialize key codes"""
        self.HEADER = b'\xFF\xFF\xFF\xFF\x53\x4D\x41\x52\x54\x43\x4C\x4F\x55\x44\xAA\xAA'
        self.GET_STATUS = b'\x0b\x01\xFE\xFF\xFE\x00\x33\x01'
        self.OPERATION = b'\x0F\x01\xFE\xFF\xFE\x00\x31\x01'
        self.AC_PANEL_CONTROL = b'\x14\x01\xFE\xFF\xFE\xE0\xEE\x01'
        self.AC_PANEL_STATUS = b'\x0C\x01\xFE\xFF\xFE\xE0\xEC\x01'
        # self.AC_PANEL_STATUS = b'\x0C\x01\xFE\xFF\xFE\xE0\xEC'
        self.SCENE_CONTROL = b'\x0F\x01\xFE\xFF\xFE\x00\x02\x01'
        self.IR_OPERATION = b'\x0D\x01\xFE\xFF\xFE\xE0\x1C\x01'

        self.PANEL_MISC_PART = b'\x01\x17\x17\x17\x00'
        self.TRAIL = b'\x00\x00'

rc = RelayKeys()


def crc16_ccitt(data, crc=0):
    CRC16_CCITT_TAB = \
        [
            0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7,
            0x8108, 0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef,
            0x1231, 0x0210, 0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6,
            0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de,
            0x2462, 0x3443, 0x0420, 0x1401, 0x64e6, 0x74c7, 0x44a4, 0x5485,
            0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d,
            0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6, 0x5695, 0x46b4,
            0xb75b, 0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d, 0xc7bc,
            0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823,
            0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b,
            0x5af5, 0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12,
            0xdbfd, 0xcbdc, 0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a,
            0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41,
            0xedae, 0xfd8f, 0xcdec, 0xddcd, 0xad2a, 0xbd0b, 0x8d68, 0x9d49,
            0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70,
            0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a, 0x9f59, 0x8f78,
            0x9188, 0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e, 0xe16f,
            0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067,
            0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e,
            0x02b1, 0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256,
            0xb5ea, 0xa5cb, 0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d,
            0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405,
            0xa7db, 0xb7fa, 0x8799, 0x97b8, 0xe75f, 0xf77e, 0xc71d, 0xd73c,
            0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634,
            0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9, 0xb98a, 0xa9ab,
            0x5844, 0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882, 0x28a3,
            0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a,
            0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92,
            0xfd2e, 0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9,
            0x7c26, 0x6c07, 0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1,
            0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8,
            0x6e17, 0x7e36, 0x4e55, 0x5e74, 0x2e93, 0x3eb2, 0x0ed1, 0x1ef0,
        ]

    tab = CRC16_CCITT_TAB  # minor optimization (now in locals)
    crc = 0x0000
    for byte in six.iterbytes(data):
        index = ((crc >> 8)) ^ byte
        crc = (((crc << 8) & 0xFFFF) ^ tab[index])
    return crc & 0xffff


def relay_opr(param):
    print(param, "-->")
    logging.info("Sending Operation on " + str(param['device_id']) + " on channel id " + str(
        param['channel_id']) + " Operation " + str(param['device_status']) + "------- Sending")
    y = hex(int(param['channel_id']))
    # print(y)
    if int(param['channel_id']) < 16:
        m = y.replace('0x', '0')
        # print(m)
    else:
        m = y.replace('0x', '')
    # channel_id = int(m, 16)
    channel_id = binascii.a2b_hex(m.encode('utf-8'))
    # print(channel_id)
    deviceid_hex = hex(int(param['device_id']))
    print(deviceid_hex, "--")
    if int(param['device_id']) < 16:
        deviceid_replaced = deviceid_hex.replace('0x', '0')
    else:
        deviceid_replaced = deviceid_hex.replace('0x', '')

    device_id = binascii.a2b_hex(deviceid_replaced.encode('utf-8'))
    print(device_id)
    operation = param['device_status']

    if operation != None:
        if operation == 'true':
            # print("operation: ",operation)
            b = r"\x" + '64'
            o = b.replace('\\x', '')
            opr = binascii.a2b_hex(o.encode('utf-8'))
            if 'delay_second' in param:
                delay = b'\x00' + pack('B', int(param['delay_second']))
            else:
                delay = b'\x00\x00'

        elif operation == 'false':
            # print("operation: ",operation)
            b = r"\x" + '00'
            o = b.replace('\\x', '')
            opr = binascii.a2b_hex(o.encode('utf-8'))
            if 'delay_second' in param:
                delay = b'\x00' + pack('B', int(param['delay_second']))
            else:
                delay = b'\x00\x00'
        else:
            opr = pack('B', int(operation))
            # print("operation: ",operation)
            delay = b'\x00\x00'

        get = crc16_ccitt(rc.OPERATION + device_id +
                          channel_id + opr + delay, crc=0)
        # print(get,"get")
        crc_int = hex(get)[2:]
        if len(crc_int) == 3:
            crc_int = '0' + crc_int
        if len(crc_int) == 2:
            crc_int = '00' + crc_int

        sm = r"\x" + r"\x".join(crc_int[n: n+2]
                                for n in range(0, len(crc_int), 2))
        a = sm.replace('\\x', '')
        a.encode('utf8')

        x = binascii.a2b_hex(a.encode('utf8'))
        # print(rc.HEADER,rc.OPERATION,device_id,channel_id,opr,rc.TRAIL,x)
        udp_pack_new = rc.HEADER + rc.OPERATION + \
            device_id + channel_id + opr + rc.TRAIL + x

        # print(udp_pack_new,"--u pack")
        s.sendto(udp_pack_new, ('255.255.255.255', 6000))


def curtain_opr(record, opr):
    if opr == "C":
        curtain_relay_opr(record)
    return True

def curtain_relay_opr(param, opr):
    print("Performing curatin operations")
    print(param,opr,"==")
    # {'device_id': '124', 'channel_open': '4', 'channel_close': '6', 'device_status': 'false'} curtain_opr_o ==
    if opr == "curtain_opr_c":
        # device_operations.relay_opr({"device_id" : param['device_id'], "channel_id" : param["channel_open"], 'device_status' : "false"})
        relay_opr({"device_id" : param['device_id'], "channel_id" : param["channel_close"], 'device_status' : "true"})

    if opr == "curtain_opr_o":
        # device_operations.relay_opr({"device_id" : param['device_id'], "channel_id" : param["channel_close"], 'device_status' : "false"})
       relay_opr({"device_id" : param['device_id'], "channel_id" : param["channel_open"], 'device_status' : "true"})

    if opr == "curtain_opr_s":
        relay_opr({"device_id" : param['device_id'], "channel_id" : param["channel_open"], 'device_status' : "false"})
        relay_opr({"device_id" : param['device_id'], "channel_id" : param["channel_close"], 'device_status' : "false"})


# param = {'device_id': '61', 'channel_open': '24', 'device_status': 'false'}
# param = {'device_id': '61', 'channel_close': '23', 'device_status': 'false'}
param = {'device_id': '61', 'channel_open': '24','channel_close': '23', 'device_status': 'false'}
# {"device_id": "61", "channel_open": "24", "channel_close": "23", "device_status": "false"}

# curtain_relay_opr(param, "curtain_opr_o")
# curtain_relay_opr(param, "curtain_opr_c")
curtain_relay_opr(param, "curtain_opr_s")



# device_id = '61'
# channel_id  ="24"
# 23
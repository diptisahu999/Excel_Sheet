import requests,socket
import json
from getmac import get_mac_address as gma
import public_ip as ip
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
ip_address = (s.getsockname()[0])
hostname = socket.gethostname()
# ip_address = socket.gethostbyname(hostname)
# print("Your Computer Name is:" + hostname)
# print("Your Computer IP Address is:" + ip_address)
print("my public ip: " ,ip.get())
macaddr = gma().upper()

# headers = {
#             'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}

url = "http://bms.bi-team.in/api/licenseKeyStored"
headers = {'Content-type': 'application/json', 'Accept': '*/*','Connection':'keep-alive','Accept-Encoding':'gzip, deflate, br','User-Agent':'PostmanRuntime/7.32.2',"Access-Control-Allow-Origin":''}
# get_auth_token = {
# "user_id":'2',
# "license_key":'ABCD12345',
# "mac_address": str(macaddr),
# "ip_address":str(ip_address),
# "action":'add_license_information'
# }


get_auth_token= {
"license_key":"BI25052023",
"mac_address":str(macaddr),
"ip_address":str(ip_address),
}
t = requests.post(url, json=get_auth_token ,headers = headers)
# print("API Response:", json.loads(t.text))
res = json.loads(t.text)
print(res['status'])


# get_auth_token = {
# "user_id":'1',
# "license_key":'ABCD1234',
# "mac_address": str(macaddr),
# "ip_address":str(ip_address),
# "action":'add_license_information'
# }

# get_auth_token = {
# "user_id":'3',
# "license_key":'ABCD123',
# "mac_address": str(macaddr),
# "ip_address":str(ip_address),
# "action":'add_license_information'
# }
import urllib
import requests
base_api = 'https://dashboard.airveda.com/api/data/latest/'
model_no=234
req_obj = {
"email": "bharat.borse@luthraindia.com",
"password": "Airveda@123"
}

headers = {
    'Authorization': 'Bearer id-token-here',
    'Content-Type': 'application/json'
}
data = {
    "email": "bharat.borse@luthraindia.com",
    "password": "Airveda@123"
}

response = requests.post(base_api, headers=headers, json=data)
print(response.json())
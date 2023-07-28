# import requests

# # API endpoint URL
# base_api = 'https://aura-b2b-rest.web.app/api/v1/org/qWeLCTC8yiQjvNtpRkMiuNzWIX93/devices/32002f000947393133303834/sensors'

# # API key
# api_key = '1cd4e151-dd78-49b7-a1fb-2ab856d22584'

# # Set up the headers with the API key
# headers = {
#     'Authorization': f'Bearer {api_key}'
# }

# # Make the API request
# response = requests.get(base_api, headers=headers)

# # Check if the request was successful (status code 200)
# if response.status_code == 200:
#     # Extract JSON content from the response
#     data = response.json()
#     print(data)
# else:
#     print(f"API call failed with status code: {response.status_code}")



import json

# Assuming device_data contains the JSON response as a dictionary
device_data = {
    'status': 'success',
    'data': {
        'aqi': {'value': 10, 'units': 'air quality index'},
        'pm10': {'value': 15, 'units': 'µg/m3'},
        'pm2': {'value': 1, 'units': 'µg/m3'},
        'co': {'value': 0.8, 'units': 'ppm'},
        'humidity': {'value': 75.5, 'units': '%'},
        'temperature': {'value': 23, 'units': 'C'},
        'co2': {'value': 519, 'units': 'ppm'},
        'voc': {'value': 64, 'units': 'ppb'},
        'published_at': '2023-07-28T09:04:37.104Z'
    }
}

# Process the data and store in selected_data list
selected_data = []

for item in device_data['data']:
    value = device_data['data'][item]['value']
    units = device_data['data'][item]['units']
    selected_item = {
        "item": item,
        "value": value,
        "units": units
    }
    selected_data.append(selected_item)

# Convert selected_data to JSON format
selected_data_json = json.dumps(selected_data)

# Create a new dictionary with the desired JSON response structure
response_data = {
    "status": device_data['status'],
    "data": selected_data_json,
}

# Convert the response_data dictionary to JSON format
response_json = json.dumps(response_data)

# Print the JSON response
print(response_json)

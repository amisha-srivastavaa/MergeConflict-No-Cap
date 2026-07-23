"""
Downloads weather information.
"""

import requests

response = requests.get(
    "https://api.weatherapi.com/demo"
)

print(response.text)
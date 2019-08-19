import requests
import json
import pandas as pd

"""
This example gets the first 5 users' ids and converts the GraphQL json response to a pandas dataframe
"""


url = "https://data.api.gccollab.ca/"
s = requests.Session()

query = """
{
    users(first: 5) {
        id
    }
}
"""

headers = {
    "token": "your_token_here"
}

r = s.post(url, json={'query': query}, headers=headers)

users = json.loads(r.text)["data"]["users"]

df = pd.DataFrame.from_dict(users)

print(df)
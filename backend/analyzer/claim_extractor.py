import json
import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

MODEL = os.getenv(
    "MODEL_NAME",
    "gpt-4.1-mini"
)


SYSTEM_PROMPT = """
You are a security capability classifier.

Return ONLY JSON.

Possible capabilities:

Filesystem
Network
Environment
Database
Shell
Subprocess

Example:

{
 "claims":[
   "Filesystem",
   "Network"
 ]
}
"""


def extract_claims(description: str):

    response = client.chat.completions.create(

        model=MODEL,

        messages=[

            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },

            {
                "role": "user",
                "content": description
            }

        ],

        temperature=0

    )

    content = response.choices[0].message.content

    try:

        data = json.loads(content)

        return data.get("claims", [])

    except Exception:

        return []
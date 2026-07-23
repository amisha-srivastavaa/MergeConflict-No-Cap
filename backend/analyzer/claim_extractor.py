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

    # Prevent sending extremely large READMEs
    description = description[:12000]

    try:
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

        data = json.loads(content)

        return data.get("claims", [])

    except Exception as e:
        print(f"Claim extraction failed: {e}")
        return []
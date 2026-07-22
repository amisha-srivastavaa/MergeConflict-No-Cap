from pydantic import BaseModel
from typing import List


class ScanRequest(BaseModel):
    description: str
    code: str


class ScanResponse(BaseModel):
    risk: int
    status: str

    claims: List[str]

    behavior: List[str]

    hidden_behaviors: List[str]

    explanation: str
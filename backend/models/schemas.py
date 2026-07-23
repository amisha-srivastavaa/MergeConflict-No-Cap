from pydantic import BaseModel
from typing import List
from typing import Optional


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



class UrlScanRequest(BaseModel):
    url: str
    targetType: str = "github"
    deep: bool = False
    includeDependencies: bool = False


class UrlScanResponse(BaseModel):
    scan_id: int
    status: str
    message: str
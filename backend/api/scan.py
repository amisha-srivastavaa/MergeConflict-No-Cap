from fastapi import APIRouter
from models.schemas import ScanRequest, ScanResponse

# Analyzer imports
from analyzer.claim_extractor import extract_claims
from analyzer.behavior_extractor import extract_behavior
from analyzer.diff_engine import compare_claims_behavior
from analyzer.risk_score import calculate_risk

router = APIRouter()


@router.post("/scan", response_model=ScanResponse)
def scan(request: ScanRequest):

    # Step 1
    claims = extract_claims(request.description)

    # Step 2
    behavior = extract_behavior(request.code)

    # Step 3
    hidden = compare_claims_behavior(
        claims,
        behavior
    )

    # Step 4
    risk, status, explanation = calculate_risk(
        hidden
    )

    return ScanResponse(
        risk=risk,
        status=status,
        claims=claims,
        behavior=behavior,
        hidden_behaviors=hidden,
        explanation=explanation
    )
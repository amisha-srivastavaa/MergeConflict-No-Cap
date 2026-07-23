from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from models.schemas import ScanRequest, ScanResponse

from analyzer.claim_extractor import extract_claims
from analyzer.behavior_extractor import extract_behavior
from analyzer.diff_engine import compare_claims_behavior
from analyzer.risk_score import calculate_risk

from database.database import get_db
from database.models import ScanResult

router = APIRouter()


@router.post("/scan", response_model=ScanResponse)
def scan(request: ScanRequest, db: Session = Depends(get_db)):

    # Extract claimed capabilities
    claims = extract_claims(request.description)

    # Extract actual behavior
    behavior = extract_behavior(request.code)

    # Compare
    hidden = compare_claims_behavior(
        claims,
        behavior
    )

    # Calculate risk
    risk, status, explanation = calculate_risk(hidden)

    # Save to DB
    result = ScanResult(
        description=request.description,
        claims=",".join(claims),
        behavior=",".join(behavior),
        hidden_behaviors=",".join(hidden),
        risk_score=risk,
        status=status,
        explanation=explanation
    )

    db.add(result)
    db.commit()

    return ScanResponse(
        risk=risk,
        status=status,
        claims=claims,
        behavior=behavior,
        hidden_behaviors=hidden,
        explanation=explanation
    )
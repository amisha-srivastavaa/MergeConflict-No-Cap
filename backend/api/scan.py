from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from models.schemas import (
    ScanRequest,
    ScanResponse,
    UrlScanRequest,
    UrlScanResponse,
)

from analyzer.claim_extractor import extract_claims
from analyzer.behavior_extractor import extract_behavior
from analyzer.diff_engine import compare_claims_behavior
from analyzer.risk_score import calculate_risk

from database.database import get_db
from database.models import ScanResult

router = APIRouter()


# ---------------------------------------------------
# Existing Local Scan Endpoint
# ---------------------------------------------------
@router.post("/scan", response_model=ScanResponse)
def scan(request: ScanRequest, db: Session = Depends(get_db)):

    claims = extract_claims(request.description)

    behavior = extract_behavior(request.code)

    hidden = compare_claims_behavior(
        claims,
        behavior
    )

    risk, status, explanation = calculate_risk(hidden)

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
    db.refresh(result)

    return ScanResponse(
        risk=risk,
        status=status,
        claims=claims,
        behavior=behavior,
        hidden_behaviors=hidden,
        explanation=explanation
    )


# ---------------------------------------------------
# React Frontend Compatibility
# ---------------------------------------------------
@router.post("/scan/url", response_model=UrlScanResponse)
def scan_url(
    request: UrlScanRequest,
    db: Session = Depends(get_db)
):

    result = ScanResult(
        description=f"Repository: {request.url}",
        claims="",
        behavior="",
        hidden_behaviors="",
        risk_score=0,
        status="PENDING",
        explanation="Repository scan queued."
    )

    db.add(result)
    db.commit()
    db.refresh(result)

    return UrlScanResponse(
        scan_id=result.id,
        status="PENDING",
        message="Repository scan queued."
    )





# ---------------------------------------------------
# Scan History
# ---------------------------------------------------
@router.get("/scan/history")
def get_history(
    db: Session = Depends(get_db)
):

    results = (
        db.query(ScanResult)
        .order_by(ScanResult.created_at.desc())
        .all()
    )

    history = []

    for item in results:

        history.append({

            "id": item.id,

            "url": None,

            "repo_name": None,

            "target_type": "github",

            "risk_score": item.risk_score,

            "risk_level": item.status,

            "status": item.status,

            "explanation": item.explanation,

            "claims": item.claims.split(",") if item.claims else [],

            "behavior": item.behavior.split(",") if item.behavior else [],

            "hidden_behaviors": item.hidden_behaviors.split(",") if item.hidden_behaviors else [],

            "created_at": item.created_at

        })

    return history


# ---------------------------------------------------
# Analytics
# ---------------------------------------------------
@router.get("/scan/analytics")
def analytics(
    db: Session = Depends(get_db)
):

    scans = db.query(ScanResult).all()

    total = len(scans)

    safe = sum(
        1 for s in scans
        if s.status == "SAFE"
    )

    medium = sum(
        1 for s in scans
        if s.status == "MEDIUM"
    )

    high = sum(
        1 for s in scans
        if s.status == "HIGH"
    )

    average = (
        sum(s.risk_score for s in scans) / total
        if total else 0
    )

    return {
        "totalScans": total,
        "safeCount": safe,
        "mediumCount": medium,
        "highCount": high,
        "averageRiskScore": average
    }

# ---------------------------------------------------
# Get Single Scan
# ---------------------------------------------------
@router.get("/scan/{scan_id}")
def get_scan(
    scan_id: int,
    db: Session = Depends(get_db)
):

    result = (
        db.query(ScanResult)
        .filter(ScanResult.id == scan_id)
        .first()
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Scan not found"
        )

    return {
        "id": result.id,
        "url": None,
        "repo_name": None,
        "target_type": "github",

        "risk_score": result.risk_score,
        "risk_level": result.status,
        "status": result.status,

        "explanation": result.explanation,

        "claims": result.claims.split(",") if result.claims else [],
        "behavior": result.behavior.split(",") if result.behavior else [],
        "hidden_behaviors": result.hidden_behaviors.split(",") if result.hidden_behaviors else [],

        "created_at": result.created_at
    }
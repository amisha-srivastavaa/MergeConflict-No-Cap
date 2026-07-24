from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import traceback

from models.schemas import (
    ScanRequest,
    ScanResponse,
    UrlScanRequest,
    UrlScanResponse,
)
from github.fetcher import (
    fetch_readme,
    fetch_repository_code,
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
@router.post("/scan/url", response_model=UrlScanResponse)
def scan_url(
    request: UrlScanRequest,
    db: Session = Depends(get_db)
):

    try:
        # Fetch repository contents
        readme = fetch_readme(request.url)
        code = fetch_repository_code(request.url)

        # Run analysis
        claims = extract_claims(readme)
        behavior = extract_behavior(code)

        hidden = compare_claims_behavior(
            claims,
            behavior
        )

        risk, status, explanation = calculate_risk(hidden)

        # Save to database
        result = ScanResult(
            description=readme,
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

        # Return response expected by frontend
        return UrlScanResponse(
            id=result.id,
            risk=risk,
            status=status,
            claims=claims,
            behavior=behavior,
            hidden_behaviors=hidden,
            explanation=explanation
        )

    except Exception as e:
        print("\n========== ERROR ==========")
        traceback.print_exc()
        print("===========================\n")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ---------------------------------------------------
# React Frontend Compatibility
# ---------------------------------------------------
@router.post("/scan/url", response_model=UrlScanResponse)
def scan_url(
    request: UrlScanRequest,
    db: Session = Depends(get_db)
):

    try:

        print("Fetching repository...")

        readme = fetch_readme(request.url)

        files = fetch_repository_code(request.url)

        print(f"README length: {len(readme)}")
        print(f"Files downloaded: {len(files)}")

        print("Extracting claims...")

        claims = extract_claims(readme)

        print("Claims:", claims)

        print("Extracting behavior...")

        behavior = extract_behavior(files)

        print("Behavior:", behavior)

        hidden = compare_claims_behavior(
            claims,
            behavior
        )

        print("Hidden:", hidden)

        risk, status, explanation = calculate_risk(hidden)

        result = ScanResult(
            description=readme,
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

        return UrlScanResponse(
            id=result.id,
            risk=result.risk_score,
            status=result.status,
            claims=claims,
            behavior=behavior,
            hidden_behaviors=hidden,
            explanation=explanation,
            message="Repository analyzed successfully."
        )

    except Exception as e:

        print(e)

        raise HTTPException(
            status_code=500,
            detail=str(e)
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
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas import AnalyzeResponse, VehicleDetected, ViolationDetected, ChallanIssued
from app.services.challan import issue_challan
from app.emailer import send_email
from app.templates.email_templates import challan_email

router = APIRouter(prefix="/process", tags=["process"])

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_video(
    location: str = Form(...),
    video: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    detected_plate = "KA01AB1234"
    detected_type = "car"
    violation_code = "RED_LIGHT"
    confidence = 0.92

    try:
        challan_row = issue_challan(
            db=db,
            plate=detected_plate,
            vehicle_type=detected_type,
            violation_code=violation_code,
            location=location,
            user_id=None,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    html = challan_email(
        plate=detected_plate,
        vehicle_type=detected_type,
        violation_code=violation_code,
        location=location,
        amount=challan_row.amount,
    )
    try:
        send_email(subject=f"Challan for {detected_plate} ({violation_code})", html=html)
    except Exception:
        pass

    return AnalyzeResponse(
        vehicle=VehicleDetected(plate=detected_plate, type=detected_type),
        violation=ViolationDetected(type=violation_code, confidence=confidence, location=location),
        challan=ChallanIssued(id=challan_row.id, amount=challan_row.amount, status="ISSUED"),
    )

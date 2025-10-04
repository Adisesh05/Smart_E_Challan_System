from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db import get_db
from app import models, schemas

router = APIRouter(prefix="/challans", tags=["challans"])

def _to_out(row: models.Challan) -> schemas.ChallanOut:
    return schemas.ChallanOut(
        id=row.id,
        plate=row.vehicle.number_plate if row.vehicle else "",
        type=row.vehicle.type if row.vehicle and row.vehicle.type else "",
        amount=row.amount,
        status="PAID" if row.is_paid else "ISSUED",
        issued_at=row.issued_at,
    )

@router.get("", response_model=List[schemas.ChallanOut])
def list_challans(
    db: Session = Depends(get_db),
    plate: Optional[str] = Query(default=None, description="Filter by exact number plate"),
    is_paid: Optional[bool] = Query(default=None, description="Filter by payment status"),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
):
    q = db.query(models.Challan).join(models.Vehicle)
    if plate:
        q = q.filter(models.Vehicle.number_plate == plate)
    if is_paid is not None:
        q = q.filter(models.Challan.is_paid == is_paid)
    rows = q.order_by(models.Challan.id.desc()).limit(limit).offset(offset).all()
    return [_to_out(r) for r in rows]

@router.get("/{challan_id}", response_model=schemas.ChallanOut)
def get_challan(challan_id: int, db: Session = Depends(get_db)):
    row = db.get(models.Challan, challan_id)
    if not row:
        raise HTTPException(status_code=404, detail="Challan not found")
    return _to_out(row)

@router.patch("/{challan_id}/pay", response_model=schemas.ChallanOut)
def mark_paid(challan_id: int, db: Session = Depends(get_db)):
    row = db.get(models.Challan, challan_id)
    if not row:
        raise HTTPException(status_code=404, detail="Challan not found")
    if row.is_paid:
        return _to_out(row)
    row.is_paid = True
    db.commit()
    db.refresh(row)
    return _to_out(row)

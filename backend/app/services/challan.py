from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app import models

DEFAULT_VIOLATIONS = [
    ("RED_LIGHT",   "Red light violation",           1000.0),
    ("NO_HELMET",   "Riding without helmet",          500.0),
    ("NO_SEATBELT", "Driving without seatbelt",      1000.0),
    ("WRONG_LANE",  "Wrong lane / One-way",           750.0),
    ("OVERSPEED",   "Over-speeding",                 1500.0),
]

def ensure_violation_types(db: Session) -> int:
    added = 0
    for code, desc, base in DEFAULT_VIOLATIONS:
        if not db.query(models.ViolationType).filter(models.ViolationType.code == code).first():
            db.add(models.ViolationType(code=code, description=desc, base_penalty=base))
            added += 1
    if added:
        db.commit()
    return added

def upsert_vehicle(db: Session, plate: str, vehicle_type: str | None = None, owner_id: int | None = None) -> models.Vehicle:
    v = db.query(models.Vehicle).filter(models.Vehicle.number_plate == plate).first()
    if v:
        if vehicle_type and not v.type:
            v.type = vehicle_type
            db.commit(); db.refresh(v)
        return v
    v = models.Vehicle(number_plate=plate, type=vehicle_type, owner_id=owner_id)
    db.add(v); db.commit(); db.refresh(v)
    return v

def escalate_amount(db: Session, vehicle_id: int, violation_type_id: int, base_penalty: float) -> float:
    unpaid = db.query(models.Challan).filter(
        and_(models.Challan.vehicle_id == vehicle_id, models.Challan.is_paid == False)  # noqa: E712
    )
    same = unpaid.filter(models.Challan.violation_type_id == violation_type_id).order_by(models.Challan.id.desc()).first()
    if same:
        return round(same.amount * 2.0, 2)
    other = unpaid.filter(models.Challan.violation_type_id != violation_type_id).first()
    if other:
        return round(base_penalty * 1.25, 2)
    return float(base_penalty)

def issue_challan(db: Session, plate: str, vehicle_type: str, violation_code: str, location: str | None = None, user_id: int | None = None) -> models.Challan:
    vt = db.query(models.ViolationType).filter(models.ViolationType.code == violation_code).first()
    if not vt:
        raise ValueError(f"Violation type '{violation_code}' not found. Call /bootstrap/violation-types first.")
    vehicle = upsert_vehicle(db, plate=plate, vehicle_type=vehicle_type)
    amount = escalate_amount(db, vehicle.id, vt.id, vt.base_penalty)
    row = models.Challan(
        issued_at=datetime.utcnow(),
        amount=amount,
        is_paid=False,
        user_id=user_id,
        vehicle_id=vehicle.id,
        violation_type_id=vt.id,
    )
    db.add(row); db.commit(); db.refresh(row)
    return row

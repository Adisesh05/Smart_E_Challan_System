from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.services.challan import ensure_violation_types
from app.schemas import BootstrapResponse

router = APIRouter(prefix="/bootstrap", tags=["bootstrap"])

@router.post("/violation-types", response_model=BootstrapResponse)
def bootstrap_violation_types(db: Session = Depends(get_db)):
    ensure_violation_types(db)
    return {"ok": True}

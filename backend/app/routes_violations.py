from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app import models, schemas

router = APIRouter(prefix="/violations", tags=["violations"])

@router.get("", response_model=List[schemas.ViolationTypeOut])
def list_violations(db: Session = Depends(get_db)):
    return db.query(models.ViolationType).order_by(models.ViolationType.code.asc()).all()

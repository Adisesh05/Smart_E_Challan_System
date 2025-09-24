# backend/app/schemas.py
from datetime import datetime
from typing import Optional, List, Literal

from pydantic import BaseModel, EmailStr, Field, ConfigDict


# ---------- Common ----------

class Msg(BaseModel):
    message: str


# ---------- Auth ----------

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool
    is_admin: bool


# ---------- Vehicle ----------

class VehicleCreate(BaseModel):
    number_plate: str
    type: Optional[str] = None  # car | bike | truck | auto etc.


class VehicleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    number_plate: str
    type: Optional[str] = None
    owner_id: Optional[int] = None


# ---------- Violation Types (master data) ----------

class ViolationTypeCreate(BaseModel):
    code: str  # e.g., RED_LIGHT, NO_HELMET
    description: str
    base_penalty: float


class ViolationTypeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    description: str
    base_penalty: float


# ---------- Challans ----------

class ChallanOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    plate: str
    type: str              # violation type code
    amount: float
    status: Literal["ISSUED", "PAID"] = "ISSUED"
    issued_at: datetime


# ---------- Analysis (what /process/analyze returns) ----------

class VehicleDetected(BaseModel):
    plate: str
    type: str


class ViolationDetected(BaseModel):
    type: str
    confidence: float
    location: str


class ChallanIssued(BaseModel):
    id: int
    amount: float
    status: Literal["ISSUED", "PAID"] = "ISSUED"


class AnalyzeResponse(BaseModel):
    vehicle: VehicleDetected
    violation: ViolationDetected
    challan: ChallanIssued


# ---------- Bootstrap ----------

class BootstrapResponse(BaseModel):
    ok: bool = True

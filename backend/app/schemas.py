from datetime import datetime
from typing import Optional, Literal, List
from pydantic import BaseModel, EmailStr, ConfigDict

class Msg(BaseModel):
    message: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
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
    full_name: Optional[str]
    is_active: bool
    is_admin: bool

class VehicleCreate(BaseModel):
    number_plate: str
    type: Optional[str] = None

class VehicleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    number_plate: str
    type: Optional[str] = None
    owner_id: Optional[int] = None

class ViolationTypeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    code: str
    description: str
    base_penalty: float

class ChallanOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    plate: str
    type: str
    amount: float
    status: Literal["ISSUED", "PAID"] = "ISSUED"
    issued_at: datetime

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

class BootstrapResponse(BaseModel):
    ok: bool = True

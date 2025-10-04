from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, DateTime, ForeignKey, Boolean, Float, UniqueConstraint
)
from sqlalchemy.orm import relationship
from app.db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), default="")
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)

    vehicles = relationship("Vehicle", back_populates="owner")
    challans = relationship("Challan", back_populates="user")

class Vehicle(Base):
    __tablename__ = "vehicles"
    __table_args__ = (UniqueConstraint("number_plate", name="uq_vehicle_plate"),)
    id = Column(Integer, primary_key=True)
    number_plate = Column(String(64), nullable=False, index=True)
    type = Column(String(32), nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    owner = relationship("User", back_populates="vehicles")
    challans = relationship("Challan", back_populates="vehicle")

class ViolationType(Base):
    __tablename__ = "violation_types"
    __table_args__ = (UniqueConstraint("code", name="uq_violation_code"),)
    id = Column(Integer, primary_key=True)
    code = Column(String(64), nullable=False, index=True)
    description = Column(String(255), nullable=False)
    base_penalty = Column(Float, nullable=False, default=0.0)

    challans = relationship("Challan", back_populates="violation_type")

class Challan(Base):
    __tablename__ = "challans"
    id = Column(Integer, primary_key=True)
    issued_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    amount = Column(Float, nullable=False, default=0.0)
    is_paid = Column(Boolean, default=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    violation_type_id = Column(Integer, ForeignKey("violation_types.id"), nullable=False)

    user = relationship("User", back_populates="challans")
    vehicle = relationship("Vehicle", back_populates="challans")
    violation_type = relationship("ViolationType", back_populates="challans")

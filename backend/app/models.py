# backend/app/models.py
from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Boolean,
    Float,
    Enum,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)

    vehicles = relationship("Vehicle", back_populates="owner")
    challans = relationship("Challan", back_populates="user")


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    number_plate = Column(String, unique=True, index=True, nullable=False)
    type = Column(String, nullable=True)  # car, bike, truck, etc.
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="vehicles")
    challans = relationship("Challan", back_populates="vehicle")


class ViolationType(Base):
    __tablename__ = "violation_types"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)  # e.g. RL (red light)
    description = Column(String, nullable=False)
    base_penalty = Column(Float, nullable=False)


class Challan(Base):
    __tablename__ = "challans"
    __table_args__ = (UniqueConstraint("vehicle_id", "violation_type_id", "is_paid", name="uq_unpaid_per_type"),)

    id = Column(Integer, primary_key=True, index=True)
    issued_at = Column(DateTime, default=datetime.utcnow)
    amount = Column(Float, nullable=False)
    is_paid = Column(Boolean, default=False)

    # relations
    user_id = Column(Integer, ForeignKey("users.id"))
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    violation_type_id = Column(Integer, ForeignKey("violation_types.id"))

    user = relationship("User", back_populates="challans")
    vehicle = relationship("Vehicle", back_populates="challans")
    violation_type = relationship("ViolationType")

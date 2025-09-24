# backend/app/db.py
from contextlib import contextmanager
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.config import settings


class Base(DeclarativeBase):
    """Base class for SQLAlchemy models."""
    pass


# Create SQLAlchemy engine from env
if settings.DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False},  # needed for SQLite
        pool_pre_ping=True,
    )
else:
    # Postgres (e.g., Supabase). Ensure your .env uses +psycopg2 and sslmode=require
    # Example:
    # DATABASE_URL=postgresql+psycopg2://postgres:PASS@db.xxx.supabase.co:5432/postgres?sslmode=require
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
    )

# Session factory
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def init_db() -> None:
    """Import models and create tables if not present."""
    # Import here to avoid circular imports at module import time
    from app import models  # noqa: F401
    Base.metadata.create_all(bind=engine)


def get_db() -> Generator:
    """FastAPI dependency to get a DB session per-request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def session_scope() -> Generator:
    """Context manager for scripts / jobs."""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
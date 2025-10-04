from functools import lru_cache
from typing import List, Optional, Union
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator
import json


class Settings(BaseSettings):
    # ==== Base Configuration ====
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ==== Security & JWT ====
    JWT_SECRET: str = "changeme"
    JWT_ALG: str = "HS256"
    JWT_EXPIRE_MIN: int = 1440  # 1 day

    # ==== Database ====
    DATABASE_URL: str = "sqlite:///./echallan.db"

    # ==== SMTP Config ====
    SMTP_HOST: str = "localhost"
    SMTP_PORT: int = 25
    SMTP_USER: Optional[str] = None
    SMTP_PASS: Optional[str] = None
    SMTP_USE_TLS: bool = False

    # ==== Alerts ====
    ALERT_TO: str = "adisesh2267@gmail.com"
    ALERT_FROM: str = "no-reply@echallan.local"

    # ==== CORS ====
    cors_origins_raw: str = Field(default="", alias="CORS_ORIGINS_RAW")
    cors_origins: List[str] = Field(default=["http://localhost:3000"], alias="CORS_ORIGINS")

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors(cls, v: Union[str, List[str]]):
        """Support JSON list or comma-separated string for CORS_ORIGINS."""
        if isinstance(v, str):
            v = v.strip()
            if not v:
                return []
            # Try JSON list format
            if v.startswith("["):
                try:
                    parsed = json.loads(v)
                    if isinstance(parsed, list):
                        return [s.strip() for s in parsed if s.strip()]
                except Exception:
                    pass
            # Otherwise assume comma-separated
            return [s.strip() for s in v.split(",") if s.strip()]
        return v

    @property
    def merged_cors_origins(self) -> List[str]:
        """
        Combines both cors_origins_raw (simple CSV) and cors_origins (parsed field).
        Useful if both are defined.
        """
        origins = set(self.cors_origins or [])
        if self.cors_origins_raw:
            for s in self.cors_origins_raw.split(","):
                s = s.strip()
                if s:
                    origins.add(s)
        return list(origins)

    # ==== Logging ====
    LOG_LEVEL: str = "info"


@lru_cache()
def get_settings() -> "Settings":
    """Cached settings instance to avoid reloading each import."""
    return Settings()


settings = get_settings()

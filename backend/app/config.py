# backend/app/config.py
from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    # Tell pydantic-settings to read backend/.env and ignore unknown keys
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",  # don't error on unexpected env vars
    )

    # ========= SECURITY / JWT =========
    JWT_SECRET: str = "changeme"
    JWT_ALG: str = "HS256"
    JWT_EXPIRE_MIN: int = 1440  # minutes

    # ========= DATABASE =========
    DATABASE_URL: str = "sqlite:///./echallan.db"

    # ========= EMAIL / SMTP =========
    SMTP_HOST: str = "localhost"
    SMTP_PORT: int = 25
    SMTP_USER: str | None = None
    SMTP_PASS: str | None = None
    SMTP_USE_TLS: bool = False  # "true"/"false" in .env are coerced to bool

    # ========= E-CHALLAN NOTIFICATIONS =========
    ALERT_TO: str = "adisesh2267@gmail.com"
    ALERT_FROM: str = "no-reply@echallan.local"

    # ========= CORS (Front-end origins allowed) =========
    # Map the env var CORS_ORIGINS -> this raw string field
    # Example in .env:
    #   CORS_ORIGINS=http://localhost:3000,https://your-v0-preview
    CORS_ORIGINS_RAW: str = Field(default="http://localhost:3000", alias="CORS_ORIGINS")

    # ========= LOGGING =========
    LOG_LEVEL: str = "info"

    # Expose a parsed list for the app to use
    @property
    def CORS_ORIGINS(self) -> List[str]:
        s = (self.CORS_ORIGINS_RAW or "").strip()
        if not s:
            return []
        # Allow JSON array too
        if s.startswith("["):
            import json
            try:
                v = json.loads(s)
                if isinstance(v, list):
                    return [str(x).strip() for x in v if str(x).strip()]
            except Exception:
                pass
        # Fallback: comma-separated
        return [x.strip() for x in s.split(",") if x.strip()]


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

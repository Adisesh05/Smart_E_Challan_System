# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db import init_db
from app.auth import router as auth_router


def create_app() -> FastAPI:
    app = FastAPI(title="e-Challan API", version="0.1.0")

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,  # e.g. ['http://localhost:3000', ...]
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    def _startup():
        init_db()

    @app.get("/ping")
    def ping():
        return {"message": "pong"}

    # register routers
    app.include_router(auth_router)

    return app


app = create_app()

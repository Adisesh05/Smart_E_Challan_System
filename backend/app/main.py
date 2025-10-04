from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db import init_db
from app.auth import router as auth_router
from app.routes_bootstrap import router as bootstrap_router
from app.routes_process import router as process_router
from app.routes_challans import router as challans_router
from app.routes_violations import router as violations_router

def create_app() -> FastAPI:
    app = FastAPI(title="e-Challan API", version="0.1.0")

    allow_origins = settings.cors_origins or [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    def _startup():
        init_db()

    @app.get("/")
    def root():
        return {"ok": True, "service": "e-Challan API", "docs": "/docs", "ping": "/ping"}

    @app.get("/ping")
    def ping():
        return {"message": "pong"}

    app.include_router(auth_router)
    app.include_router(bootstrap_router)
    app.include_router(process_router)
    app.include_router(challans_router)
    app.include_router(violations_router)

    return app

app = create_app()

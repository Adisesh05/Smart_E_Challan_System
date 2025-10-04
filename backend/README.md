# e‑Challan Backend (FastAPI)

## Quick start (Windows, PowerShell)

1. Go to this folder:
   ```powershell
   cd backend
   ```
2. Make sure your `.env` is present (use your existing values).
3. Create venv and install deps:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   python -m ensurepip --upgrade
   python -m pip install --upgrade pip setuptools wheel
   python -m pip install -r requirements.txt
   ```
4. Run the API:
   ```powershell
   python -m uvicorn app.main:app --reload --port 8000
   ```
5. Open http://127.0.0.1:8000/docs
   - POST `/bootstrap/violation-types`
   - POST `/process/analyze` (send any file + a location) → returns challan
   - GET `/challans` → list
   - PATCH `/challans/{id}/pay` → mark paid

## Environment variables expected
- JWT_SECRET, JWT_ALG, JWT_EXPIRE_MIN
- DATABASE_URL
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_USE_TLS
- ALERT_TO, ALERT_FROM
- CORS_ORIGINS

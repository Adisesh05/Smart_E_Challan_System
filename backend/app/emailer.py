from __future__ import annotations
import asyncio
from email.message import EmailMessage
from typing import Optional
import aiosmtplib
from app.config import settings

async def send_email_async(
    subject: str,
    html: str,
    *,
    to: Optional[str] = None,
    from_addr: Optional[str] = None,
    plain_fallback: str | None = None,
) -> None:
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = from_addr or settings.ALERT_FROM
    msg["To"] = to or settings.ALERT_TO

    if not plain_fallback:
        plain_fallback = "HTML email"
    msg.set_content(plain_fallback)
    msg.add_alternative(html, subtype="html")

    await aiosmtplib.send(
        msg,
        hostname=settings.SMTP_HOST,
        port=settings.SMTP_PORT,
        start_tls=bool(settings.SMTP_USE_TLS),
        username=settings.SMTP_USER or None,
        password=settings.SMTP_PASS or None,
    )

def send_email(subject: str, html: str, *, to: Optional[str] = None, from_addr: Optional[str] = None) -> None:
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            fut = asyncio.run_coroutine_threadsafe(
                send_email_async(subject, html, to=to, from_addr=from_addr), loop
            )
            fut.result()
            return
    except RuntimeError:
        pass
    loop = asyncio.new_event_loop()
    try:
        asyncio.set_event_loop(loop)
        loop.run_until_complete(send_email_async(subject, html, to=to, from_addr=from_addr))
    finally:
        loop.close()

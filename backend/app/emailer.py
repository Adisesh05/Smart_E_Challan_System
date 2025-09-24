# backend/app/emailer.py
"""
Lightweight SMTP mailer for the e-Challan backend.

- Uses settings from app.config (Gmail/SMTP or MailHog, etc.)
- Exposes async `send_email_async(...)` and sync wrapper `send_email(...)`
- HTML content supported; plain-text fallback auto-added
"""

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
    """
    Send an email (HTML + optional plain fallback) using SMTP.

    Args:
        subject: Email subject
        html: HTML body
        to: override recipient (defaults to settings.ALERT_TO)
        from_addr: override sender (defaults to settings.ALERT_FROM)
        plain_fallback: optional plain text; if not provided, a generic fallback is used
    """
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = from_addr or settings.ALERT_FROM
    msg["To"] = to or settings.ALERT_TO

    # Plain text fallback
    if not plain_fallback:
        plain_fallback = "This is an HTML email. Please view in an HTML-capable client."

    msg.set_content(plain_fallback)
    msg.add_alternative(html, subtype="html")

    # TLS vs plain (STARTTLS recommended for Gmail: port 587)
    if settings.SMTP_USE_TLS:
        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            start_tls=True,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASS,
        )
    else:
        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            start_tls=False,
            username=settings.SMTP_USER or None,
            password=settings.SMTP_PASS or None,
        )


def send_email(
    subject: str,
    html: str,
    *,
    to: Optional[str] = None,
    from_addr: Optional[str] = None,
    plain_fallback: str | None = None,
) -> None:
    """
    Synchronous wrapper (handy inside regular FastAPI endpoints).
    """
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # If we're already in an event loop (e.g., inside FastAPI with lifespan),
            # schedule it and block until done.
            fut = asyncio.run_coroutine_threadsafe(
                send_email_async(
                    subject, html, to=to, from_addr=from_addr, plain_fallback=plain_fallback
                ),
                loop,
            )
            fut.result()
            return
    except RuntimeError:
        # No running loop; we'll create one below.
        pass

    loop = asyncio.new_event_loop()
    try:
        asyncio.set_event_loop(loop)
        loop.run_until_complete(
            send_email_async(
                subject, html, to=to, from_addr=from_addr, plain_fallback=plain_fallback
            )
        )
    finally:
        loop.close()

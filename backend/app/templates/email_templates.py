def challan_email(plate: str, vehicle_type: str, violation_code: str, location: str, amount: float) -> str:
    return f"""    <html>
      <body style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#f6f7fb; padding:24px;">
        <div style="max-width:640px;margin:0 auto;background:white;border-radius:12px;padding:24px;box-shadow:0 6px 24px rgba(0,0,0,.08)">
          <h2 style="margin:0 0 12px;color:#ef4444">New Traffic Challan</h2>
          <p><b>Plate:</b> {plate}</p>
          <p><b>Vehicle:</b> {vehicle_type}</p>
          <p><b>Violation:</b> {violation_code}</p>
          <p><b>Location:</b> {location}</p>
          <p style="font-size:18px;"><b>Amount:</b> ₹{amount:.2f}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
          <small style="color:#6b7280">Automated notification from e‑Challan system.</small>
        </div>
      </body>
    </html>
    """

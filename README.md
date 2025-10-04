# 🚦 Smart e-Challan System (WIP)

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![Status](https://img.shields.io/badge/status-Work%20in%20Progress-orange?logo=github)]()
[![Made with FastAPI](https://img.shields.io/badge/FastAPI-005571?logo=fastapi&logoColor=white)]()
[![Frontend](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)]()
[![Database](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)]()
[![AI/ML](https://img.shields.io/badge/YOLOv8/YOLOv9-vision-green?logo=python&logoColor=white)]()
[![OCR](https://img.shields.io/badge/OCR-EasyOCR%20%7C%20PaddleOCR-yellow)]()

> ⚡ **AI-powered traffic violation detection & digital challan generation system**  
> Bringing **Computer Vision + Automation + Smart Enforcement** together for the future of **safe and smart cities** 🌍  
> 🚧 **This project is a Work-in-Progress (WIP)** and is being actively developed.

---

## ✨ Overview

The **Smart e-Challan System** is an AI-driven solution that detects traffic violations, extracts vehicle number plates using OCR, and generates e-Challans automatically.  
It eliminates manual effort, improves transparency, and enables **real-time, data-driven enforcement**.

---

## 🔑 Features (Planned & In-Progress)

- 🏍️ **Vehicle & Rider Detection** — YOLOv8 / YOLOv9  
- 🎥 **Multi-Object Tracking** — ByteTrack  
- 🔍 **ANPR (Automatic Number Plate Recognition)** — EasyOCR / PaddleOCR + GFPGAN / Real-ESRGAN  
- 🚦 **Violation Detection** — Helmetless riders, red-light jumping, overspeeding, more  
- 💳 **Penalty Escalation Logic** —  
  - 2× for repeat violations  
  - 1.25× for new types  
- 📧 **Email Notifications** — Auto-send challan proof snapshots  
- 🗄️ **Database Integration** — PostgreSQL (via Supabase)  
- 🔐 **Secure APIs** — FastAPI + JWT Authentication  
- 🌐 **Frontend Dashboard** — Built in Next.js + Tailwind CSS

---

## 🏗️ Architecture

```plaintext
Frontend (Next.js + Tailwind)
         ↓
   FastAPI Backend (Microservices)
         ↓
   ├── Detection Service (YOLO + ByteTrack)
   ├── ANPR Service (OCR + Image Enhancer)
   ├── Violation Service (Rules + Escalation)
   ├── Challan Service (Generation + Emailer)
         ↓
   PostgreSQL (Supabase Cloud DB)
🚧 Current Status
✅ Backend structure built (FastAPI + Supabase)

✅ Frontend setup (Next.js + Tailwind)

⚙️ Detection + OCR modules under testing

🔜 Upcoming:

Live camera streaming

Public dashboard

Docker + Kubernetes deployment

⚡ Tech Stack
Layer	Technologies
Frontend	Next.js, Tailwind CSS
Backend	FastAPI, SQLAlchemy, JWT
Database	Supabase (PostgreSQL)
AI / ML	YOLOv8/YOLOv9, ByteTrack
OCR	EasyOCR, PaddleOCR
Image Enhancement	GFPGAN, Real-ESRGAN
DevOps (Planned)	Docker, Kubernetes

🚀 Quick Start

# Clone the repository
git clone https://github.com/your-username/smart-echallan.git
cd smart-echallan

# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
🤝 Contributing
We’re still building this! Contributions are welcome ❤️

Fork the repository

Create a new branch

Submit a PR

📌 Disclaimer
⚠️ Prototype — Work in Progress.
This is an educational and research project. Not for real-world enforcement use yet.

🌟 Vision
A future where traffic violations are detected instantly, challans are generated digitally, and enforcement becomes transparent, automated, and smart 🚦💡
That’s the Smart e-Challan vision!

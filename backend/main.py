from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from database import engine, init_db
from routers import dashboard

# Lifecycle: init database saat startup 
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Run init_db saat app startup"""
    print("🚀 Initializing database...")
    init_db()
    print("✅ Database ready")
    yield
    # Cleanup (jika ada) bisa ditaruh di sini

# FastAPI 
app = FastAPI(
    title="DPMPTSP Jawa Timur API",
    description="Backend API untuk Dashboard Realisasi Penanaman Modal",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS mengizinkan frontend akses API 
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])

# Health check pake swagger
@app.get("/")
def root():
    return {
        "message": "DPMPTSP Jawa Timur API",
        "docs": "/docs",
        "status": " 200 ok",
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

"""
FastAPI Backend <nanti buat swagger api biar mudah integrasi>

Endpoint utama:
- GET  /api/dashboard/options   → list tahun, sektor, dll untuk filter
- POST /api/dashboard/kpi       → KPI cards (total, PMA, PMDN, TKI + growth)
- POST /api/dashboard/bar-tahun → data bar chart per tahun
- POST /api/dashboard/sektor    → data chart per sektor
- POST /api/dashboard/kabkota   → ranking kab/kota
- POST /api/dashboard/negara    → ranking negara (PMA ajh)
"""
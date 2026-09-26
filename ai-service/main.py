from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from routers import forecast, anomalies, copilot

app = FastAPI(title="StockSense AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forecast.router, prefix="/forecast", tags=["Forecast"])
app.include_router(anomalies.router, prefix="/anomalies", tags=["Anomalies"])
app.include_router(copilot.router, prefix="/copilot", tags=["Copilot"])

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "StockSense AI"}

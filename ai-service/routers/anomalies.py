from fastapi import APIRouter, HTTPException
from services.detector import detect_anomalies

router = APIRouter()

@router.get("/")
async def get_anomalies(days: int = 30):
    try:
        result = detect_anomalies(days)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

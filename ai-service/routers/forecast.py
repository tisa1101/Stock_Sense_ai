from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from services.forecaster import forecast_demand

router = APIRouter()

@router.post("/{product_id}")
async def get_forecast(product_id: int, horizon_days: int = 30):
    try:
        result = forecast_demand(product_id, horizon_days)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

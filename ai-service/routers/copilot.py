from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from services.copilot_service import chat

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    context: Optional[Dict[str, Any]] = {}

@router.post("/chat")
async def copilot_chat(request: ChatRequest):
    try:
        history_dicts = [{"role": msg.role, "content": msg.content} for msg in request.history]
        result = chat(request.message, history_dicts, request.context)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

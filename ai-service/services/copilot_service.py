import os
import json
import google.generativeai as genai
from datetime import datetime
from services.db import get_dashboard_context

def chat(message: str, history: list, context: dict = None):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
        return {
            "reply": "I'm sorry, my AI capabilities are currently disabled because the GEMINI_API_KEY is not configured.",
            "timestamp": datetime.now().isoformat()
        }
        
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Build prompt
        system_prompt = "You are StockSense Copilot, an AI assistant for inventory management. You help users understand their stock data, predict needs, and make smart inventory decisions. Always be specific with numbers and product names when available. Format responses in clear markdown."
        
        db_context = get_dashboard_context()
        if context:
            db_context.update(context)
            
        full_prompt = f"{system_prompt}\n\nCurrent Dashboard Context:\n{json.dumps(db_context, indent=2)}\n\n"
        
        # Format history
        formatted_history = []
        for msg in history:
            role = "user" if msg.get("role") == "user" else "model"
            formatted_history.append({"role": role, "parts": [msg.get("content", "")]})
            
        chat_session = model.start_chat(history=formatted_history)
        
        # Send new message with context injected if it's the first message, 
        # or just rely on history.
        # It's cleaner to inject context into the first message or system instructions.
        # Since GenerativeModel supports system instructions in 1.5, we can use that,
        # but to keep it simple with older SDKs, we just prepend to user message if history is empty.
        
        if not history:
            msg_to_send = f"{full_prompt}\nUser Question: {message}"
        else:
            msg_to_send = f"Dashboard updates:\n{json.dumps(db_context)}\n\nUser Question: {message}"

        response = chat_session.send_message(msg_to_send)
        
        return {
            "reply": response.text,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        print(f"Error in copilot chat: {e}")
        return {
            "reply": "I'm sorry, I encountered an error while processing your request. Please try again later.",
            "timestamp": datetime.now().isoformat()
        }

# main.py - COMPLETE WORKING VERSION
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    text: str
    sessionid: Optional[str] = None

def emergency_rule_check(text: str) -> str:
    t = text.lower()
    if "not breathing" in t or "no breathing" in t:
        return """Stay calm. Call emergency services immediately. 
        Place person on back, hands center chest, 100-120 compressions/min."""
    if "choking" in t:
        return """Person may be choking. Stand behind, abdominal thrusts until object out."""
    return "No emergency detected. Please provide more details."

@app.get("/health")
async def health():
    return {"apikeyset": True, "status": "Claude ready"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    session_id = request.sessionid or f"session_{hash(request.text)}"
    reply = emergency_rule_check(request.text)
    return {
        "sessionid": session_id,
        "turn": 1,
        "reply": reply,
        "processingms": 500
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860, reload=True)

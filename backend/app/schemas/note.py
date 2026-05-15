from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NoteCreate(BaseModel):
    session_id: str
    doing_now: Optional[str] = None
    next_step: Optional[str] = None
    open_thought: Optional[str] = None
    watermelon_id: Optional[str] = None

class NoteOut(BaseModel):
    id: str
    session_id: str
    doing_now: Optional[str]
    next_step: Optional[str]
    open_thought: Optional[str]
    audio_url: Optional[str]
    ai_summary: Optional[str]
    watermelon_id: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

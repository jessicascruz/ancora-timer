from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.session import SessionStatus

class SessionCreate(BaseModel):
    duration_minutes: int
    break_minutes: int
    watermelon_id: Optional[str] = None

class SessionUpdate(BaseModel):
    status: Optional[SessionStatus] = None
    completed_at: Optional[datetime] = None

class SessionOut(BaseModel):
    id: str
    duration_minutes: int
    break_minutes: int
    status: SessionStatus
    started_at: datetime
    completed_at: Optional[datetime]
    watermelon_id: Optional[str]
    updated_at: datetime

    class Config:
        from_attributes = True

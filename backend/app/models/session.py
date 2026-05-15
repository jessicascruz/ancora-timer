from sqlalchemy import Column, String, Integer, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from app.database import Base

class SessionStatus(str, enum.Enum):
    running  = "running"
    paused   = "paused"
    done     = "done"
    canceled = "canceled"

class Session(Base):
    __tablename__ = "sessions"

    id             = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    duration_minutes = Column(Integer, nullable=False)   # 25 / 45 / 50 / 90 / livre
    break_minutes    = Column(Integer, nullable=False)   # 5 / 10 / 15 / livre
    status         = Column(Enum(SessionStatus), default=SessionStatus.running)
    started_at     = Column(DateTime(timezone=True), server_default=func.now())
    completed_at   = Column(DateTime(timezone=True), nullable=True)

    # Sync com WatermelonDB
    watermelon_id  = Column(String, nullable=True, unique=True)
    updated_at     = Column(DateTime(timezone=True), onupdate=func.now(),
                            server_default=func.now())

    notes = relationship("Note", back_populates="session", cascade="all, delete-orphan")
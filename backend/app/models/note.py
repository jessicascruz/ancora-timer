from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.database import Base

class Note(Base):
    __tablename__ = "notes"

    id           = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id   = Column(String, ForeignKey("sessions.id"), nullable=False)

    # Campos do modal de anotação
    doing_now    = Column(Text, nullable=True)
    next_step    = Column(Text, nullable=True)
    open_thought = Column(Text, nullable=True)

    # Áudio e IA
    audio_url    = Column(String, nullable=True)   # caminho do arquivo gravado
    ai_summary   = Column(Text, nullable=True)     # retorno processado pela IA

    # Sync com WatermelonDB
    watermelon_id = Column(String, nullable=True, unique=True)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())
    updated_at    = Column(DateTime(timezone=True), onupdate=func.now(),
                           server_default=func.now())

    session = relationship("Session", back_populates="notes")
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.session import Session
from app.schemas.session import SessionCreate, SessionUpdate, SessionOut
from typing import List

router = APIRouter(prefix="/sessions", tags=["sessions"])

@router.post("/", response_model=SessionOut)
async def create_session(data: SessionCreate, db: AsyncSession = Depends(get_db)):
    session = Session(**data.model_dump())
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session

@router.get("/", response_model=List[SessionOut])
async def list_sessions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Session).order_by(Session.started_at.desc()))
    return result.scalars().all()

@router.get("/{session_id}", response_model=SessionOut)
async def get_session(session_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Session).where(Session.id == session_id))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.patch("/{session_id}", response_model=SessionOut)
async def update_session(session_id: str, data: SessionUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Session).where(Session.id == session_id))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(session, field, value)
    await db.commit()
    await db.refresh(session)
    return session

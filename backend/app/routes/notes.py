from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.note import Note
from app.schemas.note import NoteCreate, NoteOut
from typing import List

router = APIRouter(prefix="/notes", tags=["notes"])

@router.post("/", response_model=NoteOut)
async def create_note(data: NoteCreate, db: AsyncSession = Depends(get_db)):
    note = Note(**data.model_dump())
    db.add(note)
    await db.commit()
    await db.refresh(note)
    return note

@router.get("/session/{session_id}", response_model=List[NoteOut])
async def list_notes_by_session(session_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Note).where(Note.session_id == session_id))
    return result.scalars().all()

@router.get("/", response_model=List[NoteOut])
async def list_all_notes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Note).order_by(Note.created_at.desc()))
    return result.scalars().all()

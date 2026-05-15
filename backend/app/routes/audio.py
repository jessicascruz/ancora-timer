from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.note import Note
from app.services.audio_service import transcribe_audio
from app.services.ai_service import extract_note_fields

router = APIRouter(prefix="/audio", tags=["audio"])

@router.post("/process/{note_id}")
async def process_audio(
    note_id: str,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """Transcribe audio and extract structured fields."""
    result = await db.execute(select(Note).where(Note.id == note_id))
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    audio_bytes = await file.read()

    transcript = await transcribe_audio(audio_bytes, file.filename)
    fields = await extract_note_fields(transcript)

    note.doing_now    = fields.get("doing_now")
    note.next_step    = fields.get("next_step")
    note.open_thought = fields.get("open_thought")
    note.ai_summary   = transcript

    await db.commit()
    await db.refresh(note)

    return {
        "transcript": transcript,
        "fields": fields,
        "note_id": note.id
    }

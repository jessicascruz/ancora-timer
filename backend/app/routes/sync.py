from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.session import Session
from app.models.note import Note
from datetime import datetime, timezone
from typing import Optional

router = APIRouter(prefix="/sync", tags=["sync"])

@router.get("/pull")
async def pull_changes(
    last_pulled_at: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    """Pull changes from server (WatermelonDB sync protocol)."""
    since = datetime.fromtimestamp(last_pulled_at / 1000, tz=timezone.utc) if last_pulled_at else None

    session_query = select(Session)
    note_query = select(Note)

    if since:
        session_query = session_query.where(Session.updated_at > since)
        note_query = note_query.where(Note.updated_at > since)

    sessions = (await db.execute(session_query)).scalars().all()
    notes    = (await db.execute(note_query)).scalars().all()

    def serialize_session(s):
        return {
            "id": s.watermelon_id or s.id,
            "server_id": s.id,
            "duration_minutes": s.duration_minutes,
            "break_minutes": s.break_minutes,
            "status": s.status,
            "started_at": int(s.started_at.timestamp() * 1000) if s.started_at else None,
            "completed_at": int(s.completed_at.timestamp() * 1000) if s.completed_at else None,
        }

    def serialize_note(n):
        return {
            "id": n.watermelon_id or n.id,
            "server_id": n.id,
            "session_id": n.session.watermelon_id or n.session_id if n.session else n.session_id,
            "doing_now": n.doing_now,
            "next_step": n.next_step,
            "open_thought": n.open_thought,
            "audio_url": n.audio_url,
            "ai_summary": n.ai_summary,
            "created_at": int(n.created_at.timestamp() * 1000) if n.created_at else None,
        }

    return {
        "changes": {
            "sessions": {"created": [serialize_session(s) for s in sessions], "updated": [], "deleted": []},
            "notes":    {"created": [serialize_note(n) for n in notes],    "updated": [], "deleted": []},
        },
        "timestamp": int(datetime.now(timezone.utc).timestamp() * 1000)
    }

@router.post("/push")
async def push_changes(payload: dict, db: AsyncSession = Depends(get_db)):
    """Push changes from client to server (WatermelonDB sync protocol)."""
    changes = payload.get("changes", {})

    for s in changes.get("sessions", {}).get("created", []):
        existing = (await db.execute(select(Session).where(Session.watermelon_id == s["id"]))).scalar_one_or_none()
        if not existing:
            session = Session(
                watermelon_id    = s["id"],
                duration_minutes = s["duration_minutes"],
                break_minutes    = s["break_minutes"],
                status           = s.get("status", "running"),
            )
            db.add(session)

    for n in changes.get("notes", {}).get("created", []):
        existing = (await db.execute(select(Note).where(Note.watermelon_id == n["id"]))).scalar_one_or_none()
        if not existing:
            session = (await db.execute(select(Session).where(Session.watermelon_id == n["session_id"]))).scalar_one_or_none()
            if session:
                note = Note(
                    watermelon_id = n["id"],
                    session_id    = session.id,
                    doing_now     = n.get("doing_now"),
                    next_step     = n.get("next_step"),
                    open_thought  = n.get("open_thought"),
                )
                db.add(note)

    await db.commit()
    return {"success": True}

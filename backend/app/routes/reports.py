from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, cast, Date
from app.database import get_db
from app.models.session import Session, SessionStatus
from datetime import date

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/summary")
async def get_report_summary(db: AsyncSession = Depends(get_db)):
    today = date.today()

    today_result = await db.execute(
        select(func.count(Session.id)).where(
            Session.status == SessionStatus.done,
            cast(Session.started_at, Date) == today
        )
    )
    sessions_today = today_result.scalar()

    total_result = await db.execute(
        select(func.count(Session.id)).where(Session.status == SessionStatus.done)
    )
    total_sessions = total_result.scalar()

    days_result = await db.execute(
        select(func.count(func.distinct(cast(Session.started_at, Date)))).where(
            Session.status == SessionStatus.done
        )
    )
    days_with_sessions = days_result.scalar()

    average_per_day = round(total_sessions / days_with_sessions, 1) if days_with_sessions > 0 else 0

    time_result = await db.execute(
        select(func.sum(Session.duration_minutes)).where(Session.status == SessionStatus.done)
    )
    total_focus_minutes = time_result.scalar() or 0

    break_result = await db.execute(
        select(func.sum(Session.break_minutes)).where(Session.status == SessionStatus.done)
    )
    total_break_minutes = break_result.scalar() or 0

    return {
        "sessions_today": sessions_today,
        "total_sessions": total_sessions,
        "days_with_sessions": days_with_sessions,
        "average_per_day": average_per_day,
        "total_focus_minutes": total_focus_minutes,
        "total_break_minutes": total_break_minutes,
    }

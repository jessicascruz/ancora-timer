# Pomodoro App — Especificação Completa para Construção

> **Instruções para o Claude:** Leia este documento inteiro antes de começar. Construa todos os arquivos na ordem das fases. Não pule nenhuma etapa. Ao final de cada fase, confirme o que foi criado.

---

## Stack tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14 (App Router, TypeScript) |
| Estilo | Tailwind CSS |
| Estado global | Zustand |
| Banco local | WatermelonDB (IndexedDB no browser) |
| Formulários | React Hook Form + Zod |
| Backend | FastAPI (Python 3.11+) |
| ORM | SQLAlchemy (async) |
| Migrations | Alembic |
| Banco remoto | PostgreSQL |
| IA — transcrição | Gemini |
| IA — processamento | Gemini |
| Notificações UI | react-hot-toast |
| Datas | date-fns |

---

## Estrutura de pastas

```
pomodoro-app/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                  ← redireciona para /timer
│   │   │   ├── timer/
│   │   │   │   └── page.tsx
│   │   │   ├── historico/
│   │   │   │   └── page.tsx
│   │   │   └── relatorios/
│   │   │       └── page.tsx
│   │   ├── components/
│   │   │   ├── Timer/
│   │   │   │   ├── TimerDisplay.tsx
│   │   │   │   ├── TimerControls.tsx
│   │   │   │   ├── DurationPicker.tsx
│   │   │   │   └── BreakPicker.tsx
│   │   │   ├── NoteModal/
│   │   │   │   ├── NoteModal.tsx
│   │   │   │   └── AudioRecorder.tsx
│   │   │   ├── BreakSummary/
│   │   │   │   └── BreakSummary.tsx
│   │   │   ├── Layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── Historico/
│   │   │   │   ├── SessionCard.tsx
│   │   │   │   └── SessionList.tsx
│   │   │   └── Relatorios/
│   │   │       ├── StatCard.tsx
│   │   │       └── ReportCharts.tsx
│   │   ├── db/
│   │   │   ├── index.ts                  ← inicializa WatermelonDB
│   │   │   ├── schema.ts
│   │   │   └── models/
│   │   │       ├── Session.ts
│   │   │       └── Note.ts
│   │   ├── store/
│   │   │   ├── timerStore.ts
│   │   │   └── sessionStore.ts
│   │   ├── hooks/
│   │   │   ├── useTimer.ts
│   │   │   ├── useNotification.ts
│   │   │   └── useAudioRecorder.ts
│   │   ├── services/
│   │   │   ├── api.ts                    ← cliente HTTP para o backend
│   │   │   └── sync.ts                   ← sync WatermelonDB ↔ backend
│   │   └── lib/
│   │       └── sounds.ts                 ← áudios de notificação (Web Audio API)
│   ├── public/
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── session.py
│   │   │   └── note.py
│   │   ├── schemas/
│   │   │   ├── session.py
│   │   │   └── note.py
│   │   ├── routes/
│   │   │   ├── sessions.py
│   │   │   ├── notes.py
│   │   │   ├── audio.py
│   │   │   ├── sync.py
│   │   │   └── reports.py
│   │   └── services/
│   │       ├── ai_service.py
│   │       └── audio_service.py
│   ├── alembic/
│   │   └── env.py
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env
│
└── docker-compose.yml
```

---

## FASE 1 — Infraestrutura base

### 1.1 — docker-compose.yml (raiz do projeto)

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: pomodoro
      POSTGRES_PASSWORD: pomodoro123
      POSTGRES_DB: pomodoro_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file: ./backend/.env
    depends_on:
      - postgres
    volumes:
      - ./backend:/app
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
    command: npm run dev

volumes:
  pgdata:
```

### 1.2 — backend/requirements.txt

```
fastapi==0.111.0
uvicorn==0.29.0
sqlalchemy==2.0.30
asyncpg==0.29.0
alembic==1.13.1
psycopg2-binary==2.9.9
python-multipart==0.0.9
openai==1.30.1
anthropic==0.28.0
pydantic==2.7.1
python-dotenv==1.0.1
aiofiles==23.2.1
```

### 1.3 — backend/.env

```env
DATABASE_URL=postgresql+asyncpg://pomodoro:pomodoro123@localhost:5432/pomodoro_db
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

---

## FASE 2 — Backend: banco de dados e modelos

### 2.1 — backend/app/database.py

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
```

### 2.2 — backend/app/models/session.py

```python
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

    id               = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    duration_minutes = Column(Integer, nullable=False)
    break_minutes    = Column(Integer, nullable=False)
    status           = Column(Enum(SessionStatus), default=SessionStatus.running)
    started_at       = Column(DateTime(timezone=True), server_default=func.now())
    completed_at     = Column(DateTime(timezone=True), nullable=True)
    watermelon_id    = Column(String, nullable=True, unique=True)
    updated_at       = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    notes = relationship("Note", back_populates="session", cascade="all, delete-orphan")
```

### 2.3 — backend/app/models/note.py

```python
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.database import Base

class Note(Base):
    __tablename__ = "notes"

    id            = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id    = Column(String, ForeignKey("sessions.id"), nullable=False)
    doing_now     = Column(Text, nullable=True)
    next_step     = Column(Text, nullable=True)
    open_thought  = Column(Text, nullable=True)
    audio_url     = Column(String, nullable=True)
    ai_summary    = Column(Text, nullable=True)
    watermelon_id = Column(String, nullable=True, unique=True)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())
    updated_at    = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    session = relationship("Session", back_populates="notes")
```

### 2.4 — backend/app/models/__init__.py

```python
from app.models.session import Session, SessionStatus
from app.models.note import Note
```

### 2.5 — backend/alembic/env.py (trecho que deve ser editado)

Após `alembic init alembic`, editar `env.py` para incluir:

```python
from app.database import Base
from app.models import Session, Note

target_metadata = Base.metadata
```

E em `alembic.ini`:
```ini
sqlalchemy.url = postgresql+psycopg2://pomodoro:pomodoro123@localhost:5432/pomodoro_db
```

Comandos para rodar:
```bash
alembic revision --autogenerate -m "create sessions and notes"
alembic upgrade head
```

---

## FASE 3 — Backend: schemas Pydantic

### 3.1 — backend/app/schemas/session.py

```python
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
```

### 3.2 — backend/app/schemas/note.py

```python
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
```

---

## FASE 4 — Backend: rotas da API

### 4.1 — backend/app/routes/sessions.py

```python
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
```

### 4.2 — backend/app/routes/notes.py

```python
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
```

### 4.3 — backend/app/services/ai_service.py

```python
import anthropic
import json
import os

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

async def extract_note_fields(transcript: str) -> dict:
    """
    Recebe a transcrição do áudio e usa Claude para extrair
    os três campos estruturados da anotação.
    """
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        messages=[
            {
                "role": "user",
                "content": f"""
A partir desta transcrição de áudio de um usuário fazendo uma pausa no trabalho,
extraia as seguintes informações em JSON:

- doing_now: O que a pessoa está fazendo agora / estava fazendo
- next_step: O próximo passo ou tarefa mencionada
- open_thought: Pensamento em aberto, dúvida ou pendência mencionada

Se algum campo não for mencionado, deixe como null.
Responda APENAS com o JSON, sem texto adicional, sem markdown.

Transcrição:
{transcript}
"""
            }
        ]
    )
    
    raw = response.content[0].text.strip()
    return json.loads(raw)
```

### 4.4 — backend/app/services/audio_service.py

```python
import openai
import os
import tempfile
import aiofiles

openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def transcribe_audio(audio_bytes: bytes, filename: str) -> str:
    """
    Recebe bytes do arquivo de áudio, salva temporariamente
    e transcreve com Whisper.
    """
    suffix = "." + filename.split(".")[-1] if "." in filename else ".webm"
    
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        with open(tmp_path, "rb") as audio_file:
            response = openai_client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language="pt"
            )
        return response.text
    finally:
        os.unlink(tmp_path)
```

### 4.5 — backend/app/routes/audio.py

```python
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
    """
    Recebe arquivo de áudio, transcreve com Whisper,
    processa com Claude e salva os campos na Note.
    """
    result = await db.execute(select(Note).where(Note.id == note_id))
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    audio_bytes = await file.read()
    
    # 1. Transcrever com Whisper
    transcript = await transcribe_audio(audio_bytes, file.filename)
    
    # 2. Extrair campos com Claude
    fields = await extract_note_fields(transcript)
    
    # 3. Salvar no banco
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
```

### 4.6 — backend/app/routes/reports.py

```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, cast, Date
from app.database import get_db
from app.models.session import Session, SessionStatus
from datetime import date, datetime, timezone

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/summary")
async def get_report_summary(db: AsyncSession = Depends(get_db)):
    today = date.today()

    # Total de sessões concluídas hoje
    today_result = await db.execute(
        select(func.count(Session.id)).where(
            Session.status == SessionStatus.done,
            cast(Session.started_at, Date) == today
        )
    )
    sessions_today = today_result.scalar()

    # Total geral de sessões concluídas
    total_result = await db.execute(
        select(func.count(Session.id)).where(Session.status == SessionStatus.done)
    )
    total_sessions = total_result.scalar()

    # Dias distintos com sessões concluídas
    days_result = await db.execute(
        select(func.count(func.distinct(cast(Session.started_at, Date)))).where(
            Session.status == SessionStatus.done
        )
    )
    days_with_sessions = days_result.scalar()

    # Média de sessões por dia
    average_per_day = round(total_sessions / days_with_sessions, 1) if days_with_sessions > 0 else 0

    # Tempo total de foco (minutos)
    time_result = await db.execute(
        select(func.sum(Session.duration_minutes)).where(Session.status == SessionStatus.done)
    )
    total_focus_minutes = time_result.scalar() or 0

    # Tempo total de pausa (minutos)
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
```

### 4.7 — backend/app/routes/sync.py

```python
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
    """
    Retorna todas as mudanças do servidor desde last_pulled_at (timestamp em ms).
    Protocolo WatermelonDB Sync.
    """
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
    """
    Recebe mudanças locais do WatermelonDB e persiste no PostgreSQL.
    """
    changes = payload.get("changes", {})

    # Sincronizar sessions
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

    # Sincronizar notes
    for n in changes.get("notes", {}).get("created", []):
        existing = (await db.execute(select(Note).where(Note.watermelon_id == n["id"]))).scalar_one_or_none()
        if not existing:
            # Resolver session_id pelo watermelon_id
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
```

### 4.8 — backend/app/main.py

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import sessions, notes, audio, sync, reports

app = FastAPI(title="Pomodoro API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sessions.router)
app.include_router(notes.router)
app.include_router(audio.router)
app.include_router(sync.router)
app.include_router(reports.router)

@app.get("/health")
async def health():
    return {"status": "ok"}
```

---

## FASE 5 — Frontend: configuração inicial

### 5.1 — Comandos para criar o projeto

```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir

npm install @nozbe/watermelondb @nozbe/with-observables
npm install zustand
npm install react-hook-form zod @hookform/resolvers
npm install date-fns
npm install react-hot-toast
npm install axios
```

### 5.2 — frontend/src/lib/sounds.ts

Gerar sons de notificação via Web Audio API (sem arquivos externos):

```typescript
export function playWarningSound() {
  const ctx = new AudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.setValueAtTime(880, ctx.currentTime)
  osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1)
  osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2)
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.5)
}

export function playCompleteSound() {
  const ctx = new AudioContext()
  ;[523, 659, 784, 1047].forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.4)
    osc.start(ctx.currentTime + i * 0.15)
    osc.stop(ctx.currentTime + i * 0.15 + 0.4)
  })
}

export function playBreakEndSound() {
  const ctx = new AudioContext()
  ;[784, 659, 523].forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.2)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.5)
    osc.start(ctx.currentTime + i * 0.2)
    osc.stop(ctx.currentTime + i * 0.2 + 0.5)
  })
}
```

---

## FASE 6 — Frontend: WatermelonDB

### 6.1 — frontend/src/db/schema.ts

```typescript
import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'sessions',
      columns: [
        { name: 'server_id',        type: 'string',  isOptional: true },
        { name: 'duration_minutes', type: 'number' },
        { name: 'break_minutes',    type: 'number' },
        { name: 'status',           type: 'string' },
        { name: 'started_at',       type: 'number' },
        { name: 'completed_at',     type: 'number',  isOptional: true },
        { name: 'synced',           type: 'boolean' },
        { name: 'updated_at',       type: 'number' },
      ],
    }),
    tableSchema({
      name: 'notes',
      columns: [
        { name: 'session_id',   type: 'string' },
        { name: 'server_id',    type: 'string',  isOptional: true },
        { name: 'doing_now',    type: 'string',  isOptional: true },
        { name: 'next_step',    type: 'string',  isOptional: true },
        { name: 'open_thought', type: 'string',  isOptional: true },
        { name: 'audio_url',    type: 'string',  isOptional: true },
        { name: 'ai_summary',   type: 'string',  isOptional: true },
        { name: 'created_at',   type: 'number' },
        { name: 'synced',       type: 'boolean' },
      ],
    }),
  ],
})
```

### 6.2 — frontend/src/db/models/Session.ts

```typescript
import { Model } from '@nozbe/watermelondb'
import { field, date, readonly, children } from '@nozbe/watermelondb/decorators'
import Note from './Note'

export default class Session extends Model {
  static table = 'sessions'
  static associations = {
    notes: { type: 'has_many' as const, foreignKey: 'session_id' },
  }

  @field('server_id')        serverId!: string | null
  @field('duration_minutes') durationMinutes!: number
  @field('break_minutes')    breakMinutes!: number
  @field('status')           status!: string
  @date('started_at')        startedAt!: Date
  @date('completed_at')      completedAt!: Date | null
  @field('synced')           synced!: boolean
  @readonly @date('updated_at') updatedAt!: Date

  @children('notes') notes!: any
}
```

### 6.3 — frontend/src/db/models/Note.ts

```typescript
import { Model } from '@nozbe/watermelondb'
import { field, date, relation } from '@nozbe/watermelondb/decorators'
import Session from './Session'

export default class Note extends Model {
  static table = 'notes'
  static associations = {
    sessions: { type: 'belongs_to' as const, key: 'session_id' },
  }

  @field('session_id')   sessionId!: string
  @field('server_id')    serverId!: string | null
  @field('doing_now')    doingNow!: string | null
  @field('next_step')    nextStep!: string | null
  @field('open_thought') openThought!: string | null
  @field('audio_url')    audioUrl!: string | null
  @field('ai_summary')   aiSummary!: string | null
  @date('created_at')    createdAt!: Date
  @field('synced')       synced!: boolean

  @relation('sessions', 'session_id') session!: Session
}
```

### 6.4 — frontend/src/db/index.ts

```typescript
import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'
import { schema } from './schema'
import Session from './models/Session'
import Note from './models/Note'

const adapter = new LokiJSAdapter({
  schema,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
})

const database = new Database({
  adapter,
  modelClasses: [Session, Note],
})

export default database
export { Session, Note }
```

---

## FASE 7 — Frontend: store Zustand

### 7.1 — frontend/src/store/timerStore.ts

```typescript
import { create } from 'zustand'

export type TimerStatus = 'idle' | 'running' | 'pre-warning' | 'break' | 'done'

interface TimerStore {
  duration: number           // minutos de foco
  breakDuration: number      // minutos de pausa
  timeLeft: number           // segundos restantes
  status: TimerStatus
  showNoteModal: boolean
  showBreakSummary: boolean
  currentSessionId: string | null
  currentNoteId: string | null
  aiSummary: { doingNow?: string; nextStep?: string; openThought?: string } | null

  // Actions
  setDuration: (min: number) => void
  setBreakDuration: (min: number) => void
  startTimer: () => void
  pauseTimer: () => void
  resumeTimer: () => void
  resetTimer: () => void
  tickTimer: () => void
  triggerPreWarning: () => void
  completeSession: () => void
  startBreak: () => void
  endBreak: () => void
  openNoteModal: () => void
  closeNoteModal: () => void
  setCurrentSessionId: (id: string) => void
  setCurrentNoteId: (id: string) => void
  setAiSummary: (summary: TimerStore['aiSummary']) => void
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  duration:          25,
  breakDuration:     5,
  timeLeft:          25 * 60,
  status:            'idle',
  showNoteModal:     false,
  showBreakSummary:  false,
  currentSessionId:  null,
  currentNoteId:     null,
  aiSummary:         null,

  setDuration:      (min) => set({ duration: min, timeLeft: min * 60, status: 'idle' }),
  setBreakDuration: (min) => set({ breakDuration: min }),

  startTimer:  () => set({ status: 'running' }),
  pauseTimer:  () => set({ status: 'idle' }),
  resumeTimer: () => set({ status: 'running' }),
  resetTimer:  () => set((s) => ({ status: 'idle', timeLeft: s.duration * 60, showNoteModal: false })),

  tickTimer: () => {
    const { timeLeft, status, duration, breakDuration } = get()
    if (status === 'running' || status === 'pre-warning') {
      if (timeLeft === 90) {
        get().triggerPreWarning()
      } else if (timeLeft <= 0) {
        get().completeSession()
      } else {
        set({ timeLeft: timeLeft - 1 })
      }
    } else if (status === 'break') {
      if (timeLeft <= 0) {
        get().endBreak()
      } else {
        set({ timeLeft: timeLeft - 1 })
      }
    }
  },

  triggerPreWarning: () => set({ status: 'pre-warning', showNoteModal: true }),
  completeSession:   () => set({ status: 'break', showNoteModal: false }),
  startBreak:        () => set((s) => ({ timeLeft: s.breakDuration * 60 })),

  endBreak: () => set({
    status:           'idle',
    showBreakSummary: true,
    timeLeft:         get().duration * 60,
  }),

  openNoteModal:  () => set({ showNoteModal: true }),
  closeNoteModal: () => set({ showNoteModal: false }),

  setCurrentSessionId: (id) => set({ currentSessionId: id }),
  setCurrentNoteId:    (id) => set({ currentNoteId: id }),
  setAiSummary:        (s)  => set({ aiSummary: s }),
}))
```

---

## FASE 8 — Frontend: hooks

### 8.1 — frontend/src/hooks/useTimer.ts

```typescript
'use client'
import { useEffect, useRef } from 'react'
import { useTimerStore } from '@/store/timerStore'
import { playWarningSound, playCompleteSound, playBreakEndSound } from '@/lib/sounds'

export function useTimer() {
  const store    = useTimerStore()
  const interval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (store.status === 'running' || store.status === 'pre-warning' || store.status === 'break') {
      interval.current = setInterval(() => {
        store.tickTimer()
      }, 1000)
    } else {
      if (interval.current) clearInterval(interval.current)
    }
    return () => { if (interval.current) clearInterval(interval.current) }
  }, [store.status])

  // Efeitos sonoros e de atenção
  useEffect(() => {
    if (store.status === 'pre-warning') {
      playWarningSound()
      document.title = '⚠️ Anote o que está fazendo! — Pomodoro'
    } else if (store.status === 'break') {
      playCompleteSound()
      document.title = '☕ Pausa — Pomodoro'
    } else if (store.status === 'idle' && store.showBreakSummary) {
      playBreakEndSound()
      document.title = '▶️ Hora de focar — Pomodoro'
    } else {
      document.title = 'Pomodoro'
    }
  }, [store.status, store.showBreakSummary])

  return store
}
```

### 8.2 — frontend/src/hooks/useAudioRecorder.ts

```typescript
'use client'
import { useState, useRef } from 'react'

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob,   setAudioBlob]   = useState<Blob | null>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const chunks        = useRef<Blob[]>([])

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder.current = new MediaRecorder(stream)
    chunks.current = []

    mediaRecorder.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data)
    }

    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'audio/webm' })
      setAudioBlob(blob)
      stream.getTracks().forEach((t) => t.stop())
    }

    mediaRecorder.current.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    mediaRecorder.current?.stop()
    setIsRecording(false)
  }

  const clearAudio = () => setAudioBlob(null)

  return { isRecording, audioBlob, startRecording, stopRecording, clearAudio }
}
```

---

## FASE 9 — Frontend: serviço de API

### 9.1 — frontend/src/services/api.ts

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
})

// Sessions
export const createSession = (data: { duration_minutes: number; break_minutes: number }) =>
  api.post('/sessions/', data).then((r) => r.data)

export const updateSession = (id: string, data: object) =>
  api.patch(`/sessions/${id}`, data).then((r) => r.data)

export const listSessions = () =>
  api.get('/sessions/').then((r) => r.data)

// Notes
export const createNote = (data: object) =>
  api.post('/notes/', data).then((r) => r.data)

export const listNotes = () =>
  api.get('/notes/').then((r) => r.data)

// Audio
export const processAudio = async (noteId: string, audioBlob: Blob) => {
  const form = new FormData()
  form.append('file', audioBlob, 'audio.webm')
  return api.post(`/audio/process/${noteId}`, form).then((r) => r.data)
}

// Reports
export const getReportSummary = () =>
  api.get('/reports/summary').then((r) => r.data)
```

---

## FASE 10 — Frontend: componentes principais

### 10.1 — DurationPicker (frontend/src/components/Timer/DurationPicker.tsx)

Componente de seleção de duração.

**Props:** `value: number`, `onChange: (min: number) => void`

**Comportamento:**
- Mostrar botões para 25, 45, 50, 90 minutos
- Mostrar campo numérico livre ("Livre") quando nenhum padrão é selecionado
- Botão selecionado deve ficar visualmente destacado (ring/border colorido)
- Rótulo acima: "Duração do foco"

### 10.2 — BreakPicker (frontend/src/components/Timer/BreakPicker.tsx)

Igual ao DurationPicker, mas para pausas.

**Opções:** 5, 10, 15 minutos + campo livre
**Rótulo:** "Duração da pausa"

### 10.3 — TimerDisplay (frontend/src/components/Timer/TimerDisplay.tsx)

Exibe o tempo restante em formato `MM:SS` centralizado na tela.

**Comportamento:**
- Formato: `MM:SS` (ex: `24:59`)
- Cor muda conforme status:
  - `running` → texto normal
  - `pre-warning` → texto âmbar/laranja, pulsar animação
  - `break` → texto verde
- Mostrar label abaixo do timer:
  - `running` → "Focando"
  - `pre-warning` → "⚠️ Anote o que está fazendo!"
  - `break` → "Pausa"
  - `idle` → "Pronto"

### 10.4 — TimerControls (frontend/src/components/Timer/TimerControls.tsx)

Botões de controle do timer.

**Botões:**
- `idle` → botão "Iniciar" (verde)
- `running` ou `pre-warning` → botão "Pausar"
- `break` → sem botão (timer automático)
- Sempre mostrar botão "Reiniciar" (cinza, menor)

**Ao clicar em "Iniciar":**
1. Chamar `createSession({ duration_minutes, break_minutes })` na API
2. Salvar o `id` retornado no `timerStore.currentSessionId`
3. Criar uma `Note` vazia associada à session
4. Salvar o `note.id` no `timerStore.currentNoteId`
5. Chamar `startTimer()`

### 10.5 — NoteModal (frontend/src/components/NoteModal/NoteModal.tsx)

Modal que aparece 1min30s antes do fim do timer.

**Aparece quando:** `showNoteModal === true`

**Campos:**
- "O que estou fazendo" (textarea)
- "Próximo passo" (textarea)
- "Pensamento aberto" (textarea)
- Botão "🎙️ Gravar áudio" → usa `useAudioRecorder`
- Quando áudio gravado: mostrar player simples e botão "Enviar áudio para IA"
- Botão "Salvar anotação" → chama `createNote` ou atualiza nota com os campos

**Ao enviar áudio:**
1. Chamar `processAudio(noteId, audioBlob)`
2. Preencher os campos do formulário com o retorno da IA
3. Permitir edição antes de salvar

**Ao salvar:**
1. Atualizar a `Note` no banco com os campos preenchidos
2. Fechar o modal (`closeNoteModal()`)

### 10.6 — BreakSummary (frontend/src/components/BreakSummary/BreakSummary.tsx)

Painel exibido quando a pausa termina.

**Aparece quando:** `showBreakSummary === true`

**Exibe:**
- Título: "Sua pausa terminou! O que foi anotado:"
- Os três campos da última `Note` do ciclo atual (busca pelo `currentNoteId`)
- Se tiver `ai_summary`, mostrar como "Transcrição da IA"
- Botão "Iniciar novo ciclo" → chama `resetTimer()` e limpa `showBreakSummary`

---

## FASE 11 — Frontend: páginas

### 11.1 — frontend/src/app/timer/page.tsx

Layout da página principal do timer.

```
┌─────────────────────────────────────────┐
│  DurationPicker     BreakPicker         │
│                                         │
│         TimerDisplay (grande)           │
│                                         │
│           TimerControls                 │
│                                         │
│  [NoteModal aparece como overlay]       │
│  [BreakSummary aparece como card]       │
└─────────────────────────────────────────┘
```

### 11.2 — frontend/src/app/historico/page.tsx

Página de histórico de sessões.

**Comportamento:**
- Buscar todas as sessions via `listSessions()`
- Para cada session, buscar suas notes via `listNotes()` filtrado por `session_id`
- Ordenar por data decrescente
- Renderizar com `SessionCard` para cada sessão

**SessionCard exibe:**
- Data e hora de início
- Duração e pausa
- Status (badge colorido: verde = done, cinza = canceled)
- Lista de notas associadas expandível (accordion)
  - Cada nota mostra: doing_now, next_step, open_thought, ai_summary

### 11.3 — frontend/src/app/relatorios/page.tsx

Página de relatórios.

**Buscar dados de:** `getReportSummary()`

**Cards de estatísticas a exibir:**

| Card | Dado |
|------|------|
| Sessões hoje | `sessions_today` |
| Total de sessões | `total_sessions` |
| Média por dia | `average_per_day` |
| Dias com sessões | `days_with_sessions` |
| Tempo de foco | `total_focus_minutes` convertido para horas/minutos |
| Tempo de pausa | `total_break_minutes` convertido para horas/minutos |

---

## FASE 12 — Frontend: layout e navegação

### 12.1 — frontend/src/components/Layout/Navbar.tsx

Barra de navegação com links para:
- `/timer` — "Timer"
- `/historico` — "Histórico"
- `/relatorios` — "Relatórios"

### 12.2 — frontend/src/app/layout.tsx

```typescript
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Layout/Navbar'

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Navbar />
        <main>{children}</main>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
```

---

## Regras de design e UX

- Tema escuro preferencial (dark mode Tailwind)
- Timer display: fonte monospace grande (mínimo `text-7xl`)
- Transições suaves nos estados do timer (`transition-all duration-300`)
- Modal com backdrop escuro semi-transparente
- Cards com `rounded-xl` e `shadow-lg`
- Cores de status:
  - `running` → azul (`blue-500`)
  - `pre-warning` → âmbar (`amber-500`) com `animate-pulse`
  - `break` → verde (`green-500`)
  - `done` → roxo (`purple-500`)
- Botão primário: verde sólido com hover mais escuro
- Feedback imediato ao gravar áudio (indicador vermelho pulsando)

---

## Variáveis de ambiente do frontend

Criar `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Ordem de execução para o Claude

1. Criar `docker-compose.yml`
2. Criar todos os arquivos do backend (Fases 2 a 4)
3. Rodar `alembic upgrade head` para criar as tabelas
4. Criar o projeto Next.js e instalar dependências (Fase 5)
5. Criar arquivos do WatermelonDB (Fase 6)
6. Criar store Zustand (Fase 7)
7. Criar hooks (Fase 8)
8. Criar serviço de API (Fase 9)
9. Criar todos os componentes (Fase 10)
10. Criar as páginas (Fase 11)
11. Criar layout e navegação (Fase 12)
12. Testar o fluxo completo: iniciar timer → modal → anotação → pausa → resumo

---

## Checklist de validação

Ao terminar, verificar:

- [ ] Backend inicia sem erros: `uvicorn app.main:app --reload`
- [ ] Tabelas criadas no PostgreSQL
- [ ] `GET /health` retorna `{"status": "ok"}`
- [ ] `POST /sessions/` cria sessão
- [ ] `POST /notes/` cria nota
- [ ] `POST /audio/process/{id}` transcreve e retorna campos
- [ ] `GET /reports/summary` retorna estatísticas
- [ ] Frontend inicia: `npm run dev`
- [ ] Timer conta regressivamente
- [ ] Modal aparece aos 1min30s restantes
- [ ] Gravação de áudio funciona no browser
- [ ] BreakSummary aparece ao final da pausa
- [ ] Página de Histórico lista sessões e notas
- [ ] Página de Relatórios exibe cards com estatísticas

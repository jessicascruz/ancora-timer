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

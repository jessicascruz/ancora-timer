import openai
import os
import tempfile

openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def transcribe_audio(audio_bytes: bytes, filename: str) -> str:
    """Transcribe audio file using Whisper."""
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

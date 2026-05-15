import anthropic
import json
import os

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

async def extract_note_fields(transcript: str) -> dict:
    """Extract structured fields from audio transcript using Claude."""
    response = client.messages.create(
        model="claude-opus-4-7",
        max_tokens=1000,
        messages=[
            {
                "role": "user",
                "content": f"""Extract the following information from this audio transcript in JSON format:

- doing_now: What the person is doing / was doing
- next_step: Next step or task mentioned
- open_thought: Open thought, doubt, or pending item mentioned

If a field is not mentioned, set it to null.
Respond ONLY with JSON, no additional text or markdown.

Transcript:
{transcript}
"""
            }
        ]
    )

    raw = response.content[0].text.strip()
    return json.loads(raw)

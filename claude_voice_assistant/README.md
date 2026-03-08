# Claude Voice Assistant

A clean, voice-first AI assistant powered by Claude (Anthropic) and FastAPI.

## Stack
- **Backend**: FastAPI + Uvicorn (port 7860)
- **Frontend**: Standalone HTML/CSS/JS (no framework, no build step)
- **AI**: Claude claude-sonnet-4-20250514 via Anthropic API
- **Voice In**: Web Speech API (Chrome/Edge)
- **Voice Out**: Browser SpeechSynthesis (all modern browsers)

## Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Add your API key
cp .env.example .env
# Edit .env → set ANTHROPIC_API_KEY=sk-ant-...

# 3. Start backend (Terminal 1)
uvicorn backend.main:app --reload --port 7860

# 4. Open frontend (Terminal 2 or just double-click)
open frontend/index.html
# Or serve it: python -m http.server 3000 --directory frontend
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/chat` | Send message, get Claude reply |
| GET | `/api/session/{id}` | Session metadata |
| GET | `/api/session/{id}/history` | Full conversation history |
| DELETE | `/api/session/{id}` | Clear session |
| GET | `/health` | Backend health + API key status |

## Notes
- Voice input requires Chrome 90+ or Edge 90+
- TTS works in all modern browsers
- Text input works everywhere as fallback
- Session history is in-memory; clears on server restart

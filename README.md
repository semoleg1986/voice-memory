# Voice Memory

Voice-first personal memory for ChatGPT.

Production: https://voice-memory.floot.app

## Current capabilities

- iPhone-first voice recorder
- Email/password authentication
- Per-user private audio storage
- Speech transcription and automatic memory/question routing
- Semantic memory search
- People extraction and Memory ↔ Person links
- Non-blocking identity clarifications
- Data export, per-memory deletion, full account deletion
- User-scoped queries throughout the backend

## Current architecture

```
React UI
  |
Floot endpoints
  |
  +-- Auth / session
  +-- Memory pipeline
  +-- People / clarifications
  +-- Data controls
  |
PostgreSQL + private object storage
  |
Floot AI
```

Floot project id: `8db65a22-a939-40dc-9907-b520cf99dcfd`

## Direction

The next architecture milestone is a remote MCP server with OAuth so ChatGPT can retrieve a user's Voice Memory directly. After that: pgvector retrieval and a Clean/Hexagonal-lite split into application ports and infrastructure adapters.

## Security

Secrets and production credentials are intentionally not committed. Every memory query must derive the user identity from the authenticated session/token; callers must never be trusted to supply an arbitrary user_id.

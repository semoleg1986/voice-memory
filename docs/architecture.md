# Architecture

## Core flow

```
iPhone microphone
  -> private presigned audio upload
  -> transcription
  -> intent classification
       -> memory: embedding -> persistence -> entity extraction -> clarification
       -> question: embedding -> user-scoped retrieval -> answer
```

## Data model

- users
- sessions
- user_passwords
- login_attempts
- voice_memories
- people
- memory_people
- clarifications

Every user-owned aggregate is scoped by authenticated user identity.

## Target architecture

```
ChatGPT
  -> OAuth
  -> Remote MCP
  -> Application
       RememberVoice
       SearchMemories
       GetMemory
       SearchPeople
       GetPersonMemories
  -> Ports
       MemoryRepository
       EntityRepository
       AudioStorage
       Transcriber
       IntentClassifier
       EmbeddingProvider
  -> Infrastructure
       PostgreSQL + pgvector
       private object storage
       AI providers
```

MCP should return evidence (memory_id, timestamp, transcript excerpt, provenance), not generate a second final answer. ChatGPT should compose the user-facing answer.

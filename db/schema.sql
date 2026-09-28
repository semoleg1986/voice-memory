CREATE TYPE clarification_status AS ENUM ('pending','resolved','dismissed');

CREATE TABLE voice_memories (
  id uuid PRIMARY KEY,
  user_id bigint REFERENCES users(id) ON DELETE CASCADE,
  storage_filename text NOT NULL UNIQUE,
  mime_type text NOT NULL,
  duration_seconds integer NOT NULL DEFAULT 0,
  transcript text,
  embedding jsonb,
  status text NOT NULL DEFAULT 'uploaded',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE people (
  id uuid PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  aliases jsonb NOT NULL DEFAULT '[]'::jsonb,
  description text,
  organization text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE memory_people (
  memory_id uuid NOT NULL REFERENCES voice_memories(id) ON DELETE CASCADE,
  person_id uuid NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  relation text,
  confidence double precision NOT NULL DEFAULT 1,
  PRIMARY KEY (memory_id, person_id)
);

CREATE TABLE clarifications (
  id uuid PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  memory_id uuid NOT NULL REFERENCES voice_memories(id) ON DELETE CASCADE,
  type text NOT NULL,
  mentioned_name text NOT NULL,
  proposed_person_id uuid REFERENCES people(id) ON DELETE SET NULL,
  question text NOT NULL,
  status clarification_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

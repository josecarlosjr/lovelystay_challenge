CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  location TEXT,
  languages TEXT[]
);

CREATE TABLE IF NOT EXISTS languages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  language TEXT
);

-- Check if the "languages" column exists in the "users" table
DO $$BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'users'
    AND column_name = 'languages'
  ) THEN
    -- Add the "languages" column to the "users" table
    ALTER TABLE users
    ADD COLUMN languages TEXT[];
  END IF;
END$$;

-- Add a unique constraint to the "name" column in the "users" table
DO $$BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'unique_name'
  ) THEN
    ALTER TABLE users
    ADD CONSTRAINT unique_name UNIQUE (name);
  END IF;
END$$;

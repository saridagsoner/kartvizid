-- Add certificates column to cvs table
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS certificates jsonb DEFAULT '[]'::jsonb;

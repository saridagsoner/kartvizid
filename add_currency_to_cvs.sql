-- Add salary_currency column to cvs table
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS salary_currency text DEFAULT 'TRY';

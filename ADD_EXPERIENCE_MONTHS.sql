
-- Add experience_months column to cvs table
ALTER TABLE public.cvs
ADD COLUMN IF NOT EXISTS experience_months integer DEFAULT 0;

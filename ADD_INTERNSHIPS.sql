
-- Add internship_details column to cvs table
ALTER TABLE public.cvs
ADD COLUMN IF NOT EXISTS internship_details jsonb DEFAULT '[]'::jsonb;

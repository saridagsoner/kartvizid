-- Add JSONB columns to cvs table to store structured data
ALTER TABLE public.cvs 
ADD COLUMN IF NOT EXISTS work_experience JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS education_details JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS language_details JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS certificates JSONB DEFAULT '[]'::jsonb;

-- Ensure RLS policies allow update on these columns
-- (Existing policies usually cover "all columns" for update if not restricted, 
-- but explicit GRANTs/Policies might be needed if column-level security was used.
-- Standard Supabase RLS policies are usually row-based, so this should be fine.)

-- Backfill logic?
-- If we have existing data in 'education' text column, we might want to migrate it 
-- to 'education_details' but parsing unstructured text is hard.
-- For now, we leave them as is. The UI handles legacy fallback.

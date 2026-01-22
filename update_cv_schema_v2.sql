-- Migration to enhance CVS table with structured data columns

ALTER TABLE public.cvs
ADD COLUMN IF NOT EXISTS district TEXT,
ADD COLUMN IF NOT EXISTS education_details JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS work_experience JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS language_details JSONB DEFAULT '[]'::jsonb;

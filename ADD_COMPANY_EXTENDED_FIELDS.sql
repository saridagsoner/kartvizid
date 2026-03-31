-- Add extended fields to companies table
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS founded_year integer,
ADD COLUMN IF NOT EXISTS employee_count text,
ADD COLUMN IF NOT EXISTS instagram_url text;

-- Add preferred_city and preferred_roles to cvs table

ALTER TABLE public.cvs
ADD COLUMN IF NOT EXISTS preferred_city text,
ADD COLUMN IF NOT EXISTS preferred_roles text[];

-- Comment on columns
COMMENT ON COLUMN public.cvs.preferred_city IS 'Preferred city for work';
COMMENT ON COLUMN public.cvs.preferred_roles IS 'List of preferred job roles or areas';

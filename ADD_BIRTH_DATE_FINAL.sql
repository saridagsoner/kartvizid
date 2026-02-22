-- 1. Add birth_date column to cvs table
ALTER TABLE public.cvs ADD COLUMN IF NOT EXISTS birth_date text;

-- 2. Force schema cache reload for PostgREST (Supabase API)
NOTIFY pgrst, 'reload schema';

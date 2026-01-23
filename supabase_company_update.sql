
-- Add new columns to companies table
alter table public.companies 
add column if not exists district text,
add column if not exists country text,
add column if not exists address text;

-- (Optional) If we want to ensure country defaults to Turkey easily
alter table public.companies 
alter column country set default 'Türkiye';

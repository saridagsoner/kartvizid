-- Add contact info columns to cvs table
alter table public.cvs
add column if not exists email text,
add column if not exists phone text,
add column if not exists is_email_public boolean default false,
add column if not exists is_phone_public boolean default false;

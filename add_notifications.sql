-- Add notification preference columns to profiles table
alter table public.profiles
add column if not exists email_notifications boolean default true,
add column if not exists marketing_notifications boolean default false;

-- Ensure users can update these columns (covered by existing policy, but good to verify)
-- Existing policy: "Users can update own profile." using (auth.uid() = id); -> This covers all columns.

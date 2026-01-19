-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a table for CVs
create table cvs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Personal Info
  name text not null,
  profession text not null,
  city text not null,
  photo_url text,
  about text,
  
  -- Details
  experience_years numeric,
  language text,
  language_level text,
  salary_min numeric,
  salary_max numeric,
  
  -- Arrays stored as text[] or jsonb. Postgres text[] is good for simple strings.
  skills text[],
  
  -- Other fields
  education text,
  education_level text,
  graduation_status text,
  work_type text,
  employment_type text,
  military_status text,
  marital_status text,
  disability_status text,
  driver_license text[],
  travel_status text,
  notice_period text,
  
  -- Status flags
  is_new boolean default true,
  is_active boolean default true,
  is_placed boolean default false,
  views integer default 0
);

-- RLS for CVs
alter table cvs enable row level security;

create policy "CVs are viewable by everyone."
  on cvs for select
  using ( true );

create policy "Users can insert their own CVs."
  on cvs for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own CVs."
  on cvs for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own CVs."
  on cvs for delete
  using ( auth.uid() = user_id );

-- Handle new user signup -> create profile automatically
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update: Add Working Status and References columns
ALTER TABLE cvs 
ADD COLUMN IF NOT EXISTS "working_status" TEXT DEFAULT 'open',
ADD COLUMN IF NOT EXISTS "references" JSONB DEFAULT '[]'::jsonb;

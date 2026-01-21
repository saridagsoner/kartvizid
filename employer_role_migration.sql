-- Add role to profiles
-- We use a check constraint for simple enum emulation
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'job_seeker' CHECK (role IN ('job_seeker', 'employer'));

-- Create Companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  company_name text NOT NULL,
  description text,
  website text,
  industry text,
  city text,
  logo_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- RLS for Companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies are viewable by everyone."
  ON public.companies FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own company."
  ON public.companies FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own company."
  ON public.companies FOR UPDATE
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own company."
  ON public.companies FOR DELETE
  USING ( auth.uid() = user_id );

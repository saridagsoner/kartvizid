-- SQL to fix missing columns in the 'cvs' table
-- Run this in your Supabase SQL Editor

ALTER TABLE cvs ADD COLUMN IF NOT EXISTS district text;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS birth_date text;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS experience_months integer DEFAULT 0;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS salary_currency text DEFAULT '₺';
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS employmentType text;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS military_status text;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS maritalStatus text;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS disabilityStatus text;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS travel_status text;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS notice_period text;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS is_email_public boolean DEFAULT false;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS is_phone_public boolean DEFAULT false;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS working_status text DEFAULT 'open';
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS preferred_city text;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS preferred_roles jsonb DEFAULT '[]'::jsonb;

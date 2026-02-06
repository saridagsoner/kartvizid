-- Add KVKK consent columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS kvkk_consent boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS kvkk_consent_date timestamp with time zone;

-- Comment on columns
COMMENT ON COLUMN public.profiles.kvkk_consent IS 'User consent status for KVKK (Personal Data Protection Law)';
COMMENT ON COLUMN public.profiles.kvkk_consent_date IS 'Timestamp of when the user gave KVKK consent';

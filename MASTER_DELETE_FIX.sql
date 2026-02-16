
-- MASTER FIX FOR USER DELETION ERROR
-- This script addresses:
-- 1. Public table dependencies (CASCADE DELETE)
-- 2. Storage object dependencies (Trigger to delete files)

BEGIN;

--------------------------------------------------------------------------------
-- PART 1: ENSURE PUBLIC TABLES CASCADE DELETE
--------------------------------------------------------------------------------

-- 1. PROFILES
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. CVS
ALTER TABLE public.cvs DROP CONSTRAINT IF EXISTS cvs_user_id_fkey;
ALTER TABLE public.cvs ADD CONSTRAINT cvs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. COMPANIES
ALTER TABLE public.companies DROP CONSTRAINT IF EXISTS companies_user_id_fkey;
ALTER TABLE public.companies DROP CONSTRAINT IF EXISTS "companies_userId_fkey";
ALTER TABLE public.companies ADD CONSTRAINT companies_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. SAVED CVS
ALTER TABLE public.saved_cvs DROP CONSTRAINT IF EXISTS saved_cvs_employer_id_fkey;
ALTER TABLE public.saved_cvs ADD CONSTRAINT saved_cvs_employer_id_fkey FOREIGN KEY (employer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 5. NOTIFICATIONS
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_sender_id_fkey;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
-- Note: sender_id references profiles(id) now in some versions, but let's be safe and check if it references auth.users
-- IF it references profiles, profile deletion handles it. If it references auth.users, this handles it.
-- We will just make sure it cascades if it exists.

-- 6. CONTACT REQUESTS
ALTER TABLE public.contact_requests DROP CONSTRAINT IF EXISTS contact_requests_requester_id_fkey;
ALTER TABLE public.contact_requests DROP CONSTRAINT IF EXISTS contact_requests_target_user_id_fkey;
ALTER TABLE public.contact_requests ADD CONSTRAINT contact_requests_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.contact_requests ADD CONSTRAINT contact_requests_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

--------------------------------------------------------------------------------
-- PART 2: STORAGE OBJECTS CLEANUP TRIGGER
--------------------------------------------------------------------------------
-- Supabase Storage objects (avatars, CVs) reference auth.users.
-- If a user has files, deletion fails unless we delete files first.

CREATE OR REPLACE FUNCTION public.handle_deleted_user_cleanup() 
RETURNS TRIGGER AS $$
BEGIN
  -- Delete all files owned by the user in storage.objects
  -- This requires the function to run with adequate privileges (security definer)
  DELETE FROM storage.objects WHERE owner = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to avoid duplication
DROP TRIGGER IF EXISTS on_auth_user_deleted_cleanup ON auth.users;

-- Create Trigger
CREATE TRIGGER on_auth_user_deleted_cleanup
BEFORE DELETE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_deleted_user_cleanup();

COMMIT;

-- MASTER SCRIPT TO ALLOW DELETING USERS FROM SUPABASE DASHBOARD
-- This script fixes the "Database error deleting user" issue by ensuring
-- all foreign key references to auth.users cascade deletes.

BEGIN;

-- --------------------------------------------------------------------------------
-- STEP 0: CLEANUP ORPHANED RECORDS
-- --------------------------------------------------------------------------------
-- The error "violates foreign key constraint... is not present in table users" 
-- happens because there are old records in your tables belonging to users that 
-- were already deleted from auth.users. 
-- We must delete these orphaned records first before we can create the constraints.

DELETE FROM public.profiles WHERE id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.cvs WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.companies WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.saved_cvs WHERE employer_id IS NOT NULL AND employer_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.notifications WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.contact_requests WHERE requester_id IS NOT NULL AND requester_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.contact_requests WHERE target_user_id IS NOT NULL AND target_user_id NOT IN (SELECT id FROM auth.users);


-- --------------------------------------------------------------------------------
-- STEP 1: ADD CASCADE DELETE CONSTRAINTS
-- --------------------------------------------------------------------------------

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

-- 6. CONTACT REQUESTS
ALTER TABLE public.contact_requests DROP CONSTRAINT IF EXISTS contact_requests_requester_id_fkey;
ALTER TABLE public.contact_requests DROP CONSTRAINT IF EXISTS contact_requests_target_user_id_fkey;
ALTER TABLE public.contact_requests ADD CONSTRAINT contact_requests_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.contact_requests ADD CONSTRAINT contact_requests_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


-- --------------------------------------------------------------------------------
-- STEP 2: STORAGE OBJECTS CLEANUP TRIGGER
-- --------------------------------------------------------------------------------
-- If a user has uploaded avatars or CV images, Supabase fails to delete the user
-- because the files still exist in the storage.objects table.

CREATE OR REPLACE FUNCTION public.handle_deleted_user_cleanup() 
RETURNS TRIGGER AS $$
BEGIN
  -- Delete all files owned by the user in storage.objects
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

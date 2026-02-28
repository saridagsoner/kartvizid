-- THE ULTIMATE BRUTE FORCE DELETE FIX
-- If the previous scripts don't work, there is a hidden table or constraint blocking the deletion.
-- This script uses a trigger on auth.users that runs BEFORE DELETE
-- and aggressively wipes out every possible related record across all tables.

BEGIN;

CREATE OR REPLACE FUNCTION public.custom_aggressive_user_cleanup() 
RETURNS TRIGGER AS $$
BEGIN
  -- 1. Wipe out Notifications (has user_id and sender_id)
  DELETE FROM public.notifications WHERE user_id = OLD.id OR sender_id = OLD.id;
  
  -- 2. Wipe out Contact Requests (has requester_id and target_user_id)
  DELETE FROM public.contact_requests WHERE requester_id = OLD.id OR target_user_id = OLD.id;

  -- 3. Wipe out Saved CVs
  DELETE FROM public.saved_cvs WHERE employer_id = OLD.id;

  -- 4. Wipe out Companies
  DELETE FROM public.companies WHERE user_id = OLD.id;

  -- 5. Wipe out CVs
  DELETE FROM public.cvs WHERE user_id = OLD.id;

  -- 6. Wipe out Profiles
  DELETE FROM public.profiles WHERE id = OLD.id;

  -- 7. Wipe out Storage Objects (Files)
  DELETE FROM storage.objects WHERE owner = OLD.id;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if there is one
DROP TRIGGER IF EXISTS tr_aggressive_user_cleanup ON auth.users;
DROP function IF EXISTS public.custom_aggressive_user_cleanup();

CREATE OR REPLACE FUNCTION public.custom_aggressive_user_cleanup() 
RETURNS TRIGGER AS $$
BEGIN
  -- 1. Wipe out Notifications (has user_id and sender_id)
  DELETE FROM public.notifications WHERE user_id = OLD.id OR sender_id = OLD.id;
  
  -- 2. Wipe out Contact Requests (has requester_id and target_user_id)
  DELETE FROM public.contact_requests WHERE requester_id = OLD.id OR target_user_id = OLD.id;

  -- 3. Wipe out Saved CVs
  DELETE FROM public.saved_cvs WHERE employer_id = OLD.id;

  -- 4. Wipe out Companies
  DELETE FROM public.companies WHERE user_id = OLD.id;

  -- 5. Wipe out CVs
  DELETE FROM public.cvs WHERE user_id = OLD.id;

  -- 6. Wipe out Profiles
  DELETE FROM public.profiles WHERE id = OLD.id;

  -- 7. Wipe out Storage Objects (Files)
  DELETE FROM storage.objects WHERE owner = OLD.id;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Add trigger
CREATE TRIGGER tr_aggressive_user_cleanup
BEFORE DELETE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.custom_aggressive_user_cleanup();


-- ALSO drop and recreate standard cascade references just in case
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.cvs DROP CONSTRAINT IF EXISTS cvs_user_id_fkey;
ALTER TABLE public.cvs ADD CONSTRAINT cvs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.companies DROP CONSTRAINT IF EXISTS companies_user_id_fkey;
ALTER TABLE public.companies ADD CONSTRAINT companies_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.saved_cvs DROP CONSTRAINT IF EXISTS saved_cvs_employer_id_fkey;
ALTER TABLE public.saved_cvs ADD CONSTRAINT saved_cvs_employer_id_fkey FOREIGN KEY (employer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_sender_id_fkey;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.contact_requests DROP CONSTRAINT IF EXISTS contact_requests_requester_id_fkey;
ALTER TABLE public.contact_requests ADD CONSTRAINT contact_requests_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.contact_requests DROP CONSTRAINT IF EXISTS contact_requests_target_user_id_fkey;
ALTER TABLE public.contact_requests ADD CONSTRAINT contact_requests_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

COMMIT;

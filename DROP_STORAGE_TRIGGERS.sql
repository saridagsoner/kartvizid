-- FAILED STORAGE DELETION TRIGGER CLEANUP --
-- Problem: Supabase blocks direct SQL formatting "DELETE FROM storage.objects".
-- It throws ERROR: 42501  Direct deletion from storage tables is not allowed. Use the Storage API instead.
-- Solution: We must drop our triggers that try to do this.

BEGIN;

-- 1. Drop the aggressive trigger we just created
DROP TRIGGER IF EXISTS tr_aggressive_user_cleanup ON auth.users;
DROP FUNCTION IF EXISTS public.custom_aggressive_user_cleanup();

-- 2. Drop the old cleanup trigger (this was actually the main culprit all along)
DROP TRIGGER IF EXISTS on_auth_user_deleted_cleanup ON auth.users;
DROP FUNCTION IF EXISTS public.handle_deleted_user_cleanup();

-- 3. Just to be 100% safe, let's keep the basic structure that deletes ONLY from public tables
--    This is allowed because public tables belong to us, but storage belongs to Supabase internals.

CREATE OR REPLACE FUNCTION public.safe_user_cleanup() 
RETURNS TRIGGER AS $$
BEGIN
  -- We ONLY delete from our own public tables here.
  -- Storage files will become "orphaned" but it won't block user deletion.
  -- You can later use a cron job or script via the Supabase Javascript client to clean up orphaned files.
  
  DELETE FROM public.notifications WHERE user_id = OLD.id OR sender_id = OLD.id;
  DELETE FROM public.contact_requests WHERE requester_id = OLD.id OR target_user_id = OLD.id;
  DELETE FROM public.saved_cvs WHERE employer_id = OLD.id;
  DELETE FROM public.companies WHERE user_id = OLD.id;
  DELETE FROM public.cvs WHERE user_id = OLD.id;
  DELETE FROM public.profiles WHERE id = OLD.id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_safe_user_cleanup
BEFORE DELETE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.safe_user_cleanup();


COMMIT;

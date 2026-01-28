-- Comprehensive Account Deletion Function
-- This function handles the cleanup of all user data across the system
-- ensuring a clean state for re-registration if desired.

DROP FUNCTION IF EXISTS public.delete_account();

CREATE OR REPLACE FUNCTION public.delete_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Get the current user ID
  current_user_id := auth.uid();
  
  -- If no user is logged in, exit
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- 1. Delete Notifications (Sent or Received)
  BEGIN
    DELETE FROM public.notifications 
    WHERE user_id = current_user_id OR sender_id = current_user_id;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  -- 2. Delete Contact Requests (Sender or Target)
  BEGIN
    DELETE FROM public.contact_requests 
    WHERE sender_id = current_user_id OR target_user_id = current_user_id;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  -- 3. Delete CV
  BEGIN
    DELETE FROM public.cvs 
    WHERE user_id = current_user_id;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  -- 4. Delete Company Profile (if employer)
  BEGIN
    DELETE FROM public.companies 
    WHERE created_by = current_user_id;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  -- 5. Delete Profile
  BEGIN
    DELETE FROM public.profiles 
    WHERE id = current_user_id;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  -- 6. Delete User from Auth (Critical Step)
  -- This requires SECURITY DEFINER to work
  DELETE FROM auth.users 
  WHERE id = current_user_id;

END;
$$;

-- Grant execution permission
GRANT EXECUTE ON FUNCTION public.delete_account() TO authenticated;

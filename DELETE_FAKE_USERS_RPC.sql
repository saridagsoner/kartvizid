-- Create a function running as SECURITY DEFINER to bypass trigger restrictions
CREATE OR REPLACE FUNCTION delete_fake_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user record;
BEGIN
  -- First delete all CVs
  DELETE FROM public.cvs WHERE email LIKE '%@example.com';
  
  -- For each fake user, delete their storage objects to avoid the trigger error
  FOR v_user IN SELECT id FROM auth.users WHERE email LIKE '%@example.com' LOOP
    DELETE FROM storage.objects WHERE owner = v_user.id;
    DELETE FROM auth.users WHERE id = v_user.id;
  END LOOP;
END;
$$;

-- Execute the function
SELECT delete_fake_users();

-- Clean up the function
DROP FUNCTION delete_fake_users();

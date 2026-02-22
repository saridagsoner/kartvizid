-- Force delete by disabling triggers per session (Requires postgres role, which SQL Editor has)
DO $$
BEGIN
  -- 1. Disable all triggers for the current transaction using replication role bypass
  SET session_replication_role = replica;

  -- 2. Delete CVs
  DELETE FROM public.cvs WHERE email LIKE '%@example.com';

  -- 3. Delete their files
  DELETE FROM storage.objects WHERE owner IN (SELECT id FROM auth.users WHERE email LIKE '%@example.com');

  -- 4. Finally, delete the auth user
  DELETE FROM auth.users WHERE email LIKE '%@example.com';

  -- 5. Restore normal trigger behavior
  SET session_replication_role = DEFAULT;

EXCEPTION WHEN OTHERS THEN
  -- Make sure to always reset the role even if it fails
  SET session_replication_role = DEFAULT;
  RAISE;
END $$;

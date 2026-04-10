-- DELETE_SPECIFIC_FAKE_USERS.sql
-- PURPOSE: Surgically remove specific fake profiles identified by the user in screenshots.
-- SAFETY: Only targets users with email ending in '@example.com' and matching names.
-- USAGE: Run in Supabase SQL Editor.

DO $$
DECLARE
  v_target_names TEXT[] := ARRAY[
    'Ayşe Nur Göçkün', 
    'Nermin Sönmez', 
    'Emircan Güleç', 
    'Sedat Eser', 
    'Umut Can Yılmaz',
    'Cihan Güler',
    'Erol Karan',
    'Yiğit Seçkin',
    'Taylan Yalçın',
    'Sinem Bulut',
    'Bora Turgut',
    'Sertaç Karan',
    'Zeynep Kaya'
  ];
BEGIN
  -- Disable triggers and foreign key checks for this session
  SET session_replication_role = replica;

  -- 1. Remove from CVS table (Targets only @example.com emails for safety)
  DELETE FROM public.cvs 
  WHERE email LIKE '%@example.com' 
  AND name = ANY(v_target_names);

  -- 2. Remove from Profiles table (if they exist there)
  DELETE FROM public.profiles
  WHERE id IN (
    SELECT id FROM auth.users 
    WHERE email LIKE '%@example.com' 
    AND (raw_user_meta_data->>'full_name') = ANY(v_target_names)
  );

  -- 3. Finally remove from Auth Users
  DELETE FROM auth.users 
  WHERE email LIKE '%@example.com' 
  AND (raw_user_meta_data->>'full_name') = ANY(v_target_names);

  -- Restore normal behavior
  SET session_replication_role = DEFAULT;
  
  RAISE NOTICE 'Deleted specified fake users successfully.';
END $$;

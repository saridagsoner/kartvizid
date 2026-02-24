-- Check if the trigger exists
SELECT tgname, relname, prosrc 
FROM pg_trigger
JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
WHERE pg_class.relnamespace = 'auth'::regnamespace AND relname = 'users';

-- Check recent rows in auth.users to see if metadata is saved
SELECT id, email, raw_user_meta_data FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- Check if any CVs were created recently
SELECT id, user_id, email, name, profession FROM public.cvs ORDER BY created_at DESC LIMIT 5;

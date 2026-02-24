SELECT tgname, relname, prosrc 
FROM pg_trigger
JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
WHERE pg_class.relnamespace = 'auth'::regnamespace AND relname = 'users';

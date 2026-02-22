-- Step 1: Temporarily disable the trigger that causes the storage error (if it exists)
-- Replace "handle_deleted_user_cleanup" with the actual trigger name if different, but usually it's tied to auth.users
ALTER TABLE auth.users DISABLE TRIGGER ALL;

-- Step 2: Delete from the CVs table
DELETE FROM public.cvs WHERE email LIKE '%@example.com';

-- Step 3: Delete from auth.users
DELETE FROM auth.users WHERE email LIKE '%@example.com';

-- Step 4: Re-enable the triggers
ALTER TABLE auth.users ENABLE TRIGGER ALL;

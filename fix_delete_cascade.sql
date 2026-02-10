-- Enable CASCADE DELETE on all tables referencing auth.users
-- This allows deleting a user from Supabase Authentication -> Users dashboard
-- effectively removing all their data automatically.

BEGIN;

-- 1. Profiles (id -> users.id)
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_id_fkey,
ADD CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- 2. CVs (user_id -> users.id)
ALTER TABLE public.cvs
DROP CONSTRAINT IF EXISTS cvs_user_id_fkey,
ADD CONSTRAINT cvs_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- 3. Companies (user_id -> users.id)
ALTER TABLE public.companies
DROP CONSTRAINT IF EXISTS companies_userId_fkey, -- Trying common naming
DROP CONSTRAINT IF EXISTS companies_user_id_fkey,
ADD CONSTRAINT companies_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- 4. Notifications (user_id -> users.id AND sender_id -> users.id)
ALTER TABLE public.notifications
DROP CONSTRAINT IF EXISTS notifications_user_id_fkey,
ADD CONSTRAINT notifications_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

ALTER TABLE public.notifications
DROP CONSTRAINT IF EXISTS notifications_sender_id_fkey,
ADD CONSTRAINT notifications_sender_id_fkey
    FOREIGN KEY (sender_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- 5. Contact Requests (requester_id and target_user_id)
ALTER TABLE public.contact_requests
DROP CONSTRAINT IF EXISTS contact_requests_requester_id_fkey,
ADD CONSTRAINT contact_requests_requester_id_fkey
    FOREIGN KEY (requester_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

ALTER TABLE public.contact_requests
DROP CONSTRAINT IF EXISTS contact_requests_target_user_id_fkey,
ADD CONSTRAINT contact_requests_target_user_id_fkey
    FOREIGN KEY (target_user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- 6. Saved CVs (employer_id -> users.id)
ALTER TABLE public.saved_cvs
DROP CONSTRAINT IF EXISTS saved_cvs_employer_id_fkey,
ADD CONSTRAINT saved_cvs_employer_id_fkey
    FOREIGN KEY (employer_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

COMMIT;

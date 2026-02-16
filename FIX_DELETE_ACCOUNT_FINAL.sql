
-- FINAL RELIABLE FIX FOR USER DELETION
-- This script safely re-creates all Foreign Key constraints linking to auth.users with ON DELETE CASCADE.
-- Checks for existence before dropping to avoid errors.

BEGIN;

-- 1. PROFILES (user_id -> auth.users.id)
-- Note: 'profiles' usually has 'id' as primary key which is also the foreign key to auth.users.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
      ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
      ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey; -- Handle alternative naming

      ALTER TABLE public.profiles
        ADD CONSTRAINT profiles_id_fkey
        FOREIGN KEY (id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE;
  END IF;
END $$;

-- 2. CVS (user_id -> auth.users.id)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cvs') THEN
      ALTER TABLE public.cvs DROP CONSTRAINT IF EXISTS cvs_user_id_fkey;
      
      ALTER TABLE public.cvs
        ADD CONSTRAINT cvs_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE;
  END IF;
END $$;

-- 3. COMPANIES (user_id -> auth.users.id)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'companies') THEN
      ALTER TABLE public.companies DROP CONSTRAINT IF EXISTS companies_user_id_fkey;
      ALTER TABLE public.companies DROP CONSTRAINT IF EXISTS "companies_userId_fkey"; -- Case sensitive check

      ALTER TABLE public.companies
        ADD CONSTRAINT companies_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE;
  END IF;
END $$;

-- 4. NOTIFICATIONS (user_id -> auth.users.id AND sender_id -> auth.users.id)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications') THEN
      ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
      ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_sender_id_fkey;

      ALTER TABLE public.notifications
        ADD CONSTRAINT notifications_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE;

      ALTER TABLE public.notifications
        ADD CONSTRAINT notifications_sender_id_fkey
        FOREIGN KEY (sender_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE;
  END IF;
END $$;

-- 5. CONTACT REQUESTS (requester_id, target_user_id -> auth.users.id)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contact_requests') THEN
      ALTER TABLE public.contact_requests DROP CONSTRAINT IF EXISTS contact_requests_requester_id_fkey;
      ALTER TABLE public.contact_requests DROP CONSTRAINT IF EXISTS contact_requests_target_user_id_fkey;

      ALTER TABLE public.contact_requests
        ADD CONSTRAINT contact_requests_requester_id_fkey
        FOREIGN KEY (requester_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE;

      ALTER TABLE public.contact_requests
        ADD CONSTRAINT contact_requests_target_user_id_fkey
        FOREIGN KEY (target_user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE;
  END IF;
END $$;

-- 6. SAVED CVS (employer_id -> auth.users.id)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'saved_cvs') THEN
      ALTER TABLE public.saved_cvs DROP CONSTRAINT IF EXISTS saved_cvs_employer_id_fkey;

      ALTER TABLE public.saved_cvs
        ADD CONSTRAINT saved_cvs_employer_id_fkey
        FOREIGN KEY (employer_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE;
  END IF;
END $$;

COMMIT;

-- ==============================================================================
-- FIX MISSING RELATIONSHIPS (PGRST200 ERROR FIX)
-- ==============================================================================

-- Bu script, contact_requests tablosunun profiles tablosu ile olan bağlantılarını tamir eder.
-- Hata mesajındaki "Could not find a relationship" sorununu çözer.

DO $$ 
BEGIN 
    -- 1. requester_id bağlantısını onar
    -- Önce varsa eski/bozuk olanı sil
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'contact_requests_requester_id_fkey') THEN
        ALTER TABLE contact_requests DROP CONSTRAINT contact_requests_requester_id_fkey;
    END IF;

    -- Yeniden, doğru şekilde oluştur
    ALTER TABLE contact_requests
    ADD CONSTRAINT contact_requests_requester_id_fkey
    FOREIGN KEY (requester_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE;


    -- 2. target_user_id bağlantısını onar
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'contact_requests_target_user_id_fkey') THEN
        ALTER TABLE contact_requests DROP CONSTRAINT contact_requests_target_user_id_fkey;
    END IF;

    ALTER TABLE contact_requests
    ADD CONSTRAINT contact_requests_target_user_id_fkey
    FOREIGN KEY (target_user_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE;

    
    -- 3. notifications sender_id bağlantısını onar (Garanti olsun)
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'notifications_sender_id_fkey') THEN
        ALTER TABLE notifications DROP CONSTRAINT notifications_sender_id_fkey;
    END IF;

    ALTER TABLE notifications
    ADD CONSTRAINT notifications_sender_id_fkey
    FOREIGN KEY (sender_id)
    REFERENCES profiles(id)
    ON DELETE SET NULL;

END $$;

-- Schema cache'i yenilemek için
NOTIFY pgrst, 'reload schema';

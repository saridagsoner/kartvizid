-- ==============================================================================
-- MASTER RELATIONSHIP FIX (HER ŞEYİ TEK SEFERDE DÜZELTME)
-- ==============================================================================

-- Bu script veritabanındaki tüm kopuk bağlantıları (Foreign Keys) sıfırdan ve doğru şekilde kurar.
-- "PGRST200: Could not find a relationship" hatasının kesin çözümüdür.

DO $$ 
BEGIN 
    -- 1. COMPANIES TABLOSU BAĞLANTISI (Şirket isimleri için şart)
    -- Önce eskiyi temizle
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'companies_user_id_fkey') THEN
        ALTER TABLE companies DROP CONSTRAINT companies_user_id_fkey;
    END IF;
    
    -- Yenisini, PostgREST'in anlayacağı şekilde ekle
    ALTER TABLE companies
    ADD CONSTRAINT companies_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE;


    -- 2. CVS TABLOSU BAĞLANTISI (Aday isimleri için şart)
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'cvs_user_id_fkey') THEN
        ALTER TABLE cvs DROP CONSTRAINT cvs_user_id_fkey;
    END IF;

    ALTER TABLE cvs
    ADD CONSTRAINT cvs_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE;


    -- 3. CONTACT_REQUESTS BAĞLANTILARI (İstekler için şart)
    -- requester_id
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'contact_requests_requester_id_fkey') THEN
        ALTER TABLE contact_requests DROP CONSTRAINT contact_requests_requester_id_fkey;
    END IF;

    ALTER TABLE contact_requests
    ADD CONSTRAINT contact_requests_requester_id_fkey
    FOREIGN KEY (requester_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE;

    -- target_user_id
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'contact_requests_target_user_id_fkey') THEN
        ALTER TABLE contact_requests DROP CONSTRAINT contact_requests_target_user_id_fkey;
    END IF;

    ALTER TABLE contact_requests
    ADD CONSTRAINT contact_requests_target_user_id_fkey
    FOREIGN KEY (target_user_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE;


    -- 4. NOTIFICATIONS BAĞLANTISI (Bildirimler için şart)
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'notifications_sender_id_fkey') THEN
        ALTER TABLE notifications DROP CONSTRAINT notifications_sender_id_fkey;
    END IF;

    ALTER TABLE notifications
    ADD CONSTRAINT notifications_sender_id_fkey
    FOREIGN KEY (sender_id)
    REFERENCES profiles(id)
    ON DELETE SET NULL;

END $$;

-- Schema Cache'i Yenile (Supabase'in değişiklikleri görmesi için çok önemli)
NOTIFY pgrst, 'reload schema';

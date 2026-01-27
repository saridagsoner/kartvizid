-- ==============================================================================
-- KARTVIZID FINAL STABLE FIX (NO MAGIC TRIGGERS)
-- ==============================================================================

-- 1. CLEANUP (Tüm eski tetikleyicileri ve fonksiyonları temizle)
DROP TRIGGER IF EXISTS on_contact_request_created ON contact_requests CASCADE;
DROP TRIGGER IF EXISTS on_contact_request_events ON contact_requests CASCADE;
DROP TRIGGER IF EXISTS on_contact_request_update ON contact_requests CASCADE; -- Kullanıcı manuel silmediyse diye
DROP FUNCTION IF EXISTS handle_contact_request_events() CASCADE;
DROP FUNCTION IF EXISTS handle_new_contact_request() CASCADE;

-- 2. SCHEMA GARANTİSİ
DO $$ 
BEGIN 
    -- updated_at kolonu yoksa ekle (HATA KAYNAĞI BURASIYDI)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_requests' AND column_name = 'updated_at') THEN 
        ALTER TABLE contact_requests ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;

    -- sender_id kolonu yoksa ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'sender_id') THEN 
        ALTER TABLE notifications ADD COLUMN sender_id UUID;
    END IF;
END $$;

-- 3. GÜVENLİ RPC - YENİ İSTEK (Hem istek hem bildirim oluşturur)
CREATE OR REPLACE FUNCTION create_contact_request_secure(
  p_target_user_id UUID,
  p_sender_name TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_new_id UUID;
  v_status text; -- enum yerine text 
BEGIN
  -- 1. İsteği Oluştur
  INSERT INTO contact_requests (requester_id, target_user_id, status)
  VALUES (auth.uid(), p_target_user_id, 'pending')
  RETURNING id, status INTO v_new_id, v_status;

  -- 2. Bildirimi Oluştur (Trigger yerine burada yapıyoruz, isim garanti doğru gelir)
  INSERT INTO notifications (user_id, type, title, message, related_id, sender_id, is_read)
  VALUES (
    p_target_user_id,
    'contact_request',
    'İletişim İsteği',
    p_sender_name || ' iletişim bilgilerinizi görüntülemek istiyor.',
    v_new_id,
    auth.uid(),
    FALSE
  );

  RETURN jsonb_build_object('id', v_new_id, 'status', v_status);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. GÜVENLİ RPC - CEVAP VERME (Hem güncelleme hem bildirim)
CREATE OR REPLACE FUNCTION respond_to_request_secure(
  p_request_id UUID,
  p_action TEXT,
  p_responder_name TEXT
)
RETURNS VOID AS $$
DECLARE
  v_requester_id UUID;
  v_target_user_id UUID;
BEGIN
  -- İsteği bul
  SELECT requester_id, target_user_id INTO v_requester_id, v_target_user_id
  FROM contact_requests WHERE id = p_request_id;
  
  -- Yetki Kontrolü
  IF v_target_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Yetkisiz işlem.';
  END IF;

  -- 1. Durumu Güncelle
  UPDATE contact_requests 
  SET status = p_action, updated_at = NOW()
  WHERE id = p_request_id;

  -- 2. İlgili Bildirimi Okundu Olarak İşaretle (Kritik Düzeltme: Listeden düşmesi için)
  UPDATE notifications
  SET is_read = TRUE
  WHERE related_id = p_request_id 
    AND user_id = auth.uid()
    AND type = 'contact_request';

  -- 3. Bildirim Gönder (İsteği yapan kişiye)
  INSERT INTO notifications (user_id, type, title, message, related_id, sender_id, is_read)
  VALUES (
    v_requester_id,
    CASE WHEN p_action = 'approved' THEN 'success' ELSE 'info' END,
    CASE WHEN p_action = 'approved' THEN 'İletişim İsteği Onaylandı' ELSE 'İstek Sonuçlandı' END,
    p_responder_name || ' iletişime geçme isteğinizi ' || CASE WHEN p_action = 'approved' THEN 'onayladı.' ELSE 'reddetti.' END,
    p_request_id,
    auth.uid(),
    FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. RLS İZİNLERİ (Son Kontrol)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizleyelim ki çakışma olmasın
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Users can insert notifications" ON notifications;

-- Notifications Policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
-- RPC (Security Definer) kullandığımız için insert policy şart değil ama manuel fallback için:
CREATE POLICY "Users can insert notifications" ON notifications FOR INSERT WITH CHECK (auth.uid() = sender_id);


DROP POLICY IF EXISTS "Users can view own requests" ON contact_requests;
DROP POLICY IF EXISTS "Users can insert requests" ON contact_requests;
DROP POLICY IF EXISTS "Recipient can update request status" ON contact_requests;
DROP POLICY IF EXISTS "Requester can delete pending" ON contact_requests;

-- Contact Requests Policies
CREATE POLICY "Users can view own requests" ON contact_requests FOR SELECT 
USING (auth.uid() = requester_id OR auth.uid() = target_user_id);

CREATE POLICY "Users can insert requests" ON contact_requests FOR INSERT 
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Recipient can update request status" ON contact_requests FOR UPDATE 
USING (auth.uid() = target_user_id);

CREATE POLICY "Requester can delete pending" ON contact_requests FOR DELETE 
USING (auth.uid() = requester_id AND status = 'pending');

-- Public Profiles
DROP POLICY IF EXISTS "Public profiles" ON profiles;
CREATE POLICY "Public profiles" ON profiles FOR SELECT USING (true);

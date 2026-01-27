-- ==============================================================================
-- KARTVIZID NOTIFICATION SYSTEM REBOOT - CLEAN ARCHITECTURE (DEPENDENCY FIX)
-- ==============================================================================

-- 1. CLEANUP (Dependency hatalarını önlemek için CASCADE ekledik)
DROP FUNCTION IF EXISTS respond_to_request_secure(uuid, text, text) CASCADE;
DROP FUNCTION IF EXISTS create_contact_request_secure(uuid, text) CASCADE;
DROP FUNCTION IF EXISTS handle_new_contact_request() CASCADE;
DROP FUNCTION IF EXISTS handle_contact_request_events() CASCADE; -- Eğer varsa

-- Triggerları ayrıca silmeye çalışalım ama CASCADE zaten halleder
DROP TRIGGER IF EXISTS on_contact_request_created ON contact_requests;
DROP TRIGGER IF EXISTS on_contact_request_events ON contact_requests;

-- Politikaları temizle
DROP POLICY IF EXISTS "Users can view their notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON notifications; -- EKLENDİ
DROP POLICY IF EXISTS "Users can insert notifications" ON notifications;

DROP POLICY IF EXISTS "Users can view own requests" ON contact_requests;
DROP POLICY IF EXISTS "Requester can delete own pending request" ON contact_requests;
DROP POLICY IF EXISTS "Requester can delete pending" ON contact_requests; -- EKLENDİ
DROP POLICY IF EXISTS "Recipient can update request status" ON contact_requests;
DROP POLICY IF EXISTS "Users can insert requests" ON contact_requests;
DROP POLICY IF EXISTS "Authorized users can insert requests" ON contact_requests;
DROP POLICY IF EXISTS "Users can view their own received requests" ON contact_requests;
DROP POLICY IF EXISTS "Users can update requests they received" ON contact_requests;

DROP POLICY IF EXISTS "Public profiles" ON profiles; -- EKLENDİ
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- 2. SCHEMA CHECKS
-- sender_id'nin varlığından emin ol
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'sender_id') THEN 
        ALTER TABLE notifications ADD COLUMN sender_id UUID;
    END IF;
END $$;

-- 3. CENTRAL NOTIFICATION LOGIC (TRIGGER)
-- Bu fonksiyon hem yeni isteklerde hem de cevaplarda çalışır. Tek merkezdir.
CREATE OR REPLACE FUNCTION handle_contact_request_events() 
RETURNS TRIGGER AS $$
DECLARE
  v_sender_id UUID;
  v_receiver_id UUID;
  v_type TEXT;
  v_title TEXT;
  v_message TEXT;
  v_sender_name TEXT;
  v_role TEXT;
BEGIN
  -- A) YENİ İSTEK (INSERT)
  IF (TG_OP = 'INSERT') THEN
    v_sender_id := NEW.requester_id;
    v_receiver_id := NEW.target_user_id;
    v_type := 'contact_request';
    v_title := 'İletişim İsteği';
    
    -- Gönderen ismini bul (Önce Company, Sonra CV, Sonra Profil)
    SELECT role INTO v_role FROM profiles WHERE id = v_sender_id;
    IF v_role = 'employer' THEN
        SELECT company_name INTO v_sender_name FROM companies WHERE user_id = v_sender_id;
    ELSIF v_role = 'job_seeker' THEN
        SELECT name INTO v_sender_name FROM cvs WHERE user_id = v_sender_id;
    END IF;
    
    IF v_sender_name IS NULL THEN 
       SELECT full_name INTO v_sender_name FROM profiles WHERE id = v_sender_id;
    END IF;
    IF v_sender_name IS NULL THEN v_sender_name := 'Bir kullanıcı'; END IF;

    v_message := v_sender_name || ' iletişim bilgilerinizi görüntülemek istiyor.';

  -- B) CEVAPLAMA (UPDATE)
  ELSIF (TG_OP = 'UPDATE') THEN
    -- Sadece statü değiştiyse işlem yap (pending -> approved/rejected)
    IF OLD.status = 'pending' AND NEW.status IN ('approved', 'rejected') THEN
       v_sender_id := NEW.target_user_id; -- Cevaplayan kişi (Hedef)
       v_receiver_id := NEW.requester_id; -- Bildirimi alacak kişi (İsteyen)
       
       IF NEW.status = 'approved' THEN
         v_type := 'success';
         v_title := 'İletişim İsteği Onaylandı';
       ELSE
         v_type := 'info';
         v_title := 'İstek Sonuçlandı';
       END IF;

       -- Cevaplayan ismini bul
       SELECT role INTO v_role FROM profiles WHERE id = v_sender_id;
       IF v_role = 'employer' THEN
           SELECT company_name INTO v_sender_name FROM companies WHERE user_id = v_sender_id;
       ELSIF v_role = 'job_seeker' THEN
           SELECT name INTO v_sender_name FROM cvs WHERE user_id = v_sender_id;
       END IF;
       
       IF v_sender_name IS NULL THEN 
          SELECT full_name INTO v_sender_name FROM profiles WHERE id = v_sender_id;
       END IF;
       IF v_sender_name IS NULL THEN v_sender_name := 'Bir kullanıcı'; END IF;

       v_message := v_sender_name || ' isteğinizi ' ||  CASE WHEN NEW.status = 'approved' THEN 'onayladı.' ELSE 'reddetti.' END;
    ELSE
       RETURN NEW; -- Başka güncelleme ise bildirim atma
    END IF;
  END IF;

  -- Bildirimi Oluştur
  INSERT INTO notifications (user_id, type, title, message, related_id, sender_id, is_read)
  VALUES (v_receiver_id, v_type, v_title, v_message, NEW.id, v_sender_id, FALSE);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- RLS bypass için gerekli

-- Trigger'ı Bağla
CREATE TRIGGER on_contact_request_events
AFTER INSERT OR UPDATE ON contact_requests
FOR EACH ROW EXECUTE FUNCTION handle_contact_request_events();


-- 4. RPCS (Frontend uyumluluğu için, ama mantık Trigger'a devredildi)
-- Bu fonksiyonlar sadece işlemi yapar, bildirimi Trigger halleder.

-- Yeni İstek Oluşturma RPC
CREATE OR REPLACE FUNCTION create_contact_request_secure(
  p_target_user_id UUID,
  p_sender_name TEXT 
)
RETURNS JSONB AS $$
DECLARE
  v_new_id UUID;
  v_status text; 
BEGIN
  INSERT INTO contact_requests (requester_id, target_user_id, status)
  VALUES (auth.uid(), p_target_user_id, 'pending')
  RETURNING id, status INTO v_new_id, v_status;

  RETURN jsonb_build_object('id', v_new_id, 'status', v_status);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- İsteğe Cevap Verme RPC
CREATE OR REPLACE FUNCTION respond_to_request_secure(
  p_request_id UUID,
  p_action TEXT,
  p_responder_name TEXT
)
RETURNS VOID AS $$
DECLARE
  v_target_user_id UUID;
BEGIN
  SELECT target_user_id INTO v_target_user_id FROM contact_requests WHERE id = p_request_id;
  
  -- Sadece isteğin hedefi (target_user) cevap verebilir
  IF v_target_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Yetkisiz işlem.';
  END IF;

  UPDATE contact_requests 
  SET status = p_action, updated_at = NOW()
  WHERE id = p_request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. RLS POLICIES (Son dokunuş)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
-- Trigger eklediği için insert politikasına gerek yok ama RLS hatası olmasın diye:
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

-- Contact Requests
CREATE POLICY "Users can view own requests" ON contact_requests FOR SELECT 
USING (auth.uid() = requester_id OR auth.uid() = target_user_id);

CREATE POLICY "Users can insert requests" ON contact_requests FOR INSERT 
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Recipient can update request status" ON contact_requests FOR UPDATE 
USING (auth.uid() = target_user_id);

CREATE POLICY "Requester can delete pending" ON contact_requests FOR DELETE 
USING (auth.uid() = requester_id AND status = 'pending');

-- Profiles (Public Read)
CREATE POLICY "Public profiles" ON profiles FOR SELECT USING (true);

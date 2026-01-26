-- 1. Add sender_id column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'sender_id') THEN 
        ALTER TABLE notifications ADD COLUMN sender_id UUID;
    END IF; 
END $$;

-- 2. Add/Update Foreign Key Constraint to point to public.profiles
-- First drop existing if any (to be safe)
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_sender_id_fkey;

-- Add correct constraint
ALTER TABLE notifications
  ADD CONSTRAINT notifications_sender_id_fkey
  FOREIGN KEY (sender_id)
  REFERENCES public.profiles(id)
  ON DELETE SET NULL;

-- 3. Update RPC: respond_to_request_secure (to save sender_id)
CREATE OR REPLACE FUNCTION respond_to_request_secure(
  p_request_id UUID,
  p_action TEXT,
  p_responder_name TEXT
)
RETURNS VOID AS $$
DECLARE
  v_requester_id UUID;
  v_target_user_id UUID;
  v_responder_id UUID;
BEGIN
  v_responder_id := auth.uid();

  SELECT requester_id, target_user_id INTO v_requester_id, v_target_user_id
  FROM contact_requests
  WHERE id = p_request_id;

  IF v_requester_id IS NULL THEN
    RAISE EXCEPTION 'Request not found';
  END IF;

  IF v_target_user_id != v_responder_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE contact_requests
  SET status = p_action::contact_request_status,
      updated_at = NOW()
  WHERE id = p_request_id;

  INSERT INTO notifications (user_id, type, title, message, related_id, is_read, sender_id)
  VALUES (
    v_requester_id,
    CASE WHEN p_action = 'approved' THEN 'success' ELSE 'info' END,
    CASE WHEN p_action = 'approved' THEN 'İletişim İsteği Onaylandı' ELSE 'İstek Sonuçlandı' END,
    CASE 
      WHEN p_action = 'approved' THEN p_responder_name || ' ile iletişim isteğiniz onaylandı. Profil bilgilerini artık görüntüleyebilirsiniz.'
      ELSE p_responder_name || ' reddetti.'
    END,
    p_request_id,
    FALSE,
    v_responder_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create/Update RPC: mark_all_notifications_read
CREATE OR REPLACE FUNCTION mark_all_notifications_read()
RETURNS VOID AS $$
BEGIN
  UPDATE notifications
  SET is_read = TRUE
  WHERE user_id = auth.uid() AND is_read = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

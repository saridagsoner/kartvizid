-- Function to safely create/upsert a contact request AND send a notification
-- Run this in Supabase SQL Editor

CREATE OR REPLACE FUNCTION create_contact_request_secure(
  p_target_user_id UUID,
  p_sender_name TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER -- Bypasses RLS, runs with admin privileges
AS $$
DECLARE
  v_request_id UUID;
  v_requester_id UUID;
BEGIN
  -- Get current user ID
  v_requester_id := auth.uid();
  IF v_requester_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- 1. Upsert Request
  INSERT INTO contact_requests (requester_id, target_user_id, status)
  VALUES (v_requester_id, p_target_user_id, 'pending')
  ON CONFLICT (requester_id, target_user_id) 
  DO UPDATE SET status = 'pending', created_at = NOW()
  RETURNING id INTO v_request_id;

  -- 2. Insert Notification
  INSERT INTO notifications (user_id, title, message, type, related_id)
  VALUES (
    p_target_user_id, 
    'Yeni İletişim İsteği', 
    p_sender_name || ' sizinle iletişime geçmek istiyor.', 
    'contact_request', 
    v_request_id
  );

  RETURN json_build_object('id', v_request_id, 'status', 'pending');
END;
$$;

-- Function to safely respond to a request AND send a notification
CREATE OR REPLACE FUNCTION respond_to_request_secure(
  p_request_id UUID,
  p_action TEXT,
  p_responder_name TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_requester_id UUID;
  v_notification_title TEXT;
  v_notification_msg TEXT;
  v_notification_type TEXT;
BEGIN
  -- 1. Update Request
  UPDATE contact_requests
  SET status = p_action
  WHERE id = p_request_id
  RETURNING requester_id INTO v_requester_id;

  IF v_requester_id IS NULL THEN
    RAISE EXCEPTION 'Request not found';
  END IF;

  -- 2. Prepare Notification
  IF p_action = 'approved' THEN
    v_notification_title := 'İstek Onaylandı';
    v_notification_msg := p_responder_name || ' iletişim isteğinizi onayladı. Artık iletişim bilgilerini görebilirsiniz.';
    v_notification_type := 'success';
  ELSE
    v_notification_title := 'İstek Reddedildi';
    v_notification_msg := p_responder_name || ' iletişim isteğinizi reddetti.';
    v_notification_type := 'warning';
  END IF;

  -- 3. Insert Notification for the original Requester
  INSERT INTO notifications (user_id, title, message, type, related_id)
  VALUES (
    v_requester_id,
    v_notification_title,
    v_notification_msg,
    v_notification_type,
    p_request_id
  );

  -- 4. Mark the original incoming notification as read (optional cleanup)
  UPDATE notifications
  SET is_read = true
  WHERE related_id = p_request_id AND user_id = auth.uid();

  RETURN json_build_object('success', true);
END;
$$;

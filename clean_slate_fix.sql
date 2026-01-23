-- COMPREHENSIVE FIX - RUN THIS ENTIRE SCRIPT
-- This script cleans up ANY potential conflicts and re-installs the secure functions.

BEGIN;

-- 1. CLEANUP: Drop existing policies to prevent RLS conflicts
DROP POLICY IF EXISTS "Users can view their own requests" ON contact_requests;
DROP POLICY IF EXISTS "Users can create requests" ON contact_requests;
DROP POLICY IF EXISTS "Users can update their own requests" ON contact_requests;
DROP POLICY IF EXISTS "Requester can delete their own requests" ON contact_requests;

DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;

-- 2. CLEANUP: Drop existing functions to ensure fresh logic
DROP FUNCTION IF EXISTS create_contact_request_secure(UUID, TEXT);
DROP FUNCTION IF EXISTS respond_to_request_secure(UUID, TEXT, TEXT);

-- 3. PERMISSIONS: Enable RLS but create minimal policies for SELECT
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow Users to SEE their own requests (RPC handles Insert/Update)
CREATE POLICY "Select_ContactRequests" ON contact_requests FOR SELECT
USING (auth.uid() = requester_id OR auth.uid() = target_user_id);

-- Allow Users to SEE their own notifications
CREATE POLICY "Select_Notifications" ON notifications FOR SELECT
USING (auth.uid() = user_id);

-- Allow Users to UPDATE their own notifications (Mark Read)
CREATE POLICY "Update_Notifications" ON notifications FOR UPDATE
USING (auth.uid() = user_id);

-- 4. LOGIC: Re-create the Secure RPC Functions
-- These runs with SECURITY DEFINER, bypassing RLS for the content creation

CREATE OR REPLACE FUNCTION create_contact_request_secure(
  p_target_user_id UUID,
  p_sender_name TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_request_id UUID;
  v_requester_id UUID;
BEGIN
  v_requester_id := auth.uid();
  IF v_requester_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  -- Upsert
  INSERT INTO contact_requests (requester_id, target_user_id, status)
  VALUES (v_requester_id, p_target_user_id, 'pending')
  ON CONFLICT (requester_id, target_user_id) 
  DO UPDATE SET status = 'pending', created_at = NOW()
  RETURNING id INTO v_request_id;

  -- Notify
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
  v_msg TEXT;
  v_type TEXT;
BEGIN
  -- Update
  UPDATE contact_requests
  SET status = p_action
  WHERE id = p_request_id
  RETURNING requester_id INTO v_requester_id;

  -- Notify
  IF p_action = 'approved' THEN
    v_msg := p_responder_name || ' iletişim isteğinizi onayladı.';
    v_type := 'success';
  ELSE
    v_msg := p_responder_name || ' iletişim isteğinizi reddetti.';
    v_type := 'warning';
  END IF;

  INSERT INTO notifications (user_id, title, message, type, related_id)
  VALUES (v_requester_id, 'İstek Sonuçlandı', v_msg, v_type, p_request_id);

  -- Mark original as read
  UPDATE notifications SET is_read = true WHERE related_id = p_request_id AND user_id = auth.uid();

  RETURN json_build_object('success', true);
END;
$$;

COMMIT;

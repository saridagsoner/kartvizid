-- FINAL MISSING PIECE --
-- Run this to enable the Secure Cancel function

CREATE OR REPLACE FUNCTION cancel_contact_request_secure(
  p_target_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_requester_id UUID;
BEGIN
  v_requester_id := auth.uid();
  IF v_requester_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  -- Delete the request
  DELETE FROM contact_requests
  WHERE requester_id = v_requester_id 
  AND target_user_id = p_target_user_id
  AND status = 'pending';

  -- Optional: Delete the notification too (to clean up)
  DELETE FROM notifications
  WHERE user_id = p_target_user_id
  AND type = 'contact_request'
  -- We try to match related_id if possible, but simplest is via user/type/content match 
  -- or we rely on the fact that the request is gone.
  -- Better: Find the request ID first? No, request is deleted.
  -- Let's just leave the notification or delete generic pending ones from this user.
  -- For safety, let's just delete the request. The notification will stay but the button will reset.
  
  RETURN json_build_object('success', true);
END;
$$;

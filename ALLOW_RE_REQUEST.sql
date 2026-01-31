
-- Update create_contact_request_secure to handle rejected requests by deleting them first
CREATE OR REPLACE FUNCTION create_contact_request_secure(
  p_target_user_id UUID,
  p_sender_name TEXT 
)
RETURNS JSONB AS $$
DECLARE
  v_new_id UUID;
  v_status text; 
  v_existing_id UUID;
  v_existing_status text;
BEGIN
  -- Check for existing request between these users
  SELECT id, status INTO v_existing_id, v_existing_status
  FROM contact_requests
  WHERE requester_id = auth.uid() AND target_user_id = p_target_user_id;

  IF v_existing_id IS NOT NULL THEN
      IF v_existing_status = 'rejected' THEN
          -- If previously rejected, DELETE it to allow a fresh start.
          -- This is safer than updating because it ensures the INSERT trigger fires correctly for the new notification.
          DELETE FROM contact_requests WHERE id = v_existing_id;
      ELSIF v_existing_status = 'pending' THEN
          RAISE EXCEPTION 'Zaten bekleyen bir isteğiniz var.';
      ELSIF v_existing_status = 'approved' THEN
          RAISE EXCEPTION 'Zaten onaylanmış bir iletişiminiz var.';
      END IF;
  END IF;

  -- Insert new request
  INSERT INTO contact_requests (requester_id, target_user_id, status)
  VALUES (auth.uid(), p_target_user_id, 'pending')
  RETURNING id, status INTO v_new_id, v_status;

  RETURN jsonb_build_object('id', v_new_id, 'status', v_status);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

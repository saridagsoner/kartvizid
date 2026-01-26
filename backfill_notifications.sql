-- Backfill sender_id for existing notifications
-- This looks at the related contact_request and finds the 'other' person
UPDATE notifications n
SET sender_id = (
  CASE
    -- If the notification owner (user_id) is the requester, then sender is target
    WHEN cr.requester_id = n.user_id THEN cr.target_user_id
    -- If the notification owner is the target, then sender is requester
    WHEN cr.target_user_id = n.user_id THEN cr.requester_id
  END
)
FROM contact_requests cr
WHERE n.related_id = cr.id
  AND n.sender_id IS NULL;

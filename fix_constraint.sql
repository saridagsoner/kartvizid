-- FIX: Allow 'contact_request' type in notifications
-- Run this if you see "violates check constraint notifications_type_check"

BEGIN;

-- 1. Drop the old restrictive constraint
ALTER TABLE notifications 
DROP CONSTRAINT IF EXISTS notifications_type_check;

-- 2. Add the new constraint including 'contact_request'
ALTER TABLE notifications 
ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('info', 'success', 'warning', 'error', 'contact_request'));

COMMIT;

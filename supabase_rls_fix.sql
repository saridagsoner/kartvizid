-- Enable RLS
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own requests" ON contact_requests;
DROP POLICY IF EXISTS "Users can create requests" ON contact_requests;
DROP POLICY IF EXISTS "Users can update their own requests" ON contact_requests;
DROP POLICY IF EXISTS "Requester can delete their own requests" ON contact_requests;
DROP POLICY IF EXISTS "Users can view requests sent to them" ON contact_requests;
DROP POLICY IF EXISTS "Users can view requests sent by them" ON contact_requests;

-- 1. SELECT: Users can view requests they sent OR received
CREATE POLICY "Users can view their own requests"
ON contact_requests FOR SELECT
USING (auth.uid() = requester_id OR auth.uid() = target_user_id);

-- 2. INSERT: Users can create requests where they are the requester
-- The WITH CHECK ensures they can only insert valid rows for themselves
CREATE POLICY "Users can create requests"
ON contact_requests FOR INSERT
WITH CHECK (auth.uid() = requester_id);

-- 3. UPDATE: 
-- Requester can update (e.g. for upsert/resend)
-- Target can update (for Approve/Reject status changes)
CREATE POLICY "Users can update their own requests"
ON contact_requests FOR UPDATE
USING (auth.uid() = requester_id OR auth.uid() = target_user_id);

-- 4. DELETE: Requester can delete their pending requests
CREATE POLICY "Requester can delete their own requests"
ON contact_requests FOR DELETE
USING (auth.uid() = requester_id);

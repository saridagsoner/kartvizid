-- Drop the existing constraint if it references auth.users (to be safe/clean)
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_sender_id_fkey;

-- Add constraint referencing public.profiles which enables PostgREST resource embedding
ALTER TABLE notifications
  ADD CONSTRAINT notifications_sender_id_fkey
  FOREIGN KEY (sender_id)
  REFERENCES public.profiles(id)
  ON DELETE SET NULL;

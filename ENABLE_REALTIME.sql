-- Enable real-time for messaging tables
BEGIN;

-- Check if publication exists, if not, it's usually already there in Supabase
-- Add tables to the publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

COMMIT;

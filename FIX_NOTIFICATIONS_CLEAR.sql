
-- Add is_visible column to notifications for Soft Delete support
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS is_visible boolean DEFAULT true;

-- Ensure existing notifications are visible
UPDATE public.notifications SET is_visible = true WHERE is_visible IS NULL;

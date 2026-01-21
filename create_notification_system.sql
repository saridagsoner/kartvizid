-- 1. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info', -- 'info', 'success', 'warning'
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK ( true ); -- Triggers need this, or use security definer functions

-- 3. Function to handle contact request status changes
CREATE OR REPLACE FUNCTION public.handle_contact_request_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if status changed to 'approved'
  IF OLD.status = 'pending' AND NEW.status = 'approved' THEN
    -- Insert notification for the requester (The Employer)
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      NEW.requester_id,
      'İletişim İsteği Onaylandı',
      'Bir firma veya aday ile iletişim isteğiniz onaylandı. Profil bilgilerini artık görüntüleyebilirsiniz.',
      'success'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger
DROP TRIGGER IF EXISTS on_contact_request_update ON public.contact_requests;
CREATE TRIGGER on_contact_request_update
  AFTER UPDATE ON public.contact_requests
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_contact_request_update();

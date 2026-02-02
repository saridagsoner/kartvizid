
-- 1. Create Saved CVs Table
CREATE TABLE IF NOT EXISTS public.saved_cvs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cv_id uuid NOT NULL REFERENCES public.cvs(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(employer_id, cv_id) -- Prevent duplicate saves
);

-- 2. Enable RLS
ALTER TABLE public.saved_cvs ENABLE ROW LEVEL SECURITY;

-- 3. Policies
CREATE POLICY "Employers can view their saved cvs" 
ON public.saved_cvs FOR SELECT 
USING (auth.uid() = employer_id);

CREATE POLICY "Employers can save cvs" 
ON public.saved_cvs FOR INSERT 
WITH CHECK (auth.uid() = employer_id);

CREATE POLICY "Employers can remove saved cvs" 
ON public.saved_cvs FOR DELETE 
USING (auth.uid() = employer_id);

-- 4. Notification Trigger Logic
CREATE OR REPLACE FUNCTION handle_saved_cv_notification() 
RETURNS TRIGGER AS $$
DECLARE
  v_cv_owner_id UUID;
  v_sender_name TEXT;
  v_role TEXT;
BEGIN
  -- Get CV owner
  SELECT user_id INTO v_cv_owner_id FROM public.cvs WHERE id = NEW.cv_id;
  
  -- Get Employer Name (Company > Profile)
  SELECT role INTO v_role FROM public.profiles WHERE id = NEW.employer_id;
  
  IF v_role = 'employer' THEN
      SELECT company_name INTO v_sender_name FROM public.companies WHERE user_id = NEW.employer_id;
  END IF;
  
  IF v_sender_name IS NULL THEN
      SELECT full_name INTO v_sender_name FROM public.profiles WHERE id = NEW.employer_id;
  END IF;
  
  IF v_sender_name IS NULL THEN v_sender_name := 'Bir iş veren'; END IF;

  -- Insert Notification
  INSERT INTO public.notifications (user_id, type, title, message, related_id, sender_id, is_read)
  VALUES (
    v_cv_owner_id,
    'info', -- or success
    'Profiliniz Kaydedildi',
    v_sender_name || ' senin CV''ni kaydetti.',
    NEW.id,
    NEW.employer_id,
    FALSE
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Attach Trigger
DROP TRIGGER IF EXISTS on_saved_cv_insert ON public.saved_cvs;
CREATE TRIGGER on_saved_cv_insert
AFTER INSERT ON public.saved_cvs
FOR EACH ROW EXECUTE FUNCTION handle_saved_cv_notification();

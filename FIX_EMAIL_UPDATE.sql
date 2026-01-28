-- 1. Add email column to profiles if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email text;

-- 2. Backfill email from auth.users
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id
AND p.email IS NULL;

-- 3. Update handle_new_user function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create function to handle email updates
CREATE OR REPLACE FUNCTION public.handle_user_update() 
RETURNS trigger AS $$
BEGIN
  -- Sync email if it changed
  IF new.email <> old.email THEN
    UPDATE public.profiles
    SET email = new.email
    WHERE id = new.id;
  END IF;
  
  -- Sync metadata if needed
  IF new.raw_user_meta_data->>'full_name' <> old.raw_user_meta_data->>'full_name' THEN
    UPDATE public.profiles
    SET full_name = new.raw_user_meta_data->>'full_name'
    WHERE id = new.id;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create trigger for updates
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_user_update();


-- 1. Set a default placeholder for existing records with NULL photo_url to prevent migration failure
UPDATE public.cvs
SET photo_url = 'https://picsum.photos/200/300' 
WHERE photo_url IS NULL OR photo_url = '';

-- 2. Alter the column to enforce NOT NULL
ALTER TABLE public.cvs
ALTER COLUMN photo_url SET NOT NULL;

-- 3. Add a check constraint to ensure it's not empty string (optional but good practice)
ALTER TABLE public.cvs
ADD CONSTRAINT check_photo_url_length CHECK (length(photo_url) > 0);

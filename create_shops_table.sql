-- Create shops table
CREATE TABLE IF NOT EXISTS public.shops (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    profession TEXT NOT NULL,
    description TEXT,
    city TEXT NOT NULL,
    district TEXT,
    phone TEXT,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Shops are viewable by everyone" 
ON public.shops FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own shop" 
ON public.shops FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shop" 
ON public.shops FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shop" 
ON public.shops FOR DELETE 
USING (auth.uid() = user_id);

-- Storage bucket for shop logos (if not exists)
-- Note: Assuming 'logos' or 'photos' bucket already exists, 
-- but we should ensure 'shops' folder is handled in storage policies if needed.

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_shops_user_id ON public.shops(user_id);
CREATE INDEX IF NOT EXISTS idx_shops_city ON public.shops(city);
CREATE INDEX IF NOT EXISTS idx_shops_profession ON public.shops(profession);

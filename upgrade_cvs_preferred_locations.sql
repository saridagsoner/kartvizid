-- Kartvizid CV Tablosu Güncelleme
-- Bu SQL kodunu Supabase > SQL Editor üzerinden çalıştırın.

ALTER TABLE public.cvs 
ADD COLUMN IF NOT EXISTS preferred_cities TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS preferred_countries TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS salary_currency TEXT DEFAULT '₺';

COMMENT ON COLUMN public.cvs.preferred_cities IS 'Kullanıcının tercih ettiği şehirler listesi (Maks 3)';
COMMENT ON COLUMN public.cvs.preferred_countries IS 'Kullanıcının tercih ettiği ülkeler listesi (Maks 3)';
COMMENT ON COLUMN public.cvs.salary_currency IS 'Maaş beklentisi para birimi (₺, $, €, £)';

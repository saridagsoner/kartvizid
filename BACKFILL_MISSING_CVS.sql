-- Bu script, daha önceden kayıt olmuş ama hatadan dolayı CV'si 
-- (kartviziti) oluşmamış "iş arayan" hesaplarını tespit eder ve onlar için de 
-- eksik kartvizitleri geriye dönük olarak oluşturur.

INSERT INTO public.cvs (
  user_id, 
  name, 
  profession, 
  city, 
  experience_years, 
  experience_months, 
  email,
  skills, 
  education_details, 
  work_experience, 
  internship_details, 
  language_details, 
  certificates,
  is_new, 
  views, 
  is_placed, 
  is_active, 
  about, 
  photo_url, 
  language, 
  education, 
  salary_min, 
  salary_max
)
SELECT 
  u.id,
  COALESCE(NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''), 'İsimsiz Kullanıcı'),
  COALESCE(NULLIF(TRIM(u.raw_user_meta_data->>'profession'), ''), 'Belirtilmedi'),
  COALESCE(NULLIF(TRIM(u.raw_user_meta_data->>'city'), ''), 'Belirtilmedi'),
  COALESCE(CAST(NULLIF(u.raw_user_meta_data->>'experience_years', '') AS integer), 0),
  COALESCE(CAST(NULLIF(u.raw_user_meta_data->>'experience_months', '') AS integer), 0),
  u.email,
  ARRAY[]::text[], 
  '[]'::jsonb, 
  '[]'::jsonb, 
  '[]'::jsonb, 
  '[]'::jsonb, 
  '[]'::jsonb,
  true, 
  0, 
  false, 
  true, 
  '', 
  '', 
  'Belirtilmedi', 
  'Belirtilmedi', 
  0, 
  0
FROM auth.users u
LEFT JOIN public.cvs c ON u.id = c.user_id
WHERE COALESCE(u.raw_user_meta_data->>'role', '') = 'job_seeker'
  AND c.id IS NULL;

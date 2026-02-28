-- Bu script, yeni kayıt olan iş arayanlar için oluşturulan tetikleyiciyi (trigger) günceller.
-- "working_status" alanının varsayılan olarak "active" (iş buldu/gizli) gelmesini engelleyip 
-- zorla "open" (iş arıyor/görünür) yapar. Böylece ana sayfada listelemeye düşer.

CREATE OR REPLACE FUNCTION public.handle_new_job_seeker()
RETURNS trigger AS $$
BEGIN
  IF COALESCE(NEW.raw_user_meta_data->>'role', '') = 'job_seeker' THEN
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
      salary_max,
      working_status
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'profession', ''),
      COALESCE(NEW.raw_user_meta_data->>'city', ''),
      COALESCE(CAST(NULLIF(NEW.raw_user_meta_data->>'experience_years', '') AS integer), 0),
      COALESCE(CAST(NULLIF(NEW.raw_user_meta_data->>'experience_months', '') AS integer), 0),
      NEW.email,
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
      0,
      'open' -- ÇÖZÜM: Kartvizidin ana sayfada "iş arıyor" modunda parlamasını sağlar
    );
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Kartvizit oluşturulurken hata: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Varsa eski tetikleyiciyi sil ve yeniden oluştur
DROP TRIGGER IF EXISTS on_auth_user_created_job_seeker ON auth.users;

CREATE TRIGGER on_auth_user_created_job_seeker
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_job_seeker();

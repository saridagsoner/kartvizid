-- Bu kod, yeni bir iş arayan kayıt olduğunda otomatik olarak CV oluşturur.

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
      photo_url
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
      ''
    );
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Hata çıkarsa kayıt işlemini engelleme
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Varsa eski tetikleyiciyi temizle
DROP TRIGGER IF EXISTS on_auth_user_created_job_seeker ON auth.users;

-- Yeni tetikleyiciyi bağla
CREATE TRIGGER on_auth_user_created_job_seeker
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_job_seeker();

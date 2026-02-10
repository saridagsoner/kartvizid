-- BULK SEED: 20 Fake Users (Mixed Gender, 3 Placed)
-- Run this in Supabase Dashboard > SQL Editor

DO $$
DECLARE
  i INT;
  v_user_id UUID;
  v_gender TEXT;
  v_first_name TEXT;
  v_last_name TEXT;
  v_full_name TEXT;
  v_email TEXT;
  v_photo_url TEXT;
  v_profession TEXT;
  v_city TEXT;
  v_is_placed BOOLEAN;
  
  -- Data Arrays
  male_names TEXT[] := ARRAY['Ali', 'Mehmet', 'Can', 'Burak', 'Emre', 'Murat', 'Hakan', 'Ozan', 'Tolga', 'Kerem', 'Mustafa', 'Yusuf', 'Ömer', 'Arda', 'Cem', 'Deniz', 'Ege', 'Kaan'];
  female_names TEXT[] := ARRAY['Ayşe', 'Fatma', 'Zeynep', 'Elif', 'Selin', 'Gamze', 'Büşra', 'Derya', 'Esra', 'İrem', 'Merve', 'Seda', 'Kübra', 'Hande', 'Ece', 'Nazlı', 'Beren', 'Defne'];
  last_names TEXT[] := ARRAY['Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Öztürk', 'Aydın', 'Özdemir', 'Arslan', 'Doğan', 'Koç', 'Kurt', 'Özer', 'Tekin', 'Yavuz', 'Kocaman', 'Sönmez'];
  professions TEXT[] := ARRAY['Yazılım Mühendisi', 'Grafik Tasarımcı', 'Dijital Pazarlama Uzmanı', 'Veri Analisti', 'Proje Yöneticisi', 'İç Mimar', 'Android Geliştirici', 'Frontend Developer', 'Satış Müdürü', 'İnsan Kaynakları Uzmanı'];
  cities TEXT[] := ARRAY['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Eskişehir', 'Kocaeli', 'Gaziantep'];
  
BEGIN
  -- Loop for 20 users
  FOR i IN 1..20 LOOP
    v_user_id := gen_random_uuid();
    
    -- Pick gender
    IF (floor(random() * 2) = 0) THEN
      v_gender := 'men';
      v_first_name := male_names[1 + floor(random() * array_length(male_names, 1))];
    ELSE
      v_gender := 'women';
      v_first_name := female_names[1 + floor(random() * array_length(female_names, 1))];
    END IF;
    
    v_last_name := last_names[1 + floor(random() * array_length(last_names, 1))];
    v_full_name := v_first_name || ' ' || v_last_name;
    v_email := lower(v_first_name) || '.' || lower(v_last_name) || i || floor(random() * 1000) || '@example.com';
    v_photo_url := 'https://randomuser.me/api/portraits/' || v_gender || '/' || floor(random() * 95) || '.jpg'; -- Limit to 95 to avoid broken links
    
    v_profession := professions[1 + floor(random() * array_length(professions, 1))];
    v_city := cities[1 + floor(random() * array_length(cities, 1))];

    -- Determine if placed (Last 3 users get placed status)
    IF i > 17 THEN
      v_is_placed := true;
    ELSE
      v_is_placed := false;
    END IF;

    -- 1. Insert into auth.users
    INSERT INTO auth.users (
      id, instance_id, aud, role, email,
      encrypted_password, email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at, updated_at, confirmation_token, recovery_token
    ) VALUES (
      v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', v_email,
      '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEF', -- Dummy hash
      now(),
      '{"provider": "email", "providers": ["email"]}',
      jsonb_build_object('full_name', v_full_name, 'avatar_url', v_photo_url),
      now(), now(), '', ''
    );

    -- 2. Insert into public.cvs
    INSERT INTO public.cvs (
      user_id, name, profession, city, district, photo_url, about,
      experience_years, skills,
      education_details, work_experience, internship_details, language_details, certificates,
      email, phone, is_email_public, is_phone_public, is_active, is_new, 
      views, is_placed
    ) VALUES (
      v_user_id,
      v_full_name,
      v_profession,
      v_city,
      'Merkez',
      v_photo_url,
      'Merhaba, ben ' || v_full_name || '. ' || v_profession || ' olarak kariyerime devam ediyorum.',
      floor(random() * 10) + 1,
      ARRAY['İletişim', 'Takım Çalışması', 'Planlama'],
      '[]'::jsonb,
      '[]'::jsonb,
      '[]'::jsonb,
      '[]'::jsonb,
      '[]'::jsonb,
      v_email,
      '+90 555 ' || floor(random() * 899 + 100) || ' ' || floor(random() * 89 + 10) || ' ' || floor(random() * 89 + 10),
      true, true, true, false,
      floor(random() * 500),
      v_is_placed -- Set true for the last 3 users
    );
    
  END LOOP;
END $$;

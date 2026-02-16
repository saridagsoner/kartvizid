
-- BULK SEED: 30 Realistic Turkish Users with Everyday Professions
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
  v_district TEXT;
  v_about TEXT;
  v_experience INT;
  
  -- Data Arrays
  male_names TEXT[] := ARRAY['Ahmet', 'Mehmet', 'Mustafa', 'Ali', 'Hüseyin', 'Hasan', 'İbrahim', 'İsmail', 'Osman', 'Yusuf', 'Murat', 'Ömer', 'Ramazan', 'Halil', 'Süleyman', 'Abdullah', 'Mahmut', 'Salih', 'Kemal', 'Recep', 'Uğur', 'Onur', 'Burak', 'Emre', 'Can'];
  female_names TEXT[] := ARRAY['Fatma', 'Ayşe', 'Emine', 'Hatice', 'Zeynep', 'Elif', 'Meryem', 'Şerife', 'Zehra', 'Sultan', 'Hanife', 'Merve', 'Havva', 'Zeliha', 'Esra', 'Fadime', 'Özlem', 'Hacer', 'Yasemin', 'Hülya', 'Seda', 'Gamze', 'Büşra', 'Derya', 'Selin'];
  last_names TEXT[] := ARRAY['Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Yıldırım', 'Öztürk', 'Aydın', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara', 'Koç', 'Kurt', 'Özkan', 'Şimşek', 'Polat', 'Korkmaz', 'Öz', 'Çakır', 'Erdoğan'];
  
  professions TEXT[] := ARRAY[
    'Garson', 'Garson', 'Garson', 'Garson',
    'Hemşire', 'Hemşire', 'Hemşire', 'Hemşire',
    'Öğretmen', 'Öğretmen', 'Öğretmen', 'Öğretmen',
    'Satış Danışmanı', 'Satış Danışmanı', 'Satış Danışmanı', 'Satış Danışmanı',
    'Avukat', 'Avukat', 'Avukat',
    'Şoför', 'Şoför', 'Şoför', 'Şoför',
    'Yazılımcı', 'Yazılımcı', 'Yazılımcı', 'Yazılımcı',
    'Aşçı', 'Aşçı', 
    'Muhasebeci', 
    'Güvenlik Görevlisi', 
    'Kasiyer', 'Kasiyer',
    'Temizlik Personeli',
    'Elektrikçi',
    'Tesisatçı',
    'Kurye', 'Kurye',
    'Eczacı',
    'Diş Hekimi'
  ];
  
  cities TEXT[] := ARRAY['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Şanlıurfa', 'Kocaeli', 'Mersin', 'Hatay', 'Manisa', 'Kayseri'];
  istanbul_districts TEXT[] := ARRAY['Kadıköy', 'Beşiktaş', 'Üsküdar', 'Şişli', 'Maltepe', 'Kartal', 'Pendik', 'Ümraniye', 'Ataşehir', 'Fatih', 'Beyoğlu', 'Bakırköy'];
  
  -- Blacklist Names to Exclude
  blacklist_names TEXT[] := ARRAY['Derya Şahin', 'Ali Öz', 'Hülya Çelik', 'Zeynep Arslan', 'Ayşe Öztürk', 'Yusuf Yıldız', 'Mehmet Arslan', 'Gamze Korkmaz', 'Osman Polat', 'Mehmet Yılmaz', 'Emre Arslan', 'Zeliha Kurt', 'Zeynep Demir'];
  
BEGIN
  -- 1. CLEANUP: Delete existing fake users (identified by email domain example.com)
  -- Deleting from public.cvs happens automatically if there is CASCADE, but we do it safely here just in case or if no FK cascade.
  DELETE FROM public.cvs WHERE email LIKE '%@example.com';
  DELETE FROM auth.users WHERE email LIKE '%@example.com';

  -- 2. LOOP: Create 30 new users
  FOR i IN 1..30 LOOP
    v_user_id := gen_random_uuid();
    
    -- Pick gender and name (with retry if blacklisted)
    LOOP
      IF (floor(random() * 2) = 0) THEN
        v_gender := 'men';
        v_first_name := male_names[1 + floor(random() * array_length(male_names, 1))];
      ELSE
        v_gender := 'women';
        v_first_name := female_names[1 + floor(random() * array_length(female_names, 1))];
      END IF;
      
      v_last_name := last_names[1 + floor(random() * array_length(last_names, 1))];
      v_full_name := v_first_name || ' ' || v_last_name;
      
      -- Exit inner loop if name is NOT in blacklist
      EXIT WHEN NOT (v_full_name = ANY(blacklist_names));
    END LOOP;
    
    -- Create a unique-ish email
    v_email := lower(v_first_name) || '.' || lower(v_last_name) || i || floor(random() * 999) || '@example.com';
    
    -- Random User Photo (using randomuser.me which has decent diversity)
    -- IDs 0-99 exists for both genders.
    v_photo_url := 'https://randomuser.me/api/portraits/' || v_gender || '/' || floor(random() * 99) || '.jpg';
    
    -- Select Profession (Random from the weighted array)
    v_profession := professions[1 + floor(random() * array_length(professions, 1))];
    
    v_city := cities[1 + floor(random() * array_length(cities, 1))];
    
    IF v_city = 'İstanbul' THEN
      v_district := istanbul_districts[1 + floor(random() * array_length(istanbul_districts, 1))];
    ELSE
      v_district := 'Merkez';
    END IF;

    -- Custom About Text based on profession
    v_experience := floor(random() * 15) + 1;
    v_about := 'Merhaba, ben ' || v_full_name || '. ' || v_city || ' bölgesinde ' || lower(v_profession) || ' olarak çalışıyorum. ' || v_experience || ' yıllık deneyimim var. İşimi severek yapıyorum ve yeni fırsatlara açığım.';

    -- INSERT into auth.users (Requires service_role or adequate permissions on Supabase SQL Editor which runs as postgres/superuser usually)
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

    -- INSERT into public.cvs
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
      v_district,
      v_photo_url,
      v_about,
      v_experience,
      ARRAY['İletişim', 'Disiplin', 'Sorumluluk Sahibi', 'Takım Çalışması']::text[],
      '[]'::jsonb,
      '[]'::jsonb,
      '[]'::jsonb,
      '[]'::jsonb,
      '[]'::jsonb,
      v_email,
      '+90 5' || (floor(random() * 3) + 3) || floor(random() * 10) || ' ' || floor(random() * 899 + 100) || ' ' || floor(random() * 89 + 10) || ' ' || floor(random() * 89 + 10),
      true, true, true, 
      (random() > 0.7), -- 30% chance of being "New"
      floor(random() * 500) + 50,
      false -- Default not placed
    );
    
  END LOOP;
END $$;

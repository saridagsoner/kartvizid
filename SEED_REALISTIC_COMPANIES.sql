-- ÖNCE TEMİZLİK (Supabase SQL Editor'da çalıştırın)
DELETE FROM public.companies WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@example.com%');
DELETE FROM public.profiles WHERE id IN (SELECT id FROM auth.users WHERE email LIKE '%@example.com%');
DELETE FROM auth.users WHERE email LIKE '%@example.com%';

DO $$
DECLARE
    new_user_id UUID;
    random_suffix TEXT;
    i INTEGER;
    -- TUTARLI ŞİRKET İSİMLERİ
    company_names TEXT[] := ARRAY[
        'Öz Kardeşler Mobilya', 'Doyum Pide Salonu', 'Parlak Oto Yıkama', 'Hızlı Paket Kurye', 'Yıldız Elektrik',
        'Teknik Beyaz Eşya', 'Hijyen Temizlik Hizmetleri', 'Keyif Kahvesi', 'Makas Erkek Kuaförü', 'Çam Ahşap Tasarım',
        'Lezzet Döner', 'Akım Elektrik Bobinaj', 'Bereket Çay Ocağı', 'Çelik Yapı Ferforje', 'Lojistik Depo Hizmetleri',
        'Fırın Sanatı', 'Moda Terzi', 'Net Pen PVC', 'Can Market', 'Güven Bekçilik',
        'Sıla Bayan Kuaförü', 'Ege Turizm Servis', 'Florist Çiçek', 'Renk Yapı Dekorasyon', 'Kule Güvenlik',
        'Vizyon Reklam', 'Pizza Express', 'Hesap Uzmanı Muhasebe', 'Sert Demir İşleri', 'Okul Kantini',
        'Stüdyo Renk', 'Emlak Dünyası', 'Şehir Taksi', 'Power Fit Gym', 'Rot Balans Dünyası',
        'Duman Nargile Cafe', 'Mis Halı Yıkama', 'Gül Çocuk Akademisi', 'Dost Petshop', 'Usta Dönerci',
        'Pazar Market', 'İplik Tekstil', 'Kardeşler Kasabı', 'Mavi Akvaryum', 'Yeşil Bahçe Peyzaj',
        'Demir Bilek Gym', 'Anadolu Sofrası', 'Petek Pastanesi', 'Zümrüt Kuyumculuk', 'Jet Kargo'
    ];
    -- İSİMLERLE TAM TUTARLI HAKKINDA METİNLERİ
    about_texts TEXT[] := ARRAY[
        'Atölyeye döşemeci ve zımparacı ustası aranıyor acil', -- Öz Kardeşler Mobilya
        'Pide fırınına hamur ustası ve motorcu lazım', -- Doyum Pide Salonu
        'İç dış yıkama yapabilen seri elemanlar aranıyor', -- Parlak Oto Yıkama
        'A2 ehliyetli kendi motoruyla çalışacak kuryeler', -- Hızlı Paket Kurye
        'Tesisat işinden anlayan elektrikçi kalfası', -- Yıldız Elektrik
        'Beyaz eşya tamirine çırak ve yardımcı arkadaş', -- Teknik Beyaz Eşya
        'Ofis temizliğine titiz bayan elemanlar alınacaktır', -- Hijyen Temizlik Hizmetleri
        'Cafeye nargileci ve akşamcı garson lazım', -- Keyif Kahvesi
        'Berber kalfası aranıyor yerimiz işlek', -- Makas Erkek Kuaförü
        'Mobilya imalatına vasıfsız gençler yetiştirilecektir', -- Çam Ahşap Tasarım
        'Döner tezgahına kesimden anlayan usta lazım', -- Lezzet Döner
        'Bobinaj ve motor sarımından anlayan kalfa', -- Akım Elektrik Bobinaj
        'Çay ocağına bakacak samimi ve dürüst birisi', -- Bereket Çay Ocağı
        'Demir doğrama ve ferforje ustası aranıyor acil', -- Çelik Yapı Ferforje
        'Depoda mal kabul yapacak gençler asgari+sigorta', -- Lojistik Depo Hizmetleri
        'Taş fırına ekmek ustası ve tezgahtar lazım', -- Fırın Sanatı
        'Terzi yanına overlokçu ve ortacı bayanlar', -- Moda Terzi
        'Pencerelere montaj yapacak usta ve yardımcı', -- Net Pen PVC
        'Markete reyoncu ve kasa bakacak arkadaslar', -- Can Market
        'Şantiye alanına gece bekçisi aranıyor emliyetli', -- Güven Bekçilik
        'Bayan kuaförüne fön çekmeyi bilen kalfa', -- Sıla Bayan Kuaförü
        'D2 yetki belgeli servis şöförü aranıyor', -- Ege Turizm Servis
        'Dükkana bakacak çiçekten anlayan bayan yardımcı', -- Florist Çiçek
        'İç dış boya yapabilen inşaat ustaları lazım', -- Renk Yapı Dekorasyon
        'Site güvenliğine sertifikalı 2 bay arkadaş', -- Kule Güvenlik
        'Reklam ajansına corel ve photoshop bilen grafiker', -- Vizyon Reklam
        'Pizzacıya hamur açmayı bilen usta aranıyor', -- Pizza Express
        'Muhasebe ofisine ön muhasebe bilen bayan eleman', -- Hesap Uzmanı Muhasebe
        'Kaynak işinden anlayan demirci ustaları', -- Sert Demir İşleri
        'Okul kantinine bakacak yardımcı abla lazım', -- Okul Kantini
        'Fotoğraf stüdyosuna photoshop bilen eleman', -- Stüdyo Renk
        'Emlak ofisine diksiyonu düzgün satışcılar', -- Emlak Dünyası
        'Gece vardiyasında çalışacak taksi şöförü', -- Şehir Taksi
        'Spor salonuna kayıt alacak bayan resepsiyonist', -- Power Fit Gym
        'Oto lastik tamirinden anlayan yardımcı', -- Rot Balans Dünyası
        'Nargile kafeye közcü ve garson aranıyor', -- Duman Nargile Cafe
        'Halı yıkama fabrikasına şöför ve vasıfsızlar', -- Mis Halı Yıkama
        'Kreşe çocuklardan anlayan yardımcı abla', -- Gül Çocuk Akademisi
        'Petshopa bakacak hayvansever genç eleman', -- Dost Petshop
        'Dönerciye kesim usta yardımcısı acele', -- Usta Dönerci
        'Pazarda tezgah kuracak çevik gençler lazım', -- Pazar Market
        'Tekstil atölyesine ortacı ve overlokçular', -- İplik Tekstil
        'Kasap dükkanına çırak ve yardımcı lazım', -- Kardeşler Kasabı
        'Akvaryumcuya bakacak hobiden anlayan eleman', -- Mavi Akvaryum
        'Bahçe düzenlemesinden anlayan peyzaj işçisi', -- Yeşil Bahçe Peyzaj
        'Boks ve fitness salonuna hoca aranıyor', -- Demir Bilek Gym
        'Lokantaya bulaşıkçı ve salon garsonu acil', -- Anadolu Sofrası
        'Pastaneye tezgahtar ve hamurcu çırağı', -- Petek Pastanesi
        'Kuyumcu yanına yetiştirilecek güvenilir çırak', -- Zümrüt Kuyumculuk
        'Kurye firmasına a2 ehliyetli elemanlar' -- Jet Kargo
    ];

    industries TEXT[] := ARRAY[
        'Üretim', 'Gıda', 'Hizmet', 'Lojistik', 'Teknik Hizmetler',
        'Teknik Hizmetler', 'Temizlik', 'Gıda', 'Kişisel Bakım', 'Üretim',
        'Gıda', 'Teknik Hizmetler', 'Gıda', 'İnşaat', 'Lojistik',
        'Gıda', 'Tekstil', 'İnşaat', 'Ticaret', 'Hizmet',
        'Kişisel Bakım', 'Ulaşım', 'Ticaret', 'İnşaat', 'Güvenlik',
        'Medya', 'Gıda', 'Hizmet', 'Üretim', 'Gıda',
        'Sanat', 'Gayrimenkul', 'Ulaşım', 'Spor', 'Teknik Hizmetler',
        'Gıda', 'Hizmet', 'Eğitim', 'Ticaret', 'Gıda',
        'Ticaret', 'Tekstil', 'Gıda', 'Ticaret', 'Hizmet',
        'Spor', 'Gıda', 'Gıda', 'Mücevherat', 'Lojistik'
    ];

    cities TEXT[] := ARRAY['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Kocaeli', 'Gaziantep', 'Tekirdağ'];
BEGIN
    FOR i IN 1..50 LOOP
        random_suffix := floor(random() * 9000 + 1000)::text;
        
        -- 1. Create Auth User
        INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, aud, role)
        VALUES (
            gen_random_uuid(),
            'company_' || i || '_' || random_suffix || '@example.com',
            crypt('password123', gen_salt('bf')),
            now(),
            '{"provider":"email","providers":["email"]}',
            jsonb_build_object('role', 'employer', 'full_name', company_names[i]),
            now(),
            now(),
            '',
            'authenticated',
            'authenticated'
        )
        RETURNING id INTO new_user_id;

        -- 2. Create Company Profile
        INSERT INTO public.companies (
            id,
            user_id,
            company_name,
            industry,
            city,
            district,
            description,
            logo_url,
            created_at,
            updated_at
        )
        VALUES (
            gen_random_uuid(),
            new_user_id,
            company_names[i],
            industries[i],
            cities[floor(random() * 10 + 1)],
            'Merkez',
            about_texts[i], -- ARTIK TAM TUTARLI
            NULL,
            now(),
            now()
        );
    END LOOP;
END $$;

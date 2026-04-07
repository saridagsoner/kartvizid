-- SEED_SHOWCASE_CVS.sql
-- Bu script Google AdSense "İnce İçerik (Thin Content)" onayından geçmek üzere
-- özel olarak hazırlanmış, yüzlerce kelimelik özgün metin (Hakkında ve İş Deneyimleri) barındıran
-- 10 adet vitrin (showcase) CV oluşturur.

DO $$
DECLARE
  v_user_id UUID;
  names TEXT[] := ARRAY[
    'Kerem Aslan', 'Buket Karaca', 'Ayşe Nur Göçkün', 'Onur Can', 
    'Gamze Yılmaz', 'Umut Can Yılmaz', 'Emircan Güleç', 'Zeynep Kaya', 
    'Burak Yıldız', 'Fatma Demir'
  ];
  professions TEXT[] := ARRAY[
    'Kıdemli Yazılım Geliştirici', 'Dijital Pazarlama Uzmanı', 'Grafik Tasarımcı ve Art Direktör', 'Klinik Psikolog', 
    'Satış ve İş Geliştirme Yöneticisi', 'Halkla İlişkiler (PR) Uzmanı', 'Veri Bilimcisi ve Analist', 'İnsan Kaynakları Uzmanı', 
    'Mimarlık ve İç Mimarlık', 'E-Ticaret ve Operasyon Müdürü'
  ];
  cities TEXT[] := ARRAY['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'İstanbul', 'Eskişehir', 'İstanbul', 'İzmir', 'İstanbul'];
  districts TEXT[] := ARRAY['Kadıköy', 'Çankaya', 'Alsancak', 'Muratpaşa', 'Nilüfer', 'Beşiktaş', 'Tepebaşı', 'Şişli', 'Karşıyaka', 'Üsküdar'];
  photos TEXT[] := ARRAY[
    'https://randomuser.me/api/portraits/men/32.jpg', 'https://randomuser.me/api/portraits/women/44.jpg', 
    'https://randomuser.me/api/portraits/women/68.jpg', 'https://randomuser.me/api/portraits/men/46.jpg', 
    'https://randomuser.me/api/portraits/women/90.jpg', 'https://randomuser.me/api/portraits/men/50.jpg', 
    'https://randomuser.me/api/portraits/men/72.jpg', 'https://randomuser.me/api/portraits/women/35.jpg', 
    'https://randomuser.me/api/portraits/men/15.jpg', 'https://randomuser.me/api/portraits/women/55.jpg'
  ];
  abouts TEXT[] := ARRAY[
    '10 yılı aşkın süredir teknoloji sektöründe uçtan uca modern web tabanlı projeler geliştiren, yenilikçi ve çözüm odaklı Kıdemli Yazılım Geliştiriciyim. Özellikle React, Node.js ve bulut mimarileri (AWS, GCP) üzerinde yoğunlaşarak ölçeklenebilir ve yüksek performanslı sistemler tasarlıyorum. Kariyerim boyunca finans, e-ticaret ve sağlık alanlarında kritik öneme sahip dev projelerde lider geliştirici olarak görev aldım. Kod kalitesine (Clean Code) ve çevik yazılım (Agile/Scrum) prensiplerine sıkı sıkıya bağlı kalarak, her projede sadece işlevsel değil aynı zamanda sürdürülebilir bir altyapı kurmayı amaçlarım. Takım çalışmasının gücüne inanan, sürekli öğrenmeyi ve yeni teknolojilere adapte olmayı bir yaşam felsefesi haline getirmiş bir mühendisim. Gelecekte, yapay zeka entegrasyonlu büyük veri projelerinde daha fazla sorumluluk üstlenmeyi hedefliyorum.',
    'Dijital dünyanın hızla değişen dinamiklerine tutkuyla bağlı olan, analitik düşünce ile yaratıcı stratejiyi bir araya getiren Kıdemli Dijital Pazarlama Uzmanıyım. Markaların dijital platformlardaki görünürlüğünü organik ve ücretli kanallar üzerinden (SEO, SEM, Sosyal Medya, İçerik Pazarlaması) artırma konusunda 8 yıllık kapsamlı bir kariyere sahibim. Çalıştığım şirketlerde veri odaklı hareket ederek dönüşüm oranlarını (CRO) üst seviyelere kadar çıkardım ve dijital reklam bütçelerini maksimum ROI hedefiyle yönettim. Geleneksel pazarlama metodlarının dijitaldeki modern izdüşümünü kurarken, daima marka kimliğini zedelemeden kullanıcı ile duygusal bir bağ kurmayı hedeflerim. İş dünyasında stratejinin sadece fikir üretmekten değil, o fikri tutarlı bir veri ile ölçümlemekten geçtiğine inanıyorum.',
    'Estetik değerleri işlevsellikle buluşturan, marka hikayelerini görsel sanatlarla anlatan tutkulu bir Grafik Tasarımcı ve Art Direktörüm. Adobe Creative Suite (Photoshop, Illustrator, InDesign, Premiere Pro) başta olmak üzere sektörün standart tasarım araçlarını ileri profesyonel düzeyde kullanıyorum. 7 yılı aşan kariyerimde, kurumsal kimlik oluşturma, ambalaj tasarımı, UI/UX tasarımı ve sosyal medya görsel iletişim stratejileri alanlarında yüzlerce projeye imza attım. Minimalist fakat vurucu tasarımlara inanır, tipografi ve renk teorisini bir iletişim dili olarak kullanırım. Son kullanıcının zihninde kalıcı bir iz bırakan tasarımlar yaratmak benim en büyük motivasyonumdur.',
    'İnsan psikolojisinin derinliklerine duyduğum merakla yola çıkarak, bireylerin mental iyi oluşlarına bilimsel yaklaşımlarla destek olan Klinik Psikologum. Bilişsel Davranışçı Terapi (BDT) ve Şema Terapi alanlarında kapsamlı eğitimlerimi tamamlamış olup, yetişkinlerle duygu durum bozuklukları, anksiyete, travma sonrası stres ve ilişki problemleri üzerine aktif terapi seansları yürütmekteyim. Danışanlarıma ön yargısız, güvenilir ve tamamen empatik bir alan yaratmayı temel prensip edinirim. Mesleki etik sınırlarını daima en üstte tutarak, ulusal ve uluslararası akademik gelişmeleri yakından takip eder, kendimi geliştirmekten asla vazgeçmem.',
    '15 Yıllık kapsamlı kurumsal satış yönetimi deneyimine sahip, hedef odaklı ve stratejik bir İş Geliştirme Yöneticisiyim. B2B ve B2C pazar dinamiklerine hakimiyetimle şirketlerin pazar paylarını ve yıllık cirolarını istikrarlı bir şekilde artırma konusunda uzmanım. Geleneksel müşteri ilişkilerinin ötesine geçerek, markalar arasında kalıcı ticari köprüler kurmayı, yüksek hacimli kurumsal anlaşmalar sağlamayı ve yeni pazarlara giriş stratejileri üretmeyi görev edindim. Çatışma çözümü, müzakere teknikleri ve stres altındaki kriz yönetimi konularında deneyimliyim. Aynı zamanda alt kademedeki satış uzmanlarına mentorluk yaparak yüksek performanslı, tutkulu ve motive satış ekipleri kurmaktan büyük keyif alırım.',
    'Kurumların vizyonunu hedef kitleye doğru bir biçimde aktarmayı misyon edinmiş, stratejik iletişim ustası bir Halkla İlişkiler (PR) Uzmanıyım. 6 yıllık kariyerimde medya ilişkileri, kriz yönetimi, kurumsal sosyal sorumluluk (KSS) projeleri ve basın bülteni yönetimi gibi konularda oldukça deneyimliyim. Geleneksel medyanın yanı sıra, influencer işbirlikleri ve yeni medya stratejilerinde de proaktif bir yaklaşım sergilerim. Bir kriz anında, markanın itibarını zedelemeden en soğukkanlı şekilde süreci yönetme ve markayı krizden güçlenerek çıkarma konusundaki tecrübeme güveniyorum. Mükemmel diksiyon, yazılı ifade ve güçlü ikna kabiliyetim ile her zaman proaktif hareket ederim.',
    'Milyonlarca satır veri arasında gizlenmiş büyük resmi görmeyi ve bu verileri işletmelerin stratejik kararlar almasını sağlayacak net içgörülere dönüştürmeyi seven bir Veri Bilimcisi ve Analistiyim. Python (Pandas, NumPy, Scikit-learn), SQL, R, ve veri görselleştirme araçları (Tableau, Power BI) konusunda oldukça tecrübeliyim. Machine Learning algoritmaları ve tahminleme (predictive analysis) modelleri kurarak şirket maliyetlerini optimize eden projelere liderlik ettim. Verinin sadece rakamlardan değil, şirketlerin geleceğini aydınlatan bir harita olduğuna inanırım. Karmaşık matematiksel süreçleri, teknik olmayan ekiplere yalın bir dille anlatabilme becerim, iş birimi ile teknik ekip arasındaki mükemmel uyumu sağlamaktadır.',
    'İnsan kaynağının şirketlerin en büyük sermayesi olduğuna inanan, uçtan uca çalışanın yaşam döngüsünü yönetme konusunda uzmanlaşmış bir İnsan Kaynakları Yöneticisiyim. İşe alım süreçleri, performans yönetimi, ücretlendirme stratejileri, yan haklar ve şirket içi eğitim planlamaları üzerine 9 yıllık deneyimim bulunuyor. Özellikle Headhunting metodolojisini kullanarak teknoloji ve finans gibi yetenek kıtlığı yaşanan sektörlerde kritik rolleri hızla kapatabilme becerisine sahibim. Çalışan bağlılığını artırmak, kurum kültürünü şeffaf ve kapsayıcı hale getirmek ve sürdürülebilir bir motivasyon iklimi yaratmak her zaman en öncelikli hedeflerimdendir. Çalışan ve kurum menfaatlerini en adil terazide tartar, yasal mevzuatlara ve iş kanununa mutlak surette bağlı çalışırım.',
    'Mekanları sadece yapısal olarak değil, hikayesi olan yaşamsal formlar olarak tasarlamayı seven yenilikçi bir İç Mimarım. Tasarım sürecinde sürdürülebilir malzemeler, modern minimalizm ve ergonomik çözümlere ağırlık veriyorum. AutoCAD, 3ds Max, SketchUp ve Lumion gibi programlarda konsept aşamasından fotogerçekçi renderlara kadar tüm mimari süreci kusursuz yönetirim. Meslek hayatım boyunca lüks konut, restorasyon ve ticari alan (AVM, restoran) projelerinde baş tasarımcı unvanıyla çalıştım. Mekanın ruhunu kullanıcının ihtiyaçlarıyla senkronize ederek ortaya eşsiz, zamanın ötesinde estetik kompozisyonlar çıkarmayı hedeflerim. Tasarımın doğa ile entegre olması gerektiğine olan inancımla biyofilik tasarım konseptleri üzerine özel çalışmalar yürütmekteyim.',
    'Dijital perakende dinamiklerine hakim, analitik ve stratejik vizyona sahip E-Ticaret ve Operasyon Müdürü. Son 8 yıldır Türkiye’nin önde gelen e-ticaret platformlarında operasyon, lojistik, müşteri deneyimi ve kampanya yönetimi alanlarını başarıyla yönetmekteyim. Stok dönüşüm hızını artırma, iade oranlarını minimize etme ve "Last Mile Delivery" (son kilometre teslimat) operasyonlarını kusursuzlaştırma üzerine odaklanarak kârlılığı hedefliyorum. Omni-channel süreçlerini yapılandırmak, CRM dataları üzerinden müşteri yaşam boyu değerini (CLV) maksimize edecek aksiyonlar almak günlük pratiğimin parçasıdır. Giderek zorlaşan rekabet ortamında hızı, esnekliği ve müşteri memnuniyetini bir arada sunan sürdürülebilir operasyon ağları kurmak ana uzmanlık alanımdır.'
  ];
  
  -- We don't bother heavily with exact jsonb work experience arrays here because
  -- the "About" text itself is massive and easily fills the text-to-html ratio.
  -- But we add a dummy rich JSON for work experience to be safe.
  work_exp JSONB := '[
    {"id": "wx1", "role": "Kıdemli Uzman", "company": "Büyük Kurumsal Holding A.Ş.", "startDate": "01.2018", "endDate": "05.2023", "isCurrent": false},
    {"id": "wx2", "role": "Bölüm Yöneticisi", "company": "Global Teknoloji Sistemleri", "startDate": "06.2023", "endDate": "", "isCurrent": true}
  ]'::JSONB;
  
  education JSONB := '[
    {"id": "ed1", "university": "Ortadoğu Teknik Üniversitesi", "department": "İlgili Bölüm", "level": "lisans", "status": "Mezun"},
    {"id": "ed2", "university": "Boğaziçi Üniversitesi", "department": "Yüksek Lisans Programı", "level": "yukseklisans", "status": "Mezun"}
  ]'::JSONB;

BEGIN
  -- We insert these specifically as "Showcase" users, distinct from the test loop.
  FOR i IN 1..10 LOOP
    v_user_id := gen_random_uuid();
    
    -- CREATE USER in auth
    INSERT INTO auth.users (
      id, instance_id, aud, role, email,
      encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, recovery_token
    ) VALUES (
      v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
      'showcase.' || i || '@kartvizid.com',
      '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEF',
      now(),
      '{"provider": "email", "providers": ["email"]}',
      jsonb_build_object('full_name', names[i], 'avatar_url', photos[i]),
      now(), now(), '', ''
    );

    -- CREATE CV
    INSERT INTO public.cvs (
      user_id, name, profession, city, district, photo_url, about,
      experience_years, skills,
      work_experience, education_details,
      email, phone, is_email_public, is_phone_public, is_active, is_new,
      views, is_placed,
      salary_min, salary_max, salary_currency, work_type, employment_type, notice_period
    ) VALUES (
      v_user_id,
      names[i],
      professions[i],
      cities[i],
      districts[i],
      photos[i],
      abouts[i],
      (i + 4),
      ARRAY['Analitik Düşünce', 'Problem Çözme', 'Zaman Yönetimi', 'Liderlik', 'Proje Yönetimi', 'İnovasyon', 'Takım Çalışması', 'Kriz Yönetimi']::text[],
      work_exp,
      education,
      'showcase.' || i || '@kartvizid.com',
      '+90 555 000 ' || (100+i),
      false, false, true, true,
      (400 + (i*10)), false,
      35000, 65000, '₺', 'Hibrit', 'Tam Zamanlı', 'Hemen'
    );
    
  END LOOP;
END $$;

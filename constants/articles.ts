
export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishedAt: string;
  readTime: string;
}

export const BLOG_ARTICLES: Article[] = [
  {
    id: '1',
    slug: 'etkili-cv-hazirlama-rehberi-2026',
    title: 'Etkili CV Hazırlama Rehberi 2026: İş Verenleri Etkilemenin Yolları',
    excerpt: 'Modern iş dünyasında fark yaratacak profesyonel bir CV hazırlamak için bilmeniz gereken en güncel ipuçları ve stratejiler.',
    category: 'Kariyer Tavsiyeleri',
    publishedAt: '2026-04-01',
    readTime: '8 dk',
    content: `
      <h2>Modern CV Hazırlamanın Altın Kuralları</h2>
      <p>İş dünyası hızla değişiyor ve işe alım süreçleri de bu değişime ayak uyduruyor. 2026 yılında bir CV sadece bir belge değil, sizin profesyonel markanızın yansımasıdır.</p>
      
      <h3>1. Net ve Okunaklı Bir Düzen Seçin</h3>
      <p>İşe alım yöneticileri her bir CV'ye ortalama 6-10 saniye ayırır. Karmaşık düzenlerden kaçının. Standart fontlar (Inter, Roboto gibi) ve bol beyaz alan kullanmak, bilgilerinizin daha hızlı okunmasını sağlar.</p>
      
      <h3>2. Başarı Odaklı Olun</h3>
      <p>Sadece "Şu firmada şu işi yaptım" demek yerine, "Şu projeyi yöneterek verimliliği %20 artırdım" gibi ölçülebilir sonuçlar verin. Rakamlar her zaman kelimelerden daha güçlüdür.</p>
      
      <h3>3. Kartvizid ile Dijital CV'nin Avantajları</h3>
      <p>Geleneksel kağıt CV'lerin yerini artık dinamik dijital profiller alıyor. Kartvizid.com üzerinden oluşturacağınız dijital kartlarınız, sürekli güncellenebilir ve etkileşimli yapısıyla sizi diğer adayların önüne geçirir.</p>
      
      <h3>Sonuç</h3>
      <p>CV'niz sizinle beraber yaşayan bir dokümandır. Her yeni yetenek ve deneyim sonrası onu güncellemeyi unutmayın.</p>
    `
  },
  {
    id: '2',
    slug: 'mulakatlarda-basarili-olmanin-sirlari',
    title: 'Mülakatlarda Başarılı Olmanın Sırları: Heyecanınızı Fırsata Çevirin',
    excerpt: 'İş mülakatlarında sorulan zor sorulara nasıl cevap verilir? Beden dili nasıl olmalı? İşte profesyonellerden tavsiyeler.',
    category: 'Mülakat Teknikleri',
    publishedAt: '2026-04-03',
    readTime: '10 dk',
    content: `
      <h2>Mülakat Öncesi Hazırlık Süreci</h2>
      <p>Başarılı bir mülakatın %70'i hazırlıktır. Şirketi araştırmaktan, mülakatı yapan kişinin LinkedIn profilini incelemeye kadar geniş bir yelpazede hazırlık yapmalısınız.</p>
      
      <h3>1. STAR Tekniğini Kullanın</h3>
      <p>Situaton (Durum), Task (Görev), Action (Eylem) ve Result (Sonuç) kelimelerinin baş harflerinden oluşan bu teknik, zor soruları hikayeleştirerek yanıtlamanızı sağlar.</p>
      
      <h3>2. Beden Dilinin Gücü</h3>
      <p>Göz teması kurmak, dik oturmak ve aktif dinleme yaptığınızı baş hareketleriyle göstermek sizin özgüvenli olduğunuzu kanıtlar. Dijital mülakatlarda kameraya bakmayı unutmayın!</p>
      
      <h3>3. "Bize Kendinizden Bahsedin" Sorusu</h3>
      <p>Bu soru bir otobiyografi değildir. Geçmiş başarılarınız, şu anki konumunuz ve gelecekte o şirkete katacağınız artı değerlerin özetidir.</p>
    `
  },
  {
      id: '3',
      slug: 'dijital-dunyada-kisisel-marka-olusturma',
      title: 'Dijital Dünyada Kişisel Marka Oluşturma: Kariyerinizi Bir Üst Seviyeye Taşıyın',
      excerpt: 'Sizi diğer adaylardan ayıran özelliğiniz nedir? Dijital dünyada profesyonel görünürlüğünüzü artırmanın yollarını keşfedin.',
      category: 'Kişisel Gelişim',
      publishedAt: '2026-04-05',
      readTime: '12 dk',
      content: `
        <h2>Neden Kişisel Marka?</h2>
        <p>Günümüzde işverenler sadece teknik becerilere bakmıyor; bir kişinin çevrimiçi duruşu ve paylaştığı değerler de büyük önem arz ediyor.</p>
        
        <h3>Profesyonel Bir Dijital Varlık Oluşturun</h3>
        <p>Linkedin ve profesyonel portfolyo siteleri (Kartvizid gibi) sizin vitrininizdir. Bu platformlarda tutarlı bir görsel ve dil kullanmak marka algınızı güçlendirir.</p>
        
        <p>Kendi alanınızda içerik üretmek, makaleler yazmak sizi o konuda uzman konumuna getirir. Google'da isminiz arandığında ne çıkacağını kontrol edin!</p>
      `
  },
  {
    id: '4',
    slug: 'linkedin-profil-optimizasyonu-2026',
    title: 'LinkedIn Profil Optimizasyonu 2026: İK Uzmanlarının Dikkatini Çekin',
    excerpt: 'LinkedIn profiliniz sadece bir özgeçmiş değil, dijital dünyadaki itibarınızdır. İşte 2026 standartlarında bir profil için ipuçları.',
    category: 'Kişisel Marka',
    publishedAt: '2026-04-06',
    readTime: '15 dk',
    content: `
      <h2>LinkedIn'de Görünür Olmanın Yeni Kuralları</h2>
      <p>LinkedIn artık sadece iş aranan bir yer değil, profesyonel networking'in kalbi. 2026'da bir profilin "Yıldız" seviyesine ulaşması için stratejik dokunuşlar gerekiyor.</p>
      
      <h3>1. Headline (Başlık) Sadece Unvan Değildir</h3>
      <p>"Yazılım Mühendisi" yazıp bırakmak yerine "Hataları Çözüme Dönüştüren Yazılım Mimarı | React & Next.js Uzmanı" gibi değer odaklı başlıklar kullanın.</p>
      
      <h3>2. About (Hakkında) Bölümü: Hikayenizi Anlatın</h3>
      <p>Üçüncü tekil şahıs yerine birinci tekil şahısla, tutkularınızdan ve çözdüğünüz büyük problemlerden bahsedin. İlk 3 satır en kritiğidir, çünkü "Devamını Oku" butonuna bastırmanız gerekir.</p>
      
      <h3>3. Kartvizid Linkinizi Ekleyin</h3>
      <p>LinkedIn profilinizin "Featured" (Öne Çıkanlar) kısmına Kartvizid.com'daki dijital kartınızı ekleyerek, işverenlere interaktif ve hızlı bir deneyim sunun.</p>
    `
  },
  {
    id: '5',
    slug: 'maas-pazarligi-teknikleri',
    title: 'Maaş Pazarlığı Teknikleri: Değerinizi Kanıtlayın ve Hak Ettiğinizi Alın',
    excerpt: 'İş teklifi aldığınızda veya zam döneminde masaya nasıl oturmalısınız? İşte profesyonel pazarlık stratejileri.',
    category: 'Kariyer Tavsiyeleri',
    publishedAt: '2026-04-07',
    readTime: '12 dk',
    content: `
      <h2>Maaş Pazarlığı Bir Çatışma Değil, Bir Anlaşmadır</h2>
      <p>Pazarlık masasına oturduğunuzda kendinizi bir "satıcı" değil, bir "çözüm ortağı" olarak görün. Şirket size bir bütçe ayırıyor, siz de onlara zamanınızı ve yeteneğinizi veriyorsunuz.</p>
      
      <h3>1. Pazar Araştırması Yapın</h3>
      <p>Kendi sektörünüzde ve deneyim seviyenizde ortalama maaşları bilmeden masaya oturmayın. Kartvizid'deki benzer profillerin talep ettiği aralıkları analiz edin.</p>
      
      <h3>2. Sadece Paraya Odaklanmayın</h3>
      <p>Yan haklar, esnek çalışma saatleri, eğitim bütçesi veya hisse opsiyonları da paketinizin bir parçasıdır. Toplam faydaya odaklanın.</p>
    `
  },
  {
    id: '6',
    slug: 'uzaktan-calisma-verimliligi',
    title: 'Uzaktan Çalışmada Verimlilik: Evden Çalışırken Disiplini Korumak',
    excerpt: 'Home-office çalışma düzeninde tükenmişlik (burnout) sendromundan kaçınmak ve odaklanmayı artırmak için rehber.',
    category: 'Yaşam Tarzı',
    publishedAt: '2026-04-08',
    readTime: '9 dk',
    content: `
      <h2>Ev ve İş Arasındaki Sınırları Çizin</h2>
      <p>Uzaktan çalışmanın en büyük tuzağı "her an ulaşılabilir" olma hissidir. Verimlilik, saatlerce bilgisayar başında kalmak değil, odaklı çalışmaktır.</p>
      
      <h3>1. Rutin Oluşturun</h3>
      <p>Pijamalarla çalışmak başta cazip gelse de, zihninizi "iş moduna" sokmak için bir sabah rutini ve çalışma kıyafeti (evde bile olsa) önemlidir.</p>
      
      <h3>2. Dijital Detoks Saatleri</h3>
      <p>Mesai saati bittiğinde bildirimleri kapatın. İşinizin hayatınızın merkezi değil, onu finanse eden bir araç olduğunu unutmayın.</p>
    `
  },
  {
    id: '7',
    slug: 'cv-fotografi-nasil-olmali',
    title: 'Profesyonel CV Fotoğrafı Nasıl Olmalı? İlk İzlenimi Güçlendirin',
    excerpt: 'Bir fotoğraf bin kelimeye bedeldir. İşverenlerin profilinize baktığında güven duymasını sağlayacak detaylar.',
    category: 'İş Arama',
    publishedAt: '2026-04-09',
    readTime: '7 dk',
    content: `
      <h2>Göz Teması ve Güler Yüzün Önemi</h2>
      <p>Dijital CV'nizdeki fotoğrafınız, sizinle mülakat yapmadan önceki ilk "merhabadır". Selfie tarzı veya sosyal medya fotoğrafları profesyonelliğinize zarar verebilir.</p>
      
      <h3>1. Arka Plan Sadeliktir</h3>
      <p>Dikkati dağıtan nesnelerden kaçının. Hafif bulanık veya sade beyaz/gri bir arka plan her zaman en güvenli limandır.</p>
      
      <h3>2. Güncel Kalın</h3>
      <p>10 yıl önceki fotoğrafınızı kullanmayın. İnsanlar mülakata geldiğinizde fotoğraftaki kişiyle karşılaşmak ister.</p>
    `
  },
  {
    id: '8',
    slug: 'yazilim-sektorunde-kariyer-yapmak',
    title: 'Yazılım Sektöründe Kariyer Yapmak: Hangi Dili Öğrenmelisiniz?',
    excerpt: 'Yazılım dünyasına yeni girenler veya kariyer değiştirenler için 2026 teknoloji trendleri analizi.',
    category: 'Teknoloji',
    publishedAt: '2026-04-10',
    readTime: '18 dk',
    content: `
      <h2>Dil Değil, Problem Çözme Yeteneği</h2>
      <p>Programlama dilleri sadece birer araçtır. Asıl önemli olan algoritmik düşünme ve karmaşık problemleri basit parçalara ayırabilmektir.</p>
      
      <h3>1. Web Teknolojileri Hala Lider</h3>
      <p>JavaScript, Python ve Go dilleri 2026'da da popülerliğini koruyor. Özellikle "Fullstack" gelişim, işverenlerin en çok talep ettiği alan.</p>
      
      <h3>2. AI ile İş Birliği</h3>
      <p>Yapay zeka araçlarını (Copilot, ChatGPT) bir rakip değil, hızınızı 3 katına çıkaracak bir asistan olarak görmeyi öğrenin.</p>
    `
  },
  {
    id: '9',
    slug: 'is-mulakatinda-beden-dili',
    title: 'İş Mülakatında Beden Dili: Sözleriniz Kadar Duruşunuz da Önemli',
    excerpt: 'Mülakat sırasında farkında olmadan verdiğiniz sinyalleri nasıl kontrol edersiniz?',
    category: 'Mülakat Teknikleri',
    publishedAt: '2026-04-11',
    readTime: '11 dk',
    content: `
      <h2>Aynalama Tekniği ve Özgüven</h2>
      <p>Mülakatı yapan kişinin beden dilini hafifçe "aynalamak", bilinçaltında bir uyum ve güven duygusu oluşturur.</p>
      
      <h3>1. Ellerinizi Saklamayın</h3>
      <p>Ellerin masanın üzerinde görünür olması, dürüstlük ve şeffaflık mesajı verir. Sürekli kapalı kollar ise savunma modunda olduğunuzu gösterir.</p>
      
      <h3>2. Dik Duruşun Gücü</h3>
      <p>Sandalyeye yayılmak veya aşırı büzülmek yerine, omurganızın dik olması sizin o işe ve kendinize olan inancınızı temsil eder.</p>
    `
  },
  {
    id: '10',
    slug: 'kariyerde-stres-yonetimi',
    title: 'Kariyerde Stres Yönetimi: Zor Zamanlarda Ayakta Kalmak',
    excerpt: 'İş yükü arttığında ve hedefler zorlaştığında zihinsel sağlığınızı korumanın pratik yolları.',
    category: 'Psikoloji',
    publishedAt: '2026-04-12',
    readTime: '14 dk',
    content: `
      <h2>Stres Bir Düşman Değil, Bir Sinyaldir</h2>
      <p>Hafif düzeyde stres odaklanmayı artırabilir, ancak kronik stres yaratıcılığı öldürür. Önemli olan stresi yönetmektir.</p>
      
      <h3>1. Önceliklendirme: Eisenhower Matrisi</h3>
      <p>Görevlerinizi "Acil" ve "Önemli" olarak sınıflandırın. Her şeyi aynı anda yapmaya çalışmak en büyük stres kaynağıdır.</p>
      
      <h3>2. Molaların Gücü (Pomodoro)</h3>
      <p>25 dakikalık odaklı çalışma ve 5 dakikalık molalar, zihninizin tazelenmesini sağlar. Çay molasını bir lüks değil, bir ihtiyaç olarak görün.</p>
    `
  }
];

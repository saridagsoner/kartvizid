
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

const CATEGORY_MAP: Record<string, Record<string, string>> = {
  tr: {
    'job_search': 'İş Arayışında Uzmanlık',
    'interview': 'Mülakat Teknikleri',
    'networking': 'Networking ve Kişisel Marka',
    'tech': 'Teknoloji ve Gelecek',
    'transformation': 'Kariyer Dönüşümü',
    'salary': 'Maaş ve Finans',
    'lifestyle': 'Yaşam Tarzı',
    'management': 'Yönetim',
    'psychology': 'İş Yeri Psikolojisi',
    'development': 'Kişisel Gelişim',
    'youth': 'Gelecek ve Gençler',
    'global': 'Global Kariyer'
  },
  en: {
    'job_search': 'Job Search Expertise',
    'interview': 'Interview Techniques',
    'networking': 'Networking & Personal Branding',
    'tech': 'Technology & Future',
    'transformation': 'Career Transformation',
    'salary': 'Salary & Finance',
    'lifestyle': 'Lifestyle',
    'management': 'Management',
    'psychology': 'Workplace Psychology',
    'development': 'Personal Development',
    'youth': 'Future & Youth',
    'global': 'Global Career'
  },
  de: {
    'job_search': 'Jobsuche-Expertise',
    'interview': 'Interview-Techniken',
    'networking': 'Networking & Personal Branding',
    'tech': 'Technologie & Zukunft',
    'transformation': 'Karriere-Transformation',
    'salary': 'Gehalt & Finanzen',
    'lifestyle': 'Lifestyle',
    'management': 'Management',
    'psychology': 'Arbeitspsychologie',
    'development': 'Persönliche Entwicklung',
    'youth': 'Zukunft & Jugend',
    'global': 'Globale Karriere'
  },
  fr: {
    'job_search': 'Expertise en Recherche d\'Emploi',
    'interview': 'Techniques d\'Entretien',
    'networking': 'Networking & Personal Branding',
    'tech': 'Technologie & Futur',
    'transformation': 'Transformation de Carrière',
    'salary': 'Salaire & Finance',
    'lifestyle': 'Mode de Vie',
    'management': 'Management',
    'psychology': 'Psychologie au Travail',
    'development': 'Développement Personnel',
    'youth': 'Futur & Jeunesse',
    'global': 'Carrière Mondiale'
  },
  es: {
    'job_search': 'Experiencia en Búsqueda de Empleo',
    'interview': 'Técnicas de Entrevista',
    'networking': 'Networking y Marca Personal',
    'tech': 'Tecnología y Futuro',
    'transformation': 'Transformación de Carrera',
    'salary': 'Salario y Finanzas',
    'lifestyle': 'Estilo de Vida',
    'management': 'Gestión',
    'psychology': 'Psicología Laboral',
    'development': 'Desarrollo Personal',
    'youth': 'Futuro y Juventud',
    'global': 'Carrera Global'
  },
  ar: {
    'job_search': 'خبرة البحث عن وظيفة',
    'interview': 'تقنيات المقابلة',
    'networking': 'التواصل والعلامة التجارية الشخصية',
    'tech': 'التكنولوجيا والمستقبل',
    'transformation': 'تحول المسار المهني',
    'salary': 'الراتب والتمويل',
    'lifestyle': 'أسلوب الحياة',
    'management': 'الإدارة',
    'psychology': 'علم النفس في مكان العمل',
    'development': 'التطوير الشخصي',
    'youth': 'Gelecek ve Gençler',
    'global': 'Global Kariyer'
  }
};

const BLOG_ARTICLES_BASE: Article[] = [
  {
    id: '1',
    slug: 'etkili-cv-hazirlama-2026',
    title: 'Etkili CV Hazırlama Rehberi 2026: Seçilen Yüzde 5-lik Dilime Girin',
    excerpt: 'ATS sistemlerini aşan, işe alım yöneticilerini ilk 6 saniyede etkileyen profesyonel CV hazırlama stratejileri.',
    category: 'job_search',
    publishedAt: '2026-04-01',
    readTime: '20',
    content: `
      <h2>2026'da CV Yazımına Giriş: Algoritmalar ve İnsanlar İçin Yazmak</h2>
      <p>Modern iş dünyasında özgeçmişiniz artık sadece bir kağıt parçası değil, dijital dünyadaki ilk 'merhabanız'dır. 2026 yılında bir CV'nin başarısı, hem yapay zeka tabanlı Aday Takip Sistemlerini (ATS) geçmesine hem de bir insanın dikkatini çekmesine bağlıdır. Bu rehberde, sizi adaylar arasında en üst %5'lik dilime taşıyacak stratejileri inceleyeceğiz.</p>
      <h3>1. ATS Sistemlerini %100 Başarıyla Aşmak</h3>
      <p>Şirketlerin çoğu artık başvuruları ilk aşamada botlara okutuyor. Bu botlar, metni ayrıştırırken karmaşık tablolara, görsellere veya alışılmadık fontlara takılabilir.</p>
    `
  },
  {
    id: '2',
    slug: 'mulakat-zor-sorular-cevaplar',
    title: 'Mülakat Teknikleri: En Zor Sorulara Verilecek Kazanan Cevaplar',
    excerpt: 'Mülakatçının niyetini anlayın: Gizli anlamları deşifre edin ve her soruda uzmanlığınızı kanıtlayın.',
    category: 'interview',
    publishedAt: '2026-04-02',
    readTime: '18',
    content: `<h2>Mülakatın Psikolojisi: Neden Soruyorlar?</h2><p>Mülakatçılar sadece teknik bilginizi değil, baskı altında nasıl tepki verdiğinizi test ederler.</p>`
  },
  {
    id: '3',
    slug: 'kisisel-marka-otorite-olma',
    title: 'Kişisel Marka İnşası: Kendi Alanınızda Otorite Olmanın Yollarını',
    excerpt: 'LinkedIn alternatifleri ve dijital dünyada kendi markanızı yöneterek işlerin ayağınıza gelmesini sağlayın.',
    category: 'networking',
    publishedAt: '2026-04-03',
    readTime: '22',
    content: `<h2>Kişisel Marka Nedir?</h2><p>Kişisel marka, siz odada yokken insanların sizin hakkınızda söyledikleridir.</p>`
  },
  {
      id: '4',
      slug: 'dijital-kartvizit-nedir-avantajlari',
      title: 'Dijital Kartvizit Nedir? Modern Profesyoneller İçin Neden Bir Zorunluluk?',
      excerpt: 'Network kurma biçimimiz değişti. Kartvizid ile saniyeler içinde kalıcı bağlantılar kurmanın avantajlarını keşfedin.',
      category: 'tech',
      publishedAt: '2026-04-04',
      readTime: '15',
      content: `<h2>Fiziksel Kartvizitlerin Sonu</h2><p>Dijital kartvizit, saniyeler içinde telefon rehberine giren modern bir araçtır.</p>`
  },
  {
      id: '5',
      slug: 'maas-pazarligi-stratejileri-rehberi',
      title: 'Maaş Pazarlığı Stratejileri: Değerinizi Kanıtlayın ve Hak Ettiğinizi Alın',
      excerpt: 'Yüz yüze görüşmelerde veya sözleşme aşamasında maaş pazarlığı nasıl yapılır? İşte profesyonel taktikler.',
      category: 'salary',
      publishedAt: '2026-04-05',
      readTime: '17',
      content: `<h2>Maaş Pazarlığı Bir Anlaşmadır</h2><p>Doğru stratejiyle hak ettiğiniz maaşı almak sizin elinizdedir.</p>`
  },
  {
    id: '6',
    slug: 'linkedin-profil-optimizasyonu-2026',
    title: 'LinkedIn Profil Optimizasyonu 2026: Algoritmalar Sizi Nasıl Öne Çıkarır?',
    excerpt: 'Yapay zeka çağında LinkedIn profilinizi bir mıknatısa dönüştürün. Anahtar kelime stratejileri ve içerik üretim ipuçları.',
    category: 'networking',
    publishedAt: '2026-04-06',
    readTime: '25',
    content: `
      <h2>Profiliniz Web Sitenizdir</h2>
      <p>2026 yılında LinkedIn, sadece bir özgeçmiş deposu olmaktan çıkıp profesyonel bir portfolyo ve içerik platformuna dönüştü. İşverenler artık sadece ne yaptığınızı değil, ne bildiğinizi ve nasıl düşündüğünüzü de görmek istiyor.</p>
      <h3>Manşet (Headline) Alanını Doğru Kullanmak</h3>
      <p>Sadece unvanınızı yazmak yerine, sunduğunuz değeri anlatan anahtar kelimeler ekleyin. 'Yazılım Mühendisi' yerine 'Yüksek Ölçekli Sistemler Uzmanı | Node.js & Go | Verimlilik Odaklı Çözümler' gibi ifadeler sizi aramalarda üst sıralara taşır.</p>
    `
  },
  {
    id: '7',
    slug: 'uzaktan-calisma-verimlilik-taktikleri',
    title: 'Uzaktan Çalışmada Verimlilik: Evden Kariyer Basamaklarını Tırmanma Rehberi',
    excerpt: 'Görünmezlik tehlikesini aşın: Uzaktan çalışırken terfi almanın ve ekip içinde etkili kalmanın yolları.',
    category: 'lifestyle',
    publishedAt: '2026-04-07',
    readTime: '18',
    content: `
      <h2>Evde Ama Ekibin Kalbinde</h2>
      <p>Uzaktan çalışmanın en büyük riski 'gözden ırak olan gönülden de ırak olur' durumudur. Bunu aşmak için proaktif iletişim şarttır.</p>
      <h3>Asenkron İletişimin Gücü</h3>
      <p>Mesajlarınızı ve raporlarınızı o kadar net yazın ki, karşı tarafın ek soru sormasına gerek kalmasın. Bu profesyonellik göstergesidir.</p>
    `
  },
  {
    id: '8',
    slug: 'tersine-ise-alim-nedir-faydalari',
    title: 'Üçüncü Nesil İnsan Kaynakları: Tersine İşe Alım (Reverse Recruitment) Nedir?',
    excerpt: 'Artık adaylar değil, şirketler sizi ikna etmeli. Kartvizid modelinin temelindeki modern İK devrimini keşfedin.',
    category: 'transformation',
    publishedAt: '2026-04-08',
    readTime: '15',
    content: `
      <h2>Pasif Aday Olmaktan Aktif Hedef Olmaya</h2>
      <p>Tersine işe alım, geleneksel 'başvur ve bekle' modelini yıkar. Bu modelde yetenek platformda parlar ve şirketler en iyi projeleriyle adayın kapısını çalar.</p>
    `
  },
  {
      id: '9',
      slug: 'mulakatta-beden-dili-kamera-arkasi',
      title: 'Kamera Arkasındaki Güç: Video Mülakatlarda Beden Dili ve Teknik Kurulum',
      excerpt: 'Işık, açı ve bakışlar: Dijital ortamda güven veren bir profesyonel imaj çizmenin tüm detayları.',
      category: 'interview',
      publishedAt: '2026-04-09',
      readTime: '22',
      content: `<h2>Kameraya Bakmak, Göz Temasıdır</h2><p>Ekrana değil, doğrudan kamera merceğine bakmak karşı tarafta güven uyandırır.</p>`
  },
  {
      id: '10',
      slug: 'kariyerde-stres-yonetimi-burnout-engelleme',
      title: 'Tükenmişlik (Burnout) ile Savaş: Kariyerinizde Stres Yönetimi ve Akıl Sağlığı',
      excerpt: 'İş-yaşam dengesini kurmak bir lüks değil, uzun vadeli kariyer başarısı için temel bir zorunluluktur.',
      category: 'psychology',
      publishedAt: '2026-04-10',
      readTime: '28',
      content: `<h2>Sınır Çizmeyi Öğrenmek</h2><p>Mesai saatleri dışında bildirimleri kapatmak, üretkenliğinizi düşürmez; aksine ertesi güne daha taze başlamanızı sağlar.</p>`
  },
  {
      id: '11',
      slug: 'freelance-kariyerine-baslangic-rehberi',
      title: 'Freelance Ekonomisinde Yeriniz: Kendi İşinizin Patronu Olmanın İlk 5 Adımı',
      excerpt: 'Kurumsal hayatı bırakıp özgürlüğe adım atmak isteyenler için finansal ve operasyonel yol haritası.',
      category: 'global',
      publishedAt: '2026-04-11',
      readTime: '24',
      content: `<h2>Niş Alan Belirlemek</h2><p>Her şeyi yapan hiç kimse olamazsınız. Bir konuda uzmanlaşmak, freelance dünyasında daha yüksek ücretler almanızı sağlar.</p>`
  },
  {
      id: '12',
      slug: 'yazilim-sektorunde-kariyer-2026-trendleri',
      title: 'Yazılımda Kariyer 2026: Hangi Teknolojiler ve Diller Kazandıracak?',
      excerpt: 'AI integrasyonları, düşük kodlu platformlar ve siber güvenliğin yükselişiyle değişen yazılımcı profili.',
      category: 'tech',
      publishedAt: '2026-04-12',
      readTime: '30',
      content: `<h2>Dil Değil, Mantık Önemli</h2><p>Artık sadece kod yazmak yetmiyor; AI araçlarını bir orkestra şefi gibi yöneten yazılımcılar aranan isimler olacak.</p>`
  },
  {
      id: '13',
      slug: 'saglik-sektorunde-dijitallesme-kariyer',
      title: 'Sağlıkta Yeni Ufuklar: Sağlık Profesyonelleri İçin Dijitalleşen Kariyer Fırsatları',
      excerpt: 'Tele-tıp, veri analitiği ve dijital sağlık danışmanlığının yükselişiyle gelen yeni uzmanlıklar.',
      category: 'transformation',
      publishedAt: '2026-04-13',
      readTime: '19',
      content: `<h2>Veri ile İyileştirmek</h2><p>Geleceğin sağlık çalışanları, sadece stetoskop değil, veri analitiği araçlarını da kullanacak.</p>`
  },
  {
      id: '14',
      slug: 'hibrit-calisma-modeli-denge-rehberi',
      title: 'Hibrit Çalışma Dengesi: Ofis ve Ev Arasında Maksimum Verim Sağlamanın Yolları',
      excerpt: 'İki dünyanın en iyisini birleştirin: Hibrit düzende disiplin ve sosyallik dengesini kurmak.',
      category: 'lifestyle',
      publishedAt: '2026-04-14',
      readTime: '16',
      content: `<h2>Esneklik ve Disiplin</h2><p>Hibrit modelde başarılı olmanın anahtarı, hangi işin ofiste hangisinin evde daha iyi yapıldığını bilmektir.</p>`
  },
  {
      id: '15',
      slug: 'kariyer-donusumu-30-yas-sonrasi',
      title: '30 Yaşından Sonra Kariyer Değiştirmek: Geç Kalmadınız, Güçlendiniz',
      excerpt: 'Sektör değiştirmekten korkmayın. Eski tecrübelerinizi yeni alanınızda nasıl bir avantaja çevirirsiniz?',
      category: 'transformation',
      publishedAt: '2026-04-15',
      readTime: '21',
      content: `<h2>Aktarılabilir Beceriler</h2><p>Eski işinizden getirdiğiniz iletişim, yönetim ve problem çözme yetenekleri her sektörde değerlidir.</p>`
  },
  {
      id: '16',
      slug: 'gelecegin-meslekleri-2030-hazirlik',
      title: '2030\'a Doğru: Geleceğin Mesleklerine Bugünden Hazırlanma Stratejileri',
      excerpt: 'Robotların yapamayacağı işlere odaklanın: Empati, yaratıcılık ve stratejik düşünmenin yükselişi.',
      category: 'youth',
      publishedAt: '2026-04-16',
      readTime: '35',
      content: `<h2>Yumuşak Becerilerin (Soft Skills) Zaferi</h2><p>Teknik işleri makineler devraldıkça, insan kalmayı gerektiren rollerin değeri paha biçilemez olacak.</p>`
  },
  {
      id: '17',
      slug: 'etkili-networking-dijital-dunya',
      title: 'Etkili Networking: Fiziksel Kartvizitlerin Ötesinde Bağlantılar Kurmak',
      excerpt: 'Sadece tanışmak değil, akılda kalmak: Networkünüzü nasıl organik bir güç haline getirirsiniz?',
      category: 'networking',
      publishedAt: '2026-04-17',
      readTime: '20',
      content: `<h2>Değer Vermek, Değer Bulmaktır</h2><p>Networking birinden bir şey istemek değil, birine nasıl yardımcı olabileceğinizi bulmaktır.</p>`
  },
  {
      id: '18',
      slug: 'is-yerinde-mobbing-yasal-haklar',
      title: 'Mobbing ile Mücadele: Psikolojik Taciz Karşısında Yasal Haklarınız ve Güvenliğiniz',
      excerpt: 'Kendinizi koruyun: Mobbing belirtilerini tanımak ve profesyonel sınırlar çizmek.',
      category: 'psychology',
      publishedAt: '2026-04-18',
      readTime: '26',
      content: `<h2>Belgelemek Hayat Kurtarır</h2><p>Yaşadığınız olumsuzlukları tarih ve detay vererek not almak, olası bir yasal süreçte en büyük kanıtınızdır.</p>`
  },
  {
      id: '19',
      slug: 'girisimcilik-vs-profesyonel-hayat',
      title: 'Girişimcilik mi, Profesyonel Hayat mı? Size Uygun Kariyer Yolunu Bulun',
      excerpt: 'Risk iştahı, konfor alanı ve özgürlük: Hangi dünya sizin karakterinize daha yakın?',
      category: 'development',
      publishedAt: '2026-04-19',
      readTime: '23',
      content: `<h2>Kendi Yolunu Çizmek</h2><p>Girişimcilik sadece şirket kurmak değil, bir bakış açısıdır. Bunu kurumsal hayatta da uygulayabilirsiniz.</p>`
  },
  {
      id: '20',
      slug: 'yurtdisinda-kariyer-stratejileri-2026',
      title: 'Global Kariyer: Yurtdışında İş Bulma ve Vize Süreçleri İçin Modern Stratejiler',
      excerpt: 'Sınırları aşın: Yurt dışındaki şirketlere uzaktan veya yerinde başvururken dikkat etmeniz gerekenler.',
      category: 'global',
      publishedAt: '2026-04-20',
      readTime: '27',
      content: `<h2>Global Standartlarda Özgeçmiş</h2><p>Her ülkenin özgeçmiş kültürü farklıdır. Global vizyona uygun bir profil, kapıların daha kolay açılmasını sağlar.</p>`
  },
  {
    id: '21',
    slug: 'kapak-yazisi-hazirlama-rehberi-2026',
    title: 'Kapak Yazısı (Cover Letter) Sanatı: 2026 Trendleri ve Şablonlar',
    excerpt: 'Standart mektupları unutun. İşe alım yöneticisini daha ilk paragrafta etkileyecek kişiselleştirilmiş kapak yazısı formülleri.',
    category: 'job_search',
    publishedAt: '2026-04-21',
    readTime: '15',
    content: `
      <h2>2026'da Kapak Yazısı Hala Gerekli mi?</h2>
      <p>Pek çok aday kapak yazısını zaman kaybı olarak görse de, 2026'da rekabetin bu kadar yoğun olduğu bir ortamda, kendinizi hikayeleştirmenin en iyi yolu budur. Bir bot değil, bir insan olduğunuzu kanıtlamanın yoludur.</p>
      <h3>Hangi Sektörler Kapak Yazısına Önem Veriyor?</h3>
      <p>Özellikle kreatif endüstriler, yönetim danışmanlığı ve startup ekosistemleri, adayın kültürel uyumunu anlamak için bu yazıları dikkatle inceler.</p>
    `
  },
  {
    id: '22',
    slug: 'ats-dostu-yazi-tipleri-ve-mizanpaj',
    title: 'ATS Dostu Yazı Tipleri ve Mizanpaj Sırları: Botları Aşın',
    excerpt: 'CV-nizin tasarımı botlar tarafından nasıl okunuyor? En iyi fontlar ve kaçınmanız gereken grafiksel hatalar.',
    category: 'job_search',
    publishedAt: '2026-04-22',
    readTime: '12',
    content: `
      <h2>Botların Gözünden CV'niz</h2>
      <p>ATS (Applicant Tracking Systems) yazılımları, metni belirli bir hiyerarşide arar. Karmaşık sütunlar veya tablolar bu hiyerarşiyi bozabilir.</p>
      <h3>En Güvenli Fontlar</h3>
      <p>Arial, Calibri ve Roboto gibi sans-serif fontlar hem botlar hem de ekran başında yorgun gözlerle CV inceleyen insanlar için en ideal seçeneklerdir.</p>
    `
  },
  {
    id: '23',
    slug: 'video-mulakat-yazilimlari-uzman-ayarlari',
    title: 'Video Mülakat Yazılımları: Zoom, Teams ve Meet için Uzman Ayarları',
    excerpt: 'Teknik aksaklıklar mülakat performansınızı gölgelemesin. Profesyonel bir dijital duruş için ekipman ve yazılım rehberi.',
    category: 'interview',
    publishedAt: '2026-04-23',
    readTime: '18',
    content: `
      <h2>Teknik Mükemmeliyet Güven Verir</h2>
      <p>Mülakata bağlandığınız anda sesinizin net olması ve görüntünüzün donmaması, dijital okuryazarlığınızın ilk kanıtıdır.</p>
      <h3>Arka Plan ve Işık Yönetimi</h3>
      <p>Pencereyi karşınıza alın (arkaya değil). Dağınık olmayan bir arka plan veya hafif bir bulanıklaştırma efekti profesyonel imajınızı destekler.</p>
    `
  },
  {
    id: '24',
    slug: 'star-teknigi-ile-mulakat-sorulari',
    title: 'Davranışsal Mülakat Soruları: STAR Tekniğiyle Hikaye Anlatıcılığı',
    excerpt: '"Bana bir zorluğu nasıl aştığınızı anlatın" gibi sorulara verilecek en etkili yapısal cevap formülü.',
    category: 'interview',
    publishedAt: '2026-04-24',
    readTime: '22',
    content: `
      <h2>STAR Tekniği Nedir?</h2>
      <p>Situation (Durum), Task (Görev), Action (Aksiyon) ve Result (Sonuç) kelimelerinin baş harflerinden oluşur. Bu yöntemle cevabınızı bir film senaryosu gibi kurgulayabilirsiniz.</p>
      <h3>Sonuç Odaklı Olmak</h3>
      <p>En önemli kısım 'Result' aşamasıdır. Rakamlarla desteklenen başarılar mülakatçının hafızasında kalıcı olur.</p>
    `
  },
  {
    id: '25',
    slug: 'linkedin-open-to-work-rozeti-analizi',
    title: 'LinkedIn\'de "Open to Work" Rozeti: Stratejik mi, Riskli mi?',
    excerpt: 'Yeşil çerçeve gerçekten işe yarıyor mu? İşe alım uzmanlarının bu rozete bakış açısı ve doğru kullanım stratejileri.',
    category: 'networking',
    publishedAt: '2026-04-25',
    readTime: '15',
    content: `
      <h2>Algı ve Gerçeklik</h2>
      <p>Bazı uzmanlar bu rozetin "çaresizlik" gibi algılanabileceğini savunsa da, 2026'da bu artık aktif bir arayışın ve şeffaflığın sembolü haline geldi.</p>
      <h3>Ayarları Kişiselleştirmek</h3>
      <p>Rozeti tüm dünyaya göstermek yerine sadece rercuiter'lara görünür kılmak, mevcut işinizde sorun yaşamamanızı sağlar.</p>
    `
  },
  {
    id: '26',
    slug: 'dijital-portfolyo-olusturma-rehberi',
    title: 'Dijital Portfolyo Oluşturma: Kod Yazmadan Kendi Sitenizi Kurun',
    excerpt: 'Statik bir CV-nin ötesine geçin.Projelerinizi sergileyebileceğiniz modern portfolyo araçları ve içerik ipuçları.',
    category: 'tech',
    publishedAt: '2026-04-26',
    readTime: '20',
    content: `
      <h2>Neden Bir Portfolyo?</h2>
      <p>Sadece söylemeyin, gösterin (Show, don't tell). Bir tasarımcı, yazar veya yazılımcı için bitmiş projeler 10 sayfalık CV'den daha değerlidir.</p>
      <h3>Ücretsiz Araçlar</h3>
      <p>Notion, Canva veya GitHub Pages gibi platformlarla teknik bilgi gerektirmeden profesyonel bir site oluşturabilirsiniz.</p>
    `
  },
  {
    id: '27',
    slug: 'sektorel-fuarlar-networking-taktikleri',
    title: 'Sektörel Fuarlar ve Zirveler: Networking\'den Maksimum Verim Almak',
    excerpt: 'Kalabalıklar arasında kaybolmayın. Etkinlik öncesi, sırası ve sonrasında etkili bağlantılar kurma stratejileri.',
    category: 'networking',
    publishedAt: '2026-04-27',
    readTime: '25',
    content: `
      <h2>Hazırlık Aşçısı Olun</h2>
      <p>Bir etkinliğe gitmeden önce katılımcı listesini inceleyin ve tanışmak istediğiniz 5 kişiyi belirleyin.</p>
      <h3>Elevator Pitch (Asansör Konuşması)</h3>
      <p>Kendinizi ve ne yaptığınızı 30 saniyede etkileyici bir şekilde anlatacak bir cümleniz olsun.</p>
    `
  },
  {
    id: '28',
    slug: 'referans-yonetimi-profesyonel-ipuclari',
    title: 'Referans Yönetimi: Kimleri Listelemeli, Kimleri Gizlemeli?',
    excerpt: 'Eski yöneticilerinizle aranızı iyi tutun. Referans kontrolü aşamasında yapılan kritik hatalar ve çözüm yolları.',
    category: 'job_search',
    publishedAt: '2026-04-28',
    readTime: '14',
    content: `
      <h2>Referans İstemenin Nezaketi</h2>
      <p>Birini referans yazmadan önce mutlaka iznini alın ve başvuracağınız pozisyon hakkında ona bilgi verin.</p>
      <h3>Zor Durumlar: Kötü Ayrılıklar</h3>
      <p>Eğer bir işten tatsız ayrıldıysanız, doğrudan yönetici yerine bir iş arkadaşınızı referans göstermek stratejik bir hamle olabilir.</p>
    `
  },
  {
    id: '29',
    slug: 'is-arama-yorgunlugu-ile-basa-cikma',
    title: 'İş Arama Yorgunluğu (Job Search Burnout) ile Başa Çıkma',
    excerpt: 'Yüzlerce ret cevabından sonra motivasyonu korumak mümkün mü? Psikolojik dayanıklılık ve süreç yönetimi.',
    category: 'psychology',
    publishedAt: '2026-04-29',
    readTime: '30',
    content: `
      <h2>Reddedilmek Kişisel Değildir</h2>
      <p>İş arama süreci bir maratondur. Her 'red' sizi 'kabul' alacağınız o bir tane doğru işe daha da yaklaştırır.</p>
      <h3>Rutin Oluşturmak</h3>
      <p>Günde sadece 4 saat iş arayın, kalan zamanda hobilerinize ve öğrenmeye odaklanın. 24 saat iş bakmak verimliliğinizi düşürür.</p>
    `
  },
  {
    id: '30',
    slug: 'yurt-disi-uzaktan-calisma-kultur-farki',
    title: 'Yurt Dışı Şirketlerle Uzaktan Çalışma: Kültürel Farklılıklar Rehberi',
    excerpt: 'Global bir köyde kariyer yapmak. Farklı zaman dilimleri ve çalışma kültürlerine adaptasyon için pratik tavsiyeler.',
    category: 'global',
    publishedAt: '2026-04-30',
    readTime: '28',
    content: `
      <h2>Zaman Dilimi Dansı</h2>
      <p>Uzaktan çalışmada en kritik beceri asenkron iletişimdir. İşinizi o kadar şeffaf yürütün ki yöneticiniz uykudayken bile ne yaptığınızı görebilsin.</p>
      <h3>Kültürel Nüanslar</h3>
      <p>Amerikan dobralığı ile Alman disiplini veya Japon nezaketi arasında denge kurmak global kariyer başarısının anahtarıdır.</p>
    `
  },
  {
    id: '31',
    slug: 'teknik-olmayan-roller-teknik-mulakat',
    title: 'Teknik Olmayan Roller İçin Teknik Mülakatlara Hazırlık',
    excerpt: 'Pazarlama veya satış pozisyonları için neden teknik bilgi isteniyor? Yazılımcılarla aynı dili konuşmanın yolları.',
    category: 'interview',
    publishedAt: '2026-05-01',
    readTime: '20',
    content: `
      <h2>Teknoloji Okuryazarlığı</h2>
      <p>Bir teknoloji şirketinde ürün müdürü veya satışçıysanız, API'nın ne olduğunu bilmek sizi diğer adayların fersah fersah önüne taşır.</p>
    `
  },
  {
    id: '32',
    slug: 'grup-mulakatlarinda-one-cikma-stratejileri',
    title: 'Grup Mülakatlarında Öne Çıkma: Domino Etkisi Yaratın',
    excerpt: 'Diğer adayları geride bırakırken kaba durmamak mümkün mü? İşbirliği ve liderlik yeteneklerinizi sergileyin.',
    category: 'interview',
    publishedAt: '2026-05-02',
    readTime: '17',
    content: `
      <h2>Aktif Dinleme ve Liderlik</h2>
      <p>Grup mülakatında en çok konuşan değil, en mantıklı sentezi yapan kazanır. Diğer adayların fikirlerine atıfta bulunarak liderlik gösterin.</p>
    `
  },
  {
    id: '33',
    slug: 'freelance-teklif-hazirlama-taktikleri',
    title: 'Freelance Teklif Hazırlama: Kabul Oranınızı Artıracak Taktikler',
    excerpt: 'Müşteriye neden sizi seçmesi gerektiğini bir bakışta gösterin. Fiyatlandırma ve kapsam belirleme rehberi.',
    category: 'salary',
    publishedAt: '2026-05-03',
    readTime: '24',
    content: `
      <h2>Maliyet Değil, Değer Önerisi</h2>
      <p>Teklifinizde kaç saat çalışacağınızı değil, müşterinin hangi problemini çözeceğinizi ve ona ne kadar para kazandıracağınızı anlatın.</p>
    `
  },
  {
    id: '34',
    slug: 'github-profilini-cv-gibi-kullanmak',
    title: 'GitHub Profilini Bir CV Gibi Kullanmak: Yazılımcılar İçin İpuçları',
    excerpt: 'Readme dosyalarından contribute grafiklerine: GitHub profilinizi bir kariyer aracına dönüştürün.',
    category: 'tech',
    publishedAt: '2026-05-04',
    readTime: '19',
    content: `
      <h2>Commit Geçmişinden Fazlası</h2>
      <p>Profilinizin 'README' dosyasını bir giriş sayfası gibi düzenleyin. Hangi teknolojileri bildiğinizi görsellerle destekleyin.</p>
    `
  },
  {
    id: '35',
    slug: 'kariyer-arasinda-career-gap-aciklama-sanati',
    title: 'Kariyer Arasında (Career Gap) Açıklama Sanatı',
    excerpt: 'İşe ara verdiğiniz dönemi bir kayıp olarak değil, bir gelişim olarak sunmanın profesyonel yolları.',
    category: 'transformation',
    publishedAt: '2026-05-05',
    readTime: '21',
    content: `
      <h2>Dürüstlük ve Odaklanma</h2>
      <p>Seyahat etmek, ailevi nedenler veya sadece dinlenmek... Sebebi ne olursa olsun bu süreyi 'öğrenim' ve 'projeler' ile birleştirmek etkili olur.</p>
    `
  },
  {
    id: '36',
    slug: 'startup-dunyasina-giris-rehberi',
    title: 'Kurumsal Kimlikten Uzaklaşma: Startup Dünyasına Giriş Rehberi',
    excerpt: 'Değişen dinamikler, belirsizlikler ve büyük ödüller: Startup ekosistemine uyum sağlamak için bilmeniz gerekenler.',
    category: 'transformation',
    publishedAt: '2026-05-06',
    readTime: '25',
    content: `
      <h2>Hız ve Esneklik</h2>
      <p>Bir startup'ta unvanınız 'Pazarlama Uzmanı' olsa da bazen ürün desteği vermek zorunda kalabilirsiniz. Bu çok yönlülük değerlidir.</p>
    `
  },
  {
    id: '37',
    slug: 'is-tekliflerini-degerlendirme-yan-haklar',
    title: 'İş Tekliflerini Değerlendirme: Yan Haklar ve Hisse Opsiyonları',
    excerpt: 'Sadece net maaşa bakmayın. Toplam paket değerini hesaplama, sağlık sigortası ve hisse payı (ESOP) analizleri.',
    category: 'salary',
    publishedAt: '2026-05-07',
    readTime: '30',
    content: `
      <h2>Rakamların Ötesi</h2>
      <p>Eğitim bütçesi, uzaktan çalışma ödeneği ve esnek çalışma saatleri hayat kalitenizi doğrudan etkiler.</p>
    `
  },
  {
    id: '38',
    slug: 'kariyer-hizlandirici-mentor-iliskisi',
    title: 'Mentor-Menti İlişkisi: Kariyerinizde Bir Hızlandırıcı Bulun',
    excerpt: 'Doğru mentoru nasıl seçersiniz? İlişkiyi sürdürmek ve her görüşmeden somut bir gelişim planı ile ayrılmak.',
    category: 'development',
    publishedAt: '2026-05-08',
    readTime: '22',
    content: `
      <h2>Neden Mentor?</h2>
      <p>Başkalarının hatalarından ders çıkarmak, kendi başınıza yapacağınızdan çok daha hızlı yol almanızı sağlar.</p>
    `
  },
  {
    id: '39',
    slug: 'is-gorusmesi-sonrasi-follow-up-sabloni',
    title: 'İş Görüşmesi Sonrası Takip (Follow-up) E-postası Şablonları',
    excerpt: 'Mülakat bittiğinde asıl süreç başlar. Akılda kalıcı, nazik ve profesyonel takip mektuplarıyla şansınızı artırın.',
    category: 'interview',
    publishedAt: '2026-05-09',
    readTime: '12',
    content: `
      <h2>Zamanlama Her Şeydir</h2>
      <p>Mülakattan sonraki ilk 24 saat içinde teşekkür maili göndermek sizi diğer adaylardan ayırır.</p>
    `
  },
  {
    id: '40',
    slug: 'icerik-ureterek-is-bulmak-gorsunurluk',
    title: 'İçerik Üreterek İş Bulmak: Niche Alanlarda Görünürlük',
    excerpt: 'LinkedIn alternatifleri ve dijital dünyada kendi markanızı yöneterek işlerin ayağınıza gelmesini sağlayın.',
    category: 'networking',
    publishedAt: '2026-05-10',
    readTime: '26',
    content: `
      <h2>Sessiz Uzman Olmayın</h2>
      <p>Bildiklerinizi paylaşmak, sadece bir 'profil' olmaktan çıkıp bir 'otorite' olmanızı sağlar.</p>
    `
  },
  {
    id: '41',
    slug: 'yapay-zeka-ile-cv-optimizasyonu-araclar',
    title: 'Yapay Zeka ile CV Optimizasyonu: En İyi 5 Araç ve Kullanım Rehberi',
    excerpt: 'ChatGPT, Claude ve özel ATS araçlarını kullanarak özgeçmişinizi nasıl kişiselleştirirsiniz? Pratik prompt örnekleri.',
    category: 'tech',
    publishedAt: '2026-05-11',
    readTime: '22',
    content: `
      <h2>Yapay Zeka Sizin Rakibiniz Değil, Asistanınızdır</h2>
      <p>2026 yılında CV hazırlarken yapay zekadan yararlanmamak, elinizde hesap makinesi varken elle çarpma işlemi yapmaya benzer. Önemli olan doğru soruları (prompt) sormaktır.</p>
      <h3>ChatGPT için Özgeçmiş Promptları</h3>
      <p>"Aşağıdaki iş tanımına uygun olarak, mevcut CV'mdeki başarılarımı STAR tekniğiyle yeniden yapılandır" komutu işinizi çok kolaylaştıracaktır.</p>
    `
  },
  {
    id: '42',
    slug: 'low-code-platformlar-kariyer-kapisi',
    title: 'Düşük Kodlu (Low-Code) Platformlar: Teknik Olmayanlar İçin Kariyer Kapısı',
    excerpt: 'Karmaşık kodlar yazmadan uygulama geliştirmeyi öğrenin. Bubble, FlutterFlow ve Microsoft PowerApps ile yeni bir yol.',
    category: 'tech',
    publishedAt: '2026-05-12',
    readTime: '18',
    content: `
      <h2>Yazılım Dünyasında Demokratikleşme</h2>
      <p>Artık bir ürün hayata geçirmek için mutlaka bilgisayar mühendisi olmanıza gerek yok. Low-code araçlar, iş analistleri ve pazarlamacılar için devasa bir oyun alanı sunuyor.</p>
    `
  },
  {
    id: '43',
    slug: 'siber-guvenlikte-kariyer-2026-rolleri',
    title: 'Siber Güvenlikte Kariyer: 2026\'nın En Kritik ve En Çok Kazandıran Rolleri',
    excerpt: 'Veri sızıntılarının arttığı dünyada koruyucu olun. Etik hackerlıktan güvenlik mimarlığına geçiş yolları.',
    category: 'job_search',
    publishedAt: '2026-05-13',
    readTime: '25',
    content: `
      <h2>Dijital Kapı Nöbetçileri</h2>
      <p>Siber güvenlik, 'işsiz kalma' riskinin en düşük olduğu alanlardan biridir. Şirketler artık sadece savunma değil, proaktif saldırı simülasyonları için uzmanlar arıyor.</p>
    `
  },
  {
    id: '44',
    slug: 'yesil-yakali-olmak-surdurulebilirlik-kariyer',
    title: 'Yeşil Yakalı Olmak: Sürdürülebilirlik Sektöründe Yeni İş Fırsatları',
    excerpt: 'Ekoloji ve ekonomiyi birleştiren kariyerler. Karbon ayak izi uzmanlığı ve döngüsel ekonomi danışmanlığı nedir?',
    category: 'transformation',
    publishedAt: '2026-05-14',
    readTime: '20',
    content: `
      <h2>Dünyayı Kurtarırken Kariyer Yapmak</h2>
      <p>Yeşil yakalılar, şirketlerin sürdürülebilirlik hedeflerine ulaşmasını sağlayan stratejistlerin yeni adıdır. Bu alan önümüzdeki 10 yılın en hızlı büyüyen sektörü olacak.</p>
    `
  },
  {
    id: '45',
    slug: 'veri-bilimi-vs-veri-analitigi-karsilastirma',
    title: 'Veri Bilimi vs. Veri Analitiği: Hangi Yol Sizin İçin Daha Uygun?',
    excerpt: 'Rakamlarla çalışmayı seviyorsanız hangi uzmanlığı seçmelisiniz? Maaş, yetenek ve günlük rutin farkları.',
    category: 'development',
    publishedAt: '2026-05-15',
    readTime: '15',
    content: `
      <h2>Geçmişe Bakmak mı, Geleceği Tahmin Etmek mi?</h2>
      <p>Veri analistleri mevcut veriden anlamlı raporlar çıkarırken, veri bilimciler algoritmalarla gelecekteki trendleri modellemeye odaklanır.</p>
    `
  },
  {
    id: '46',
    slug: 'bulut-bilisim-sertifikalari-degerli-mi',
    title: 'Bulut Bilişim (Cloud Computing) Sertifikaları: 2026\'da Almaya Değer mi?',
    excerpt: 'AWS, Azure ve Google Cloud: Hangi sertifika size kapıları açar? Maliyet ve getiri analizi.',
    category: 'tech',
    publishedAt: '2026-05-16',
    readTime: '24',
    content: `
      <h2>Bulutsuz Bir Şirket Kalmadı</h2>
      <p>Sertifikalar sadece bir kağıt parçası değil, standartlaşmış bir bilginin kanıtıdır. Global projelerde yer almak için bu 'ehliyetler' şarttır.</p>
    `
  },
  {
    id: '47',
    slug: 'dijital-gocebelik-rehberi-yasal-hazirlik',
    title: 'Dijital Göçebelik (Digital Nomad) Rehberi: Yasal ve Finansal Hazırlık',
    excerpt: 'Plajdan çalışmak göründüğü kadar kolay mı? Vize türleri, sağlık sigortası ve yabancı ülkelerdeki vergi yükümlülükleri.',
    category: 'lifestyle',
    publishedAt: '2026-05-17',
    readTime: '30',
    content: `
      <h2>Özgürlüğün Bedeli: Planlama</h2>
      <p>Dijital göçebe olmak sadece bir laptop ve internet hızı değildir. Estonya, Portekiz veya Bali'de yasal olarak kalmanın püf noktaları vardır.</p>
    `
  },
  {
    id: '48',
    slug: 'e-ticaret-uzmanligi-sektore-giris',
    title: 'E-ticaret Uzmanlığı: Kendi Mağazanızı Kurmadan Sektöre Giriş',
    excerpt: 'Amazon, Trendyol veya Shopify ekosistemlerinde yönetici olun. Dijital pazarlamanın satışla birleştiği nokta.',
    category: 'job_search',
    publishedAt: '2026-05-18',
    readTime: '19',
    content: `
      <h2>Satışın Yeni Yüzü</h2>
      <p>Ürün listeleme, stok yönetimi ve müşteri deneyimi... E-ticaret uzmanlığı, 2026'nın en çok aranan operasyonel rollerinden biri haline geldi.</p>
    `
  },
  {
    id: '49',
    slug: 'fintech-dunyasinda-kariyer-bankacilik-gelecegi',
    title: 'Fintech Dünyasında Kariyer: Geleneksel Bankacılığın Geleceği',
    excerpt: 'Neo-bankalar ve ödeme sistemleri. Finans ve teknolojinin kesiştiği noktada yüksek maaşlı iş fırsatları.',
    category: 'salary',
    publishedAt: '2026-05-19',
    readTime: '22',
    content: `
      <h2>Para Dijitalleşiyor</h2>
      <p>Blokzincir ve açık bankacılık konularında uzmanlaşan profesyoneller, geleneksel bankacılardan çok daha hızlı terfi alıyor.</p>
    `
  },
  {
    id: '50',
    slug: 'oyun-gelistirme-kariyeri-sanat-ve-kod',
    title: 'Oyun Geliştirme: Sadece Kod Değil, Bir Sanat Dalı Olarak Kariyer',
    excerpt: 'Unity ve Unreal Engine ile hikayeler yaratın. Oyun tasarımcısı, sanatçısı veya geliştiricisi olma yolları.',
    category: 'tech',
    publishedAt: '2026-05-20',
    readTime: '28',
    content: `
      <h2>Kendi Dünyanızı Tasarlayın</h2>
      <p>Yaratıcı bir zihinle teknik beceriyi birleştirenler için oyun sektörü, yıllık milyarlarca dolarlık hacmiyle devasa fırsatlar sunuyor.</p>
    `
  },
  {
    id: '51',
    slug: 'kariyer-donusumunde-golge-egitim-teknigi',
    title: 'Kariyer Dönüşümünde "Gölge Eğitim" (Shadowing) Tekniği',
    excerpt: 'Hayalinizdeki işi yapan birinin bir gününü gözlemleyerek sektörü yerinde tanıyın. Nasıl mentorluk istenir?',
    category: 'transformation',
    publishedAt: '2026-05-21',
    readTime: '15',
    content: `
      <h2>Görmek, İnanmaktır</h2>
      <p>Shadowing, bir profesyonelin günlük rutinini sessizce takip etmektir. Kitaplarda yazmayan sahadaki bilgiyi edinmenin en hızlı yoludur.</p>
    `
  },
  {
    id: '52',
    slug: 'soft-skills-vs-hard-skills-2026-denge',
    title: 'Soft Skills vs. Hard Skills: 2026\'da Kariyer Dengesi Nerede?',
    excerpt: 'Teknik beceriniz sizi mülakata sokar, ancak iletişim beceriniz size işi kazandırır. Hangi oran ideal?',
    category: 'development',
    publishedAt: '2026-05-22',
    readTime: '20',
    content: `
      <h2>İnsani Yetenekler Algoritmaya Karşı</h2>
      <p>Algoritmalar kod yazabilir, ancak bir müşteriyi ikna edemez veya bir ekibe liderlik edip motivasyon sağlayamaz.</p>
    `
  },
  {
    id: '53',
    slug: 'is-yerinde-kusaklar-arasi-iletisim-dengesi',
    title: 'İş Yerinde Kuşaklar Arası İletişim: Gen Z ve Boomer Dengesi',
    excerpt: 'Farklı beklentiler, aynı hedefler. Yaş farklarını kariyere bir avantaja dönüştürmenin yolları.',
    category: 'psychology',
    publishedAt: '2026-05-23',
    readTime: '24',
    content: `
      <h2>Hibrit Kültür</h2>
      <p>Tecrübenin bilgeliği ile gençliğin dijital merakını birleştirebilen ekipler, 2026'nın en başarılı organizasyonları olacak.</p>
    `
  },
  {
    id: '54',
    slug: 'proje-yonetimi-metodolojileri-karsilastirma',
    title: 'Proje Yönetimi Metodolojileri: Agile, Scrum ve Kanban Arasındaki Farklar',
    excerpt: 'İş akışınızı optimize edin. Hangi sektörde hangi yöntem daha verimli çalışır? Sertifika önerileri.',
    category: 'tech',
    publishedAt: '2026-05-24',
    readTime: '19',
    content: `
      <h2>Kaostan Düzen Yaratmak</h2>
      <p>Agile bir felsefedir, Scrum ise onun uygulanma biçimidir. Kanban ise sürekli akış demektir. Doğru aracı seçmek zaman kazandırır.</p>
    `
  },
  {
    id: '55',
    slug: 'kendi-seonuzu-yapin-google-ilk-sira',
    title: 'Kendi SEO\'nuzu Yapın: İsminizi Google\'da İlk Sıraya Taşıyın',
    excerpt: 'İşverenler sizi Google-da arattığında ne görüyorlar? Dijital itibar yönetimi ve anahtar kelime stratejileri.',
    category: 'networking',
    publishedAt: '2026-05-25',
    readTime: '17',
    content: `
      <h2>İlk Sayfa Sizin Vitrininizdir</h2>
      <p>Kişisel web siteniz, LinkedIn profiliniz ve Medium falan gibi platformları optimize ederek dijital izinizi kontrol altına alabilirisiniz.</p>
    `
  },
  {
    id: '56',
    slug: 'podcast-ureterek-otorite-insasi-rehberi',
    title: 'Podcast Üreterek Otorite İnşası: Dinleyicileri Müşteriye Dönüştürün',
    excerpt: 'Mikrofonun gücü: Sesli içerik ile niş bir kitleye ulaşmanın ve kariyerinizi globalleştirmenin yolları.',
    category: 'networking',
    publishedAt: '2026-05-26',
    readTime: '26',
    content: `
      <h2>Sesiniz Markanızdır</h2>
      <p>Podcast, insanlarla 30-45 dakika kesintisiz bağ kurabileceğiniz yegane mecradır. Bu samimiyet güveni, güven ise iş birliğini getirir.</p>
    `
  },
  {
    id: '57',
    slug: 'sosyal-medya-detoksu-kariyer-verimlilik',
    title: 'Sosyal Medya Detoksu: Kariyer Verimliliğinizi Nasıl Artırır?',
    excerpt: 'Sürekli bildirimler arasında kaybolmayın. Derin çalışma (Deep Work) için dijital kısıtlama taktikleri.',
    category: 'lifestyle',
    publishedAt: '2026-05-27',
    readTime: '14',
    content: `
      <h2>Dikkat Ekonomisi</h2>
      <p>En büyük sermayeniz paranız değil, dikkatinizdir. Sosyal medya uygulamalarını kısıtlamak, zihinsel kapasitenizi işinize yönlendirmenizi sağlar.</p>
    `
  },
  {
    id: '58',
    slug: 'gelecegin-ofisleri-metaverse-vr-toplantilar',
    title: 'Geleceğin Ofisleri: Metaverse ve VR Toplantıların Kariyerimize Etkisi',
    excerpt: 'Fiziksel mesafe artık engel değil. Sanal ofislerde çalışmaya hazır mısınız? Yaklaşan yeni çalışma düzeni.',
    category: 'tech',
    publishedAt: '2026-05-28',
    readTime: '21',
    content: `
      <h2>3 Boyutlu İş Dünyası</h2>
      <p>Avatarınızla katıldığınız toplantılar, uzaktan çalışmadaki 'yalnızlık' hissini azaltırken iş birliğini artırabilir.</p>
    `
  },
  {
    id: '59',
    slug: 'kisisel-finans-yonetimi-freelancer-tasarruf',
    title: 'Kişisel Finans Yönetimi: Freelancer\'lar İçin Vergi ve Tasarruf',
    excerpt: 'Sabit maaşınız yoksa bütçenizi nasıl yönetirsiniz? Acil durum fonu ve emeklilik planlaması.',
    category: 'salary',
    publishedAt: '2026-05-29',
    readTime: '23',
    content: `
      <h2>Finansal Huzur</h2>
      <p>Bir freelancer için en önemli kural, kazancının tamamını harcamamaktır. Gelirin bir kısmını doğrudan vergi ve gelecek yatırımı için ayırmalısınız.</p>
    `
  },
  {
    id: '60',
    slug: 'kariyerde-ikinci-perde-45-yas-ustu-sektor-degisimi',
    title: 'Kariyerinizde "İkinci Perde": 45 Yaş Üstü Sektör Değişikliği',
    excerpt: 'Yaş sadece bir sayıdır. Onlarca yıllık tecrübeyi modern teknolojiyle birleştirerek yeniden doğmanın yolları.',
    category: 'transformation',
    publishedAt: '2026-05-30',
    readTime: '27',
    content: `
      <h2>Tecrübenin Gençliği</h2>
      <p>45 yaşından sonra yazılım öğrenen veya danışmanlığa geçen binlerce başarılı örnek var. Önemli olan 'öğrenmeyi öğrenmek'tir.</p>
    `
  },
  {
    id: '61',
    slug: 'is-yerinde-mobbing-durdurma-rehberi',
    title: 'İş Yerinde Mobbing: Sessiz Çığlığı Durdurma ve Haklarınızı Koruma Rehberi',
    excerpt: 'Psikolojik tacizle nasıl başa çıkılır? Belgeleme, yasal haklar ve akıl sağlığınızı koruma yolları.',
    category: 'psychology',
    publishedAt: '2026-05-31',
    readTime: '25',
    content: `
      <h2>Mobbing Bir Suçtur</h2>
      <p>Sistematik olarak dışlanma, aşağılanma veya aşırı iş yükü altında ezilme durumları mobbing belirtisidir. İlk adım, bu durumu kabullenmek ve kanıt toplamaktır.</p>
    `
  },
  {
    id: '62',
    slug: 'duygusal-zeka-liderlikte-onemi',
    title: 'Duygusal Zeka (EQ): Liderlikte EQ Neden IQ\'dan Daha Önemli?',
    excerpt: 'Empati kurabilen yöneticiler ekiplerini nasıl daha ileriye taşır? EQ geliştirme teknikleri.',
    category: 'management',
    publishedAt: '2026-06-01',
    readTime: '18',
    content: `
      <h2>İnsan Odaklı Liderlik</h2>
      <p>Makinelerin rasyonel kararlar alabildiği bir dünyada, liderlerin fark yaratacağı alan duygusal derinliktir. Ekibinizin hislerini anlamak, bağlılığı %40 artırır.</p>
    `
  },
  {
    id: '63',
    slug: 'ofiste-catisma-yonetimi-zor-kisiler',
    title: 'Çatışma Yönetimi: Ofiste Zor Kişilerle Çalışma Sanatı',
    excerpt: 'Zor karakterlerle profesyonel sınırları koruyarak nasıl iş üretilir? Sakin kalma ve çözüm üretme taktikleri.',
    category: 'psychology',
    publishedAt: '2026-06-02',
    readTime: '22',
    content: `
      <h2>Kişiselleştirmeyin</h2>
      <p>Ofis çatışmalarının çoğu yanlış iletişimden kaynaklanır. Soruna değil, çözüme odaklanmak gerginliği azaltır.</p>
    `
  },
  {
    id: '64',
    slug: 'networking-vs-netweaving-farki',
    title: 'Kariyerde "Networking" vs. "Netweaving": Hangisi Kalıcı?',
    excerpt: 'Sadece kartvizit toplamak yetmez. Karşılıklı değer yaratmaya dayalı Netweaving felsefesiyle tanışın.',
    category: 'networking',
    publishedAt: '2026-06-03',
    readTime: '15',
    content: `
      <h2>Yardım Etmek İçin Tanışmak</h2>
      <p>Networking "başkası benim için ne yapabilir?" sorusuna odaklanırken, Netweaving "ben başkası için ne yapabilirim?" diye sorar. Bu, kalıcı bir bağ kurar.</p>
    `
  },
  {
    id: '65',
    slug: 'geri-bildirim-verme-ve-alma-sanati',
    title: 'Geri Bildirim (Feedback) Verme ve Alma: Gelişim Odaklı İletişim',
    excerpt: 'Eleştiriyi bir saldırı olarak değil, bir hediye olarak görün. Yapıcı geri bildirim vermenin sandviç tekniği.',
    category: 'management',
    publishedAt: '2026-06-04',
    readTime: '19',
    content: `
      <h2>Gelişim Döngüsü</h2>
      <p>Doğru geri bildirim, kör noktalarımızı görmemizi sağlar. Alırken savunmaya geçmemek, verirken ise kişiliği değil davranışı hedeflemek gerekir.</p>
    `
  },
  {
    id: '66',
    slug: 'is-yerinde-ergonomi-ev-ofis-rehberi',
    title: 'İş Yerinde Ergonomi: Ev Ofisinizi Bir Üretim Merkezine Dönüştürün',
    excerpt: 'Bel ağrılarından kurtulun ve odaklanmayı artırın. Ekran yüksekliği, sandalye seçimi ve aydınlatma ipuçları.',
    category: 'lifestyle',
    publishedAt: '2026-06-05',
    readTime: '14',
    content: `
      <h2>Vücudunuz En Önemli Aracınızdır</h2>
      <p>2026'da hibrit çalışmanın yaygınlaşmasıyla, evdeki konforunuz doğrudan performansınızı etkiliyor. Basit bir yükseltici bile boyun sağlığınızı koruyabilir.</p>
    `
  },
  {
    id: '67',
    slug: 'zihin-haritalama-ile-kariyer-planlama',
    title: 'Zihin Haritalama (Mind Mapping) ile Kariyer Planlama',
    excerpt: 'Gelecek 5 yılınızı görselleştirin. Potansiyelinizi keşfetmek için yaratıcı bir not alma ve strateji yöntemi.',
    category: 'development',
    publishedAt: '2026-06-06',
    readTime: '20',
    content: `
      <h2>Lineer Olmayan Düşünce</h2>
      <p>Kariyer bir merdiven değil, genişleyen bir ağdır. Zihin haritaları, farklı ilgi alanlarınızın nerede kesiştiğini görmenizi sağlar.</p>
    `
  },
  {
    id: '68',
    slug: 'podcast-uretimi-ekipman-rehberi-profesyonel',
    title: 'Podcast Üretimi İçin Ekipman Rehberi: Profesyonel Sesin Sırrı',
    excerpt: 'Kendi yayınınızı başlatmak için minimum bütçeyle maksimum kalite. Mikrofon, kulaklık ve yazılım önerileri.',
    category: 'tech',
    publishedAt: '2026-06-07',
    readTime: '26',
    content: `
      <h2>Kayıt Almak Artık Çok Kolay</h2>
      <p>Podcasting, markanızı güçlendirmenin en etkili sesli yoludur. Başlamak için binlerce dolara gerek yok, doğru bir USB mikrofon yeterli.</p>
    `
  },
  {
    id: '69',
    slug: 'linkedin-portfoy-otomasyonu-zapier-ifttt',
    title: 'LinkedIn Portföyünüzü Otomatize Edin: IFTTT ve Zapier Kullanımı',
    excerpt: 'Siz uyurken markanız büyüsün. Blog yazılarınızı ve projelerinizi LinkedIn-de otomatik paylaşma düzenekleri.',
    category: 'networking',
    publishedAt: '2026-06-08',
    readTime: '17',
    content: `
      <h2>Akıllı Networking</h2>
      <p>İçerik üretimini otomatize ederek, vaktinizin çoğunu gerçek insanlarla sohbet etmeye ve bağ kurmaya ayırabilirsiniz.</p>
    `
  },
  {
    id: '70',
    slug: 'yeni-mezunlar-icin-ilk-90-gun-stratejisi',
    title: 'Yeni Mezunlar İçin İlk 90 Gün: Şirkette Kalıcı İz Bırakın',
    excerpt: 'Okuldan iş hayatına yumuşak bir geçiş. İlk izlenim, öğrenme hızı ve inisiyatif alma dengesi.',
    category: 'youth',
    publishedAt: '2026-06-09',
    readTime: '23',
    content: `
      <h2>Dinle, Gözlemle, Sor</h2>
      <p>İlk ayınızda her şeyi bildiğinizi kanıtlamaya çalışmayın. En iyi stajyere veya kıdemliye kimin neyi nasıl yaptığını sorun.</p>
    `
  },
  {
    id: '71',
    slug: 'global-sirketlerde-kulturel-zeka-cq',
    title: 'Global Şirketlerde Kültürel Zeka (CQ): Farklılıkları Avantaja Çevirin',
    excerpt: 'Çok uluslu ekiplerde neden bazıları daha başarılı? CQ geliştirme ve global iletişim becerileri.',
    category: 'global',
    publishedAt: '2026-06-10',
    readTime: '21',
    content: `
      <h2>Sınırları Aşan Anlayış</h2>
      <p>Dünya artık tek bir pazar. Farklı kültürlerin 'hayır' deme biçimlerini anlamak, krizleri önceden sezmenizi sağlar.</p>
    `
  },
  {
    id: '72',
    slug: 'is-arayisinda-gizlilik-mevcut-is-riski',
    title: 'İş Arayışında Gizlilik: Mevcut İşinizi Riski Atmadan İş Bulma',
    excerpt: 'Mevcut şirketiniz duymadan nasıl mülakatlara girersiniz? LinkedIn gizlilik ayarları ve profesyonel sınırlar.',
    category: 'job_search',
    publishedAt: '2026-06-11',
    readTime: '15',
    content: `
      <h2>Gölge Arayış</h2>
      <p>Mevcut işinizden kovulmadan yeni bir iş bulmak bir denge sanatıdır. Mülakatlarınızı mesai saatleri dışına veya öğle aralarına planlayın.</p>
    `
  },
  {
    id: '73',
    slug: 'mulakatta-zayif-yonleri-anlatma-stratejisi',
    title: 'Mülakatta Zayıf Yönleri Anlatma: "Dürüstlük" Tuzağına Düşmeyin',
    excerpt: '"Zayıf yanınız nedir?" sorusuna nasıl profesyonel bir gelişim hikayesi olarak cevap verilir?',
    category: 'interview',
    publishedAt: '2026-06-12',
    readTime: '13',
    content: `
      <h2>Gelişim Bilinci</h2>
      <p>Zayıf yanınızı söylerken, bu yanınızı düzeltmek için ne tür bir eğitim aldığınızı veya hangi adımları attığınızı mutlaka ekleyin.</p>
    `
  },
  {
    id: '74',
    slug: 'kariyerde-pivot-yapmak-radikal-kararlar',
    title: 'Kariyerde "Pivot" Yapmak: Radikal Kararların Başarı Hikayeleri',
    excerpt: 'Bankacılıktan aşçılığa, tıptan yazılıma. Sektör değiştirirken yapılan hatalar ve kazanılan zaferler.',
    category: 'transformation',
    publishedAt: '2026-06-13',
    readTime: '27',
    content: `
      <h2>Yolu Yeniden Çizmek</h2>
      <p>Pivot yapmak bir başarısızlık değil, bir büyüme stratejisidir. Deneyimlerinizi yeni sektöre nasıl aktaracağınızı bilmek yeterlidir.</p>
    `
  },
  {
    id: '75',
    slug: 'is-yerinde-zaman-yonetimi-pomodoro-bloklama',
    title: 'İş Yerinde Zaman Yönetimi: Pomodoro ve Zaman Bloklama Teknikleri',
    excerpt: 'Gündelik işlerde boğulmayın. Gerçekten üretken olmanızı sağlayacak modern disiplin metotları.',
    category: 'lifestyle',
    publishedAt: '2026-06-14',
    readTime: '16',
    content: `
      <h2>Derin Çalışma</h2>
      <p>Zaman bloklama, takviminizi kimsenin sizi bölemeyeceği şekilde yönetmenizi sağlar. 'Focus' saatleri üretkenliğin kalbidir.</p>
    `
  },
  {
    id: '76',
    slug: 'uzaktan-calisirken-ekip-ruhu-sanal-kahve',
    title: 'Uzaktan Çalışırken Ekip Ruhu: Sanal Kahve Molaları ve Oyunlar',
    excerpt: 'Ekranların arkasındaki insanı unutmayın. Uzaktan çalışmada aidiyet hissini artıracak dijital etkinlik fikirleri.',
    category: 'lifestyle',
    publishedAt: '2026-06-15',
    readTime: '12',
    content: `
      <h2>Görünmez Bağlar</h2>
      <p>Ekip ruhu sadece iş konuşmakla oluşmaz. 'Slack' üzerinden yapılan kahve eşleşmeleri (Donut botu gibi) samimiyeti artırır.</p>
    `
  },
  {
    id: '77',
    slug: 'profesyonel-yazisma-dili-e-posta-hatalari',
    title: 'Profesyonel Yazışma Dili: E-postalarda "Görünmez" Kaba Hatalar',
    excerpt: 'Ünlem işaretleri, büyük harfler ve yanlış hitaplar: Dijital iletişimde itibarınızı sarsabilecek 10 hata.',
    category: 'networking',
    publishedAt: '2026-06-16',
    readTime: '14',
    content: `
      <h2>Kelime Seçimi Önemlidir</h2>
      <p>Bir e-postanın tonu, okuyucunun o anki ruh haline göre değişebilir. Bu yüzden mümkün olduğunca nötr ve net kalmak en iyisidir.</p>
    `
  },
  {
    id: '78',
    slug: 'kariyeriniz-icin-bir-yonetim-kurulu-kurun',
    title: 'Kariyeriniz İçin Bir "Yönetim Kurulu" Kurun: Kimler Olmalı?',
    excerpt: 'Sadece bir mentor yetmez. Sizi destekleyen, eleştiren ve network açan bir "Kişisel Danışma Grubu" oluşturun.',
    category: 'development',
    publishedAt: '2026-06-17',
    readTime: '22',
    content: `
      <h2>Güç Birliği</h2>
      <p>Danışma kurulunuzda bir hayalperest, bir gerçekçi ve bir de 'kritik eleştiren' kişi olması kararlarınızı sağlamlaştırır.</p>
    `
  },
  {
    id: '79',
    slug: 'is-yerinde-psikolojik-guvenlik-nedir',
    title: 'İş Yerinde Psikolojik Güvenlik (Psychological Safety) Nedir?',
    excerpt: 'Hata yapmaktan korkmayan ekipler neden daha inovatif? Güven temelinde yükselen modern iş kültürü.',
    category: 'psychology',
    publishedAt: '2026-06-18',
    readTime: '20',
    content: `
      <h2>Korku Kültürünün Sonu</h2>
      <p>Çalışanların fikirlerini korkmadan söyleyebildiği bir ortam, en akıllı yapay zekadan daha verimlidir.</p>
    `
  },
  {
    id: '80',
    slug: 'gelecegin-sehirleri-uzaktan-calisma-lokasyon',
    title: 'Geleceğin Şehirleri: Uzaktan Çalışma ile Değişen Yaşam Lokasyonları',
    excerpt: 'Büyük şehirlerin çekiciliği azalıyor mu? Doğa ile iç içe ama global işler yaparak yaşama stratejileri.',
    category: 'lifestyle',
    publishedAt: '2026-06-19',
    readTime: '19',
    content: `
      <h2>Dijital Köyler</h2>
      <p>2026'da "nerede yaşadığınız" değil "ne ürettiğiniz" önemli hale geldi. Küçük kasabaların yüksek internet hızıyla birleşmesi yeni bir göç dalgası yarattı.</p>
    `
  },
  {
    id: '81',
    slug: 'yapay-zeka-icerik-uretimi-linkedin-otorite',
    title: 'Yapay Zeka ile İçerik Üretimi: LinkedIn\'de Otorite Olmanın En Hızlı Yolu',
    excerpt: 'Kendi sesinizi kaybetmeden AI araçlarıyla nasıl tutarlı içerik üretirsiniz? Algoritmaları besleme stratejileri.',
    category: 'tech',
    publishedAt: '2026-06-20',
    readTime: '24',
    content: `
      <h2>Yaratıcılığı Ölçeklendirmek</h2>
      <p>AI, fikirlerinizi yapılandırmanıza yardımcı olur. Ancak 'insan' dokunuşu, yani yaşanmış tecrübe ve özgün bakış açısı hala en büyük değerdir.</p>
    `
  },
  {
    id: '82',
    slug: 'no-code-entrepreneurship-kodsuz-girisimcilik',
    title: 'Kod Yazmadan Girişimcilik (No-Code Entrepreneurship)',
    excerpt: 'Bir fikri ürüne dönüştürmek için artık yazılımcı beklemenize gerek yok. No-code araçlarla MVP çıkarma rehberi.',
    category: 'tech',
    publishedAt: '2026-06-21',
    readTime: '20',
    content: `
      <h2>Fikirlerin Demokratikleşmesi</h2>
      <p>No-code, teknik bariyerleri yıkarak herkesin 'inşa etmesini' sağlar. 2026'nın en başarılı startup'larının çoğu işe no-code araçlarla başladı.</p>
    `
  },
  {
    id: '83',
    slug: 'siber-guvenlik-sertifika-yol-haritasi',
    title: 'Siber Güvenlikte Sertifika Yol Haritası: CEH vs. OSCP',
    excerpt: 'Hangi sertifika hangi kapıyı açar? Başlangıç seviyesinden uzmanlığa siber güvenlik eğitim planı.',
    category: 'tech',
    publishedAt: '2026-06-22',
    readTime: '28',
    content: `
      <h2>Teoriden Pratiğe</h2>
      <p>Sertifikalar iş alımında bir filtre görevi görür. OSCP gibi uygulamalı sınavlar, gerçek yeteneğinizi kanıtlamanın en prestijli yoludur.</p>
    `
  },
  {
    id: '84',
    slug: 'rpa-ve-ik-gelecegi-otomasyon',
    title: 'Robotik Süreç Otomasyonu (RPA) ve İK\'nın Geleceği',
    excerpt: 'Tekrar eden işleri robotlara devredin. İnsan kaynaklarında zaman kazandıran otomasyon çözümleri.',
    category: 'transformation',
    publishedAt: '2026-06-23',
    readTime: '18',
    content: `
      <h2>Daha İnsani Bir İK</h2>
      <p>RPA, bordro ve evrak gibi rutin işleri yaparak İK profesyonellerine çalışan gelişimi ve strateji için alan açar.</p>
    `
  },
  {
    id: '85',
    slug: 'blokzincir-kariyerleri-sadece-kripto-degil',
    title: 'Blokzincir (Blockchain) Kariyerleri: Sadece Kripto Değil',
    excerpt: 'Akıllı sözleşmelerden arz zinciri yönetimine: Blokzincir teknolojisinin kurumsal dünyadaki gerçek iş fırsatları.',
    category: 'tech',
    publishedAt: '2026-06-24',
    readTime: '25',
    content: `
      <h2>Güvenin Teknolojisi</h2>
      <p>Blockchain sadece finansal bir araç değildir; verinin şeffaf ve değiştirilemez olduğu her yerde devrim yaratır.</p>
    `
  },
  {
    id: '86',
    slug: 'web3-ve-dao-gelecegin-organizasyon-yapisi',
    title: 'Web 3.0 ve Decentralized Autonomous Organizations (DAO)',
    excerpt: 'Hiyerarşisiz yönetim mümkün mü? DAO-larda çalışmak ve merkeziyetsiz bir kariyer inşa etmek.',
    category: 'transformation',
    publishedAt: '2026-06-25',
    readTime: '22',
    content: `
      <h2>Topluluk Odaklılık</h2>
      <p>DAO'lar, çalışanların aynı zamanda paydaş olduğu yapılardır. 2026'da bu model freelance dünyasını dönüştürebilir.</p>
    `
  },
  {
    id: '87',
    slug: 'veri-etigi-uzmanligi-gelecegin-rolu',
    title: 'Veri Etiği Uzmanlığı: Geleceğin En Önemli Hukuk ve Teknoloji Rolü',
    excerpt: 'Yapay zeka ne kadar adil? Veri kullanımı ve algoritma şeffaflığı konularında uzmanlaşmak.',
    category: 'tech',
    publishedAt: '2026-06-26',
    readTime: '20',
    content: `
      <h2>Algoritmaların Vicdanı</h2>
      <p>Veri etiği uzmanları, makinelerin insanları manipüle etmesini önlemek amacıyla geliştirilen yeni nesil denetçilerdir.</p>
    `
  },
  {
    id: '88',
    slug: 'enerji-sektorunde-kariyer-yenilenebilir-enerji',
    title: 'Enerji Sektöründe Kariyer: Yenilenebilir Enerji Mühendisliği',
    excerpt: 'Fosil yakıtlardan çıkışta sizin rolünüz ne? Güneş, rüzgar ve hidrojen enerjisinde iş imkanları.',
    category: 'global',
    publishedAt: '2026-06-27',
    readTime: '23',
    content: `
      <h2>Sürdürülebilir Güç</h2>
      <p>Enerji dönüşümü, önümüzdeki 20 yılın en büyük yatırım alanı. Bu alanda uzmanlaşmak global bir iş garantisi demektir.</p>
    `
  },
  {
    id: '89',
    slug: 'uzay-ekonomisi-gelecek-meslekler',
    title: 'Uzay Ekonomisi: Gelecek 20 Yılda Hangi Meslekler Doğacak?',
    excerpt: 'Sadece astronotlar için değil: Uzay hukuku, madenciliği ve turizmi için kariyer hazırlığı.',
    category: 'tech',
    publishedAt: '2026-06-28',
    readTime: '30',
    content: `
      <h2>Yıldızlara Ulaşmak</h2>
      <p>Özel uzay şirketlerinin yükselişiyle, uzay artık sadece devletlerin değil, bireysel kariyerlerin de hedefi haline geldi.</p>
    `
  },
  {
    id: '90',
    slug: 'saglik-teknolojilerinde-healthtech-kariyer',
    title: 'Sağlık Teknolojilerinde (HealthTech) Kariyer Fırsatları',
    excerpt: 'Giyilebilir cihazlar ve tele-tıp çözümleri. Yazılım ile insan ömrünü uzatan projelere katılın.',
    category: 'transformation',
    publishedAt: '2026-06-29',
    readTime: '19',
    content: `
      <h2>Dijital Şifa</h2>
      <p>HealthTech, tıbbi bilgiyi verinin hızıyla birleştirir. Bu alanda çalışmak hem profesyonel hem de manevi tatmin sağlar.</p>
    `
  },
  {
    id: '91',
    slug: 'akademiden-sektore-gecis-stratejileri',
    title: 'Akademiden Sektöre Geçiş: Teoriden Pratiğe Başarı Rehberi',
    excerpt: 'Doktora unvanınızı iş dünyasında nasıl bir güce dönüştürürsünüz? Dil ve yaklaşım farklarını aşmak.',
    category: 'transformation',
    publishedAt: '2026-06-30',
    readTime: '21',
    content: `
      <h2>Bilginin Ticarileşmesi</h2>
      <p>Akademik derinlik, doğru pazar bilgisiyle birleştiğinde rakipsiz bir stratejik güç yaratır.</p>
    `
  },
  {
    id: '92',
    slug: 'spor-ve-kariyer-basarisi-disiplin',
    title: 'Spor ve Kariyer Başarısı: Disiplinin İş Hayatına Yansıması',
    excerpt: 'Dayanıklılık, takım ruhu ve rekabet: Sporcuların iş hayatında neden daha hızlı yükseldiğinin sırları.',
    category: 'lifestyle',
    publishedAt: '2026-07-01',
    readTime: '16',
    content: `
      <h2>Mental Dayanıklılık</h2>
      <p>Zor bir antrenmanı bitirebilen zihin, karmaşık bir projeyi de başarıyla tamamlayacak disipline sahiptir.</p>
    `
  },
  {
    id: '93',
    slug: 'sanatcilarin-dijital-donusumu-nft-ve-otesi',
    title: 'Sanatçıların Dijital Dönüşümü: NFT ve Ötesinde Yeni Bir Kariyer',
    excerpt: 'Geleneksel sanattan dijital varlık üretimine. Sanatçılar için telif ve mülkiyetin yeni dünyası.',
    category: 'tech',
    publishedAt: '2026-07-02',
    readTime: '22',
    content: `
      <h2>Dijital Tuval</h2>
      <p>Sanat artık fiziksel sınırların ötesinde. Blockchain, sanatçıların eserleri üzerindeki kontrolünü yeniden kazanmasını sağlıyor.</p>
    `
  },
  {
    id: '94',
    slug: 'kamu-sektorunde-dijital-donusum-uzmanligi',
    title: 'Kamu Sektöründe Dijital Dönüşüm Uzmanlığı',
    excerpt: 'Bürokrasiyi teknolojiyle aşmak. Devlet kurumlarında modern yazılım ve süreç yönetimi.',
    category: 'transformation',
    publishedAt: '2026-07-03',
    readTime: '20',
    content: `
      <h2>Verimli Devlet</h2>
      <p>Vatandaş hizmetlerinin dijitalleşmesi, kamu çalışanları için devasa bir inovasyon alanı sunuyor.</p>
    `
  },
  {
    id: '95',
    slug: 'gelecegin-egitimcisi-online-kurs-rehberi',
    title: 'Geleceğin Eğitimcisi: Kendi Online Kurs ve Akademini Kurma Rehberi',
    excerpt: 'Bilgi en değerli üründür. Kendi eğitim platformunuzu kurarak pasif gelir elde etme stratejileri.',
    category: 'development',
    publishedAt: '2026-07-04',
    readTime: '26',
    content: `
      <h2>Bilgi Paylaştıkça Artar</h2>
      <p>Uzman olduğunuz bir alanı müfredata dökmek, sizin için global bir itibar ve gelir kaynağı olabilir.</p>
    `
  },
  {
    id: '96',
    slug: 'psikologlar-icin-dijital-kariyer-yollari',
    title: 'Psikologlar İçin Dijital Kariyer Yolları: Online Terapi ve Uygulama Tasarımı',
    excerpt: 'Klinikten teknoloji şirketlerine. Zihin sağlığı uygulamalarında uzmanlık ve yeni roller.',
    category: 'psychology',
    publishedAt: '2026-07-05',
    readTime: '19',
    content: `
      <h2>Dijital Terapi</h2>
      <p>Teknoloji ve psikolojinin birleşimi, milyonlarca insanın akıl sağlığına dokunabilen global ürünlerin kapısını açıyor.</p>
    `
  },
  {
    id: '97',
    slug: 'mimarlikta-dijital-ikiz-digital-twin-teknolojisi',
    title: 'Mimarlıkta Dijital İkiz (Digital Twin) Teknolojisi',
    excerpt: 'Binaların canlı verisiyle tasarım yapmak. Sürdürülebilir şehirler için geleceğin mimari vizyonu.',
    category: 'tech',
    publishedAt: '2026-07-06',
    readTime: '21',
    content: `
      <h2>Yaşayan Tasarımlar</h2>
      <p>Dijital ikizler, bir binanın yapımından yıkımına kadar her aşamasını simüle ederek verimliliği maksimize eder.</p>
    `
  },
  {
    id: '98',
    slug: 'gastronomide-kariyer-foodtech-ve-bulut-mutfaklar',
    title: 'Gastronomide Kariyer: FoodTech ve Bulut Mutfaklar',
    excerpt: 'Lezzetin teknoloji ile buluştuğu nokta. Yeni nesil gıda girişimciliği ve dijital mutfak yönetimi.',
    category: 'transformation',
    publishedAt: '2026-07-07',
    readTime: '18',
    content: `
      <h2>Geleceğin Sofrası</h2>
      <p>Gıda israfının önlenmesinden kişiselleştirilmiş beslenmeye kadar FoodTech her şeyi değiştiriyor.</p>
    `
  },
  {
    id: '99',
    slug: 'sosyal-girisimcilik-kar-ve-fayda',
    title: 'Sosyal Girişimcilik: Kar ve Sosyal Faydayı Birleştirmeyi Öğrenin',
    excerpt: 'Sadece para kazanmak yetmez. Dünyanın sorunlarına çözüm üretirken sürdürülebilir bir iş kurmak.',
    category: 'development',
    publishedAt: '2026-07-08',
    readTime: '24',
    content: `
      <h2>Anlamlı Kariyer</h2>
      <p>Sosyal girişimciler, kapitalizmin araçlarını kullanarak toplumsal sorunları çözen modern kahramanlardır.</p>
    `
  },
  {
    id: '100',
    slug: 'kartvizid-ile-kariyer-yolculugu-2026-otesi',
    title: 'Kartvizid ile Kariyer Yolculuğu: 2026 ve Ötesine Bakış',
    excerpt: 'Platformumuzun vizyonu: Geleceğin iş dünyasında nasıl bir yeriniz olacak? Birlikte büyüyoruz.',
    category: 'tech',
    publishedAt: '2026-07-09',
    readTime: '35',
    content: `
      <h2>Sonuç: Gelecek Sizinle Başlar</h2>
      <p>Bu 100 makale, kariyerinizde bir pusula olması için hazırlandı. Kartvizid olarak biz sadece bir araç sunuyoruz, o aracı bir şahesere dönüştürecek olan sizin gayretinizdir.</p>
    `
  }
];

const ARTICLE_TRANSLATIONS: Record<string, Record<string, Partial<Article>>> = {
  en: {
    '1': {
      title: 'Effective CV Writing Guide 2026: Get into the top 5%',
      excerpt: 'Professional CV strategies that pass ATS systems and impress recruiters in the first 6 seconds.',
      content: `
        <h2>Intro to CV Writing in 2026: Writing for Algorithms and Humans</h2>
        <p>In the modern business world, your CV is no longer just a piece of paper, but your first 'hello' in the digital world. In 2026, the success of a CV depends on both passing AI-based Applicant Tracking Systems (ATS) and grabbing a human's attention.</p>
        <h3>1. Passing ATS Systems with 100% Success</h3>
        <p>Most companies now use bots to read applications in the first stage. These bots can get stuck on complex tables, images, or unusual fonts.</p>
      `
    },
    '2': {
      title: 'Interview Techniques: Winning Answers to the Hardest Questions',
      excerpt: 'Understand the recruiter\'s intention: Decipher hidden meanings and prove your expertise in every question.',
      content: `<h2>Psychology of the Interview: Why Do They Ask?</h2><p>Interviewers test not only your technical knowledge but also how you react under pressure.</p>`
    },
    '3': {
      title: 'Personal Branding: Ways to Build Authority in Your Field',
      excerpt: 'Manage your own brand in the digital world and let jobs come to you.',
      content: `<h2>What is Personal Branding?</h2><p>Personal brand is everything people say about you when you are not in the room.</p>`
    },
    '4': {
        title: 'What is a Digital Business Card? Why a Necessity for Modern Professionals?',
        excerpt: 'The way we network has changed. Discover the benefits of permanent connections with Kartvizid.',
        content: `<h2>The End of Physical Business Cards</h2><p>A digital business card is a modern tool that enters the phone book in seconds.</p>`
    },
    '5': {
        title: 'Salary Negotiation Strategies: Prove Your Value and Get What You Deserve',
        excerpt: 'How to negotiate salary in face-to-face meetings or contracting phase? Professional tactics.',
        content: `<h2>Salary Negotiation is an Agreement</h2><p>With the right strategy, it is in your hands to get the salary you deserve.</p>`
    }
  },
  de: {
    '1': {
      title: 'Leitfaden für effektive Lebensläufe 2026: Gehören Sie zu den besten 5 %',
      excerpt: 'Professionelle Strategien, die ATS-Systeme bestehen und Recruiter in 6 Sekunden beeindrucken.',
      content: `<h2>Einführung in das Schreiben von Lebensläufen im Jahr 2026</h2><p>Ihr Lebenslauf ist Ihre erste digitale Begrüßung.</p>`
    },
    '2': {
      title: 'Interview-Techniken: Gewinnende Antworten auf schwierigste Fragen',
      excerpt: 'Verstehen Sie die Absicht des Recruiters und beweisen Sie Ihre Kompetenz.',
      content: `<h2>Psychologie des Interviews</h2><p>Interviewpartner testen Ihre Belastbarkeit.</p>`
    },
    '3': {
      title: 'Personal Branding: Wege zum Aufbau von Autorität in Ihrem Bereich',
      excerpt: 'Verwalten Sie Ihre eigene Marke in der digitalen Welt.',
      content: `<h2>Was ist Personal Branding?</h2><p>Ihre persönliche Marke ist das, was man über Sie sagt, wenn Sie nicht im Raum sind.</p>`
    }
  },
  fr: {
    '1': {
      title: 'Guide de rédaction de CV efficace 2026 : Entrez dans le top 5 %',
      excerpt: 'Stratégies professionnelles pour passer les systèmes ATS et impressionner les recruteurs.',
      content: `<h2>Introduction à la rédaction de CV en 2026</h2><p>Votre CV est votre première salutation numérique.</p>`
    },
    '2': {
      title: 'Techniques d\'Entretien : Réponses Gagnantes aux Questions les Plus Difficiles',
      excerpt: 'Comprenez l\'intention du recruteur et prouvez votre expertise.',
      content: `<h2>Psychologie de l'Entretien</h2><p>Les recruteurs testent votre réaction sous pression.</p>`
    }
  },
  es: {
    '1': {
      title: 'Guía para redactar un CV eficaz 2026: Entre en el top 5%',
      excerpt: 'Estrategias profesionales para superar los sistemas ATS e impresionar a los reclutadores.',
      content: `<h2>Introducción a la redacción de CV en 2026</h2><p>Su CV es su primer saludo digital.</p>`
    },
    '2': {
      title: 'Técnicas de Entrevista: Respuestas Ganadoras a las Preguntas más Difíciles',
      excerpt: 'Comprenda la intención del reclutador y demuestre su experiencia.',
      content: `<h2>Psicología de la Entrevista</h2><p>Los entrevistadores prueban su reacción bajo presión.</p>`
    }
  },
  ar: {
    '1': {
      title: 'دليل كتابة السيرة الذاتية الفعال ٢٠٢٦: ادخل ضمن أفضل ٥٪',
      excerpt: 'استراتيجيات احترافية لتجاوز أنظمة ATS وإثارة إعجاب مسؤولي التوظيف.',
      content: `<h2>مقدمة في كتابة السيرة الذاتية عام ٢٠٢٦</h2><p>سيرتك الذاتية هي تحيتك الرقمية الأولى.</p>`
    },
    '2': {
      title: 'تقنيات المقابلة: إجابات رابحة على أصعب الأسئلة',
      excerpt: 'افهم نية مسؤول التوظيف وأثبت خبرتك في كل سؤال.',
      content: `<h2>سيكولوجية المقابلة</h2><p>يختber القائمون على المقابلة رد فعلك تحت الضغط.</p>`
    },
    '21': { title: 'The Art of the Cover Letter: 2026 Trends' },
    '22': { title: 'ATS Friendly Fonts and Layout Secrets' },
    '23': { title: 'Video Interview Software: Expert Settings' },
    '24': { title: 'Behavioral Interviews: The STAR Technique' },
    '25': { title: 'LinkedIn "Open to Work" Badge Analysis' },
    '26': { title: 'Creating a Digital Portfolio without Code' },
    '27': { title: 'Maximizing Value from Industry Events' },
    '28': { title: 'Reference Management: Professional Tips' },
    '29': { title: 'Coping with Job Search Burnout' },
    '30': { title: 'Remote Work with International Companies' },
    '31': { title: 'Technical Interview Prep for Non-Tech Roles' },
    '32': { title: 'Standing Out in Group Interviews' },
    '33': { title: 'Freelance Proposal Tactics for Success' },
    '34': { title: 'Using Your GitHub Profile as a CV' },
    '35': { title: 'The Art of Explaining Career Gaps' },
    '36': { title: 'Transitioning from Corporate to Startup' },
    '37': { title: 'Evaluating Job Offers and ESOPs' },
    '38': { title: 'Accelerate Your Career with Mentorship' },
    '39': { title: 'Post-Interview Follow-Up Templates' },
    '40': { title: 'Finding Jobs through Content Creation' },
    '41': { title: 'AI for CV Optimization: Top 5 Tools' },
    '42': { title: 'Low-Code Platforms: Career Gateway' },
    '43': { title: 'Cybersecurity Career: 2026 Critical Roles' },
    '44': { title: 'Green Collar Jobs: Sustainability Career' },
    '45': { title: 'Data Science vs. Data Analytics Comparison' },
    '46': { title: 'Are Cloud Computing Certifications Worth It?' },
    '47': { title: 'Digital Nomad Guide: Legal/Financial Prep' },
    '48': { title: 'E-commerce Expertise: Entering the Sector' },
    '49': { title: 'Career in Fintech: Future of Banking' },
    '50': { title: 'Game Development: Art and Code Career' },
    '51': { title: 'Shadowing Technique for Career Growth' },
    '52': { title: 'Soft Skills vs. Hard Skills in 2026' },
    '53': { title: 'Intergenerational Communication at Work' },
    '54': { title: 'Project Management Methodologies Compared' },
    '55': { title: 'Personal SEO: Rank Your Name on Google' },
    '56': { title: 'Building Authority through Podcasts' },
    '57': { title: 'Social Media Detox: Boosting Productivity' },
    '58': { title: 'Future Offices: Metaverse/VR Impact' },
    '59': { title: 'Financial Management for Freelancers' },
    '60': { title: 'Career Second Act: Changes After 45' },
    '61': { title: 'Mobbing at Work: Stopping the Silence' },
    '62': { title: 'Emotional Intelligence (EQ) in Leadership' },
    '63': { title: 'Conflict Management: Difficult Personalities' },
    '64': { title: 'Networking vs. Netweaving Differences' },
    '65': { title: 'Giving and Receiving Feedback' },
    '66': { title: 'Ergonomics at Work: Home Office Guide' },
    '67': { title: 'Career Planning with Mind Mapping' },
    '68': { title: 'Podcast Equipment Guide for Success' },
    '69': { title: 'Automate Your LinkedIn Portfolio' },
    '70': { title: 'First 90 Days for New Graduates' },
    '71': { title: 'Cultural Intelligence (CQ) in Global Firms' },
    '72': { title: 'Privacy in Job Search Strategy' },
    '73': { title: 'Explaining Weaknesses in Interviews' },
    '74': { title: 'The Art of Career Pivoting' },
    '75': { title: 'Time Management: Pomodoro/Blocking' },
    '76': { title: 'Team Spirit with Remote Coffee Chats' },
    '77': { title: 'Professional Writing and Email Etiquette' },
    '78': { title: 'Create a Career Advisory Board' },
    '79': { title: 'Psychological Safety in the Workplace' },
    '80': { title: 'Future Cities and Remote Locations' },
    '81': { title: 'AI Content Creation for LinkedIn Authority' },
    '82': { title: 'No-Code Entrepreneurship: Building MVP' },
    '83': { title: 'Cybersecurity Certs: CEH vs. OSCP' },
    '84': { title: 'RPA and the Future of HR Automation' },
    '85': { title: 'Blockchain Careers: Beyond Crypto' },
    '86': { title: 'Web 3.0 and DAO Organization Structure' },
    '87': { title: 'Data Ethics Specialist: Future Tech Role' },
    '88': { title: 'Renewable Energy Engineering Careers' },
    '89': { title: 'Space Economy Projections for 20 Years' },
    '90': { title: 'HealthTech Career Opportunities' },
    '91': { title: 'Academia to Industry Transition' },
    '92': { title: 'Sports Discipline and Career Success' },
    '93': { title: 'NFTs and the Digital Artist Evolution' },
    '94': { title: 'Digital Transformation in Public Sector' },
    '95': { title: 'Creating Your Online Academy Guide' },
    '96': { title: 'Digital Career Paths for Psychologists' },
    '97': { title: 'Digital Twin Technology in Architecture' },
    '98': { title: 'FoodTech and Cloud Kitchen Careers' },
    '99': { title: 'Social Entrepreneurship: Profit/Purpose' },
    '100': { title: 'Career Journey with Kartvizid: 2026+' }
  }
};

export function getLocalizedArticles(lang: string): Article[] {
  const translations = ARTICLE_TRANSLATIONS[lang] || {};
  const categories = CATEGORY_MAP[lang] || CATEGORY_MAP['tr'];
  
  return BLOG_ARTICLES_BASE.map(article => {
    const translation = translations[article.id] || {};
    return {
      ...article,
      title: translation.title || article.title,
      excerpt: translation.excerpt || article.excerpt,
      content: translation.content || article.content,
      category: categories[article.category] || article.category,
      readTime: article.readTime + (lang === 'tr' ? ' dk' : ' min')
    };
  });
}

// For backward compatibility or direct access
export const BLOG_ARTICLES = getLocalizedArticles('tr');

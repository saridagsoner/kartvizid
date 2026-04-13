
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
    'development': 'التطوير الشخصi',
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
      content: `<h2>سيكولوجية المقابلة</h2><p>يختبر القائمون على المقابلة رد فعلك تحت الضغط.</p>`
    }
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

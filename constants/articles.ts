
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
    readTime: '18 dk',
    content: `
      <h2>Modern CV Hazırlamanın Altın Kuralları: 2026 Standartları</h2>
      <p>İş dünyası hızla değişiyor ve işe alım süreçleri de bu değişime ayak uyduruyor. 2026 yılında bir CV sadece bir belge değil, sizin profesyonel markanızın yansımasıdır. Artık sadece ne yaptığınız değil, bunu nasıl sunduğunuz ve hangi araçları kullandığınız da büyük önem taşıyor.</p>
      
      <h3>1. ATS (Aday Takip Sistemleri) Dostu Olun</h3>
      <p>Büyük şirketlerin %90'ından fazlası artık özgeçmişleri ilk aşamada yapay zeka ve ATS sistemleriyle tarıyor. Bu sistemlerden geçmek için CV'nizde doğru anahtar kelimeleri kullanmalısınız. İlan metnindeki yetkinlikleri, profesyonel deneyimlerinizle harmanlayarak sunmak bu aşamada kritiktir.</p>
      <p>Kartvizid platformunun sağladığı standart ve temiz veri yapısı, profilinizin bu tür sistemler tarafından çok daha kolay anlamlandırılmasını sağlar.</p>
      
      <h3>2. Net ve Okunaklı Bir Düzen Seçin</h3>
      <p>İşe alım yöneticileri her bir CV'ye ortalama 6-10 saniye ayırır. Karmaşık ve aşırı grafiklerle dolu düzenlerden kaçının. Standart fontlar (Inter, Roboto, Open Sans gibi) ve bol beyaz alan kullanmak, bilgilerinizin daha hızlı okunmasını sağlar. Görsel hiyerarşi kurarak (Başlıklar, tarihler, maddeler) gözün en önemli bilgiyi saniyeler içinde yakalamasına yardımcı olun.</p>
      
      <h3>3. Başarı Odaklı Olun ve Verilerle Konuşun</h3>
      <p>Sadece "Şu firmada şu işi yaptım" demek yerine, "Şu projeyi yöneterek verimliliği %20 artırdım" veya "Ekipler arası iletişimi optimize ederek proje teslim süresini 2 hafta kısalttım" gibi ölçülebilir sonuçlar verin. Rakamlar, yetkinliğinizin en somut kanıtıdır.</p>
      
      <h3>4. Kartvizid İle Dijital Çağa Ayak Uydurun</h3>
      <p>Geleneksel kağıt CV'lerin yerini artık dinamik dijital profiller alıyor. Kartvizid.com üzerinden oluşturacağınız dijital kartlarınız, sürekli güncellenebilir ve etkileşimli yapısıyla sizi diğer adayların önüne geçirir. Bir QR kod ile profilinize erişim sağlamak, teknolojiye olan uyumunuzu ve vizyonunuzu gösterir.</p>
      
      <h3>5. Özet Bölümünün Gücü</h3>
      <p>CV'nizin en üstünde yer alan 3-4 cümlelik özet bölümü, sizin "elevator pitch"inizdir. Kim olduğunuzu, en büyük başarınızı ve hedefinizi buraya sığdırın. Okuyucunun makalenin devamına geçmesi için onu burada ikna etmelisiniz.</p>
      
      <h3>Sonuç</h3>
      <p>CV'niz sizinle beraber yaşayan bir dokümandır. Her yeni yetenek ve deneyim sonrası onu güncellemeyi unutmayın. Unutmayın, en iyi CV işi alan değil, mülakat kapısını açan CV'dir.</p>
    `
  },
  {
    id: '2',
    slug: 'mulakatlarda-basarili-olmanin-sirlari',
    title: 'Mülakatlarda Başarılı Olmanın Sırları: Heyecanınızı Fırsata Çevirin',
    excerpt: 'İş mülakatlarında sorulan zor sorulara nasıl cevap verilir? Beden dili nasıl olmalı? İşte profesyonellerden tavsiyeler.',
    category: 'Mülakat Teknikleri',
    publishedAt: '2026-04-03',
    readTime: '22 dk',
    content: `
      <h2>Mülakat Öncesi Hazırlık: Stratejik Bir Yaklaşım</h2>
      <p>Başarılı bir mülakatın %70'i hazırlıktır. Şirketi araştırmaktan, mülakatı yapan kişinin profesyonel geçmişini incelemeye kadar geniş bir yelpazede hazırlık yapmalısınız. Mülakat bir sorgu odası değil, iki tarafın birbirine uyumunu test ettiği bir iş toplantısıdır.</p>
      
      <h3>1. STAR Tekniğini Ustaca Kullanın</h3>
      <p>Situaton (Durum), Task (Görev), Action (Eylem) ve Result (Sonuç) kelimelerinin baş harflerinden oluşan bu teknik, zor soruları hikayeleştirerek yanıtlamanızı sağlar. "Bize bir kriz anından bahsedin" dendiğinde, bu 4 adımı izleyerek somut bir başarı hikayesi anlatın.</p>
      
      <h3>2. Beden Dilinin Görünmeyen Gücü</h3>
      <p>Göz teması kurmak, dik oturmak ve aktif dinleme yaptığınızı baş hareketleriyle göstermek sizin özgüvenli olduğunuzu kanıtlar. Ellerinizin masanın üzerinde görünür olması dürüstlük ve şeffaflık sinyali verir. Dijital mülakatlarda ise kameraya bakmak, karşı tarafın gözüne bakmakla eşdeğerdir.</p>
      
      <h3>3. "Neden Sizi İşe Almalıyız?" Sorusuna Cevap</h3>
      <p>Bu soru sizin kendinizi pazarlama fırsatınızdır. Şirketin yaşadığı bir problemi tespit edip, sizin yeteneklerinizin bu problemi nasıl çözeceğini anlatın. "Ben sadece bu işi yapmam, ben bu departmana şu değerleri katarım" mesajını verin.</p>
      
      <h3>4. Mülakatçılara Soru Sorun</h3>
      <p>Hiç sorusu olmayan bir aday, ilgisiz veya vizyonsuz görünebilir. "Şirketin önümüzdeki 5 yıldaki en büyük hedefi nedir?" veya "Bu rolde benden beklenen en büyük başarı kriteri nedir?" gibi sorular sorarak vizyonunuzu gösterin.</p>
      
      <h3>5. Kartvizid Profilinizi Paylaşın</h3>
      <p>Mülakat sonrasında "Takip e-postası" (Follow-up) gönderirken Kartvizid dijital kartınızın linkini eklemeyi unutmayın. Bu, profesyonel duruşunuzu pekiştirecek ve iletişim bilgilerinizin mülakatçı tarafından kaydedilmesini kolaylaştıracaktır.</p>
    `
  },
  {
    id: '3',
    slug: 'dijital-dunyada-kisisel-marka-olusturma',
    title: 'Dijital Dünyada Kişisel Marka Oluşturma: Kariyerinizi Bir Üst Seviyeye Taşıyın',
    excerpt: 'Sizi diğer adaylardan ayıran özelliğiniz nedir? Dijital dünyada profesyonel görünürlüğünüzü artırmanın yollarını keşfedin.',
    category: 'Kişisel Gelişim',
    publishedAt: '2026-04-05',
    readTime: '20 dk',
    content: `
      <h2>Neden Kişisel Marka? Ürün Değil, Çözüm Olun</h2>
      <p>Günümüzde işverenler sadece teknik becerilere bakmıyor; bir kişinin çevrimiçi duruşu, paylaştığı değerler ve topluluğa olan katkıları da büyük önem arz ediyor. Kişisel marka, siz odada yokken insanların hakkınızda ne söylediğidir. Profesyonel dünyada bu algıyı yönetmek tamamen sizin elinizde.</p>
      
      <h3>1. Kendi Vitrininizi Kurun: Kartvizid'in Gücü</h3>
      <p>Profesyonel portfolyo siteleri sizin dijital vitrininizdir. Kartvizid.com üzerinde oluşturacağınız profil, sizin yeteneklerinizi, projelerinizi ve profesyonel ağınızı tek bir şık çatıda toplar. Başkalarının platformlarında kaybolmak yerine, kendi markanızı kendi alanınızda (Kartvizid linkinizle) temsil edin.</p>
      
      <h3>2. İçerik Üreterek Otorite Kurun</h3>
      <p>Bildiğiniz konularda yazılar yazmak, projelerinizin teknik detaylarını paylaşmak sizi o konuda "uzman" konumuna getirir. Google'da isminiz arandığında ne çıkacağını kontrol edin! Kendi web sitenizde veya Kartvizid profilinizdeki bio kısmında bu derinliği yansıtın.</p>
      
      <h3>3. Tutarlılık Algıyı Güçlendirir</h3>
      <p>Kullandığınız profesyonel fotoğraf, bio metni ve paylaştığınız içerik dili her platformda tutarlı olmalıdır. Bu, sizin disiplinli ve güvenilir bir profesyonel olduğunuzun kanıtıdır.</p>
      
      <h3>4. Ağ Kurma (Networking) Stratejileri</h3>
      <p>Kişisel marka sadece çevrimiçi değildir. Etkinliklerde kendinizi ifade etme şekliniz ve insanlara bıraktığınız dijital iz (Kartvizitiniz yerine Kartvizid profilinizi okutmanız gibi) modern networking'in temelidir.</p>
      
      <h3>Sonuç</h3>
      <p>Kişisel marka oluşturmak bir gecelik bir iş değil, bir yolculuktur. Değerlerinizi, yetkinliklerinizi ve gelecekte yapmak istediklerinizi bugün dijital dünyada doğru şekilde konumlandırmaya başlayın.</p>
    `
  },
  {
    id: '11',
    slug: 'dijital-kartvizit-nedir-gelecek-burada',
    title: 'Dijital Kartvizit Nedir? Neden Geleneksel Kartvizitler Tarih Oluyor?',
    excerpt: 'Modern iş dünyasında network kurmanın en teknolojik ve çevreci yolu: Kartvizid dijital kartvizit devrimini keşfedin.',
    category: 'Teknoloji',
    publishedAt: '2026-04-10',
    readTime: '15 dk',
    content: `
      <h2>Fiziksel Kartvizitlerden Dijital Kimliğe Geçiş</h2>
      <p>Yüzyıllardır kullanılan kağıt kartvizitlerin %88'i, teslim edildikten sonraki bir hafta içinde çöpe gidiyor. Bu sadece kağıt israfı değil, aynı zamanda kaybedilen potansiyel iş fırsatları demektir. 2026 yılında profesyoneller artık "Kartvizid" gibi dijital çözümleri tercih ediyor.</p>
      
      <h3>1. Neden Dijital Kartvizit?</h3>
      <p>Dijital kartvizitler asla bitmez, yırtılmaz ve en önemlisi; bilgileriniz değiştiğinde (telefon numaranız veya unvanınız gibi) binlerce kartı yeniden bastırmanız gerekmez. Bir saniye içinde profilinizi güncelleyebilirsiniz.</p>
      
      <h3>2. Kartvizid'in Avantajları: Etkileşimli Deneyim</h3>
      <p>Kartvizid üzerindeki profiliniz sadece iletişim bilgisi değildir. Oraya projelerinizi linkleyebilir, sosyal medya hesaplarınızı bağlayabilir ve hatta doğrudan mülakat talebi alabilirsiniz. Karşı tarafın telefonuna "Kişi Olarak Kaydet" butonuyla anında eklenmek paha biçilemez bir avantajdır.</p>
      
      <h3>3. Sürdürülebilirlik ve Doğa Dostu Yaklaşım</h3>
      <p>Yılda milyonlarca ağaç kartvizit üretimi için kesiliyor. Dijital kartvizit kullanarak karbon ayak izinizi azaltabilir ve şirketinize "çevreci" bir vizyon katabilirsiniz.</p>
      
      <h3>4. Analitik ve Takip</h3>
      <p>Dijital profilinizin kaç kez görüntülendiğini, hangi linklerinize tıklandığını takip edebilirsiniz. Bu, network kurma çalışmalarınızın verimliliğini ölçmenizi sağlar.</p>
      
      <h3>Nasıl Başlanır?</h3>
      <p>Kartvizid.com'a üye olup 2 dakika içinde kendi dijital kartınızı oluşturabilir, QR kodunuzla hemen tanışmaya başlayabilirsiniz. Gelecek cebinizde!</p>
    `
  },
  {
    id: '12',
    slug: 'freelance-dunyasına-giris-rehberi',
    title: 'Freelance Dünyasına Giriş: İlk Müşterinizi Nasıl Bulursunuz?',
    excerpt: 'Kendi işinizin patronu olmaya hazır mısınız? Freelance kariyerine başlarken bilmeniz gereken hukuki ve ticari temeller.',
    category: 'Girişimcilik',
    publishedAt: '2026-04-11',
    readTime: '25 dk',
    content: `
      <h2>Freelance Çalışmak: Hayal Mi, Gerçek Mi?</h2>
      <p>Esnek çalışma saatleri ve dünyanın her yerinden çalışma özgürlüğü kulağa harika geliyor. Ancak freelance kariyer, disiplinli bir yönetim ve pazarlama becerisi gerektirir. 2026 ekonomisinde bağımsız çalışanların sayısı devasa boyutlara ulaştı.</p>
      
      <h3>1. Uzmanlığınızı Belirleyin (Niche)</h3>
      <p>"Her şeyi yaparmcı" olmak yerine bir alanda uzmanlaşın. "Grafik tasarımcı" yerine "SaaS şirketleri için UI/UX uzmanı" olmak, sizi daha tercih edilebilir ve daha pahalı kılar.</p>
      
      <h3>2. Portfolyonun Gücü: Kartvizid ile Vitrininizi Hazırlayın</h3>
      <p>Freelance dünyasında "Laf değil, iş konuşur". Geçmiş projelerinizi, aldığınız referansları ve yetkinliklerinizi şık bir Kartvizid profilinde toplayın. Müşteri adaylarına tek bir link göndererek tüm profesyonelliğinizi kanıtlayın.</p>
      
      <h3>3. İlk Müşteriyi Bulma Stratejileri</h3>
      <p>İlk aşamada ağınızı (network) kullanın. Eski çalışma arkadaşlarınız, tanıdıklarınız en büyük referans kaynağınızdır. Soğuk e-postalar göndermek yerine, problem çözen içerikler paylaşarak müşterilerin size gelmesini sağlayın.</p>
      
      <h3>4. Zaman ve Nakit Yönetimi</h3>
      <p>Maaşlı bir işin aksine, freelance'de gelir her zaman sabit değildir. Acil durum fonunuzu oluşturun ve proje bazlı değil, değer odaklı fiyatlandırma yapmayı öğrenin.</p>
    `
  },
  {
    id: '13',
    slug: 'yapay-zeka-ve-kariyeriniz-2026',
    title: 'Yapay Zeka ve Kariyeriniz: İşinizi Elinizden mi Alacak?',
    excerpt: 'AI devrimi iş dünyasını nasıl değiştiriyor? Yapay zekadan etkilenmeyecek yeteneklerinizi nasıl geliştirirsiniz?',
    category: 'Teknoloji',
    publishedAt: '2026-04-12',
    readTime: '20 dk',
    content: `
      <h2>Yapay Zeka İle Rakip Değil, Ortak Olun</h2>
      <p>Korkulanın aksine yapay zeka çoğu işi yok etmeyecek, ancak işlerin "yapılış şeklini" kökten değiştirecek. Yapay zeka kullanan bir çalışan, kullanmayan bir çalışanın yerini alacak. Bu devrime ayak uydurmak artık bir seçenek değil, zorunluluktur.</p>
      
      <h3>1. AI-Okuryazarlığı (AI Literacy)</h3>
      <p>Prompt engineering'den veri analizine kadar AI araçlarını günlük iş akışınıza entegre edin. Bir yazılımcıysanız Copilot, tasarımcıysanız Midjourney, pazarlamacıysanız ChatGPT sizin en yakın çalışma arkadaşınız olmalı.</p>
      
      <h3>2. İnsani Yetenekler: Otomatize Edilemeyen Alanlar</h3>
      <p>Empati, kritik düşünme, etik karar alma ve karmaşık insan ilişkileri yönetimi... Yapay zekanın en çok zorlandığı bu alanlarda kendinizi geliştirin. Geleceğin profesyoneli, teknoloji ile duygusal zekayı birleştiren kişidir.</p>
      
      <h3>3. Sürekli Öğrenme (Lifelong Learning)</h3>
      <p>Eskiden 20 yılda olan değişim artık 2 yılda oluyor. Kartvizid profilinizdeki "Sertifikalar" ve "Yetenekler" kısmını sürekli yapay zeka ve yeni trendler doğrultusunda güncel tutun.</p>
      
      <h3>4. Geleceğin Meslekleri</h3>
      <p>Veri gizliliği uzmanlığı, AI denetçiliği, sürdürülebilirlik yöneticiliği gibi 5 yıl önce olmayan rollerde kendinize yer açın.</p>
    `
  },
  {
    id: '14',
    slug: 'maas-pazarligi-ve-pazar-degeri-2026',
    title: 'Maaş Pazarlığı Teknikleri: Değerinizi Kanıtlayın ve Hak Ettiğinizi Alın',
    excerpt: 'İş teklifi aldığınızda veya zam döneminde masaya nasıl oturmalısınız? İşte profesyonel pazarlık stratejileri.',
    category: 'Kariyer Tavsiyeleri',
    publishedAt: '2026-04-15',
    readTime: '15 dk',
    content: `
      <h2>Maaş Pazarlığı Bir Çatışma Değil, Bir Anlaşmadır</h2>
      <p>Pazarlık masasına oturduğunuzda kendinizi bir "satıcı" değil, bir "çözüm ortağı" olarak görün. Şirket size bir bütçe ayırıyor, siz de onlara zamanınızı, yeteneğinizi ve en önemlisi; onların bir problemini çözecek vizyonu veriyorsunuz.</p>
      
      <h3>1. Pazar Araştırması: Verisiz Masaya Oturmayın</h3>
      <p>Kendi sektörünüzde, şehir bazlı ve deneyim seviyenizde ortalama maaşları bilmeden masaya oturmayın. Kartvizid üzerindeki benzer yetkinlikteki profilleri ve sektör duyumlarını iyi analiz edin.</p>
      
      <h3>2. "Önce Onlar söylesin" Kuralı</h3>
      <p>Genellikle ilk rakamı telaffuz eden taraf dezavantajlı duruma düşebilir. Ancak doğrudan sorulursa, makul bir aralık verin. "Beklentim X - Y arasındadır, ancak toplam paket ve rolün detaylarına göre esneyebilirim" demek profesyoneldir.</p>
      
      <h3>3. Yan Haklar (Perks) ve Gelecek Vadi</h3>
      <p>Maaş sadece hesaba yatan para değildir. Uzaktan çalışma desteği, eğitim bütçesi, özel sağlık sigortası ve en önemlisi; o şirketin size katacağı "network" ve "know-how" da maaşın bir parçasıdır. Toplam faydaya odaklanın.</p>
    `
  },
  {
    id: '15',
    slug: 'kurumsal-hayatta-yukselme-stratejileri',
    title: 'Kurumsal Hayatta Yükselme Stratejileri: Terfi Almanın Hızlandırılmış Yolu',
    excerpt: 'Sadece çok çalışmak yetmez. Kurumsal basamakları tırmanmak için ihtiyacınız olan görünürlük ve strateji rehberi.',
    category: 'Yönetim',
    publishedAt: '2026-04-18',
    readTime: '20 dk',
    content: `
      <h2>Görünür Olmak: Çok Çalışmanın Ötesi</h2>
      <p>Bir odada çok çalışıp kimsenin haberi olmaması başarı getirmez. Başarı, çalışmak artı "algı yönetimi"dir. Kurumsal hayatta performansınız kadar, etki alanınız (influence) da önemlidir.</p>
      
      <h3>1. İnisiyatif Alın: Problemini Çözün</h3>
      <p>Yöneticinizin hayatını kolaylaştıracak projeler geliştirin. Sadece kendinize verilen işi değil, departmanı ileriye taşıyacak "ekstra mil" işlerini yapın.</p>
      
      <h3>2. İç Network ve Sponsorluk</h3>
      <p>İyi bir mentora ve daha önemlisi sizi üst yönetim toplantılarında savunacak bir "sponsora" ihtiyacınız var. Diğer departmanlarla bağ kurun, Kartvizid profilinizi şirket içi etkinliklerde aktif kullanın.</p>
      
      <h3>3. Liderlik Vasıflarını Unvan Almadan Gösterin</h3>
      <p>Ekip arkadaşlarına yardım eden, kriz anında sakin kalan ve çözüm üreten kişi zaten doğal bir liderdir. Şirket size unvan vermeden önce siz o unvanın gerekliliklerini yapmaya başlayın.</p>
    `
  },
  {
    id: '16',
    slug: 'yeni-mezunlar-icin-kariyer-yolculugu',
    title: 'Yeni Mezunlar İçin Kariyer Rehberi: İlk İşinize Giden Yol',
    excerpt: 'Okul bitti, peki şimdi ne olacak? İş piyasasına yeni giren adaylar için mülakatlardan deneme süresine kadar her şey.',
    category: 'Gelecek',
    publishedAt: '2026-04-20',
    readTime: '25 dk',
    content: `
      <h2>Okul Teorisi Bitti, Uygulama Dönemi Başlıyor</h2>
      <p>Diploma artık tek başına bir anahtar değil. İşverenler "ne biliyorsun?"dan ziyade "ne yapabiliyorsun?" sorusuna yanıt arıyor. Yeni mezun olarak en büyük gücünüz öğrenme kapasiteniz ve enerjinizdir.</p>
      
      <h3>1. Portfolyo Sizin Diplomadan Önemlidir</h3>
      <p>Eğer bir yazılımcı değilseniz bile yaptığınız projeleri, staj deneyimlerinizi ve okul kulübü başarılarınızı bir Kartvizid profilinde sergileyin. Somut kanıtlar her zaman daha etkileyicidir.</p>
      
      <h3>2. Mülakatlarda Dürüstlük ve İsteklilik</h3>
      <p>Her şeyi bilmediğinizi mülakatçılar da biliyor. Sizin öğrenmeye ne kadar aç olduğunuzu ve şirkete adaptasyon hızınızı test ediyorlar. Hazırlıklı olun, heyecanınızı göstermekten çekinmeyin.</p>
      
      <h3>3. Stajın Gücü</h3>
      <p>Mümkünse mezun olmadan, değilse hemen sonra kaliteli stajlar kovalamalıyız. Çoğu kurumsal şirket, gelecekteki çalışanlarını stajyer havuzundan seçer.</p>
    `
  },
  {
    id: '17',
    slug: 'is-gorusmesi-sonrasi-takip-epostasi',
    title: 'İş Görüşmesi Sonrası Takip E-postası: Fark Yaratacak 3 Altın Kural',
    excerpt: 'Mülakat bitti ama süreç devam ediyor. Akılda kalmak ve ciddiyetinizi göstermek için "Follow-up" nasıl yapılır?',
    category: 'Mülakat Teknikleri',
    publishedAt: '2026-04-22',
    readTime: '10 dk',
    content: `
      <h2>Mülakatın Noktası: Teşekkür E-postası</h2>
      <p>Çoğu aday mülakattan çıkar çıkmaz süreci kendi haline bırakır. Oysa mülakata davet edildiğiniz için teşekkür etmek ve konuşulan kritik bir noktayı vurgulamak sizi ilk %5'lik profesyonel dilime sokar.</p>
      
      <h3>1. Ne Zaman Gönderilmeli?</h3>
      <p>Mülakattan sonraki ilk 24 saat en ideal süredir. Hafızalar tazeyken nazik ve net bir e-posta akılda kalıcılığı artırır.</p>
      
      <h3>2. İçerik Nasıl Olmalı?</h3>
      <p>Sadece teşekkür etmeyin. Mülakat sırasında konuşulan ve sizin vizyonunuzu yansıtan bir konuya atıfta bulunun. "Konuştuğumuz X projesi üzerine biraz daha düşündüm ve..." gibi bir giriş ilgi uyandıracaktır.</p>
      
      <h3>3. İletişim Bilgilerini Ekleyin</h3>
      <p>E-postanızın sonuna Kartvizid dijital kart linkinizi ekleyin. İK uzmanı size ulaşmak istediğinde dosyalar arasındayken saniyeler içinde telefonuna kaydedebilsin.</p>
    `
  },
  {
    id: '18',
    slug: 'kariyerde-stres-ve-zaman-yonetimi',
    title: 'Kariyerde Stres Yönetimi: Zor Zamanlarda Ayakta Kalmak',
    excerpt: 'İş yükü arttığında ve hedefler zorlaştığında zihinsel sağlığınızı korumanın pratik yolları.',
    category: 'Kişisel Gelişim',
    publishedAt: '2026-04-25',
    readTime: '15 dk',
    content: `
      <h2>Stres Bir Düşman Değil, Bir Sinyaldir</h2>
      <p>Hafif düzeyde stres odaklanmayı artırabilir, ancak kronik stres yaratıcılığı ve sağlığı öldürür. 2026 dünyasının hızı bazen bunaltıcı olabilir, ancak kontrol sizin ellerinizde.</p>
      
      <h3>1. Eisenhover Matrisi İle Önceliklendirme</h3>
      <p>İşleri "Acil" ve "Önemli" olarak sınıflandırın. Her şeyi aynı anda yapmaya çalışmak yerine, en çok etki yaratacak işe odaklanın.</p>
      
      <h3>2. Dijital Sınırlar</h3>
      <p>Mesai saati bittiğinde bildirimleri yönetmeyi öğrenin. Kartvizid gibi profesyonel araçlarınızı güncel tutun ancak dijital dünyanın sizi esir almasına izin vermeyin. Mola vermek zayıflık değil, uzun vadeli başarı için bir zorunluluktur.</p>
    `
  },
  {
    id: '19',
    slug: 'gelisecek-sektorler-2026-2030',
    title: 'Geleceğin Yıldız Sektörleri: Kariyerinizi Nereye Yönlendirmelisiniz?',
    excerpt: 'Önümüzdeki 5 yıl içinde patlama yapacak alanlar ve bu alanlarda ihtiyaç duyulacak yetkinlikler.',
    category: 'Gelecek',
    publishedAt: '2026-04-28',
    readTime: '20 dk',
    content: `
      <h2>Değişen Dünya: Sürdürülebilirlik ve Teknoloji</h2>
      <p>Yenilenebilir enerji, sağlık teknolojileri ve veri güvenliği 2030'a kadar zirvede kalacak. Eğer bir kariyer değişikliği düşünüyorsanız, bu alanlardaki "niş" roller hayatınızı değiştirebilir.</p>
      
      <h3>Yetenek Dönüşümü (Reskilling)</h3>
      <p>Hangi sektörde olursanız olun, teknolojiye olan adaptasyonunuz sizin "employability" (istihdam edilebilirlik) oranınızı belirler. Kartvizid profilinize bu yeni yetenekleri eklemekten çekinmeyin.</p>
    `
  },
  {
    id: '20',
    slug: 'networking-ve-iliskiler-agi',
    title: 'Networking Sanatı: Güçlü Bir Profesyonel Ağ Nasıl Kurulur?',
    excerpt: 'İş dünyasında çevre her şeydir. Kartvizid ile modern networking stratejilerini keşfedin.',
    category: 'Kişisel Marka',
    publishedAt: '2026-04-30',
    readTime: '18 dk',
    content: `
      <h2>Link Değil, İnsan Biriktirin</h2>
      <p>Siz kimseyi aramıyorken işlerin size gelmesini sağlayan şey networkingdir. Bir toplulukta görünür olmak, fikirlerinizi paylaşmak ve insanlara karşılıksız yardımcı olmak en büyük yatırımdır.</p>
      
      <h3>Kartvizid İle Profesyonel İz Bırakın</h3>
      <p>Fiziksel bir etkinlikte kağıt parçaları dağıtmak yerine, insanlara telefonunuzdaki QR kodu göstererek profilinizi incelemelerini sağlayın. Bu hem şık hem de kalıcı bir bağlantı kurmanın en hızlı yoludur.</p>
    `
  }
];
tik yolları.',
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

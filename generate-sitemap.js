import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Setup environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// Determine variables from either Vite's typical VITE_ prefix or standard backend prefix
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Sitemap Generation Failed: Supabase credentials are not set in .env.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Define your static routes here
const staticRoutes = [
    '/',
    '/kullanim-kosullari',
    '/guvenlik-ipuclari',
    '/sikca-sorulan-sorular',
    '/yardim-merkezi',
    '/hizmetlerimiz',
    '/aydinlatma-metni',
    '/cerez-politikasi',
    '/kvkk-aydinlatma',
    '/uyelik-sozlesmesi',
    '/veri-sahibi-basvuru-formu',
    '/iletisim',
    '/rehber',
    '/hakkimizda',
    '/rehber/etkili-cv-hazirlama-2026',
    '/rehber/mulakat-zor-sorular-cevaplar',
    '/rehber/kisisel-marka-otorite-olma',
    '/rehber/dijital-kartvizit-nedir-avantajlari',
    '/rehber/maas-pazarligi-stratejileri-rehberi',
    '/rehber/linkedin-profil-optimizasyonu-2026',
    '/rehber/uzaktan-calisma-verimlilik-taktikleri',
    '/rehber/tersine-ise-alim-nedir-faydalari',
    '/rehber/mulakatta-beden-dili-kamera-arkasi',
    '/rehber/kariyerde-stres-yonetimi-burnout-engelleme',
    '/rehber/freelance-kariyerine-baslangic-rehberi',
    '/rehber/yazilim-sektorunde-kariyer-2026-trendleri',
    '/rehber/saglik-sektorunde-dijitallesme-kariyer',
    '/rehber/hibrit-calisma-modeli-denge-rehberi',
    '/rehber/kariyer-donusumu-30-yas-sonrasi',
    '/rehber/gelecegin-meslekleri-2030-hazirlik',
    '/rehber/etkili-networking-dijital-dunya',
    '/rehber/is-yerinde-mobbing-yasal-haklar',
    '/rehber/girisimcilik-vs-profesyonel-hayat',
    '/rehber/yurtdisinda-kariyer-stratejileri-2026',
    '/rehber/kapak-yazisi-hazirlama-rehberi-2026',
    '/rehber/ats-dostu-yazi-tipleri-ve-mizanpaj',
    '/rehber/video-mulakat-yazilimlari-uzman-ayarlari',
    '/rehber/star-teknigi-ile-mulakat-sorulari',
    '/rehber/linkedin-open-to-work-rozeti-analizi',
    '/rehber/dijital-portfolyo-olusturma-rehberi',
    '/rehber/sektorel-fuarlar-networking-taktikleri',
    '/rehber/referans-yonetimi-profesyonel-ipuclari',
    '/rehber/is-arama-yorgunlugu-ile-basa-cikma',
    '/rehber/yurt-disi-uzaktan-calisma-kultur-farki',
    '/rehber/teknik-olmayan-roller-teknik-mulakat',
    '/rehber/grup-mulakatlarinda-one-cikma-stratejileri',
    '/rehber/freelance-teklif-hazirlama-taktikleri',
    '/rehber/github-profilini-cv-gibi-kullanmak',
    '/rehber/kariyer-arasinda-career-gap-aciklama-sanati',
    '/rehber/startup-dunyasina-giris-rehberi',
    '/rehber/is-tekliflerini-degerlendirme-yan-haklar',
    '/rehber/kariyer-hizlandirici-mentor-iliskisi',
    '/rehber/is-gorusmesi-sonrasi-follow-up-sabloni',
    '/rehber/icerik-ureterek-is-bulmak-gorsunurluk',
    '/rehber/yapay-zeka-ile-cv-optimizasyonu-araclar',
    '/rehber/low-code-platformlar-kariyer-kapisi',
    '/rehber/siber-guvenlikte-kariyer-2026-rolleri',
    '/rehber/yesil-yakali-olmak-surdurulebilirlik-kariyer',
    '/rehber/veri-bilimi-vs-veri-analitigi-karsilastirma',
    '/rehber/bulut-bilisim-sertifikalari-degerli-mi',
    '/rehber/dijital-gocebelik-rehberi-yasal-hazirlik',
    '/rehber/e-ticaret-uzmanligi-sektore-giris',
    '/rehber/fintech-dunyasinda-kariyer-bankacilik-gelecegi',
    '/rehber/oyun-gelistirme-kariyeri-sanat-ve-kod',
    '/rehber/kariyer-donusumunde-golge-egitim-teknigi',
    '/rehber/soft-skills-vs-hard-skills-2026-denge',
    '/rehber/is-yerinde-kusaklar-arasi-iletisim-dengesi',
    '/rehber/proje-yonetimi-metodolojileri-karsilastirma',
    '/rehber/kendi-seonuzu-yapin-google-ilk-sira',
    '/rehber/podcast-ureterek-otorite-insasi-rehberi',
    '/rehber/sosyal-medya-detoksu-kariyer-verimlilik',
    '/rehber/gelecegin-ofisleri-metaverse-vr-toplantilar',
    '/rehber/kisisel-finans-yonetimi-freelancer-tasarruf',
    '/rehber/kariyerde-ikinci-perde-45-yas-ustu-sektor-degisimi',
    '/rehber/is-yerinde-mobbing-durdurma-rehberi',
    '/rehber/duygusal-zeka-liderlikte-onemi',
    '/rehber/ofiste-catisma-yonetimi-zor-kisiler',
    '/rehber/networking-vs-netweaving-farki',
    '/rehber/geri-bildirim-verme-ve-alma-sanati',
    '/rehber/is-yerinde-ergonomi-ev-ofis-rehberi',
    '/rehber/zihin-haritalama-ile-kariyer-planlama',
    '/rehber/podcast-uretimi-ekipman-rehberi-profesyonel',
    '/rehber/linkedin-portfoy-otomasyonu-zapier-ifttt',
    '/rehber/yeni-mezunlar-icin-ilk-90-gun-stratejisi',
    '/rehber/global-sirketlerde-kulturel-zeka-cq',
    '/rehber/is-arayisinda-gizlilik-mevcut-is-riski',
    '/rehber/mulakatta-zayif-yonleri-anlatma-stratejisi',
    '/rehber/kariyerde-pivot-yapmak-radikal-kararlar',
    '/rehber/is-yerinde-zaman-yonetimi-pomodoro-bloklama',
    '/rehber/uzaktan-calisirken-ekip-ruhu-sanal-kahve',
    '/rehber/profesyonel-yazisma-dili-e-posta-hatalari',
    '/rehber/kariyeriniz-icin-bir-yonetim-kurulu-kurun',
    '/rehber/is-yerinde-psikolojik-guvenlik-nedir',
    '/rehber/gelecegin-sehirleri-uzaktan-calisma-lokasyon',
    '/rehber/yapay-zeka-icerik-uretimi-linkedin-otorite',
    '/rehber/no-code-entrepreneurship-kodsuz-girisimcilik',
    '/rehber/siber-guvenlik-sertifika-yol-haritasi',
    '/rehber/rpa-ve-ik-gelecegi-otomasyon',
    '/rehber/blokzincir-kariyerleri-sadece-kripto-degil',
    '/rehber/web3-ve-dao-gelecegin-organizasyon-yapisi',
    '/rehber/veri-etigi-uzmanligi-gelecegin-rolu',
    '/rehber/enerji-sektorunde-kariyer-yenilenebilir-enerji',
    '/rehber/uzay-ekonomisi-gelecek-meslekler',
    '/rehber/saglik-teknolojilerinde-healthtech-kariyer',
    '/rehber/akademiden-sektore-gecis-stratejileri',
    '/rehber/spor-ve-kariyer-basarisi-disiplin',
    '/rehber/sanatcilarin-dijital-donusumu-nft-ve-otesi',
    '/rehber/kamu-sektorunde-dijital-donusum-uzmanligi',
    '/rehber/gelecegin-egitimcisi-online-kurs-rehberi',
    '/rehber/psikologlar-icin-dijital-kariyer-yollari',
    '/rehber/mimarlikta-dijital-ikiz-digital-twin-teknolojisi',
    '/rehber/gastronomide-kariyer-foodtech-ve-bulut-mutfaklar',
    '/rehber/sosyal-girisimcilik-kar-ve-fayda',
    '/rehber/kartvizid-ile-kariyer-yolculugu-2026-otesi'
];

// Production Domain
const BASE_URL = 'https://www.kartvizid.com';

async function generateSitemap() {
    console.log("Generating sitemap...");
    let urls = [];

    // 1. Add static routes
    staticRoutes.forEach(route => {
        urls.push({
            loc: `${BASE_URL}${route}`,
            lastmod: new Date().toISOString(),
            changefreq: 'weekly',
            priority: route === '/' ? 1.0 : 0.6
        });
    });

    try {
        // 2. Fetch CVs
        let cvs = [];
        try {
            const { data, error } = await supabase.from('cvs').select('id, slug, updated_at, is_active');
            if (error) throw error;
            cvs = (data || []).filter(cv => cv.is_active !== false); // fallback filter
        } catch (e) {
            // Fallback if schema is old
            const { data } = await supabase.from('cvs').select('id, updated_at');
            cvs = data || [];
        }

        if (cvs && cvs.length > 0) {
            cvs.forEach(cv => {
                const identifier = cv.slug || cv.id;
                urls.push({
                    loc: `${BASE_URL}/cv/${identifier}`,
                    lastmod: cv.updated_at ? new Date(cv.updated_at).toISOString() : new Date().toISOString(),
                    changefreq: 'weekly',
                    priority: 0.8
                });
            });
        }

        // 3. Fetch Companies
        let companies = [];
        try {
            const { data, error } = await supabase.from('companies').select('id, slug, updated_at');
            if (error) throw error;
            companies = data || [];
        } catch (e) {
            const { data } = await supabase.from('companies').select('id, updated_at');
            companies = data || [];
        }

        if (companies && companies.length > 0) {
            companies.forEach(company => {
                const identifier = company.slug || company.id;
                urls.push({
                    loc: `${BASE_URL}/company/${identifier}`,
                    lastmod: company.updated_at ? new Date(company.updated_at).toISOString() : new Date().toISOString(),
                    changefreq: 'monthly',
                    priority: 0.7
                });
            });
        }

        // 4. Build XML structure
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        urls.forEach(u => {
            xml += `  <url>\n`;
            xml += `    <loc>${u.loc}</loc>\n`;
            xml += `    <lastmod>${u.lastmod}</lastmod>\n`;
            xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
            xml += `    <priority>${u.priority}</priority>\n`;
            xml += `  </url>\n`;
        });

        xml += `</urlset>`;

        // 5. Write to public/sitemap.xml
        const publicPath = path.join(__dirname, 'public');
        if (!fs.existsSync(publicPath)) {
            fs.mkdirSync(publicPath);
        }
        fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), xml);

        console.log(`✅ Sitemap successfully generated with ${urls.length} URLs! -> public/sitemap.xml`);
    } catch (error) {
        console.error("❌ Error generating sitemap:", error);
        process.exit(1);
    }
}

generateSitemap();

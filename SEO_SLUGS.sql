-- 1. Türkçe karakterleri dönüştürmek için "unaccent" eklentisini aktifleştiriyoruz
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- 2. Metinleri SEO uyumlu link (Slug) formatına çeviren özel fonksiyon
CREATE OR REPLACE FUNCTION slugify("value" text)
RETURNS text AS $$
  WITH "unaccented" AS (
    SELECT unaccent("value") AS "value"
  ),
  "lowercase" AS (
    SELECT lower("value") AS "value"
  ),
  "replaced" AS (
    SELECT regexp_replace("value", '[^a-z0-9\\-_]+', '-', 'gi') AS "value"
    FROM "lowercase"
  ),
  "cleaned" AS (
    SELECT regexp_replace("value", '\-+', '-', 'gi') AS "value"
    FROM "replaced"
  ),
  "trimmed" AS (
    SELECT trim(BOTH '-' FROM "value") AS "value"
    FROM "cleaned"
  )
  SELECT "value" FROM "trimmed";
$$ LANGUAGE SQL STRICT IMMUTABLE;

-- 3. CVS ve Companies tablolarına "slug" sütunu ekleme (Eğer yoksa)
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- 4. CV'ler için benzersiz Slug üreten işlem (İsim-Meslek-Şehir)
CREATE OR REPLACE FUNCTION generate_cv_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug text;
  new_slug text;
  counter integer := 1;
BEGIN
  -- Yeni biri eklenirken veya güncellenirken slug'ı ismi, mesleği ve şehrinden oluştur
  base_slug := slugify(COALESCE(NEW.name, '') || '-' || COALESCE(NEW.profession, '') || '-' || COALESCE(NEW.city, ''));
  
  -- Eğer her şey boşsa (olmamalı ama önlem)
  IF base_slug = '' OR base_slug = '--' THEN
    base_slug := 'cv';
  END IF;

  new_slug := base_slug;
  
  -- Eğer aynı isimde link varsa sonuna -1, -2 diye sayı ekle (Çakışmayı önler)
  WHILE EXISTS (SELECT 1 FROM cvs WHERE slug = new_slug AND id != NEW.id) LOOP
    new_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;

  NEW.slug := new_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. CV Tablosu için Trigger (Tetikleyici)
DROP TRIGGER IF EXISTS trg_generate_cv_slug ON cvs;
CREATE TRIGGER trg_generate_cv_slug
BEFORE INSERT OR UPDATE OF name, profession, city
ON cvs
FOR EACH ROW
EXECUTE FUNCTION generate_cv_slug();

-- 6. Şirketler için benzersiz Slug üreten işlem
CREATE OR REPLACE FUNCTION generate_company_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug text;
  new_slug text;
  counter integer := 1;
BEGIN
  base_slug := slugify(COALESCE(NEW.company_name, ''));
  
  IF base_slug = '' THEN
    base_slug := 'sirket';
  END IF;

  new_slug := base_slug;
  
  WHILE EXISTS (SELECT 1 FROM companies WHERE slug = new_slug AND id != NEW.id) LOOP
    new_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;

  NEW.slug := new_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Şirket Tablosu için Trigger (Tetikleyici)
DROP TRIGGER IF EXISTS trg_generate_company_slug ON companies;
CREATE TRIGGER trg_generate_company_slug
BEFORE INSERT OR UPDATE OF company_name
ON companies
FOR EACH ROW
EXECUTE FUNCTION generate_company_slug();

-- 8. MEVCUT KAYITLARI GÜNCELLEME (Eski CV'lerin ve Şirketlerin linklerini oluştur)
UPDATE cvs SET name = name WHERE slug IS NULL;
UPDATE companies SET company_name = company_name WHERE slug IS NULL;

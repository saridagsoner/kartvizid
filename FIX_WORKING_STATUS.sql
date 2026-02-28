-- Bu script, daha önceden kayıt olup CV'si (kartviziti) oluşmuş fakat 
-- veritabanı "İşe Girdi (active)" olarak işaretlediği için ana sayfada 
-- gözükmeyen kartvizitleri "İş Arıyor (open)" statüsüne geri çeker.

UPDATE public.cvs
SET working_status = 'open'
WHERE working_status = 'active';

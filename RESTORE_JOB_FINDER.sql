-- İş Buldum diyerek ana sayfadaki başarılılar arasına giren ve yanlışlıkla
-- tekrar "İş Arıyor" konumuna dönen hesabınızı yeniden işe yerleştirildi 
-- olarak (kartvizidi gizleyip İş Bulanlara eklemek için) çalıştırın.

-- Tek yapmanız gereken 'Buraya Adınızı Yazın' kısmına hesaptaki İsim Soyismi yazmak.
-- Örnek: 'Mehmet Demir' veya 'Soner Sarıdağ'

UPDATE public.cvs
SET working_status = 'active'
WHERE name ILIKE '%Buraya Adınızı Yazın%';

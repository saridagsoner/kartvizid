-- 1. Her kullanıcı için sadece en son oluşturulan/güncellenen CV'yi tut, kopyaları sil
DELETE FROM public.cvs
WHERE id NOT IN (
    SELECT id
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
        FROM public.cvs
    ) sub
    WHERE rn = 1
);

-- 2. Veritabanı seviyesinde "Bir kullanıcının birden fazla CV'si olamaz" kuralını (UNIQUE) ekle
ALTER TABLE public.cvs
ADD CONSTRAINT cvs_unique_user_id UNIQUE (user_id);

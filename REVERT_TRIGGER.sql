-- Bu komut, hesaba kayıt olurken otomatik CV oluşturmaya yarayan 
-- sistemi (tetikleyiciyi ve fonksiyonu) tamamen siler.
-- Sisteminiz hiçbir hata veya uyarı olmadan Geriye / Eski haline döner.

DROP TRIGGER IF EXISTS on_auth_user_created_job_seeker ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_job_seeker();

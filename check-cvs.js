import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkCVs() {
    const { data, error } = await supabase.from('cvs').select('id, name, email, working_status, photo_url, about, is_active, is_new').order('created_at', { ascending: false }).limit(5);
    if (error) {
        console.error("Error:", error);
    } else {
        console.table(data);
    }
}

checkCVs();

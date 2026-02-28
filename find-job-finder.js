import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function findLostJobFinder() {
    // Let's find people who have a photo and we might have accidentally marked as 'open'
    const { data, error } = await supabase.from('cvs')
        .select('id, name, working_status, photo_url, created_at, updated_at')
        .neq('photo_url', '');

    if (error) {
        console.error("Error:", error);
    } else {
        console.table(data);
    }
}

findLostJobFinder();

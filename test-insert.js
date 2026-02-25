import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing supabase env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
    const fakeUserId = "00000000-0000-0000-0000-000000000000"; // Might violate FK, but let's see if we get a schema constraint error first or bypass UUID FK
    const { data, error } = await supabase.from('cvs').insert({
        user_id: fakeUserId,
        name: 'Test Setup',
        profession: 'Developer',
        city: 'Istanbul',
        experience_years: 0,
        experience_months: 0,
        email: 'test@example.com',
        skills: [],
        education_details: [],
        work_experience: [],
        internship_details: [],
        language_details: [],
        certificates: [],
        is_new: true,
        views: 0,
        is_placed: false,
        is_active: true,
        about: '',
        photo_url: ''
    });

    if (error) {
        console.error("Insert failed:", error);
    } else {
        console.log("Insert succeeded!");
    }
}

testInsert();

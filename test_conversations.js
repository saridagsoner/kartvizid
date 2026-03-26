import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('conversations').select('*').limit(1);
  if (error) {
    console.log('QUERY ERROR:', error.message);
  } else {
    console.log('QUERY SUCCESS:', data);
  }
}
test();

import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      participant1:participant1_id(id),
      participant2:participant2_id(id)
    `)
    .limit(1);

  if (error) {
    console.error('QUERY ERROR:', JSON.stringify(error, null, 2));
  } else {
    console.log('QUERY SUCCESS:', data);
  }
}
test();

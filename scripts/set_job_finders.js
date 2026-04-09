
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vkizdlujyofbsyveaara.supabase.co';
const supabaseAnonKey = 'sb_publishable_eHOWlaSSz66MMcquOceOCQ_9ud1fWaV';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setJobFinders() {
  try {
    // Fetch 2 random CVs
    const { data: cvs, error: fetchError } = await supabase
      .from('cvs')
      .select('id, name')
      .limit(2);

    if (fetchError) throw fetchError;
    if (!cvs || cvs.length === 0) {
      console.log('No CVs found to update.');
      return;
    }

    console.log(`Setting job found status for: ${cvs.map(c => c.name).join(', ')}`);

    // Update them
    const { error: updateError } = await supabase
      .from('cvs')
      .update({ is_placed: true, working_status: 'active' })
      .in('id', cvs.map(c => c.id));

    if (updateError) throw updateError;

    console.log('Successfully updated 2 users as job finders.');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

setJobFinders();

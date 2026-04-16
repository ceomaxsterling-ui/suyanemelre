const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Fetching leads...');
  const { data, error } = await supabase.from('leads').select('*');
  
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Success! Leads found:', data ? data.length : 0);
    console.log('Lead data:', JSON.stringify(data, null, 2));
  }
}

test();

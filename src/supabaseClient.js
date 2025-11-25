import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://clhjzxxiswcozdcmtqln.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsaGp6eHhpc3djb3pkY210cWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MzU1NTksImV4cCI6MjA3NzQxMTU1OX0.XUi7G4p4wEiY_mwEA1e7HzNCVZonNDhvKkLNBKspGUg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

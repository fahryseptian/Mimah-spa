import { createClient } from '@supabase/supabase-js';

let supabaseClient: any = null;

export const getSupabase = () => {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'MY_APP_URL' || supabaseUrl.trim() === '' || !supabaseUrl.startsWith('http')) {
    console.warn('Supabase client not initialized: Missing or invalid environment variables.');
    return null;
  }

  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey) as any;
    return supabaseClient;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    return null;
  }
};

export const supabase = getSupabase();

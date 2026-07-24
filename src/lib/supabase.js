import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables safely across both server (process.env) and browser/Vite environments
const supabaseUrl = 
  (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_URL || process.env?.NEXT_PUBLIC_SUPABASE_URL : '') ||
  (typeof window !== 'undefined' ? window.__ENV__?.VITE_SUPABASE_URL : '');

const supabaseAnonKey = 
  (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_ANON_KEY || process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY : '') ||
  (typeof window !== 'undefined' ? window.__ENV__?.VITE_SUPABASE_ANON_KEY : '');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[LOOP] Supabase environment variables are missing. ' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your env configuration.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

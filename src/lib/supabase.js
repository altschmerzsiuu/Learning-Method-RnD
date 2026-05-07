// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  || '';
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// If env vars are missing, export a null client — app still works via localStorage
export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const isSupabaseReady = () => !!supabase;

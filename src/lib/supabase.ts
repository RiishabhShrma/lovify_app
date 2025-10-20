import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Letter {
  id: string;
  encrypted_content: string;
  encrypted_subject: string;
  sender_name: string;
  recipient_name: string;
  encryption_iv: string;
  subject_iv: string;
  encryption_salt: string;
  created_at: string;
  read_at: string | null;
  expires_at: string | null;
}

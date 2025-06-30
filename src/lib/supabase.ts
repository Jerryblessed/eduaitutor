import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  institution?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  title: string;
  filename: string;
  content: string;
  file_size: number;
  upload_date: string;
  created_at: string;
}

export interface Summary {
  id: string;
  document_id: string;
  content: string;
  voice_url?: string;
  created_at: string;
}

export interface Quiz {
  id: string;
  document_id: string;
  title: string;
  questions: QuizQuestion[];
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

export interface QuizResult {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  answers: Record<string, number>;
  completed_at: string;
}

export interface Conversation {
  id: string;
  document_id: string;
  user_id: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
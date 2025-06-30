/*
  # Initial Schema for EduAI Tutor

  1. New Tables
    - `user_profiles`
      - `id` (uuid, references auth.users)
      - `full_name` (text)
      - `avatar_url` (text)
      - `institution` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `documents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `title` (text)
      - `filename` (text)
      - `content` (text)
      - `file_size` (integer)
      - `upload_date` (timestamp)
      - `created_at` (timestamp)
    
    - `summaries`
      - `id` (uuid, primary key)
      - `document_id` (uuid, references documents)
      - `content` (text)
      - `voice_url` (text)
      - `created_at` (timestamp)
    
    - `quizzes`
      - `id` (uuid, primary key)
      - `document_id` (uuid, references documents)
      - `title` (text)
      - `questions` (jsonb)
      - `created_at` (timestamp)
    
    - `quiz_results`
      - `id` (uuid, primary key)
      - `quiz_id` (uuid, references quizzes)
      - `user_id` (uuid, references user_profiles)
      - `score` (integer)
      - `answers` (jsonb)
      - `completed_at` (timestamp)
    
    - `conversations`
      - `id` (uuid, primary key)
      - `document_id` (uuid, references documents)
      - `user_id` (uuid, references user_profiles)
      - `messages` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  institution text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  filename text NOT NULL,
  content text NOT NULL,
  file_size integer DEFAULT 0,
  upload_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create summaries table
CREATE TABLE IF NOT EXISTS summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  voice_url text,
  created_at timestamptz DEFAULT now()
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  score integer DEFAULT 0,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  completed_at timestamptz DEFAULT now()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for documents
CREATE POLICY "Users can read own documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own documents"
  ON documents
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own documents"
  ON documents
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for summaries
CREATE POLICY "Users can read summaries of their documents"
  ON summaries
  FOR SELECT
  TO authenticated
  USING (
    document_id IN (
      SELECT id FROM documents WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert summaries for their documents"
  ON summaries
  FOR INSERT
  TO authenticated
  WITH CHECK (
    document_id IN (
      SELECT id FROM documents WHERE user_id = auth.uid()
    )
  );

-- Create policies for quizzes
CREATE POLICY "Users can read quizzes of their documents"
  ON quizzes
  FOR SELECT
  TO authenticated
  USING (
    document_id IN (
      SELECT id FROM documents WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert quizzes for their documents"
  ON quizzes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    document_id IN (
      SELECT id FROM documents WHERE user_id = auth.uid()
    )
  );

-- Create policies for quiz_results
CREATE POLICY "Users can read own quiz results"
  ON quiz_results
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own quiz results"
  ON quiz_results
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create policies for conversations
CREATE POLICY "Users can read own conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own conversations"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own conversations"
  ON conversations
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_summaries_document_id ON summaries(document_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_document_id ON quizzes(document_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_document_id ON conversations(document_id);
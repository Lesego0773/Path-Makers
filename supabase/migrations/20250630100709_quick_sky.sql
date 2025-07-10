/*
  # Create Path-Makers Database Schema

  1. New Tables
    - `workers`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `phone` (text)
      - `location` (text)
      - `skills` (text)
      - `experience` (text)
      - `availability` (text)
      - `is_verified` (boolean, default false)
      - `id_document_url` (text, nullable)
      - `selfie_url` (text, nullable)
      - `rating` (decimal, default 0)
      - `completed_jobs` (integer, default 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `employers`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `id_number` (text)
      - `is_verified` (boolean, default false)
      - `id_document_url` (text, nullable)
      - `selfie_url` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `jobs`
      - `id` (uuid, primary key)
      - `employer_id` (uuid, references employers)
      - `worker_id` (uuid, references workers, nullable)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `location` (text)
      - `budget` (decimal)
      - `status` (text, default 'open')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create workers table
CREATE TABLE IF NOT EXISTS workers (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  location text NOT NULL,
  skills text NOT NULL,
  experience text NOT NULL,
  availability text NOT NULL DEFAULT 'full-time',
  is_verified boolean DEFAULT false,
  id_document_url text,
  selfie_url text,
  rating decimal DEFAULT 0,
  completed_jobs integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create employers table
CREATE TABLE IF NOT EXISTS employers (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  id_number text NOT NULL,
  is_verified boolean DEFAULT false,
  id_document_url text,
  selfie_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid REFERENCES employers(id) ON DELETE CASCADE,
  worker_id uuid REFERENCES workers(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  budget decimal NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Workers policies
CREATE POLICY "Workers can read own data"
  ON workers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Workers can update own data"
  ON workers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Workers can insert own data"
  ON workers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Employers can read verified workers"
  ON workers
  FOR SELECT
  TO authenticated
  USING (is_verified = true);

-- Employers policies
CREATE POLICY "Employers can read own data"
  ON employers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Employers can update own data"
  ON employers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Employers can insert own data"
  ON employers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Jobs policies
CREATE POLICY "Employers can manage own jobs"
  ON jobs
  FOR ALL
  TO authenticated
  USING (employer_id = auth.uid());

CREATE POLICY "Workers can read assigned jobs"
  ON jobs
  FOR SELECT
  TO authenticated
  USING (worker_id = auth.uid());

CREATE POLICY "Workers can read open jobs"
  ON jobs
  FOR SELECT
  TO authenticated
  USING (status = 'open');

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('documents', 'documents', true),
  ('selfies', 'selfies', true);

-- Storage policies
CREATE POLICY "Users can upload their own documents"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own selfies"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'selfies' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can read their own files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = (storage.foldername(name))[1]);
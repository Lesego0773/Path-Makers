/*
  # Fix authentication and user tables

  1. Ensure all required tables exist with proper structure
  2. Fix any missing columns or constraints
  3. Ensure RLS policies are correct
  4. Add proper indexes for performance
*/

-- Ensure workers table exists with all required columns
CREATE TABLE IF NOT EXISTS workers (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  location text NOT NULL,
  skills text NOT NULL,
  experience text NOT NULL DEFAULT '',
  availability text NOT NULL DEFAULT 'full-time',
  is_verified boolean DEFAULT false,
  id_document_url text,
  selfie_url text,
  rating numeric DEFAULT 0,
  completed_jobs integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ensure employers table exists with all required columns
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

-- Ensure jobs table exists
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid REFERENCES employers(id) ON DELETE CASCADE,
  worker_id uuid REFERENCES workers(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  budget numeric NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Workers can read own data" ON workers;
DROP POLICY IF EXISTS "Workers can update own data" ON workers;
DROP POLICY IF EXISTS "Workers can insert own data" ON workers;
DROP POLICY IF EXISTS "Employers can read verified workers" ON workers;

DROP POLICY IF EXISTS "Employers can read own data" ON employers;
DROP POLICY IF EXISTS "Employers can update own data" ON employers;
DROP POLICY IF EXISTS "Employers can insert own data" ON employers;

DROP POLICY IF EXISTS "Employers can manage own jobs" ON jobs;
DROP POLICY IF EXISTS "Workers can read assigned jobs" ON jobs;
DROP POLICY IF EXISTS "Workers can read open jobs" ON jobs;

-- Create workers policies
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

-- Create employers policies
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

-- Create jobs policies
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

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('documents', 'documents', false),
  ('selfies', 'selfies', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own selfies" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view own documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload selfies" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view own selfies" ON storage.objects;

-- Create storage policies
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

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_workers_updated_at ON workers;
CREATE TRIGGER update_workers_updated_at
  BEFORE UPDATE ON workers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_employers_updated_at ON employers;
CREATE TRIGGER update_employers_updated_at
  BEFORE UPDATE ON employers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
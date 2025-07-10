/*
  # Fix employers table creation and policies

  1. New Tables
    - `employers` table with proper structure and constraints
  
  2. Security
    - Enable RLS on employers table
    - Add policies for authenticated users to manage their own data
    - Create storage policies for documents and selfies
  
  3. Functions and Triggers
    - Update timestamp trigger for employers table
*/

-- Create employers table if it doesn't exist
CREATE TABLE IF NOT EXISTS employers (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  id_number text UNIQUE NOT NULL,
  is_verified boolean DEFAULT false,
  id_document_url text,
  selfie_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Employers can read own data" ON employers;
DROP POLICY IF EXISTS "Employers can insert own data" ON employers;
DROP POLICY IF EXISTS "Employers can update own data" ON employers;

-- Create policies
CREATE POLICY "Employers can read own data"
  ON employers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Employers can insert own data"
  ON employers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Employers can update own data"
  ON employers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create function to update updated_at timestamp if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_employers_updated_at ON employers;

-- Create trigger for updated_at
CREATE TRIGGER update_employers_updated_at
  BEFORE UPDATE ON employers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create storage buckets for documents and selfies if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('documents', 'documents', false),
  ('selfies', 'selfies', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view own documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload selfies" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view own selfies" ON storage.objects;

-- Create storage policies
CREATE POLICY "Authenticated users can upload documents"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can view own documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can upload selfies"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'selfies' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can view own selfies"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'selfies' AND auth.uid()::text = (storage.foldername(name))[1]);
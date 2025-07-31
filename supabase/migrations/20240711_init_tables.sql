-- Drop existing tables (if needed)
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS employers;
DROP TABLE IF EXISTS workers;

-- Recreate tables
CREATE TABLE employers (
  id uuid primary key,
  email text unique not null,
  full_name text,
  id_number text,
  is_verified boolean default false,
  id_document_url text,
  selfie_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

CREATE TABLE workers (
  id uuid primary key,
  email text unique not null,
  full_name text,
  phone text,
  location text,
  skills text,
  experience text,
  availability text,
  is_verified boolean default false,
  id_document_url text,
  selfie_url text,
  rating float default 0,
  completed_jobs int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

CREATE TABLE jobs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid references employers(id) on delete cascade,
  worker_id uuid references workers(id),
  title text not null,
  description text,
  category text,
  location text,
  budget float,
  status text default 'open',
  type text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
); 
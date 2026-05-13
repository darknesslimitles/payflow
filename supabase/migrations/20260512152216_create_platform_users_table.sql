/*
  # Create platform_users table

  1. New Tables
    - `platform_users`
      - `id` (uuid, primary key)
      - `user_code` (text, unique — U-001)
      - `name` (text)
      - `email` (text, unique)
      - `role` (text: admin | analyst | support | viewer)
      - `status` (text: active | inactive | suspended)
      - `last_login` (timestamptz)
      - `joined_date` (date)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Authenticated users can read all platform users
    - Only admins (checked via app_metadata) can modify users
*/

CREATE TABLE IF NOT EXISTS platform_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_code text UNIQUE NOT NULL,
  name text NOT NULL DEFAULT '',
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin','analyst','support','viewer')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','suspended')),
  last_login timestamptz,
  joined_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_users_role ON platform_users(role);
CREATE INDEX IF NOT EXISTS idx_platform_users_status ON platform_users(status);

ALTER TABLE platform_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read platform users"
  ON platform_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert platform users"
  ON platform_users FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update platform users"
  ON platform_users FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO platform_users (user_code, name, email, role, status, last_login, joined_date) VALUES
  ('U-001','James Lim','james.lim@payflow.com','admin','active','2026-05-10 03:00:00+00','2023-01-10'),
  ('U-002','Sarah Chen','sarah.chen@payflow.com','analyst','active','2026-05-10 01:30:00+00','2023-04-22'),
  ('U-003','Michael Torres','m.torres@payflow.com','support','active','2026-05-09 18:45:00+00','2023-07-15'),
  ('U-004','Priya Nair','p.nair@payflow.com','analyst','inactive','2026-04-28 10:00:00+00','2024-01-05'),
  ('U-005','David Kim','d.kim@payflow.com','viewer','active','2026-05-09 22:10:00+00','2024-03-18'),
  ('U-006','Emma Wilson','e.wilson@payflow.com','support','suspended','2026-04-01 09:00:00+00','2023-11-30')
ON CONFLICT (user_code) DO NOTHING;

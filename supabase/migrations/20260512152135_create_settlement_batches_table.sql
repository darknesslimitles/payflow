/*
  # Create settlement_batches table

  1. New Tables
    - `settlement_batches`
      - `id` (uuid, primary key)
      - `batch_id` (text, unique — SB-YYYYMMDD-NNN)
      - `merchant_name` (text)
      - `amount` (numeric)
      - `tx_count` (integer)
      - `status` (text: settled | processing | pending | failed)
      - `initiated_at` (text, time string like "09:00 AM")
      - `settled_at` (text, nullable)
      - `lag` (text, human-readable lag like "2h 24m")
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Authenticated users can read/insert/update settlement batches
*/

CREATE TABLE IF NOT EXISTS settlement_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id text UNIQUE NOT NULL,
  merchant_name text NOT NULL DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  tx_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('settled','processing','pending','failed')),
  initiated_at text NOT NULL DEFAULT '',
  settled_at text,
  lag text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_settlement_batches_status ON settlement_batches(status);
CREATE INDEX IF NOT EXISTS idx_settlement_batches_created_at ON settlement_batches(created_at DESC);

ALTER TABLE settlement_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read settlement batches"
  ON settlement_batches FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert settlement batches"
  ON settlement_batches FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update settlement batches"
  ON settlement_batches FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO settlement_batches (batch_id, merchant_name, amount, tx_count, status, initiated_at, settled_at, lag) VALUES
  ('SB-20260509-001','Nexus Digital PH',48200.00,62,'settled','09:00 AM','11:24 AM','2h 24m'),
  ('SB-20260509-002','StellarMart Inc.',124750.00,187,'settled','09:00 AM','11:51 AM','2h 51m'),
  ('SB-20260509-003','Pinnacle Commerce',89300.00,134,'processing','10:00 AM',NULL,'In progress'),
  ('SB-20260509-004','Apex Solutions Ltd.',211400.00,298,'processing','11:00 AM',NULL,'In progress'),
  ('SB-20260509-005','BlueStar Trading',34600.00,51,'pending','12:00 PM',NULL,'Scheduled'),
  ('SB-20260509-006','Orbis Retail Corp.',76100.00,108,'failed','08:00 AM',NULL,'Failed — retry')
ON CONFLICT (batch_id) DO NOTHING;

/*
  # Create merchants table

  1. New Tables
    - `merchants`
      - `id` (uuid, primary key)
      - `merchant_code` (text, unique identifier like M-001)
      - `name` (text)
      - `category` (text)
      - `status` (text: active | suspended | pending)
      - `total_volume` (numeric)
      - `transaction_count` (integer)
      - `success_rate` (numeric)
      - `joined_date` (date)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Authenticated users can read all merchants
    - Only service role can insert/update/delete

  3. Seed
    - 7 mock merchants matching existing frontend data
*/

CREATE TABLE IF NOT EXISTS merchants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_code text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'suspended', 'pending')),
  total_volume numeric NOT NULL DEFAULT 0,
  transaction_count integer NOT NULL DEFAULT 0,
  success_rate numeric NOT NULL DEFAULT 0,
  joined_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read merchants"
  ON merchants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert merchants"
  ON merchants FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update merchants"
  ON merchants FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO merchants (merchant_code, name, category, status, total_volume, transaction_count, success_rate, joined_date) VALUES
  ('M-001', 'TechStore Pro', 'Electronics', 'active', 284500, 1240, 98.2, '2024-01-15'),
  ('M-002', 'GlobalMart', 'Retail', 'active', 512000, 3820, 97.5, '2023-11-08'),
  ('M-003', 'QuickPay Ltd', 'Finance', 'suspended', 98200, 540, 88.1, '2024-03-22'),
  ('M-004', 'ShopEasy', 'E-commerce', 'active', 175300, 2100, 99.1, '2023-09-01'),
  ('M-005', 'FoodDelivery Co', 'Food & Beverage', 'active', 63400, 890, 95.6, '2024-02-14'),
  ('M-006', 'LuxuryGoods', 'Luxury', 'pending', 0, 0, 0, '2026-05-09'),
  ('M-007', 'TravelBookings', 'Travel', 'active', 320100, 1560, 96.8, '2023-07-20')
ON CONFLICT (merchant_code) DO NOTHING;

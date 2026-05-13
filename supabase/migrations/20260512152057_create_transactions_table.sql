/*
  # Create transactions table

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `tx_id` (text, unique — TXN-XXXXXXX)
      - `merchant_name` (text)
      - `customer_name` (text)
      - `amount` (numeric)
      - `currency` (text)
      - `method` (text: visa | mastercard | amex | ach | wire | apple_pay | google_pay | gcash | maya | paypal)
      - `status` (text: completed | pending | processing | failed | refunded | disputed | flagged)
      - `fraud_score` (integer 0–100)
      - `settlement_status` (text: settled | unsettled | pending)
      - `country` (text, 2-char ISO code)
      - `reference_no` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Authenticated users can read/insert/update transactions

  3. Indexes
    - On status, method, fraud_score, created_at for fast filtering
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tx_id text UNIQUE NOT NULL,
  merchant_name text NOT NULL DEFAULT '',
  customer_name text NOT NULL DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  method text NOT NULL DEFAULT 'visa' CHECK (method IN ('visa','mastercard','amex','ach','wire','apple_pay','google_pay','gcash','maya','paypal')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('completed','pending','processing','failed','refunded','disputed','flagged')),
  fraud_score integer NOT NULL DEFAULT 0 CHECK (fraud_score >= 0 AND fraud_score <= 100),
  settlement_status text NOT NULL DEFAULT 'unsettled' CHECK (settlement_status IN ('settled','unsettled','pending')),
  country text NOT NULL DEFAULT 'US',
  reference_no text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_method ON transactions(method);
CREATE INDEX IF NOT EXISTS idx_transactions_fraud_score ON transactions(fraud_score);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_settlement_status ON transactions(settlement_status);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO transactions (tx_id, merchant_name, customer_name, amount, currency, method, status, fraud_score, settlement_status, country, reference_no, created_at) VALUES
  ('TXN-8842291','Nexus Digital PH','Rafael Ignacio Cruz',4280.00,'USD','visa','flagged',94,'unsettled','PH','REF-NX-009281','2026-05-09 12:18:00+00'),
  ('TXN-8842188','StellarMart Inc.','Maria Concepcion Reyes',1240.50,'USD','mastercard','completed',8,'settled','PH','REF-SM-018843','2026-05-09 12:14:00+00'),
  ('TXN-8842091','Apex Solutions Ltd.','Carlos Eduardo Ramos',8900.00,'USD','wire','processing',12,'unsettled','SG','REF-AP-001129','2026-05-09 12:09:00+00'),
  ('TXN-8841998','BlueStar Trading','Aisha Fernandez Bautista',320.00,'USD','gcash','completed',5,'settled','PH','REF-BT-227741','2026-05-09 12:01:00+00'),
  ('TXN-8841887','StellarMart Inc.','Javier Ocampo Santos',1750.00,'USD','paypal','flagged',81,'unsettled','US','REF-SM-018790','2026-05-09 11:52:00+00'),
  ('TXN-8841765','Orbis Retail Corp.','Priya Krishnamurthy',560.75,'USD','apple_pay','completed',11,'settled','SG','REF-OR-004412','2026-05-09 11:44:00+00'),
  ('TXN-8841610','Pinnacle Commerce','Luisa Magtangol Velasco',2200.00,'USD','ach','failed',22,'unsettled','PH','REF-PC-009928','2026-05-09 11:32:00+00'),
  ('TXN-8841512','Nexus Digital PH','Emmanuel Tan Aguilar',890.00,'USD','maya','completed',7,'settled','PH','REF-NX-009277','2026-05-09 11:21:00+00'),
  ('TXN-8841398','Apex Solutions Ltd.','Hiroshi Tanaka',5400.00,'USD','google_pay','disputed',45,'unsettled','JP','REF-AP-001120','2026-05-09 11:09:00+00'),
  ('TXN-8841290','BlueStar Trading','Sofia Delacroix Moreau',180.50,'USD','visa','refunded',3,'settled','FR','REF-BT-227699','2026-05-09 10:58:00+00'),
  ('TXN-8841187','Orbis Retail Corp.','Benjamin Okafor Adeyemi',3100.00,'USD','mastercard','completed',15,'settled','NG','REF-OR-004401','2026-05-09 10:44:00+00'),
  ('TXN-8841012','StellarMart Inc.','Mei-Ling Zhao',720.00,'USD','amex','pending',19,'pending','CN','REF-SM-018779','2026-05-09 10:31:00+00')
ON CONFLICT (tx_id) DO NOTHING;

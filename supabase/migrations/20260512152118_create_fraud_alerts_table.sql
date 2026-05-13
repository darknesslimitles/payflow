/*
  # Create fraud_alerts table

  1. New Tables
    - `fraud_alerts`
      - `id` (uuid, primary key)
      - `alert_code` (text, unique — FA-001)
      - `transaction_id` (text, references tx_id)
      - `merchant_name` (text)
      - `amount` (numeric)
      - `risk_score` (integer 0–100)
      - `risk_level` (text: critical | high | medium | low)
      - `reason` (text)
      - `status` (text: open | reviewed | dismissed)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Authenticated users can read/insert/update fraud alerts
*/

CREATE TABLE IF NOT EXISTS fraud_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_code text UNIQUE NOT NULL,
  transaction_id text NOT NULL DEFAULT '',
  merchant_name text NOT NULL DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  risk_score integer NOT NULL DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level text NOT NULL DEFAULT 'medium' CHECK (risk_level IN ('critical','high','medium','low')),
  reason text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','reviewed','dismissed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fraud_alerts_status ON fraud_alerts(status);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_risk_level ON fraud_alerts(risk_level);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_created_at ON fraud_alerts(created_at DESC);

ALTER TABLE fraud_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read fraud alerts"
  ON fraud_alerts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert fraud alerts"
  ON fraud_alerts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update fraud alerts"
  ON fraud_alerts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO fraud_alerts (alert_code, transaction_id, merchant_name, amount, risk_score, risk_level, reason, status, created_at) VALUES
  ('FA-001','TXN-8821','TechStore Pro',4299.99,94,'critical','Unusual location + high velocity','open','2026-05-10 02:45:00+00'),
  ('FA-002','TXN-8819','GlobalMart',1850.00,81,'high','Card not present, new device','open','2026-05-10 02:30:00+00'),
  ('FA-003','TXN-8810','QuickPay Ltd',320.50,67,'medium','Multiple failed attempts','reviewed','2026-05-10 01:15:00+00'),
  ('FA-004','TXN-8805','ShopEasy',99.00,45,'low','Slightly unusual time','dismissed','2026-05-09 23:50:00+00'),
  ('FA-005','TXN-8800','FoodDelivery Co',2100.00,88,'high','Velocity check failed','open','2026-05-09 22:10:00+00'),
  ('FA-006','TXN-8795','LuxuryGoods',7500.00,97,'critical','Stolen card pattern detected','open','2026-05-09 21:00:00+00')
ON CONFLICT (alert_code) DO NOTHING;

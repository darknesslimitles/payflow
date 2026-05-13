/*
  # Create analytics_metrics table

  1. New Tables
    - `analytics_metrics`
      - `id` (uuid, primary key)
      - `metric_date` (date)
      - `hour` (integer 0–23, nullable — for hourly data)
      - `gross_volume` (numeric)
      - `transaction_count` (integer)
      - `success_count` (integer)
      - `fraud_alert_count` (integer)
      - `chargeback_count` (integer)
      - `avg_transaction_value` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Authenticated users can read analytics metrics
*/

CREATE TABLE IF NOT EXISTS analytics_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date date NOT NULL,
  hour integer CHECK (hour >= 0 AND hour <= 23),
  gross_volume numeric NOT NULL DEFAULT 0,
  transaction_count integer NOT NULL DEFAULT 0,
  success_count integer NOT NULL DEFAULT 0,
  fraud_alert_count integer NOT NULL DEFAULT 0,
  chargeback_count integer NOT NULL DEFAULT 0,
  avg_transaction_value numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_analytics_metrics_date_hour ON analytics_metrics(metric_date, COALESCE(hour, -1));
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_date ON analytics_metrics(metric_date DESC);

ALTER TABLE analytics_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read analytics metrics"
  ON analytics_metrics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert analytics metrics"
  ON analytics_metrics FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Hourly data for today (May 9, 2026)
INSERT INTO analytics_metrics (metric_date, hour, gross_volume, transaction_count, success_count, fraud_alert_count, chargeback_count, avg_transaction_value) VALUES
  ('2026-05-09', 0,  38200,  52,  50, 0, 0, 734.62),
  ('2026-05-09', 1,  21400,  31,  30, 0, 0, 690.32),
  ('2026-05-09', 2,  14800,  18,  18, 0, 0, 822.22),
  ('2026-05-09', 3,   9200,  12,  12, 0, 0, 766.67),
  ('2026-05-09', 4,  11600,  16,  15, 0, 0, 725.00),
  ('2026-05-09', 5,  28900,  38,  37, 1, 0, 760.53),
  ('2026-05-09', 6,  54700,  74,  72, 1, 0, 739.19),
  ('2026-05-09', 7,  98400, 132, 129, 2, 1, 745.45),
  ('2026-05-09', 8, 187300, 248, 242, 3, 1, 755.24),
  ('2026-05-09', 9, 312800, 421, 411, 4, 2, 742.99),
  ('2026-05-09',10, 428500, 573, 558, 5, 3, 747.82),
  ('2026-05-09',11, 391200, 521, 508, 4, 2, 750.87),
  ('2026-05-09',12, 452900, 608, 593, 6, 3, 745.23),
-- Monthly summary data (no hour = NULL for daily rollup)
  ('2025-11-01', NULL, 1800000, 8200,  8000, 12, 8, 219.51),
  ('2025-12-01', NULL, 2400000,10500, 10200, 18,10, 228.57),
  ('2026-01-01', NULL, 2100000, 9800,  9500, 14, 9, 214.29),
  ('2026-02-01', NULL, 2600000,11200, 10900,  9, 7, 232.14),
  ('2026-03-01', NULL, 3000000,12800, 12500, 11, 8, 234.38),
  ('2026-04-01', NULL, 2800000,12100, 11800,  8, 6, 231.40),
  ('2026-05-01', NULL, 3200000,13500, 13100,  7, 5, 237.04)
ON CONFLICT DO NOTHING;

/*
  # Create notifications table

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `notification_code` (text, unique — N-001)
      - `type` (text: fraud | transaction | system | info)
      - `title` (text)
      - `message` (text)
      - `read` (boolean)
      - `user_id` (uuid, nullable — links to auth.users for per-user notifications)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Authenticated users can read/update their notifications
    - Global notifications (user_id IS NULL) visible to all authenticated users
*/

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_code text UNIQUE NOT NULL,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('fraud','transaction','system','info')),
  title text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  read boolean NOT NULL DEFAULT false,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read global and own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Authenticated users can insert notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update their notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id IS NULL OR user_id = auth.uid())
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Authenticated users can delete their notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (user_id IS NULL OR user_id = auth.uid());

INSERT INTO notifications (notification_code, type, title, message, read, created_at) VALUES
  ('N-001','fraud','Critical Fraud Alert','Transaction TXN-8821 flagged with risk score 94. Immediate review required.',false,'2026-05-10 02:45:00+00'),
  ('N-002','fraud','High Risk Transaction','TXN-8819 from GlobalMart flagged for card-not-present with new device.',false,'2026-05-10 02:30:00+00'),
  ('N-003','transaction','Large Transaction Detected','Transaction of $7,500 processed by LuxuryGoods exceeds threshold.',false,'2026-05-10 01:00:00+00'),
  ('N-004','system','System Maintenance Scheduled','Planned maintenance on May 12, 2026 from 02:00–04:00 UTC.',true,'2026-05-09 18:00:00+00'),
  ('N-005','info','Daily Summary Ready','Your daily transaction summary for May 9 is now available in Reports.',true,'2026-05-09 08:00:00+00'),
  ('N-006','transaction','Settlement Completed','Batch settlement of $284,500 for TechStore Pro completed successfully.',true,'2026-05-09 06:30:00+00'),
  ('N-007','fraud','Fraud Alert Resolved','Alert FA-003 for QuickPay Ltd has been reviewed and dismissed.',true,'2026-05-09 05:00:00+00')
ON CONFLICT (notification_code) DO NOTHING;

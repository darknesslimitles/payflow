export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      merchants: {
        Row: {
          id: string;
          merchant_code: string;
          name: string;
          category: string;
          status: 'active' | 'suspended' | 'pending';
          total_volume: number;
          transaction_count: number;
          success_rate: number;
          joined_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['merchants']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['merchants']['Insert']>;
      };
      transactions: {
        Row: {
          id: string;
          tx_id: string;
          merchant_name: string;
          customer_name: string;
          amount: number;
          currency: string;
          method: 'visa' | 'mastercard' | 'amex' | 'ach' | 'wire' | 'apple_pay' | 'google_pay' | 'gcash' | 'maya' | 'paypal';
          status: 'completed' | 'pending' | 'processing' | 'failed' | 'refunded' | 'disputed' | 'flagged';
          fraud_score: number;
          settlement_status: 'settled' | 'unsettled' | 'pending';
          country: string;
          reference_no: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>;
      };
      fraud_alerts: {
        Row: {
          id: string;
          alert_code: string;
          transaction_id: string;
          merchant_name: string;
          amount: number;
          risk_score: number;
          risk_level: 'critical' | 'high' | 'medium' | 'low';
          reason: string;
          status: 'open' | 'reviewed' | 'dismissed';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['fraud_alerts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['fraud_alerts']['Insert']>;
      };
      settlement_batches: {
        Row: {
          id: string;
          batch_id: string;
          merchant_name: string;
          amount: number;
          tx_count: number;
          status: 'settled' | 'processing' | 'pending' | 'failed';
          initiated_at: string;
          settled_at: string | null;
          lag: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['settlement_batches']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['settlement_batches']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          notification_code: string;
          type: 'fraud' | 'transaction' | 'system' | 'info';
          title: string;
          message: string;
          read: boolean;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
      platform_users: {
        Row: {
          id: string;
          user_code: string;
          name: string;
          email: string;
          role: 'admin' | 'analyst' | 'support' | 'viewer';
          status: 'active' | 'inactive' | 'suspended';
          last_login: string | null;
          joined_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['platform_users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['platform_users']['Insert']>;
      };
      analytics_metrics: {
        Row: {
          id: string;
          metric_date: string;
          hour: number | null;
          gross_volume: number;
          transaction_count: number;
          success_count: number;
          fraud_alert_count: number;
          chargeback_count: number;
          avg_transaction_value: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['analytics_metrics']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['analytics_metrics']['Insert']>;
      };
    };
  };
}

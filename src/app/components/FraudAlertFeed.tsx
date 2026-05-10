'use client';

import React, { useState } from 'react';
import { ShieldAlert, X, Eye, ChevronRight, AlertTriangle } from 'lucide-react';

import PaymentMethodBadge, { PaymentMethodType } from '@/components/ui/PaymentMethodBadge';

interface FraudAlert {
  id: string;
  txId: string;
  merchant: string;
  amount: string;
  method: PaymentMethodType;
  riskScore: number;
  reason: string;
  time: string;
  severity: 'critical' | 'high' | 'medium';
}

// Backend: replace with /api/fraud/alerts?status=active&limit=8
const initialAlerts: FraudAlert[] = [
  {
    id: 'alert-001',
    txId: 'TXN-8842291',
    merchant: 'Nexus Digital PH',
    amount: '$4,280.00',
    method: 'visa',
    riskScore: 94,
    reason: 'Velocity spike — 12 txns in 4 min from same IP',
    time: '2 min ago',
    severity: 'critical',
  },
  {
    id: 'alert-002',
    txId: 'TXN-8841887',
    merchant: 'StellarMart Inc.',
    amount: '$1,750.00',
    method: 'paypal',
    riskScore: 81,
    reason: 'Geolocation mismatch — billing vs device IP',
    time: '8 min ago',
    severity: 'high',
  },
  {
    id: 'alert-003',
    txId: 'TXN-8841203',
    merchant: 'Pinnacle Commerce',
    amount: '$890.50',
    method: 'gcash',
    riskScore: 77,
    reason: 'New device fingerprint + high-risk merchant category',
    time: '15 min ago',
    severity: 'high',
  },
  {
    id: 'alert-004',
    txId: 'TXN-8840991',
    merchant: 'Apex Solutions Ltd.',
    amount: '$3,100.00',
    method: 'mastercard',
    riskScore: 68,
    reason: 'Card BIN flagged in prior dispute cluster',
    time: '23 min ago',
    severity: 'medium',
  },
  {
    id: 'alert-005',
    txId: 'TXN-8840412',
    merchant: 'BlueStar Trading',
    amount: '$520.00',
    method: 'google_pay',
    riskScore: 62,
    reason: 'Unusual transaction pattern — off-hours purchase',
    time: '41 min ago',
    severity: 'medium',
  },
  {
    id: 'alert-006',
    txId: 'TXN-8839987',
    merchant: 'Orbis Retail Corp.',
    amount: '$2,440.00',
    method: 'ach',
    riskScore: 71,
    reason: 'ACH reversal pattern detected — prior 2 reversals',
    time: '58 min ago',
    severity: 'high',
  },
];

const severityConfig = {
  critical: { label: 'Critical', className: 'bg-danger-bg text-danger border-danger/20' },
  high: { label: 'High', className: 'bg-warning-bg text-warning border-warning/20' },
  medium: { label: 'Medium', className: 'bg-info-bg text-info border-info/20' },
};

export default function FraudAlertFeed() {
  const [alerts, setAlerts] = useState(initialAlerts);

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="card p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert size={16} className="text-danger" />
          <h3 className="text-sm font-bold text-foreground">Active Fraud Alerts</h3>
          <span className="bg-danger text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {alerts.length}
          </span>
        </div>
        <button className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
          View all
          <ChevronRight size={12} />
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 rounded-xl bg-success-bg flex items-center justify-center mb-3">
            <ShieldAlert size={24} className="text-success" />
          </div>
          <p className="text-sm font-semibold text-foreground">No active fraud alerts</p>
          <p className="text-xs text-muted-foreground mt-1">
            All transactions are within normal risk parameters
          </p>
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto scrollbar-thin flex-1 max-h-[340px]">
          {alerts.map((alert) => {
            const sev = severityConfig[alert.severity];
            return (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${sev.className} transition-all duration-200 group`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <AlertTriangle size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-xs font-bold font-mono">{alert.txId}</span>
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${sev.className}`}>
                      {sev.label}
                    </span>
                    <PaymentMethodBadge method={alert.method} showLabel={false} size="sm" />
                    <span className="text-xs font-bold tabular-nums ml-auto">
                      {alert.amount}
                    </span>
                  </div>
                  <p className="text-xs font-semibold truncate">{alert.merchant}</p>
                  <p className="text-xs opacity-80 truncate mt-0.5">{alert.reason}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1.5 flex-1">
                      <div className="flex-1 h-1 bg-black/10 rounded-full overflow-hidden max-w-[80px]">
                        <div
                          className="h-full bg-current rounded-full"
                          style={{ width: `${alert.riskScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold tabular-nums">
                        Risk {alert.riskScore}
                      </span>
                    </div>
                    <span className="text-xs opacity-60">{alert.time}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-1 rounded hover:bg-black/10 transition-all"
                    title="View transaction"
                  >
                    <Eye size={13} />
                  </button>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1 rounded hover:bg-black/10 transition-all"
                    title="Dismiss alert"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
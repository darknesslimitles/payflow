'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import { ShieldAlert, AlertTriangle, CheckCircle, XCircle, Filter } from 'lucide-react';

interface FraudAlert {
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
}

const riskColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

const statusColors: Record<string, string> = {
  open: 'bg-red-50 text-red-600',
  reviewed: 'bg-blue-50 text-blue-600',
  dismissed: 'bg-gray-100 text-gray-500',
};

export default function FraudAlertsPage() {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'reviewed' | 'dismissed'>('all');
  const [loading, setLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== 'all') params.set('status', filter);
    const res = await fetch(`/api/fraud-alerts?${params.toString()}`);
    const json = await res.json();
    setAlerts(json.data ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const openCount = alerts.filter((a) => a.status === 'open').length;
  const criticalCount = alerts.filter((a) => a.risk_level === 'critical').length;
  const reviewedCount = alerts.filter((a) => a.status === 'reviewed').length;
  const dismissedCount = alerts.filter((a) => a.status === 'dismissed').length;

  return (
    <AppLayout pageTitle="Fraud & Alerts" pageSubtitle="Monitor and manage fraud risk signals across all transactions">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Open Alerts', value: openCount, icon: <AlertTriangle size={18} />, color: 'text-red-500' },
          { label: 'Critical Risk', value: criticalCount, icon: <ShieldAlert size={18} />, color: 'text-red-600' },
          { label: 'Reviewed', value: reviewedCount, icon: <CheckCircle size={18} />, color: 'text-blue-500' },
          { label: 'Dismissed', value: dismissedCount, icon: <XCircle size={18} />, color: 'text-gray-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <span className={stat.color}>{stat.icon}</span>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Filter size={16} /> Fraud Alerts
          </h2>
          <div className="flex gap-1">
            {(['all', 'open', 'reviewed', 'dismissed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-secondary'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading alerts...</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  {['Alert ID', 'Transaction', 'Merchant', 'Amount', 'Risk Score', 'Risk Level', 'Reason', 'Status', 'Time'].map((col) => (
                    <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{alert.alert_code}</td>
                    <td className="px-4 py-3 font-mono text-xs text-primary">{alert.transaction_id}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{alert.merchant_name}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">${alert.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${alert.risk_score >= 80 ? 'bg-red-100 text-red-700' : alert.risk_score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {alert.risk_score}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${riskColors[alert.risk_level]}`}>
                        {alert.risk_level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs max-w-[180px] truncate">{alert.reason}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColors[alert.status]}`}>
                        {alert.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(alert.created_at).toLocaleString('en-US', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

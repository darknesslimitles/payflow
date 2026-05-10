'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { ShieldAlert, AlertTriangle, CheckCircle, XCircle, Filter } from 'lucide-react';

interface FraudAlert {
  id: string;
  transactionId: string;
  merchant: string;
  amount: number;
  riskScore: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  status: 'open' | 'reviewed' | 'dismissed';
  timestamp: string;
}

const mockAlerts: FraudAlert[] = [
  { id: 'FA-001', transactionId: 'TXN-8821', merchant: 'TechStore Pro', amount: 4299.99, riskScore: 94, riskLevel: 'critical', reason: 'Unusual location + high velocity', status: 'open', timestamp: '2026-05-10 02:45' },
  { id: 'FA-002', transactionId: 'TXN-8819', merchant: 'GlobalMart', amount: 1850.00, riskScore: 81, riskLevel: 'high', reason: 'Card not present, new device', status: 'open', timestamp: '2026-05-10 02:30' },
  { id: 'FA-003', transactionId: 'TXN-8810', merchant: 'QuickPay Ltd', amount: 320.50, riskScore: 67, riskLevel: 'medium', reason: 'Multiple failed attempts', status: 'reviewed', timestamp: '2026-05-10 01:15' },
  { id: 'FA-004', transactionId: 'TXN-8805', merchant: 'ShopEasy', amount: 99.00, riskScore: 45, riskLevel: 'low', reason: 'Slightly unusual time', status: 'dismissed', timestamp: '2026-05-09 23:50' },
  { id: 'FA-005', transactionId: 'TXN-8800', merchant: 'FoodDelivery Co', amount: 2100.00, riskScore: 88, riskLevel: 'high', reason: 'Velocity check failed', status: 'open', timestamp: '2026-05-09 22:10' },
  { id: 'FA-006', transactionId: 'TXN-8795', merchant: 'LuxuryGoods', amount: 7500.00, riskScore: 97, riskLevel: 'critical', reason: 'Stolen card pattern detected', status: 'open', timestamp: '2026-05-09 21:00' },
];

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
  const [filter, setFilter] = useState<'all' | 'open' | 'reviewed' | 'dismissed'>('all');

  const filtered = filter === 'all' ? mockAlerts : mockAlerts.filter(a => a.status === filter);
  const openCount = mockAlerts.filter(a => a.status === 'open').length;
  const criticalCount = mockAlerts.filter(a => a.riskLevel === 'critical').length;

  return (
    <AppLayout pageTitle="Fraud & Alerts" pageSubtitle="Monitor and manage fraud risk signals across all transactions">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Open Alerts', value: openCount, icon: <AlertTriangle size={18} />, color: 'text-red-500' },
          { label: 'Critical Risk', value: criticalCount, icon: <ShieldAlert size={18} />, color: 'text-red-600' },
          { label: 'Reviewed Today', value: 8, icon: <CheckCircle size={18} />, color: 'text-blue-500' },
          { label: 'Dismissed', value: 12, icon: <XCircle size={18} />, color: 'text-gray-400' },
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

      {/* Filter */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2"><Filter size={16} /> Fraud Alerts</h2>
          <div className="flex gap-1">
            {(['all', 'open', 'reviewed', 'dismissed'] as const).map(f => (
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
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Alert ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Transaction</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Merchant</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Amount</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Risk Score</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Risk Level</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Reason</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((alert) => (
                <tr key={alert.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{alert.id}</td>
                  <td className="px-4 py-3 font-mono text-xs text-primary">{alert.transactionId}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{alert.merchant}</td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">${alert.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${alert.riskScore >= 80 ? 'bg-red-100 text-red-700' : alert.riskScore >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {alert.riskScore}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${riskColors[alert.riskLevel]}`}>{alert.riskLevel}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs max-w-[180px] truncate">{alert.reason}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColors[alert.status]}`}>{alert.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{alert.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

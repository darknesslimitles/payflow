'use client';

import React from 'react';
import { Clock, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';

interface SettlementBatch {
  id: string;
  batchId: string;
  merchant: string;
  amount: string;
  txCount: number;
  status: 'settled' | 'processing' | 'pending' | 'failed';
  initiatedAt: string;
  settledAt: string | null;
  lag: string;
}

// Backend: replace with /api/settlements?limit=6
const batches: SettlementBatch[] = [
  {
    id: 'batch-001',
    batchId: 'SB-20260509-001',
    merchant: 'Nexus Digital PH',
    amount: '$48,200.00',
    txCount: 62,
    status: 'settled',
    initiatedAt: '09:00 AM',
    settledAt: '11:24 AM',
    lag: '2h 24m',
  },
  {
    id: 'batch-002',
    batchId: 'SB-20260509-002',
    merchant: 'StellarMart Inc.',
    amount: '$124,750.00',
    txCount: 187,
    status: 'settled',
    initiatedAt: '09:00 AM',
    settledAt: '11:51 AM',
    lag: '2h 51m',
  },
  {
    id: 'batch-003',
    batchId: 'SB-20260509-003',
    merchant: 'Pinnacle Commerce',
    amount: '$89,300.00',
    txCount: 134,
    status: 'processing',
    initiatedAt: '10:00 AM',
    settledAt: null,
    lag: 'In progress',
  },
  {
    id: 'batch-004',
    batchId: 'SB-20260509-004',
    merchant: 'Apex Solutions Ltd.',
    amount: '$211,400.00',
    txCount: 298,
    status: 'processing',
    initiatedAt: '11:00 AM',
    settledAt: null,
    lag: 'In progress',
  },
  {
    id: 'batch-005',
    batchId: 'SB-20260509-005',
    merchant: 'BlueStar Trading',
    amount: '$34,600.00',
    txCount: 51,
    status: 'pending',
    initiatedAt: '12:00 PM',
    settledAt: null,
    lag: 'Scheduled',
  },
  {
    id: 'batch-006',
    batchId: 'SB-20260509-006',
    merchant: 'Orbis Retail Corp.',
    amount: '$76,100.00',
    txCount: 108,
    status: 'failed',
    initiatedAt: '08:00 AM',
    settledAt: null,
    lag: 'Failed — retry',
  },
];

const statusIcon = {
  settled: <CheckCircle2 size={14} className="text-success" />,
  processing: <Clock size={14} className="text-info" />,
  pending: <Clock size={14} className="text-warning" />,
  failed: <AlertCircle size={14} className="text-danger" />,
};

const statusBadge = {
  settled: 'badge-success',
  processing: 'badge-info',
  pending: 'badge-warning',
  failed: 'badge-danger',
};

export default function SettlementPanel() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          <h3 className="text-sm font-bold text-foreground">Settlement Batches</h3>
          <span className="text-xs text-muted-foreground">Today</span>
        </div>
        <button className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
          View all batches
          <ChevronRight size={12} />
        </button>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Batch ID', 'Merchant', 'Amount', 'Transactions', 'Status', 'Initiated', 'Lag'].map(
                (col) => (
                  <th
                    key={`settle-col-${col}`}
                    className="text-left pb-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide pr-4 last:pr-0 whitespace-nowrap"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {batches.map((batch) => (
              <tr
                key={batch.id}
                className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors group"
              >
                <td className="py-3 pr-4 text-xs font-mono font-semibold text-primary whitespace-nowrap">
                  {batch.batchId}
                </td>
                <td className="py-3 pr-4 text-sm font-medium text-foreground whitespace-nowrap">
                  {batch.merchant}
                </td>
                <td className="py-3 pr-4 text-sm font-bold tabular-nums text-foreground whitespace-nowrap">
                  {batch.amount}
                </td>
                <td className="py-3 pr-4 text-sm tabular-nums text-muted-foreground whitespace-nowrap">
                  {batch.txCount.toLocaleString()}
                </td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      batch.status === 'settled' ?'bg-success-bg text-success'
                        : batch.status === 'processing' ?'bg-info-bg text-info'
                        : batch.status === 'pending' ?'bg-warning-bg text-warning' :'bg-danger-bg text-danger'
                    }`}
                  >
                    {statusIcon[batch.status]}
                    {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 pr-4 text-sm text-muted-foreground whitespace-nowrap">
                  {batch.initiatedAt}
                </td>
                <td
                  className={`py-3 text-sm font-semibold tabular-nums whitespace-nowrap ${
                    batch.status === 'failed' ?'text-danger'
                      : batch.status === 'settled' ?'text-success' :'text-muted-foreground'
                  }`}
                >
                  {batch.lag}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
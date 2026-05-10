'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { CreditCard } from 'lucide-react';

// Backend: replace with /api/analytics/payment-methods?range=today
const methodData = [
  { method: 'Visa', volume: 892400, count: 1241, color: '#1D4ED8' },
  { method: 'Mastercard', volume: 634200, count: 887, color: '#EA580C' },
  { method: 'PayPal', volume: 421800, count: 612, color: '#4338CA' },
  { method: 'GCash', volume: 318500, count: 748, color: '#0284C7' },
  { method: 'ACH', volume: 287600, count: 124, color: '#64748B' },
  { method: 'Google Pay', volume: 198300, count: 341, color: '#16A34A' },
  { method: 'Maya', volume: 156400, count: 312, color: '#059669' },
  { method: 'Apple Pay', volume: 112800, count: 198, color: '#374151' },
  { method: 'Wire', volume: 89200, count: 18, color: '#94A3B8' },
  { method: 'Amex', volume: 46200, count: 52, color: '#0EA5E9' },
];

const formatK = (v: number) =>
  v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}K`;

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: typeof methodData[0] }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-card border border-border rounded-xl shadow-elevated p-3">
      <p className="text-xs font-bold text-foreground mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-xs text-muted-foreground">Volume</span>
          <span className="text-xs font-bold tabular-nums">{formatK(payload[0]?.value ?? 0)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-xs text-muted-foreground">Transactions</span>
          <span className="text-xs font-bold tabular-nums text-accent">{d?.count.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default function PaymentMethodChart() {
  const [metric, setMetric] = useState<'volume' | 'count'>('volume');

  return (
    <div className="card p-5 h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard size={16} className="text-primary" />
            <h3 className="text-sm font-bold text-foreground">
              Payment Method Distribution
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">By volume and transaction count</p>
        </div>
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(['volume', 'count'] as const).map((m) => (
            <button
              key={`toggle-${m}`}
              onClick={() => setMetric(m)}
              className={`px-3 py-1.5 text-xs font-semibold transition-all ${
                metric === m
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              {m === 'volume' ? 'Volume' : 'Count'}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={methodData}
          layout="vertical"
          margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
          barSize={12}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            horizontal={false}
          />
          <XAxis
            type="number"
            tickFormatter={metric === 'volume' ? formatK : (v) => v.toString()}
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="method"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            width={68}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={metric} radius={[0, 4, 4, 0]}>
            {methodData.map((entry, index) => (
              <Cell
                key={`cell-method-${index}`}
                fill={entry.color}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
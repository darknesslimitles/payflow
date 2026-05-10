'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

// Backend: replace with /api/analytics/volume?range=today&interval=hourly
const hourlyData = [
  { time: '12 AM', volume: 38200, count: 52 },
  { time: '1 AM', volume: 21400, count: 31 },
  { time: '2 AM', volume: 14800, count: 18 },
  { time: '3 AM', volume: 9200, count: 12 },
  { time: '4 AM', volume: 11600, count: 16 },
  { time: '5 AM', volume: 28900, count: 38 },
  { time: '6 AM', volume: 54700, count: 74 },
  { time: '7 AM', volume: 98400, count: 132 },
  { time: '8 AM', volume: 187300, count: 248 },
  { time: '9 AM', volume: 312800, count: 421 },
  { time: '10 AM', volume: 428500, count: 573 },
  { time: '11 AM', volume: 391200, count: 521 },
  { time: '12 PM', volume: 452900, count: 608 },
];

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-elevated p-3 min-w-[160px]">
      <p className="text-xs font-semibold text-muted-foreground mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">Volume</span>
          <span className="text-sm font-bold text-foreground tabular-nums">
            {formatCurrency(payload[0]?.value ?? 0)}
          </span>
        </div>
        {payload[1] && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">Transactions</span>
            <span className="text-sm font-bold text-accent tabular-nums">
              {payload[1].value}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VolumeChart() {
  return (
    <div className="card p-5 h-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-primary" />
            <h3 className="text-sm font-bold text-foreground">
              Transaction Volume — Today
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Hourly GTV and transaction count (May 9, 2026)
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-primary rounded-full inline-block" />
            <span className="text-muted-foreground">Volume</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-accent rounded-full inline-block" />
            <span className="text-muted-foreground">Count</span>
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart
          data={hourlyData}
          margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.18} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="countGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.14} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            interval={2}
          />
          <YAxis
            yAxisId="volume"
            tickFormatter={formatCurrency}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            width={56}
          />
          <YAxis
            yAxisId="count"
            orientation="right"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            yAxisId="volume"
            type="monotone"
            dataKey="volume"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#volumeGradient)"
          />
          <Area
            yAxisId="count"
            type="monotone"
            dataKey="count"
            stroke="var(--accent)"
            strokeWidth={1.5}
            fill="url(#countGradient)"
            strokeDasharray="4 2"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
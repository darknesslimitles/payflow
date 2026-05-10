'use client';

import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from 'recharts';
import { Brain, TrendingDown, Zap } from 'lucide-react';

// Backend: replace with /api/ml/risk-summary
const riskData = [{ name: 'Detection Rate', value: 94.7, fill: 'var(--primary)' }];

const mlStats = [
  { id: 'ml-stat-1', label: 'ML Model Version', value: 'v4.2.1', sub: 'Deployed 3 days ago' },
  { id: 'ml-stat-2', label: 'Detection Rate', value: '94.7%', sub: '↑ 1.2% this week' },
  { id: 'ml-stat-3', label: 'False Positive Rate', value: '2.1%', sub: '↓ 0.3% this week' },
  { id: 'ml-stat-4', label: 'Avg Risk Score', value: '18.4', sub: 'Out of 100 (low risk)' },
  { id: 'ml-stat-5', label: 'Anomalies Detected', value: '127', sub: 'Last 24 hours' },
  { id: 'ml-stat-6', label: 'Auto-Blocked', value: '38', sub: 'High-risk transactions' },
];

export default function MLRiskPanel() {
  return (
    <div className="card p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Brain size={16} className="text-primary" />
        <h3 className="text-sm font-bold text-foreground">ML Risk Intelligence</h3>
        <span className="ml-auto flex items-center gap-1 text-xs bg-success-bg text-success px-2 py-0.5 rounded-full font-semibold">
          <Zap size={10} />
          Active
        </span>
      </div>
      {/* Radial gauge */}
      <div className="flex items-center justify-center mb-2">
        <div className="relative w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="90%"
              startAngle={225}
              endAngle={-45}
              data={riskData}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background={{ fill: 'var(--muted)' }}
                dataKey="value"
                angleAxisId={0}
                cornerRadius={6}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold tabular-nums text-foreground">94.7%</span>
            <span className="text-xs text-muted-foreground">Detection</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mb-4">
        <TrendingDown size={13} className="text-success" />
        <span className="text-xs text-success font-semibold">Fraud rate down 8.3% this week</span>
      </div>
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2 flex-1">
        {mlStats?.map((stat) => (
          <div
            key={stat?.id}
            className="bg-secondary rounded-lg p-3"
          >
            <p className="text-xs text-muted-foreground truncate">{stat?.label}</p>
            <p className="text-sm font-bold text-foreground tabular-nums mt-0.5">
              {stat?.value}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{stat?.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
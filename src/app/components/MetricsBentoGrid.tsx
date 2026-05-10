'use client';

import React from 'react';
import { ShieldAlert, CheckCircle2, Clock, AlertTriangle, ArrowUpRight, ArrowDownRight, DollarSign, Activity,  } from 'lucide-react';

interface MetricCardData {
  id: string;
  label: string;
  value: string;
  subValue?: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  variant: 'default' | 'success' | 'danger' | 'warning' | 'info';
  featured?: boolean;
}

const metrics: MetricCardData[] = [
  {
    id: 'metric-gtv',
    label: 'Gross Transaction Volume',
    value: '$2,847,391',
    subValue: 'Today',
    change: 12.4,
    changeLabel: 'vs yesterday',
    icon: <DollarSign size={20} />,
    variant: 'default',
    featured: true,
  },
  {
    id: 'metric-success-rate',
    label: 'Transaction Success Rate',
    value: '96.3%',
    subValue: '4,218 / 4,380 txns',
    change: 0.8,
    changeLabel: 'vs yesterday',
    icon: <CheckCircle2 size={20} />,
    variant: 'success',
  },
  {
    id: 'metric-fraud-alerts',
    label: 'Active Fraud Alerts',
    value: '14',
    subValue: '3 critical',
    change: -5,
    changeLabel: 'vs yesterday',
    icon: <ShieldAlert size={20} />,
    variant: 'danger',
  },
  {
    id: 'metric-chargeback',
    label: 'Chargeback Rate',
    value: '0.73%',
    subValue: '32 disputes',
    change: 0.12,
    changeLabel: 'vs last week',
    icon: <AlertTriangle size={20} />,
    variant: 'warning',
  },
  {
    id: 'metric-atv',
    label: 'Avg Transaction Value',
    value: '$648.40',
    subValue: 'Per transaction',
    change: -3.1,
    changeLabel: 'vs yesterday',
    icon: <Activity size={20} />,
    variant: 'info',
  },
  {
    id: 'metric-settlement-lag',
    label: 'Settlement Lag',
    value: '18.4h',
    subValue: 'Avg to settle',
    change: 2.1,
    changeLabel: 'vs yesterday',
    icon: <Clock size={20} />,
    variant: 'warning',
  },
];

const variantStyles: Record<
  string,
  { bg: string; icon: string; border: string }
> = {
  default: {
    bg: 'bg-card',
    icon: 'bg-primary/10 text-primary',
    border: 'border-border',
  },
  success: {
    bg: 'bg-card',
    icon: 'bg-success-bg text-success',
    border: 'border-border',
  },
  danger: {
    bg: 'bg-danger-bg',
    icon: 'bg-danger/20 text-danger',
    border: 'border-danger/20',
  },
  warning: {
    bg: 'bg-warning-bg',
    icon: 'bg-warning/20 text-warning',
    border: 'border-warning/20',
  },
  info: {
    bg: 'bg-info-bg',
    icon: 'bg-info/10 text-info',
    border: 'border-info/20',
  },
};

function MetricCard({ metric }: { metric: MetricCardData }) {
  const styles = variantStyles[metric.variant];
  const isPositive = metric.change > 0;
  const isDangerMetric = metric.id === 'metric-fraud-alerts' || metric.id === 'metric-chargeback' || metric.id === 'metric-settlement-lag';
  const trendGood = isDangerMetric ? !isPositive : isPositive;

  return (
    <div
      className={`${styles.bg} border ${styles.border} rounded-xl p-5 flex flex-col gap-4 shadow-card hover:shadow-elevated transition-shadow duration-200 ${
        metric.featured ? 'row-span-1' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="metric-label">{metric.label}</p>
          {metric.subValue && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {metric.subValue}
            </p>
          )}
        </div>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${styles.icon}`}
        >
          {metric.icon}
        </div>
      </div>

      <div>
        <p
          className={`tabular-nums font-bold text-foreground ${
            metric.featured ? 'text-4xl' : 'text-2xl'
          }`}
        >
          {metric.value}
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <span
          className={`flex items-center gap-0.5 text-xs font-semibold ${
            trendGood ? 'text-success' : 'text-danger'
          }`}
        >
          {trendGood ? (
            <ArrowUpRight size={14} />
          ) : (
            <ArrowDownRight size={14} />
          )}
          {Math.abs(metric.change)}
          {metric.id === 'metric-fraud-alerts' || metric.id === 'metric-settlement-lag' ? '' : '%'}
        </span>
        <span className="text-xs text-muted-foreground">{metric.changeLabel}</span>
      </div>
    </div>
  );
}

export default function MetricsBentoGrid() {
  // 6 cards → grid-cols-4 → row1: hero spans 2 cols + 2 regular, row2: 4 regular but we use 3-col last row with last spanning 2
  // Plan: grid-cols-2 md:grid-cols-4 — hero spans 2, rest are 1 each = 2+1+1 / 1+1+1+1 — last card spans 2 to fill
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {/* Hero — spans 2 cols */}
      <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2">
        <MetricCard metric={metrics[0]} />
      </div>
      {/* Regular cards */}
      {metrics.slice(1, 4).map((metric) => (
        <div key={metric.id} className="col-span-1">
          <MetricCard metric={metric} />
        </div>
      ))}
      {/* Last 2 cards — each 1 col, total 4 in second row: 2(hero space) + 2 = but row 2 is 4 cols, so 4 regular */}
      {metrics.slice(4).map((metric) => (
        <div key={metric.id} className="col-span-1 sm:col-span-1 lg:col-span-1">
          <MetricCard metric={metric} />
        </div>
      ))}
    </div>
  );
}
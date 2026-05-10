import React from 'react';

type StatusType =
  | 'completed'
  | 'pending' |'processing' |'failed' |'refunded' |'disputed' |'flagged' |'settled' |'unsettled' |'active' |'inactive';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
}

const statusConfig: Record<
  StatusType,
  { label: string; className: string; dot: string }
> = {
  completed: {
    label: 'Completed',
    className: 'bg-success-bg text-success',
    dot: 'bg-success',
  },
  pending: {
    label: 'Pending',
    className: 'bg-warning-bg text-warning',
    dot: 'bg-warning',
  },
  processing: {
    label: 'Processing',
    className: 'bg-info-bg text-info',
    dot: 'bg-info',
  },
  failed: {
    label: 'Failed',
    className: 'bg-danger-bg text-danger',
    dot: 'bg-danger',
  },
  refunded: {
    label: 'Refunded',
    className: 'bg-muted text-muted-foreground',
    dot: 'bg-muted-foreground',
  },
  disputed: {
    label: 'Disputed',
    className: 'bg-warning-bg text-warning',
    dot: 'bg-warning',
  },
  flagged: {
    label: 'Flagged',
    className: 'bg-danger-bg text-danger',
    dot: 'bg-danger',
  },
  settled: {
    label: 'Settled',
    className: 'bg-success-bg text-success',
    dot: 'bg-success',
  },
  unsettled: {
    label: 'Unsettled',
    className: 'bg-warning-bg text-warning',
    dot: 'bg-warning',
  },
  active: {
    label: 'Active',
    className: 'bg-success-bg text-success',
    dot: 'bg-success',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-muted text-muted-foreground',
    dot: 'bg-muted-foreground',
  },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${config.className} ${
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
      {config.label}
    </span>
  );
}
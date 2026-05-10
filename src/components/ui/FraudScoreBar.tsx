import React from 'react';

interface FraudScoreBarProps {
  score: number; // 0-100
  showLabel?: boolean;
}

export default function FraudScoreBar({
  score,
  showLabel = true,
}: FraudScoreBarProps) {
  const getColor = () => {
    if (score >= 70) return 'bg-danger';
    if (score >= 40) return 'bg-warning';
    return 'bg-success';
  };

  const getTextColor = () => {
    if (score >= 70) return 'text-danger';
    if (score >= 40) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden min-w-[48px]">
        <div
          className={`h-full rounded-full transition-all ${getColor()}`}
          style={{ width: `${score}%` }}
        />
      </div>
      {showLabel && (
        <span className={`text-xs font-semibold tabular-nums flex-shrink-0 ${getTextColor()}`}>
          {score}
        </span>
      )}
    </div>
  );
}
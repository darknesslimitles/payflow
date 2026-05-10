'use client';

import React, { useState } from 'react';
import { Calendar, ChevronDown, RefreshCw } from 'lucide-react';

const dateRanges = [
  { id: 'filter-today', label: 'Today' },
  { id: 'filter-7d', label: 'Last 7 days' },
  { id: 'filter-30d', label: 'Last 30 days' },
  { id: 'filter-90d', label: 'Last 90 days' },
  { id: 'filter-custom', label: 'Custom range' },
];

export default function DashboardFilters() {
  const [selectedRange, setSelectedRange] = useState('filter-today');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [lastUpdated] = useState('12:31 PM');

  const selectedLabel = dateRanges?.find((r) => r?.id === selectedRange)?.label ?? 'Today';

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        {dateRanges?.slice(0, 4)?.map((range) => (
          <button
            key={range?.id}
            onClick={() => setSelectedRange(range?.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              selectedRange === range?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            {range?.label}
          </button>
        ))}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150 ${
              selectedRange === 'filter-custom' ?'bg-primary text-primary-foreground border-primary' :'bg-card border-border text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <Calendar size={14} />
            <span>Custom</span>
            <ChevronDown size={12} />
          </button>
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-xl shadow-elevated z-20 p-1">
              <p className="text-xs text-muted-foreground px-3 py-2">
                Date range picker — connect to date library
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span>Live</span>
        </div>
        <span>·</span>
        <span>Updated {lastUpdated}</span>
        <button className="p-1.5 rounded-lg hover:bg-secondary transition-all">
          <RefreshCw size={12} />
        </button>
      </div>
    </div>
  );
}
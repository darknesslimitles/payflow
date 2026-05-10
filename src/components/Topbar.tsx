'use client';

import React, { useState } from 'react';
import { Search, Bell, RefreshCw, ChevronDown } from 'lucide-react';

interface TopbarProps {
  pageTitle?: string;
  pageSubtitle?: string;
  sidebarCollapsed?: boolean;
}

export default function Topbar({
  pageTitle,
  pageSubtitle,
}: TopbarProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="h-16 bg-card border-b border-border flex items-center px-6 lg:px-8 xl:px-10 gap-4 flex-shrink-0 sticky top-0 z-30">
      {/* Page Title */}
      <div className="flex-1 min-w-0">
        {pageTitle && (
          <div>
            <h1 className="text-lg font-bold text-foreground truncate leading-tight">
              {pageTitle}
            </h1>
            {pageSubtitle && (
              <p className="text-xs text-muted-foreground truncate">
                {pageSubtitle}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Search */}
      <div
        className={`relative hidden md:flex items-center transition-all duration-200 ${
          searchFocused ? 'w-72' : 'w-56'
        }`}
      >
        <Search
          size={14}
          className="absolute left-3 text-muted-foreground pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search transactions..."
          className="w-full pl-8 pr-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Refresh */}
      <button className="btn-ghost p-2 hidden sm:flex" title="Refresh data">
        <RefreshCw size={16} />
      </button>

      {/* Notifications */}
      <div className="relative">
        <button className="btn-ghost p-2 relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>
      </div>

      {/* User */}
      <div className="flex items-center gap-2.5 cursor-pointer hover:bg-secondary rounded-lg px-2 py-1.5 transition-all">
        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
          JL
        </div>
        <div className="hidden lg:block">
          <p className="text-sm font-semibold text-foreground leading-tight">
            James Lim
          </p>
          <p className="text-xs text-muted-foreground leading-tight">Admin</p>
        </div>
        <ChevronDown size={14} className="text-muted-foreground hidden lg:block" />
      </div>
    </header>
  );
}
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Settings,
  LogOut,
  Bell,
  Building2,
  Users,
  FileBarChart2,
  CreditCard,
} from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  group: string;
}

const navItems: NavItem[] = [
  {
    id: 'nav-dashboard',
    label: 'Analytics Dashboard',
    icon: <LayoutDashboard size={18} />,
    href: '/',
    group: 'main',
  },
  {
    id: 'nav-transactions',
    label: 'Transaction Management',
    icon: <ArrowLeftRight size={18} />,
    href: '/transaction-management',
    group: 'main',
  },
  {
    id: 'nav-fraud',
    label: 'Fraud & Alerts',
    icon: <ShieldAlert size={18} />,
    href: '/fraud-alerts',
    badge: 3,
    group: 'main',
  },
  {
    id: 'nav-merchants',
    label: 'Merchants',
    icon: <Building2 size={18} />,
    href: '/merchants',
    group: 'management',
  },
  {
    id: 'nav-payment-methods',
    label: 'Payment Methods',
    icon: <CreditCard size={18} />,
    href: '/payment-methods',
    group: 'management',
  },
  {
    id: 'nav-reports',
    label: 'Reports',
    icon: <FileBarChart2 size={18} />,
    href: '/reports',
    group: 'management',
  },
  {
    id: 'nav-users',
    label: 'User Management',
    icon: <Users size={18} />,
    href: '/user-management',
    group: 'admin',
  },
  {
    id: 'nav-settings',
    label: 'Settings',
    icon: <Settings size={18} />,
    href: '/settings',
    group: 'admin',
  },
];

const groupLabels: Record<string, string> = {
  main: 'Overview',
  management: 'Management',
  admin: 'Admin',
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const groups = ['main', 'management', 'admin'];

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen bg-card border-r border-border flex flex-col z-40
        sidebar-transition overflow-hidden
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div
        className={`flex items-center h-16 border-b border-border flex-shrink-0 ${
          collapsed ? 'justify-center px-0' : 'px-4 gap-3'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <AppLogo size={28} />
          {!collapsed && (
            <span className="font-bold text-base text-foreground tracking-tight truncate">
              PayFlow
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
        {groups.map((group) => {
          const items = navItems.filter((i) => i.group === group);
          return (
            <div key={`group-${group}`} className="mb-4">
              {!collapsed && (
                <p className="section-label mb-2">{groupLabels[group]}</p>
              )}
              <ul className="space-y-0.5">
                {items.map((item) => (
                  <li key={item.id}>
                    <div className="relative group/nav">
                      <Link
                        href={item.href}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer
                          ${collapsed ? 'justify-center' : ''}
                          ${
                            isActive(item.href)
                              ? 'bg-primary/10 text-primary font-semibold' :'text-muted-foreground hover:bg-secondary hover:text-foreground'
                          }
                        `}
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                        {!collapsed && (
                          <span className="truncate flex-1">{item.label}</span>
                        )}
                        {!collapsed && item.badge && (
                          <span className="ml-auto flex-shrink-0 bg-danger text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                        {collapsed && item.badge && (
                          <span className="absolute top-1 right-1 bg-danger text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                      {/* Tooltip for collapsed */}
                      {collapsed && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-foreground text-primary-foreground text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover/nav:opacity-100 transition-opacity duration-150 pointer-events-none z-50 shadow-elevated">
                          {item.label}
                          {item.badge && (
                            <span className="ml-1.5 bg-danger text-white text-xs rounded-full px-1.5">
                              {item.badge}
                            </span>
                          )}
                          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Notifications */}
      {!collapsed && (
        <div className="px-2 pb-2">
          <Link
            href="/notifications"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive('/notifications') ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
          >
            <Bell size={18} />
            <span className="flex-1">Notifications</span>
            <span className="bg-warning text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              5
            </span>
          </Link>
        </div>
      )}

      {/* User */}
      <div className="border-t border-border p-2 flex-shrink-0">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
              JL
            </div>
            <button className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-secondary transition-all cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
              JL
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate">
                James Lim
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Admin
              </p>
            </div>
            <LogOut
              size={16}
              className="text-muted-foreground hover:text-danger transition-colors flex-shrink-0"
            />
          </div>
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-card hover:bg-secondary transition-all z-50"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight size={12} className="text-muted-foreground" />
        ) : (
          <ChevronLeft size={12} className="text-muted-foreground" />
        )}
      </button>
    </aside>
  );
}
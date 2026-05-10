'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Bell, ShieldAlert, ArrowLeftRight, Info, CheckCheck, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  type: 'fraud' | 'transaction' | 'system' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: 'N-001', type: 'fraud', title: 'Critical Fraud Alert', message: 'Transaction TXN-8821 flagged with risk score 94. Immediate review required.', timestamp: '2026-05-10 02:45', read: false },
  { id: 'N-002', type: 'fraud', title: 'High Risk Transaction', message: 'TXN-8819 from GlobalMart flagged for card-not-present with new device.', timestamp: '2026-05-10 02:30', read: false },
  { id: 'N-003', type: 'transaction', title: 'Large Transaction Detected', message: 'Transaction of $7,500 processed by LuxuryGoods exceeds threshold.', timestamp: '2026-05-10 01:00', read: false },
  { id: 'N-004', type: 'system', title: 'System Maintenance Scheduled', message: 'Planned maintenance on May 12, 2026 from 02:00–04:00 UTC.', timestamp: '2026-05-09 18:00', read: true },
  { id: 'N-005', type: 'info', title: 'Daily Summary Ready', message: 'Your daily transaction summary for May 9 is now available in Reports.', timestamp: '2026-05-09 08:00', read: true },
  { id: 'N-006', type: 'transaction', title: 'Settlement Completed', message: 'Batch settlement of $284,500 for TechStore Pro completed successfully.', timestamp: '2026-05-09 06:30', read: true },
  { id: 'N-007', type: 'fraud', title: 'Fraud Alert Resolved', message: 'Alert FA-003 for QuickPay Ltd has been reviewed and dismissed.', timestamp: '2026-05-09 05:00', read: true },
];

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  fraud: { icon: <ShieldAlert size={16} />, color: 'text-red-600', bg: 'bg-red-50' },
  transaction: { icon: <ArrowLeftRight size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' },
  system: { icon: <Info size={16} />, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  info: { icon: <Bell size={16} />, color: 'text-gray-500', bg: 'bg-gray-50' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayed = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  return (
    <AppLayout pageTitle="Notifications" pageSubtitle="Stay updated on alerts, transactions, and system events">
      <div className="max-w-3xl">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1">
            {(['all', 'unread'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-secondary'}`}
              >
                {f} {f === 'unread' && unreadCount > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5">{unreadCount}</span>}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 text-sm text-primary hover:underline">
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="space-y-2">
          {displayed.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
              <Bell size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No notifications</p>
            </div>
          )}
          {displayed.map(notif => {
            const config = typeConfig[notif.type];
            return (
              <div
                key={notif.id}
                className={`bg-card border rounded-xl p-4 flex gap-3 transition-all ${notif.read ? 'border-border opacity-70' : 'border-primary/30 shadow-sm'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg} ${config.color}`}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${notif.read ? 'text-muted-foreground' : 'text-foreground'}`}>{notif.title}</p>
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1.5">{notif.timestamp}</p>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  {!notif.read && (
                    <button onClick={() => markRead(notif.id)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" title="Mark as read">
                      <CheckCheck size={13} />
                    </button>
                  )}
                  <button onClick={() => dismiss(notif.id)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors" title="Dismiss">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

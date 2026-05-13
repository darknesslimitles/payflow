'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import { Bell, ShieldAlert, ArrowLeftRight, Info, CheckCheck, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  notification_code: string;
  type: 'fraud' | 'transaction' | 'system' | 'info';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  fraud: { icon: <ShieldAlert size={16} />, color: 'text-red-600', bg: 'bg-red-50' },
  transaction: { icon: <ArrowLeftRight size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' },
  system: { icon: <Info size={16} />, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  info: { icon: <Bell size={16} />, color: 'text-gray-500', bg: 'bg-gray-50' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter === 'unread') params.set('unread', 'true');
    const res = await fetch(`/api/notifications?${params.toString()}`);
    const json = await res.json();
    setNotifications(json.data ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayed = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ markAll: true }) });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = async (id: string) => {
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, read: true }) });
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const dismiss = async (id: string) => {
    await fetch(`/api/notifications?id=${id}`, { method: 'DELETE' });
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <AppLayout pageTitle="Notifications" pageSubtitle="Stay updated on alerts, transactions, and system events">
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1">
            {(['all', 'unread'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-secondary'}`}
              >
                {f}{' '}
                {f === 'unread' && unreadCount > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 text-sm text-primary hover:underline">
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>

        <div className="space-y-2">
          {loading && <div className="bg-card border border-border rounded-xl p-8 text-center text-sm text-muted-foreground">Loading notifications...</div>}
          {!loading && displayed.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
              <Bell size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No notifications</p>
            </div>
          )}
          {displayed.map((notif) => {
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
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {new Date(notif.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
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

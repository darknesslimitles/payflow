'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import { Users, Search, Shield, UserCheck, UserX } from 'lucide-react';

interface PlatformUser {
  id: string;
  user_code: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'support' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  last_login: string | null;
  joined_date: string | null;
}

const roleColors: Record<string, string> = {
  admin: 'bg-sky-100 text-sky-700',
  analyst: 'bg-blue-100 text-blue-700',
  support: 'bg-teal-100 text-teal-700',
  viewer: 'bg-gray-100 text-gray-600',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-500',
  suspended: 'bg-red-100 text-red-700',
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (roleFilter !== 'all') params.set('role', roleFilter);
    const res = await fetch(`/api/platform-users?${params.toString()}`);
    const json = await res.json();
    setUsers(json.data ?? []);
    setLoading(false);
  }, [debouncedSearch, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const stats = [
    { label: 'Total Users', value: users.length, icon: <Users size={16} /> },
    { label: 'Active', value: users.filter((u) => u.status === 'active').length, icon: <UserCheck size={16} /> },
    { label: 'Admins', value: users.filter((u) => u.role === 'admin').length, icon: <Shield size={16} /> },
    { label: 'Suspended', value: users.filter((u) => u.status === 'suspended').length, icon: <UserX size={16} /> },
  ];

  return (
    <AppLayout pageTitle="User Management" pageSubtitle="Manage platform users, roles, and access permissions">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <span className="text-primary">{stat.icon}</span>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Users size={16} /> All Users
          </h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="analyst">Analyst</option>
              <option value="support">Support</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading users...</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  {['User', 'Role', 'Status', 'Last Login', 'Joined'].map((col) => (
                    <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                          {user.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${roleColors[user.role]}`}>{user.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColors[user.status]}`}>{user.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {user.last_login ? new Date(user.last_login).toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{user.joined_date ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

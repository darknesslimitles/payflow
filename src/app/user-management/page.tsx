'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Users, Search, Shield, UserCheck, UserX } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'support' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
}

const mockUsers: User[] = [
  { id: 'U-001', name: 'James Lim', email: 'james.lim@payflow.com', role: 'admin', status: 'active', lastLogin: '2026-05-10 03:00', createdAt: '2023-01-10' },
  { id: 'U-002', name: 'Sarah Chen', email: 'sarah.chen@payflow.com', role: 'analyst', status: 'active', lastLogin: '2026-05-10 01:30', createdAt: '2023-04-22' },
  { id: 'U-003', name: 'Michael Torres', email: 'm.torres@payflow.com', role: 'support', status: 'active', lastLogin: '2026-05-09 18:45', createdAt: '2023-07-15' },
  { id: 'U-004', name: 'Priya Nair', email: 'p.nair@payflow.com', role: 'analyst', status: 'inactive', lastLogin: '2026-04-28 10:00', createdAt: '2024-01-05' },
  { id: 'U-005', name: 'David Kim', email: 'd.kim@payflow.com', role: 'viewer', status: 'active', lastLogin: '2026-05-09 22:10', createdAt: '2024-03-18' },
  { id: 'U-006', name: 'Emma Wilson', email: 'e.wilson@payflow.com', role: 'support', status: 'suspended', lastLogin: '2026-04-01 09:00', createdAt: '2023-11-30' },
];

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
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
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filtered = mockUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <AppLayout pageTitle="User Management" pageSubtitle="Manage platform users, roles, and access permissions">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Users', value: mockUsers.length, icon: <Users size={16} /> },
          { label: 'Active', value: mockUsers.filter(u => u.status === 'active').length, icon: <UserCheck size={16} /> },
          { label: 'Admins', value: mockUsers.filter(u => u.role === 'admin').length, icon: <Shield size={16} /> },
          { label: 'Suspended', value: mockUsers.filter(u => u.status === 'suspended').length, icon: <UserX size={16} /> },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <span className="text-primary">{stat.icon}</span>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2"><Users size={16} /> All Users</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
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
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Last Login</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
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
                  <td className="px-4 py-3 text-xs text-muted-foreground">{user.lastLogin}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{user.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

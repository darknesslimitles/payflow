'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Building2, Search } from 'lucide-react';

interface Merchant {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'suspended' | 'pending';
  totalVolume: number;
  transactions: number;
  successRate: number;
  joinedDate: string;
}

const mockMerchants: Merchant[] = [
  { id: 'M-001', name: 'TechStore Pro', category: 'Electronics', status: 'active', totalVolume: 284500, transactions: 1240, successRate: 98.2, joinedDate: '2024-01-15' },
  { id: 'M-002', name: 'GlobalMart', category: 'Retail', status: 'active', totalVolume: 512000, transactions: 3820, successRate: 97.5, joinedDate: '2023-11-08' },
  { id: 'M-003', name: 'QuickPay Ltd', category: 'Finance', status: 'suspended', totalVolume: 98200, transactions: 540, successRate: 88.1, joinedDate: '2024-03-22' },
  { id: 'M-004', name: 'ShopEasy', category: 'E-commerce', status: 'active', totalVolume: 175300, transactions: 2100, successRate: 99.1, joinedDate: '2023-09-01' },
  { id: 'M-005', name: 'FoodDelivery Co', category: 'Food & Beverage', status: 'active', totalVolume: 63400, transactions: 890, successRate: 95.6, joinedDate: '2024-02-14' },
  { id: 'M-006', name: 'LuxuryGoods', category: 'Luxury', status: 'pending', totalVolume: 0, transactions: 0, successRate: 0, joinedDate: '2026-05-09' },
  { id: 'M-007', name: 'TravelBookings', category: 'Travel', status: 'active', totalVolume: 320100, transactions: 1560, successRate: 96.8, joinedDate: '2023-07-20' },
];

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  suspended: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
};

export default function MerchantsPage() {
  const [search, setSearch] = useState('');

  const filtered = mockMerchants.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout pageTitle="Merchants" pageSubtitle="Manage and monitor all registered merchants on the platform">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Merchants', value: mockMerchants.length },
          { label: 'Active', value: mockMerchants.filter(m => m.status === 'active').length },
          { label: 'Suspended', value: mockMerchants.filter(m => m.status === 'suspended').length },
          { label: 'Pending Review', value: mockMerchants.filter(m => m.status === 'pending').length },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2"><Building2 size={16} /> All Merchants</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search merchants..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Merchant</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Total Volume</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Transactions</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Success Rate</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(merchant => (
                <tr key={merchant.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{merchant.name.charAt(0)}</div>
                      <div>
                        <p className="font-medium text-foreground">{merchant.name}</p>
                        <p className="text-xs text-muted-foreground">{merchant.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{merchant.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColors[merchant.status]}`}>{merchant.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">${merchant.totalVolume.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{merchant.transactions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-semibold ${merchant.successRate >= 95 ? 'text-green-600' : merchant.successRate >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {merchant.successRate > 0 ? `${merchant.successRate}%` : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{merchant.joinedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

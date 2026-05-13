'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import { Building2, Search } from 'lucide-react';

interface Merchant {
  id: string;
  merchant_code: string;
  name: string;
  category: string;
  status: 'active' | 'suspended' | 'pending';
  total_volume: number;
  transaction_count: number;
  success_rate: number;
  joined_date: string | null;
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  suspended: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
};

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchMerchants = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    const res = await fetch(`/api/merchants?${params.toString()}`);
    const json = await res.json();
    setMerchants(json.data ?? []);
    setLoading(false);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  const stats = [
    { label: 'Total Merchants', value: merchants.length },
    { label: 'Active', value: merchants.filter((m) => m.status === 'active').length },
    { label: 'Suspended', value: merchants.filter((m) => m.status === 'suspended').length },
    { label: 'Pending Review', value: merchants.filter((m) => m.status === 'pending').length },
  ];

  return (
    <AppLayout pageTitle="Merchants" pageSubtitle="Manage and monitor all registered merchants on the platform">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Building2 size={16} /> All Merchants
          </h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search merchants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading merchants...</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  {['Merchant', 'Category', 'Status', 'Total Volume', 'Transactions', 'Success Rate', 'Joined'].map((col) => (
                    <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {merchants.map((merchant) => (
                  <tr key={merchant.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                          {merchant.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{merchant.name}</p>
                          <p className="text-xs text-muted-foreground">{merchant.merchant_code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{merchant.category}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColors[merchant.status]}`}>
                        {merchant.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-foreground">${merchant.total_volume.toLocaleString()}</td>
                    <td className="px-4 py-3 text-muted-foreground">{merchant.transaction_count.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${merchant.success_rate >= 95 ? 'text-green-600' : merchant.success_rate >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {merchant.success_rate > 0 ? `${merchant.success_rate}%` : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{merchant.joined_date ?? '—'}</td>
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

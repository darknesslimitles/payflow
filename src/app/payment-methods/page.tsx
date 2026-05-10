'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { CreditCard, Smartphone, Building, Wallet } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  icon: React.ReactNode;
  transactionCount: number;
  volume: number;
  successRate: number;
  avgProcessingTime: string;
  status: 'active' | 'inactive';
}

const paymentMethods: PaymentMethod[] = [
  { id: 'PM-001', name: 'Visa / Mastercard', type: 'Credit Card', icon: <CreditCard size={20} />, transactionCount: 14820, volume: 2840000, successRate: 98.4, avgProcessingTime: '1.2s', status: 'active' },
  { id: 'PM-002', name: 'American Express', type: 'Credit Card', icon: <CreditCard size={20} />, transactionCount: 3210, volume: 980000, successRate: 97.8, avgProcessingTime: '1.5s', status: 'active' },
  { id: 'PM-003', name: 'Apple Pay', type: 'Digital Wallet', icon: <Smartphone size={20} />, transactionCount: 5640, volume: 720000, successRate: 99.1, avgProcessingTime: '0.8s', status: 'active' },
  { id: 'PM-004', name: 'Google Pay', type: 'Digital Wallet', icon: <Wallet size={20} />, transactionCount: 4120, volume: 540000, successRate: 98.9, avgProcessingTime: '0.9s', status: 'active' },
  { id: 'PM-005', name: 'Bank Transfer (ACH)', type: 'Bank Transfer', icon: <Building size={20} />, transactionCount: 1890, volume: 3200000, successRate: 96.2, avgProcessingTime: '2-3 days', status: 'active' },
  { id: 'PM-006', name: 'PayPal', type: 'Digital Wallet', icon: <Wallet size={20} />, transactionCount: 2340, volume: 310000, successRate: 97.5, avgProcessingTime: '1.1s', status: 'inactive' },
];

const totalVolume = paymentMethods.reduce((sum, pm) => sum + pm.volume, 0);

export default function PaymentMethodsPage() {
  return (
    <AppLayout pageTitle="Payment Methods" pageSubtitle="Overview of all supported payment methods and their performance">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Methods', value: paymentMethods.length },
          { label: 'Active', value: paymentMethods.filter(p => p.status === 'active').length },
          { label: 'Total Transactions', value: paymentMethods.reduce((s, p) => s + p.transactionCount, 0).toLocaleString() },
          { label: 'Total Volume', value: `$${(totalVolume / 1000000).toFixed(1)}M` },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Method Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {paymentMethods.map(pm => {
          const share = ((pm.volume / totalVolume) * 100).toFixed(1);
          return (
            <div key={pm.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {pm.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{pm.name}</p>
                    <p className="text-xs text-muted-foreground">{pm.type}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${pm.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {pm.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Volume</span>
                  <span className="font-semibold text-foreground">${pm.volume.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transactions</span>
                  <span className="font-medium text-foreground">{pm.transactionCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span className={`font-semibold ${pm.successRate >= 98 ? 'text-green-600' : pm.successRate >= 95 ? 'text-yellow-600' : 'text-red-600'}`}>{pm.successRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg. Processing</span>
                  <span className="font-medium text-foreground">{pm.avgProcessingTime}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Volume Share</span>
                  <span>{share}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${share}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}

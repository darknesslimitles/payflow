'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { FileBarChart2, Download, TrendingUp, TrendingDown, DollarSign, ArrowLeftRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const monthlyData = [
  { month: 'Nov', volume: 1.8, transactions: 8200, fraud: 12 },
  { month: 'Dec', volume: 2.4, transactions: 10500, fraud: 18 },
  { month: 'Jan', volume: 2.1, transactions: 9800, fraud: 14 },
  { month: 'Feb', volume: 2.6, transactions: 11200, fraud: 9 },
  { month: 'Mar', volume: 3.0, transactions: 12800, fraud: 11 },
  { month: 'Apr', volume: 2.8, transactions: 12100, fraud: 8 },
  { month: 'May', volume: 3.2, transactions: 13500, fraud: 7 },
];

const reportTypes = [
  { id: 'transaction', label: 'Transaction Summary', description: 'Full ledger of all transactions with filters', icon: <ArrowLeftRight size={18} /> },
  { id: 'revenue', label: 'Revenue Report', description: 'Monthly and quarterly revenue breakdown', icon: <DollarSign size={18} /> },
  { id: 'fraud', label: 'Fraud Analysis', description: 'Fraud trends, risk scores, and alerts', icon: <TrendingDown size={18} /> },
  { id: 'merchant', label: 'Merchant Performance', description: 'Per-merchant volume and success rates', icon: <TrendingUp size={18} /> },
];

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState('transaction');

  return (
    <AppLayout pageTitle="Reports" pageSubtitle="Analytics reports and exportable data summaries">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Volume (May)', value: '$3.2M', change: '+14.3%', up: true },
          { label: 'Transactions (May)', value: '13,500', change: '+11.6%', up: true },
          { label: 'Avg. Ticket Size', value: '$237', change: '+2.4%', up: true },
          { label: 'Fraud Rate', value: '0.05%', change: '-12%', up: false },
        ].map(kpi => (
          <div key={kpi.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className={`text-xs font-medium mt-0.5 ${kpi.up ? 'text-green-600' : 'text-red-500'}`}>{kpi.change} vs last month</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        {/* Volume Chart */}
        <div className="xl:col-span-2 bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-4">Monthly Transaction Volume ($M)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`$${v}M`, 'Volume']} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Bar dataKey="volume" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fraud Trend */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-4">Fraud Alerts Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Line type="monotone" dataKey="fraud" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: '#ef4444' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Report Types */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <FileBarChart2 size={16} className="text-primary" />
          <h2 className="font-semibold text-foreground">Export Reports</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
          {reportTypes.map(report => (
            <div
              key={report.id}
              className={`p-4 cursor-pointer transition-colors hover:bg-secondary/30 ${activeReport === report.id ? 'bg-primary/5' : ''}`}
              onClick={() => setActiveReport(report.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-primary">{report.icon}</span>
                  <div>
                    <p className="font-medium text-foreground">{report.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{report.description}</p>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-lg hover:bg-primary/20 transition-colors">
                  <Download size={12} /> Export
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { ChartBar as FileBarChart2, Download, TrendingUp, TrendingDown, DollarSign, ArrowLeftRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

type MonthlyRow = { month: string; volume: number; transactions: number; fraud: number };

const reportTypes = [
  { id: 'transaction', label: 'Transaction Summary', description: 'Full ledger of all transactions with filters', icon: <ArrowLeftRight size={18} /> },
  { id: 'revenue', label: 'Revenue Report', description: 'Monthly and quarterly revenue breakdown', icon: <DollarSign size={18} /> },
  { id: 'fraud', label: 'Fraud Analysis', description: 'Fraud trends, risk scores, and alerts', icon: <TrendingDown size={18} /> },
  { id: 'merchant', label: 'Merchant Performance', description: 'Per-merchant volume and success rates', icon: <TrendingUp size={18} /> },
];

export default function ReportsPage() {
  const [monthlyData, setMonthlyData] = useState<MonthlyRow[]>([]);
  const [activeReport, setActiveReport] = useState('transaction');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await fetch('/api/analytics/volume?range=month&interval=monthly');
      const json = await res.json();
      setMonthlyData(json.data ?? []);
      setLoading(false);
    }
    fetchData();
  }, []);

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
          {loading ? (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">Loading chart...</div>
          ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`$${v}M`, 'Volume']} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Bar dataKey="volume" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          )}
        </div>

        {/* Fraud Trend */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-4">Fraud Alerts Trend</h3>
          {loading ? (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">Loading chart...</div>
          ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Line type="monotone" dataKey="fraud" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: '#ef4444' }} />
            </LineChart>
          </ResponsiveContainer>
          )}
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

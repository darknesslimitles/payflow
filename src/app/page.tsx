import React from 'react';
import AppLayout from '@/components/AppLayout';
import MetricsBentoGrid from './components/MetricsBentoGrid';
import VolumeChart from './components/VolumeChart';
import PaymentMethodChart from './components/PaymentMethodChart';
import FraudAlertFeed from './components/FraudAlertFeed';
import SettlementPanel from './components/SettlementPanel';
import DashboardFilters from './components/DashboardFilters';
import MLRiskPanel from './components/MLRiskPanel';

export default function AnalyticsDashboardPage() {
  return (
    <AppLayout
      pageTitle="Analytics Dashboard"
      pageSubtitle="Real-time payment intelligence — May 9, 2026"
    >
      <div className="space-y-6 fade-in">
        <DashboardFilters />
        <MetricsBentoGrid />
        <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <VolumeChart />
          </div>
          <div className="xl:col-span-1">
            <MLRiskPanel />
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
            <PaymentMethodChart />
          </div>
          <div className="xl:col-span-2">
            <FraudAlertFeed />
          </div>
        </div>
        <SettlementPanel />
      </div>
    </AppLayout>
  );
}
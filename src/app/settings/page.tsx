'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Settings, Bell, Shield, CreditCard, Key, Save } from 'lucide-react';

const tabs = [
  { id: 'general', label: 'General', icon: <Settings size={15} /> },
  { id: 'security', label: 'Security', icon: <Shield size={15} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
  { id: 'payments', label: 'Payments', icon: <CreditCard size={15} /> },
  { id: 'api', label: 'API Keys', icon: <Key size={15} /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppLayout pageTitle="Settings" pageSubtitle="Configure platform preferences and system settings">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Sidebar Tabs */}
        <div className="md:w-48 flex-shrink-0">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {tabs?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-colors border-b border-border last:border-0 ${activeTab === tab?.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
              >
                {tab?.icon}
                {tab?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-card border border-border rounded-xl p-6">
          {activeTab === 'general' && (
            <div className="space-y-5">
              <h3 className="font-semibold text-foreground text-base border-b border-border pb-3">General Settings</h3>
              {[
                { label: 'Platform Name', value: 'PayFlow', type: 'text' },
                { label: 'Support Email', value: 'support@payflow.com', type: 'email' },
                { label: 'Default Currency', value: 'USD', type: 'text' },
                { label: 'Timezone', value: 'UTC+8 (Singapore)', type: 'text' },
              ]?.map(field => (
                <div key={field?.label}>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{field?.label}</label>
                  <input type={field?.type} defaultValue={field?.value} className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-foreground" />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-5">
              <h3 className="font-semibold text-foreground text-base border-b border-border pb-3">Security Settings</h3>
              {[
                { label: 'Two-Factor Authentication', description: 'Require 2FA for all admin accounts', enabled: true },
                { label: 'Session Timeout', description: 'Auto-logout after 30 minutes of inactivity', enabled: true },
                { label: 'IP Allowlist', description: 'Restrict access to specific IP addresses', enabled: false },
                { label: 'Audit Logging', description: 'Log all admin actions for compliance', enabled: true },
              ]?.map(setting => (
                <div key={setting?.label} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{setting?.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{setting?.description}</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${setting?.enabled ? 'bg-primary' : 'bg-secondary border border-border'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm mt-0.5 transition-transform ${setting?.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <h3 className="font-semibold text-foreground text-base border-b border-border pb-3">Notification Preferences</h3>
              {[
                { label: 'Fraud Alerts', description: 'Notify when high-risk transactions are detected', enabled: true },
                { label: 'Large Transactions', description: 'Alert for transactions over $10,000', enabled: true },
                { label: 'Failed Payments', description: 'Notify on payment failures exceeding 5%', enabled: false },
                { label: 'Daily Summary', description: 'Receive daily transaction summary email', enabled: true },
                { label: 'System Updates', description: 'Notify about platform maintenance and updates', enabled: false },
              ]?.map(setting => (
                <div key={setting?.label} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{setting?.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{setting?.description}</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${setting?.enabled ? 'bg-primary' : 'bg-secondary border border-border'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm mt-0.5 transition-transform ${setting?.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-5">
              <h3 className="font-semibold text-foreground text-base border-b border-border pb-3">Payment Configuration</h3>
              {[
                { label: 'Transaction Limit (Single)', value: '$50,000', type: 'text' },
                { label: 'Daily Volume Limit', value: '$500,000', type: 'text' },
                { label: 'Fraud Score Threshold', value: '75', type: 'number' },
                { label: 'Settlement Delay (days)', value: '2', type: 'number' },
              ]?.map(field => (
                <div key={field?.label}>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{field?.label}</label>
                  <input type={field?.type} defaultValue={field?.value} className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-foreground" />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-5">
              <h3 className="font-semibold text-foreground text-base border-b border-border pb-3">API Keys</h3>
              {[
                { label: 'Live API Key', value: 'pk_live_••••••••••••••••••••••••', env: 'Production' },
                { label: 'Test API Key', value: 'pk_test_••••••••••••••••••••••••', env: 'Sandbox' },
                { label: 'Webhook Secret', value: 'whsec_••••••••••••••••••••••••', env: 'All' },
              ]?.map(key => (
                <div key={key?.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-foreground">{key?.label}</label>
                    <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded">{key?.env}</span>
                  </div>
                  <div className="flex gap-2">
                    <input type="text" defaultValue={key?.value} readOnly className="flex-1 px-3 py-2 text-sm bg-secondary border border-border rounded-lg text-muted-foreground font-mono" />
                    <button className="px-3 py-2 text-xs bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium">Copy</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-border flex justify-end">
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${saved ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary/90'}`}
            >
              <Save size={14} />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

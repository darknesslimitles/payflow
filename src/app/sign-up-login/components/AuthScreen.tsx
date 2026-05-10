'use client';

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import AppLogo from '@/components/ui/AppLogo';
import { ShieldCheck, Zap, BarChart3, Globe } from 'lucide-react';

const features = [
  {
    id: 'feat-1',
    icon: <ShieldCheck size={18} className="text-sky-300" />,
    title: 'ML Fraud Detection',
    desc: '94.7% detection rate with real-time risk scoring',
  },
  {
    id: 'feat-2',
    icon: <Zap size={18} className="text-sky-300" />,
    title: 'Multi-Method Payments',
    desc: 'Cards, ACH, GCash, Maya, PayPal, Apple Pay & more',
  },
  {
    id: 'feat-3',
    icon: <BarChart3 size={18} className="text-sky-300" />,
    title: 'Real-Time Analytics',
    desc: 'Hourly GTV, chargeback rates, and settlement tracking',
  },
  {
    id: 'feat-4',
    icon: <Globe size={18} className="text-sky-300" />,
    title: 'Multi-Currency',
    desc: 'USD, PHP and 40+ currencies with live FX rates',
  },
];

export default function AuthScreen() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] bg-foreground flex-col justify-between p-10 xl:p-14 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, #1D4ED8 0%, transparent 70%)',
              transform: 'translate(30%, -30%)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, #0EA5E9 0%, transparent 70%)',
              transform: 'translate(-30%, 30%)',
            }}
          />
          {/* Grid lines */}
          <svg
            className="absolute inset-0 w-full h-full opacity-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <AppLogo size={36} />
          <span className="text-xl font-bold text-white tracking-tight">PayFlow</span>
        </div>

        {/* Main copy */}
        <div className="relative space-y-8">
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight text-balance">
              Intelligent payment
              <br />
              <span className="text-sky-400">operations platform</span>
              <br />
              for modern businesses
            </h1>
            <p className="mt-4 text-base text-white/60 max-w-md">
              Process, monitor, and protect multi-method transactions with
              ML-powered fraud detection and real-time analytics.
            </p>
          </div>

          {/* Feature list */}
          <div className="grid grid-cols-1 gap-3">
            {features.map((feat) => (
              <div
                key={feat.id}
                className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">{feat.icon}</div>
                <div>
                  <p className="text-sm font-semibold text-white">{feat.title}</p>
                  <p className="text-xs text-white/50 mt-0.5">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative flex items-center justify-between text-xs text-white/30">
          <span>© 2026 PayFlow Technologies Inc.</span>
          <div className="flex items-center gap-4">
            <span>SOC 2 Type II</span>
            <span>PCI DSS Level 1</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-background">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <AppLogo size={32} />
          <span className="text-lg font-bold text-foreground">PayFlow</span>
        </div>

        <div className="w-full max-w-md">
          {/* Tab switcher */}
          <div className="flex rounded-xl border border-border bg-secondary p-1 mb-8">
            {(['login', 'signup'] as const).map((t) => (
              <button
                key={`tab-${t}`}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  tab === t
                    ? 'bg-card text-foreground shadow-card'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <LoginForm onSwitchToSignup={() => setTab('signup')} />
          ) : (
            <SignUpForm onSwitchToLogin={() => setTab('login')} />
          )}
        </div>
      </div>
    </div>
  );
}
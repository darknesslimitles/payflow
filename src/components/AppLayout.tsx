'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
}

export default function AppLayout({
  children,
  pageTitle,
  pageSubtitle,
}: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div
        className={`flex-1 flex flex-col min-h-screen content-transition ${
          collapsed ? 'ml-16' : 'ml-60'
        }`}
      >
        <Topbar
          pageTitle={pageTitle}
          pageSubtitle={pageSubtitle}
          sidebarCollapsed={collapsed}
        />
        <main className="flex-1 px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
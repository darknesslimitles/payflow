import React from 'react';
import AppLayout from '@/components/AppLayout';
import TransactionTable from './components/TransactionTable';

export default function TransactionManagementPage() {
  return (
    <AppLayout
      pageTitle="Transaction Management"
      pageSubtitle="Full transaction ledger — search, filter, and act on payments"
    >
      <TransactionTable />
    </AppLayout>
  );
}
'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Eye,
  RotateCcw,
  Flag,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  CheckSquare,
  Square,
  Minus,
} from 'lucide-react';
import { toast } from 'sonner';
import StatusBadge from '@/components/ui/StatusBadge';
import FraudScoreBar from '@/components/ui/FraudScoreBar';
import PaymentMethodBadge, { PaymentMethodType } from '@/components/ui/PaymentMethodBadge';
import ConfirmModal from '@/components/ui/ConfirmModal';
import TransactionDetailDrawer from './TransactionDetailDrawer';

type TxStatus = 'completed' | 'pending' | 'processing' | 'failed' | 'refunded' | 'disputed' | 'flagged';

interface Transaction {
  id: string;
  txId: string;
  merchant: string;
  customer: string;
  amount: number;
  currency: string;
  method: PaymentMethodType;
  status: TxStatus;
  fraudScore: number;
  settlementStatus: 'settled' | 'unsettled' | 'pending';
  createdAt: string;
  country: string;
  referenceNo: string;
}

// Backend: replace with /api/transactions?page=1&limit=12
const allTransactions: Transaction[] = [
  {
    id: 'tx-8842291',
    txId: 'TXN-8842291',
    merchant: 'Nexus Digital PH',
    customer: 'Rafael Ignacio Cruz',
    amount: 4280.0,
    currency: 'USD',
    method: 'visa',
    status: 'flagged',
    fraudScore: 94,
    settlementStatus: 'unsettled',
    createdAt: '2026-05-09 12:18',
    country: 'PH',
    referenceNo: 'REF-NX-009281',
  },
  {
    id: 'tx-8842188',
    txId: 'TXN-8842188',
    merchant: 'StellarMart Inc.',
    customer: 'Maria Concepcion Reyes',
    amount: 1240.5,
    currency: 'USD',
    method: 'mastercard',
    status: 'completed',
    fraudScore: 8,
    settlementStatus: 'settled',
    createdAt: '2026-05-09 12:14',
    country: 'PH',
    referenceNo: 'REF-SM-018843',
  },
  {
    id: 'tx-8842091',
    txId: 'TXN-8842091',
    merchant: 'Apex Solutions Ltd.',
    customer: 'Carlos Eduardo Ramos',
    amount: 8900.0,
    currency: 'USD',
    method: 'wire',
    status: 'processing',
    fraudScore: 12,
    settlementStatus: 'unsettled',
    createdAt: '2026-05-09 12:09',
    country: 'SG',
    referenceNo: 'REF-AP-001129',
  },
  {
    id: 'tx-8841998',
    txId: 'TXN-8841998',
    merchant: 'BlueStar Trading',
    customer: 'Aisha Fernandez Bautista',
    amount: 320.0,
    currency: 'USD',
    method: 'gcash',
    status: 'completed',
    fraudScore: 5,
    settlementStatus: 'settled',
    createdAt: '2026-05-09 12:01',
    country: 'PH',
    referenceNo: 'REF-BT-227741',
  },
  {
    id: 'tx-8841887',
    txId: 'TXN-8841887',
    merchant: 'StellarMart Inc.',
    customer: 'Javier Ocampo Santos',
    amount: 1750.0,
    currency: 'USD',
    method: 'paypal',
    status: 'flagged',
    fraudScore: 81,
    settlementStatus: 'unsettled',
    createdAt: '2026-05-09 11:52',
    country: 'US',
    referenceNo: 'REF-SM-018790',
  },
  {
    id: 'tx-8841765',
    txId: 'TXN-8841765',
    merchant: 'Orbis Retail Corp.',
    customer: 'Priya Krishnamurthy',
    amount: 560.75,
    currency: 'USD',
    method: 'apple_pay',
    status: 'completed',
    fraudScore: 11,
    settlementStatus: 'settled',
    createdAt: '2026-05-09 11:44',
    country: 'SG',
    referenceNo: 'REF-OR-004412',
  },
  {
    id: 'tx-8841610',
    txId: 'TXN-8841610',
    merchant: 'Pinnacle Commerce',
    customer: 'Luisa Magtangol Velasco',
    amount: 2200.0,
    currency: 'USD',
    method: 'ach',
    status: 'failed',
    fraudScore: 22,
    settlementStatus: 'unsettled',
    createdAt: '2026-05-09 11:32',
    country: 'PH',
    referenceNo: 'REF-PC-009928',
  },
  {
    id: 'tx-8841512',
    txId: 'TXN-8841512',
    merchant: 'Nexus Digital PH',
    customer: 'Emmanuel Tan Aguilar',
    amount: 890.0,
    currency: 'USD',
    method: 'maya',
    status: 'completed',
    fraudScore: 7,
    settlementStatus: 'settled',
    createdAt: '2026-05-09 11:21',
    country: 'PH',
    referenceNo: 'REF-NX-009277',
  },
  {
    id: 'tx-8841398',
    txId: 'TXN-8841398',
    merchant: 'Apex Solutions Ltd.',
    customer: 'Hiroshi Tanaka',
    amount: 5400.0,
    currency: 'USD',
    method: 'google_pay',
    status: 'disputed',
    fraudScore: 45,
    settlementStatus: 'unsettled',
    createdAt: '2026-05-09 11:09',
    country: 'JP',
    referenceNo: 'REF-AP-001120',
  },
  {
    id: 'tx-8841290',
    txId: 'TXN-8841290',
    merchant: 'BlueStar Trading',
    customer: 'Sofia Delacroix Moreau',
    amount: 180.5,
    currency: 'USD',
    method: 'visa',
    status: 'refunded',
    fraudScore: 3,
    settlementStatus: 'settled',
    createdAt: '2026-05-09 10:58',
    country: 'FR',
    referenceNo: 'REF-BT-227699',
  },
  {
    id: 'tx-8841187',
    txId: 'TXN-8841187',
    merchant: 'Orbis Retail Corp.',
    customer: 'Benjamin Okafor Adeyemi',
    amount: 3100.0,
    currency: 'USD',
    method: 'mastercard',
    status: 'completed',
    fraudScore: 15,
    settlementStatus: 'settled',
    createdAt: '2026-05-09 10:44',
    country: 'NG',
    referenceNo: 'REF-OR-004401',
  },
  {
    id: 'tx-8841012',
    txId: 'TXN-8841012',
    merchant: 'StellarMart Inc.',
    customer: 'Mei-Ling Zhao',
    amount: 720.0,
    currency: 'USD',
    method: 'amex',
    status: 'pending',
    fraudScore: 19,
    settlementStatus: 'pending',
    createdAt: '2026-05-09 10:31',
    country: 'CN',
    referenceNo: 'REF-SM-018779',
  },
];

type SortField = 'txId' | 'merchant' | 'amount' | 'fraudScore' | 'createdAt';
type SortDir = 'asc' | 'desc';

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50];

const statusOptions = ['all', 'completed', 'pending', 'processing', 'failed', 'refunded', 'disputed', 'flagged'];
const methodOptions = ['all', 'visa', 'mastercard', 'amex', 'ach', 'wire', 'apple_pay', 'google_pay', 'gcash', 'maya', 'paypal'];
const riskOptions = [
  { id: 'risk-all', label: 'All Risk', value: 'all' },
  { id: 'risk-low', label: 'Low (0–39)', value: 'low' },
  { id: 'risk-medium', label: 'Medium (40–69)', value: 'medium' },
  { id: 'risk-high', label: 'High (70+)', value: 'high' },
];

export default function TransactionTable() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    action: string;
    ids: string[];
  }>({ open: false, action: '', ids: [] });
  const [detailTx, setDetailTx] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    let data = allTransactions;
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (t) =>
          t.txId.toLowerCase().includes(q) ||
          t.merchant.toLowerCase().includes(q) ||
          t.customer.toLowerCase().includes(q) ||
          t.referenceNo.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') data = data.filter((t) => t.status === statusFilter);
    if (methodFilter !== 'all') data = data.filter((t) => t.method === methodFilter);
    if (riskFilter !== 'all') {
      data = data.filter((t) => {
        if (riskFilter === 'low') return t.fraudScore < 40;
        if (riskFilter === 'medium') return t.fraudScore >= 40 && t.fraudScore < 70;
        if (riskFilter === 'high') return t.fraudScore >= 70;
        return true;
      });
    }
    data = [...data].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'amount') cmp = a.amount - b.amount;
      else if (sortField === 'fraudScore') cmp = a.fraudScore - b.fraudScore;
      else if (sortField === 'createdAt') cmp = a.createdAt.localeCompare(b.createdAt);
      else cmp = a[sortField].localeCompare(b[sortField]);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return data;
  }, [search, statusFilter, methodFilter, riskFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown size={12} className="text-muted-foreground" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-primary" />
      : <ChevronDown size={12} className="text-primary" />;
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === paginated.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(paginated.map((t) => t.id)));
  };

  const handleBulkAction = (action: string) => {
    setConfirmModal({ open: true, action, ids: Array.from(selectedIds) });
  };

  const confirmAction = () => {
    const count = confirmModal.ids.length;
    const actionLabels: Record<string, string> = {
      refund: `${count} transaction${count > 1 ? 's' : ''} refunded`,
      flag: `${count} transaction${count > 1 ? 's' : ''} flagged for review`,
      delete: `${count} transaction${count > 1 ? 's' : ''} deleted`,
    };
    toast.success(actionLabels[confirmModal.action] ?? 'Action completed');
    setSelectedIds(new Set());
    setConfirmModal({ open: false, action: '', ids: [] });
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setMethodFilter('all');
    setRiskFilter('all');
    setCurrentPage(1);
  };

  const hasFilters = search || statusFilter !== 'all' || methodFilter !== 'all' || riskFilter !== 'all';

  const exportCSV = () => {
    toast.success('Exporting transactions to CSV…');
    // Backend: replace with /api/transactions/export?format=csv
  };

  const selectAllState =
    selectedIds.size === 0 ? 'none' : selectedIds.size === paginated.length ? 'all' : 'partial';

  return (
    <div className="space-y-4 fade-in">
      {/* Toolbar */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search TxID, merchant, customer…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="input-field pl-8 pr-3 py-2 text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="input-field py-2 pr-8 text-sm appearance-none cursor-pointer min-w-[130px]"
            >
              {statusOptions.map((s) => (
                <option key={`status-opt-${s}`} value={s}>
                  {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>

          {/* Method filter */}
          <div className="relative">
            <select
              value={methodFilter}
              onChange={(e) => { setMethodFilter(e.target.value); setCurrentPage(1); }}
              className="input-field py-2 pr-8 text-sm appearance-none cursor-pointer min-w-[140px]"
            >
              {methodOptions.map((m) => (
                <option key={`method-opt-${m}`} value={m}>
                  {m === 'all' ? 'All Methods' : m.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>

          {/* Risk filter */}
          <div className="relative">
            <select
              value={riskFilter}
              onChange={(e) => { setRiskFilter(e.target.value); setCurrentPage(1); }}
              className="input-field py-2 pr-8 text-sm appearance-none cursor-pointer min-w-[140px]"
            >
              {riskOptions.map((r) => (
                <option key={r.id} value={r.value}>{r.label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>

          {hasFilters && (
            <button onClick={clearFilters} className="btn-ghost text-xs gap-1.5">
              <X size={12} />
              Clear filters
            </button>
          )}

          <div className="flex-1" />

          <button onClick={exportCSV} className="btn-secondary gap-2 text-sm">
            <Download size={14} />
            Export CSV
          </button>
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Filter size={11} />
              Active filters:
            </span>
            {statusFilter !== 'all' && (
              <span className="badge-info gap-1">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('all')}><X size={10} /></button>
              </span>
            )}
            {methodFilter !== 'all' && (
              <span className="badge-info gap-1">
                Method: {methodFilter}
                <button onClick={() => setMethodFilter('all')}><X size={10} /></button>
              </span>
            )}
            {riskFilter !== 'all' && (
              <span className="badge-info gap-1">
                Risk: {riskFilter}
                <button onClick={() => setRiskFilter('all')}><X size={10} /></button>
              </span>
            )}
            {search && (
              <span className="badge-info gap-1">
                &ldquo;{search}&rdquo;
                <button onClick={() => setSearch('')}><X size={10} /></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="w-10 pl-4 py-3">
                  <button onClick={toggleAll} className="flex items-center justify-center">
                    {selectAllState === 'all' ? (
                      <CheckSquare size={16} className="text-primary" />
                    ) : selectAllState === 'partial' ? (
                      <Minus size={16} className="text-primary" />
                    ) : (
                      <Square size={16} className="text-muted-foreground" />
                    )}
                  </button>
                </th>
                {[
                  { key: 'txId', label: 'Transaction ID' },
                  { key: 'merchant', label: 'Merchant' },
                  { key: null, label: 'Customer' },
                  { key: 'amount', label: 'Amount' },
                  { key: null, label: 'Method' },
                  { key: null, label: 'Status' },
                  { key: 'fraudScore', label: 'Fraud Score' },
                  { key: null, label: 'Settlement' },
                  { key: 'createdAt', label: 'Created At' },
                  { key: null, label: 'Actions' },
                ].map((col, i) => (
                  <th
                    key={`th-${col.label}-${i}`}
                    className={`py-3 pr-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap ${
                      i === 0 ? 'pl-3' : ''
                    } ${col.key ? 'cursor-pointer select-none hover:text-foreground' : ''}`}
                    onClick={() => col.key && handleSort(col.key as SortField)}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.key && <SortIcon field={col.key as SortField} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                        <Search size={20} className="text-muted-foreground" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">No transactions found</p>
                      <p className="text-xs text-muted-foreground max-w-xs">
                        Try adjusting your search or filters to find matching transactions.
                      </p>
                      <button onClick={clearFilters} className="btn-secondary text-xs">
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((tx) => (
                  <tr
                    key={tx.id}
                    className={`border-b border-border last:border-0 transition-colors group ${
                      selectedIds.has(tx.id) ? 'bg-primary/5' : 'hover:bg-secondary/40'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="pl-4 py-3.5 w-10">
                      <button
                        onClick={() => toggleSelect(tx.id)}
                        className="flex items-center justify-center"
                      >
                        {selectedIds.has(tx.id) ? (
                          <CheckSquare size={15} className="text-primary" />
                        ) : (
                          <Square size={15} className="text-muted-foreground" />
                        )}
                      </button>
                    </td>
                    {/* TxID */}
                    <td className="py-3.5 pr-4">
                      <span className="text-xs font-mono font-semibold text-primary whitespace-nowrap">
                        {tx.txId}
                      </span>
                    </td>
                    {/* Merchant */}
                    <td className="py-3.5 pr-4">
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">
                        {tx.merchant}
                      </span>
                    </td>
                    {/* Customer */}
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                          {tx.customer.charAt(0)}
                        </div>
                        <span className="text-sm text-foreground whitespace-nowrap">
                          {tx.customer}
                        </span>
                      </div>
                    </td>
                    {/* Amount */}
                    <td className="py-3.5 pr-4">
                      <span className="text-sm font-bold tabular-nums text-foreground whitespace-nowrap">
                        ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    {/* Method */}
                    <td className="py-3.5 pr-4">
                      <PaymentMethodBadge method={tx.method} />
                    </td>
                    {/* Status */}
                    <td className="py-3.5 pr-4">
                      <StatusBadge status={tx.status} size="sm" />
                    </td>
                    {/* Fraud Score */}
                    <td className="py-3.5 pr-4 min-w-[110px]">
                      <FraudScoreBar score={tx.fraudScore} />
                    </td>
                    {/* Settlement */}
                    <td className="py-3.5 pr-4">
                      <StatusBadge status={tx.settlementStatus} size="sm" />
                    </td>
                    {/* Created At */}
                    <td className="py-3.5 pr-4">
                      <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                        {tx.createdAt}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="relative group/btn">
                          <button
                            onClick={() => setDetailTx(tx)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                          >
                            <Eye size={14} />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-foreground text-primary-foreground text-xs rounded-lg whitespace-nowrap opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity z-10">
                            View details
                          </div>
                        </div>
                        <div className="relative group/btn">
                          <button
                            onClick={() => {
                              toast.success(`Refund initiated for ${tx.txId}`);
                            }}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-warning-bg hover:text-warning transition-all"
                            disabled={tx.status === 'refunded' || tx.status === 'failed'}
                          >
                            <RotateCcw size={14} />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-foreground text-primary-foreground text-xs rounded-lg whitespace-nowrap opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity z-10">
                            Initiate refund
                          </div>
                        </div>
                        <div className="relative group/btn">
                          <button
                            onClick={() => {
                              toast.success(`${tx.txId} flagged for manual review`);
                            }}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-danger-bg hover:text-danger transition-all"
                          >
                            <Flag size={14} />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-foreground text-primary-foreground text-xs rounded-lg whitespace-nowrap opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity z-10">
                            Flag for review
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-secondary/20 flex-wrap gap-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>
              {filtered.length === 0
                ? 'No results'
                : `Showing ${(currentPage - 1) * itemsPerPage + 1}–${Math.min(
                    currentPage * itemsPerPage,
                    filtered.length
                  )} of ${filtered.length} transactions`}
            </span>
            <div className="flex items-center gap-1.5">
              <span>Rows:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-border rounded-lg px-2 py-1 text-xs bg-card text-foreground"
              >
                {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                  <option key={`perpage-${n}`} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={`page-${page}`}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                    currentPage === page
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            {totalPages > 5 && (
              <span className="text-xs text-muted-foreground px-1">…</span>
            )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-primary-foreground rounded-2xl shadow-modal px-5 py-3 flex items-center gap-4 slide-up z-50">
          <span className="text-sm font-semibold">
            {selectedIds.size} transaction{selectedIds.size > 1 ? 's' : ''} selected
          </span>
          <div className="w-px h-5 bg-white/20" />
          <button
            onClick={() => handleBulkAction('refund')}
            className="flex items-center gap-1.5 text-sm font-medium hover:text-yellow-300 transition-colors"
          >
            <RotateCcw size={14} />
            Bulk Refund
          </button>
          <button
            onClick={() => handleBulkAction('flag')}
            className="flex items-center gap-1.5 text-sm font-medium hover:text-red-300 transition-colors"
          >
            <Flag size={14} />
            Flag All
          </button>
          <button
            onClick={() => handleBulkAction('delete')}
            className="flex items-center gap-1.5 text-sm font-medium hover:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
            Delete
          </button>
          <div className="w-px h-5 bg-white/20" />
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Confirm modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        title={
          confirmModal.action === 'delete'
            ? `Delete ${confirmModal.ids.length} transaction${confirmModal.ids.length > 1 ? 's' : ''}?`
            : confirmModal.action === 'refund'
            ? `Refund ${confirmModal.ids.length} transaction${confirmModal.ids.length > 1 ? 's' : ''}?`
            : `Flag ${confirmModal.ids.length} transaction${confirmModal.ids.length > 1 ? 's' : ''}?`
        }
        description={
          confirmModal.action === 'delete'
            ? 'This will permanently remove the selected transactions from the ledger. This action cannot be undone.'
            : confirmModal.action === 'refund' ?'Refund requests will be initiated for all selected transactions. Customers will be notified automatically.' :'Selected transactions will be flagged for manual fraud review and held for processing.'
        }
        confirmLabel={
          confirmModal.action === 'delete'
            ? 'Delete transactions'
            : confirmModal.action === 'refund' ?'Initiate refunds' :'Flag for review'
        }
        variant={confirmModal.action === 'delete' ? 'danger' : 'warning'}
        onConfirm={confirmAction}
        onCancel={() => setConfirmModal({ open: false, action: '', ids: [] })}
      />

      {/* Detail drawer */}
      {detailTx && (
        <TransactionDetailDrawer
          transaction={detailTx}
          onClose={() => setDetailTx(null)}
        />
      )}
    </div>
  );
}
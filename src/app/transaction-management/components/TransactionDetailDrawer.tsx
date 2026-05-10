'use client';

import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Clock,
  Shield,
  Building2,
  User,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  RotateCcw,
  MessageSquareWarning,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Banknote,
  Globe,
  Hash,
  Calendar,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import StatusBadge from '@/components/ui/StatusBadge';
import FraudScoreBar from '@/components/ui/FraudScoreBar';
import PaymentMethodBadge, { PaymentMethodType } from '@/components/ui/PaymentMethodBadge';

interface Transaction {
  id: string;
  txId: string;
  merchant: string;
  customer: string;
  amount: number;
  currency: string;
  method: PaymentMethodType;
  status: 'completed' | 'pending' | 'processing' | 'failed' | 'refunded' | 'disputed' | 'flagged';
  fraudScore: number;
  settlementStatus: 'settled' | 'unsettled' | 'pending';
  createdAt: string;
  country: string;
  referenceNo: string;
}

interface Props {
  transaction: Transaction;
  onClose: () => void;
}

type TabId = 'overview' | 'payment-path' | 'settlement' | 'fraud' | 'actions';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'payment-path', label: 'Payment Path' },
  { id: 'settlement', label: 'Settlement' },
  { id: 'fraud', label: 'Fraud Analysis' },
  { id: 'actions', label: 'Actions' },
];

function getPaymentPath(tx: Transaction) {
  const isSuccess = tx.status === 'completed' || tx.status === 'refunded';
  const isFailed = tx.status === 'failed';
  const isFlagged = tx.status === 'flagged' || tx.status === 'disputed';

  return [
    {
      id: 'pp-1',
      node: 'Customer',
      detail: tx.customer,
      sub: tx.country,
      status: 'done' as const,
      time: tx.createdAt,
    },
    {
      id: 'pp-2',
      node: 'Payment Gateway',
      detail: 'PayFlow Gateway v3',
      sub: 'TLS 1.3 encrypted',
      status: 'done' as const,
      time: '+0.8s',
    },
    {
      id: 'pp-3',
      node: 'Fraud Engine',
      detail: 'ML Risk Assessment',
      sub: `Score: ${tx.fraudScore}/100`,
      status: isFlagged ? ('alert' as const) : ('done' as const),
      time: '+1.2s',
    },
    {
      id: 'pp-4',
      node: 'Issuing Bank',
      detail: tx.method === 'gcash' ? 'GCash / Mynt' : tx.method === 'maya' ? 'Maya Bank' : 'Card Issuer Network',
      sub: 'Authorization request',
      status: isFailed ? ('failed' as const) : ('done' as const),
      time: '+2.1s',
    },
    {
      id: 'pp-5',
      node: 'Acquiring Bank',
      detail: 'BDO Unibank Acquiring',
      sub: 'Settlement routing',
      status: isFailed ? ('failed' as const) : isSuccess ? ('done' as const) : ('pending' as const),
      time: isFailed ? 'Declined' : '+2.9s',
    },
    {
      id: 'pp-6',
      node: 'Merchant Account',
      detail: tx.merchant,
      sub: tx.settlementStatus === 'settled' ? 'Funds credited' : 'Awaiting settlement',
      status: tx.settlementStatus === 'settled' ? ('done' as const) : isFailed ? ('failed' as const) : ('pending' as const),
      time: tx.settlementStatus === 'settled' ? 'T+1 day' : 'Pending',
    },
  ];
}

function getSettlementBreakdown(tx: Transaction) {
  const gross = tx.amount;
  const processingFee = parseFloat((gross * 0.029).toFixed(2));
  const networkFee = parseFloat((gross * 0.005).toFixed(2));
  const fxFee = tx.currency !== 'USD' ? parseFloat((gross * 0.015).toFixed(2)) : 0;
  const totalFees = processingFee + networkFee + fxFee;
  const net = parseFloat((gross - totalFees).toFixed(2));
  return { gross, processingFee, networkFee, fxFee, totalFees, net };
}

function getFraudSignals(tx: Transaction) {
  const signals = [];
  if (tx.fraudScore >= 70) {
    signals.push({ id: 'fs-1', label: 'Velocity anomaly detected', severity: 'high' as const, detail: '4 transactions in 8 minutes from same IP' });
    signals.push({ id: 'fs-2', label: 'Geolocation mismatch', severity: 'high' as const, detail: 'Card issuer country differs from transaction origin' });
  }
  if (tx.fraudScore >= 40) {
    signals.push({ id: 'fs-3', label: 'Device fingerprint new', severity: 'medium' as const, detail: 'First-time device for this customer account' });
    signals.push({ id: 'fs-4', label: 'Unusual transaction amount', severity: 'medium' as const, detail: `$${tx.amount.toLocaleString()} exceeds 30-day avg by 2.4×` });
  }
  if (tx.fraudScore < 40) {
    signals.push({ id: 'fs-5', label: 'Known customer profile', severity: 'low' as const, detail: 'Customer has 12 successful transactions' });
    signals.push({ id: 'fs-6', label: 'Device recognized', severity: 'low' as const, detail: 'Trusted device used in last 30 days' });
  }
  return signals;
}

const NodeStatusIcon = ({ status }: { status: 'done' | 'alert' | 'failed' | 'pending' }) => {
  if (status === 'done') return <CheckCircle2 size={16} className="text-success" />;
  if (status === 'alert') return <AlertTriangle size={16} className="text-warning" />;
  if (status === 'failed') return <XCircle size={16} className="text-danger" />;
  return <Loader2 size={16} className="text-muted-foreground animate-spin" />;
};

const SeverityBadge = ({ severity }: { severity: 'high' | 'medium' | 'low' }) => {
  const map = {
    high: 'bg-danger-bg text-danger border border-danger/20',
    medium: 'bg-warning-bg text-warning border border-warning/20',
    low: 'bg-success-bg text-success border border-success/20',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[severity]}`}>
      {severity.toUpperCase()}
    </span>
  );
};

export default function TransactionDetailDrawer({ transaction, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedSignal, setExpandedSignal] = useState<string | null>(null);

  const paymentPath = getPaymentPath(transaction);
  const settlement = getSettlementBreakdown(transaction);
  const fraudSignals = getFraudSignals(transaction);

  const handleAction = (action: string) => {
    setActionLoading(action);
    setTimeout(() => {
      setActionLoading(null);
      const messages: Record<string, string> = {
        refund: `Refund initiated for ${transaction.txId}`,
        dispute: `Dispute filed for ${transaction.txId}`,
        retry: `Retry queued for ${transaction.txId}`,
      };
      toast.success(messages[action] ?? 'Action completed');
    }, 1800);
  };

  const canRefund = transaction.status === 'completed' || transaction.status === 'settled';
  const canDispute = !['refunded', 'disputed'].includes(transaction.status);
  const canRetry = transaction.status === 'failed';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-card h-full flex flex-col shadow-modal border-l border-border slide-up">

        {/* Header */}
        <div className="flex-shrink-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">Transaction Details</h2>
            <p className="text-xs font-mono text-primary mt-0.5">{transaction.txId}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={transaction.status} />
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-muted-foreground hover:bg-secondary transition-all ml-2"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Amount hero */}
        <div className="flex-shrink-0 px-6 py-4 bg-secondary/40 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Transaction Amount</p>
              <p className="text-3xl font-bold tabular-nums text-foreground">
                ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                <span className="text-sm font-normal text-muted-foreground ml-2">{transaction.currency}</span>
              </p>
            </div>
            <PaymentMethodBadge method={transaction.method} />
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar size={11} />{transaction.createdAt}</span>
            <span className="flex items-center gap-1"><Globe size={11} />{transaction.country}</span>
            <span className="flex items-center gap-1"><Hash size={11} />{transaction.referenceNo}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 border-b border-border px-6 overflow-x-auto scrollbar-thin">
          <div className="flex gap-0 min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-6">

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Parties */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Parties</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Merchant</p>
                      <p className="text-sm font-semibold text-foreground">{transaction.merchant}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Customer</p>
                      <p className="text-sm font-semibold text-foreground">{transaction.customer}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction info grid */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Transaction Info</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Reference No.', value: transaction.referenceNo, icon: <Hash size={12} /> },
                    { label: 'Created At', value: transaction.createdAt, icon: <Calendar size={12} /> },
                    { label: 'Country', value: transaction.country, icon: <Globe size={12} /> },
                    { label: 'Currency', value: transaction.currency, icon: <Banknote size={12} /> },
                    { label: 'Payment Method', value: transaction.method.replace('_', ' ').toUpperCase(), icon: <CreditCard size={12} /> },
                    { label: 'Settlement', value: transaction.settlementStatus, icon: <TrendingUp size={12} /> },
                  ].map((item) => (
                    <div key={`info-${item.label}`} className="bg-secondary rounded-lg p-3">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">{item.icon}{item.label}</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5 capitalize">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick risk summary */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Shield size={12} />Risk Summary
                </h3>
                <div className="bg-secondary rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Fraud Score</span>
                    <span className={`text-sm font-bold tabular-nums ${transaction.fraudScore >= 70 ? 'text-danger' : transaction.fraudScore >= 40 ? 'text-warning' : 'text-success'}`}>
                      {transaction.fraudScore} / 100
                    </span>
                  </div>
                  <FraudScoreBar score={transaction.fraudScore} />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Low risk</span><span>High risk</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PAYMENT PATH ── */}
          {activeTab === 'payment-path' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                <Info size={13} className="text-primary flex-shrink-0" />
                <p className="text-xs text-muted-foreground">Full routing path from customer initiation to merchant settlement.</p>
              </div>

              <div className="space-y-0">
                {paymentPath.map((node, idx) => (
                  <div key={node.id} className="flex gap-3">
                    {/* Connector */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                        node.status === 'done' ? 'bg-success-bg border-success' :
                        node.status === 'alert' ? 'bg-warning-bg border-warning' :
                        node.status === 'failed'? 'bg-danger-bg border-danger' : 'bg-muted border-border'
                      }`}>
                        <NodeStatusIcon status={node.status} />
                      </div>
                      {idx < paymentPath.length - 1 && (
                        <div className="w-px flex-1 bg-border my-1" style={{ minHeight: '20px' }} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pb-5 flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground">{node.node}</p>
                          <p className="text-xs text-muted-foreground truncate">{node.detail}</p>
                          <p className={`text-xs mt-0.5 ${
                            node.status === 'alert' ? 'text-warning' :
                            node.status === 'failed' ? 'text-danger' :
                            node.status === 'pending' ? 'text-muted-foreground' :
                            'text-success'
                          }`}>{node.sub}</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <span className="text-xs text-muted-foreground tabular-nums">{node.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Flow summary */}
              <div className="bg-secondary rounded-xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Routing Summary</p>
                <div className="flex items-center gap-1 flex-wrap">
                  {paymentPath.map((node, idx) => (
                    <React.Fragment key={`route-${node.id}`}>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        node.status === 'done' ? 'bg-success-bg text-success' :
                        node.status === 'alert' ? 'bg-warning-bg text-warning' :
                        node.status === 'failed'? 'bg-danger-bg text-danger' : 'bg-muted text-muted-foreground'
                      }`}>{node.node}</span>
                      {idx < paymentPath.length - 1 && <ArrowRight size={10} className="text-muted-foreground flex-shrink-0" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── SETTLEMENT ── */}
          {activeTab === 'settlement' && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                <Info size={13} className="text-primary flex-shrink-0" />
                <p className="text-xs text-muted-foreground">Fee breakdown and net settlement amount for this transaction.</p>
              </div>

              {/* Fee breakdown */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Fee Breakdown</h3>
                <div className="bg-secondary rounded-xl overflow-hidden">
                  {[
                    { label: 'Gross Amount', value: settlement.gross, highlight: false, bold: false },
                    { label: 'Processing Fee (2.9%)', value: -settlement.processingFee, highlight: false, bold: false },
                    { label: 'Network Fee (0.5%)', value: -settlement.networkFee, highlight: false, bold: false },
                    ...(settlement.fxFee > 0 ? [{ label: 'FX Conversion Fee (1.5%)', value: -settlement.fxFee, highlight: false, bold: false }] : []),
                    { label: 'Total Fees', value: -settlement.totalFees, highlight: false, bold: true },
                  ].map((row, idx) => (
                    <div key={`fee-${idx}`} className={`flex items-center justify-between px-4 py-3 ${idx < 4 ? 'border-b border-border' : ''}`}>
                      <span className={`text-sm ${row.bold ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{row.label}</span>
                      <span className={`text-sm tabular-nums font-semibold ${row.value < 0 ? 'text-danger' : 'text-foreground'}`}>
                        {row.value < 0 ? '-' : ''}${Math.abs(row.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                  {/* Net */}
                  <div className="flex items-center justify-between px-4 py-4 bg-primary/5 border-t-2 border-primary/20">
                    <span className="text-sm font-bold text-foreground">Net Settlement</span>
                    <span className="text-lg font-bold tabular-nums text-success">
                      ${settlement.net.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Settlement status */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Settlement Status</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Status', value: transaction.settlementStatus, isStatus: true },
                    { label: 'Batch ID', value: `BATCH-${transaction.id.slice(-6).toUpperCase()}` },
                    { label: 'Expected Date', value: transaction.settlementStatus === 'settled' ? 'Completed' : 'T+1 Business Day' },
                    { label: 'Destination', value: `${transaction.merchant} Account` },
                  ].map((item) => (
                    <div key={`settle-${item.label}`} className="bg-secondary rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      {item.isStatus ? (
                        <div className="mt-1"><StatusBadge status={transaction.settlementStatus} size="sm" /></div>
                      ) : (
                        <p className="text-sm font-semibold text-foreground mt-0.5">{item.value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Settlement timeline */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Clock size={12} />Settlement Timeline
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'Transaction captured', time: transaction.createdAt, done: true },
                    { label: 'Batch processing started', time: 'End of business day', done: transaction.settlementStatus !== 'unsettled' },
                    { label: 'Funds transferred to acquirer', time: 'T+0 EOD', done: transaction.settlementStatus === 'settled' },
                    { label: 'Merchant account credited', time: 'T+1 Business Day', done: transaction.settlementStatus === 'settled' },
                  ].map((step, idx) => (
                    <div key={`stl-${idx}`} className={`flex items-center justify-between p-3 rounded-lg ${step.done ? 'bg-success-bg/40' : 'bg-secondary'}`}>
                      <div className="flex items-center gap-2">
                        {step.done
                          ? <CheckCircle2 size={14} className="text-success flex-shrink-0" />
                          : <div className="w-3.5 h-3.5 rounded-full border-2 border-border flex-shrink-0" />
                        }
                        <span className={`text-xs font-medium ${step.done ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground tabular-nums">{step.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── FRAUD ANALYSIS ── */}
          {activeTab === 'fraud' && (
            <div className="space-y-5">
              {/* Score card */}
              <div className={`rounded-xl p-5 ${
                transaction.fraudScore >= 70 ? 'bg-danger-bg border border-danger/20' :
                transaction.fraudScore >= 40 ? 'bg-warning-bg border border-warning/20': 'bg-success-bg border border-success/20'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className={transaction.fraudScore >= 70 ? 'text-danger' : transaction.fraudScore >= 40 ? 'text-warning' : 'text-success'} />
                    <span className="text-sm font-semibold text-foreground">ML Risk Assessment</span>
                  </div>
                  <span className={`text-2xl font-bold tabular-nums ${transaction.fraudScore >= 70 ? 'text-danger' : transaction.fraudScore >= 40 ? 'text-warning' : 'text-success'}`}>
                    {transaction.fraudScore}<span className="text-sm font-normal text-muted-foreground">/100</span>
                  </span>
                </div>
                <FraudScoreBar score={transaction.fraudScore} />
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                  <span>Low risk (0–39)</span>
                  <span>Medium (40–69)</span>
                  <span>High (70+)</span>
                </div>
                <p className={`text-xs font-semibold mt-3 ${transaction.fraudScore >= 70 ? 'text-danger' : transaction.fraudScore >= 40 ? 'text-warning' : 'text-success'}`}>
                  {transaction.fraudScore >= 70 ? '⚠ High risk — manual review recommended' :
                   transaction.fraudScore >= 40 ? '⚡ Medium risk — monitor closely': '✓ Low risk — within normal parameters'}
                </p>
              </div>

              {/* Signal breakdown */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Risk Signals Detected</h3>
                <div className="space-y-2">
                  {fraudSignals.map((signal) => (
                    <div key={signal.id} className="bg-secondary rounded-lg overflow-hidden">
                      <button
                        className="w-full flex items-center justify-between p-3 text-left"
                        onClick={() => setExpandedSignal(expandedSignal === signal.id ? null : signal.id)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <AlertCircle size={13} className={signal.severity === 'high' ? 'text-danger' : signal.severity === 'medium' ? 'text-warning' : 'text-success'} />
                          <span className="text-sm font-medium text-foreground truncate">{signal.label}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <SeverityBadge severity={signal.severity} />
                          {expandedSignal === signal.id ? <ChevronUp size={12} className="text-muted-foreground" /> : <ChevronDown size={12} className="text-muted-foreground" />}
                        </div>
                      </button>
                      {expandedSignal === signal.id && (
                        <div className="px-3 pb-3 pt-0">
                          <p className="text-xs text-muted-foreground pl-5">{signal.detail}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ML model info */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Model Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Model Version', value: 'PayFlow-ML v4.2' },
                    { label: 'Inference Time', value: '38ms' },
                    { label: 'Confidence', value: `${Math.max(60, 100 - Math.abs(transaction.fraudScore - 50))}%` },
                    { label: 'Features Used', value: '142 signals' },
                  ].map((item) => (
                    <div key={`ml-${item.label}`} className="bg-secondary rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ACTIONS ── */}
          {activeTab === 'actions' && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                <AlertTriangle size={13} className="text-warning flex-shrink-0" />
                <p className="text-xs text-muted-foreground">Actions are irreversible. Confirm before proceeding.</p>
              </div>

              {/* Refund */}
              <div className={`rounded-xl border p-5 space-y-3 ${canRefund ? 'border-border' : 'border-border/40 opacity-60'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <RotateCcw size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Issue Refund</p>
                    <p className="text-xs text-muted-foreground">Return funds to the customer's original payment method</p>
                  </div>
                </div>
                <div className="bg-secondary rounded-lg p-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Refund amount</span>
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {transaction.currency}
                  </span>
                </div>
                {!canRefund && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <AlertCircle size={11} />
                    Refund not available for {transaction.status} transactions
                  </p>
                )}
                <button
                  disabled={!canRefund || actionLoading !== null}
                  onClick={() => handleAction('refund')}
                  className="btn-primary w-full gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === 'refund' ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                  {actionLoading === 'refund' ? 'Processing refund…' : 'Initiate Refund'}
                </button>
              </div>

              {/* Dispute */}
              <div className={`rounded-xl border p-5 space-y-3 ${canDispute ? 'border-border' : 'border-border/40 opacity-60'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-warning-bg flex items-center justify-center flex-shrink-0">
                    <MessageSquareWarning size={16} className="text-warning" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">File Dispute</p>
                    <p className="text-xs text-muted-foreground">Raise a chargeback or dispute with the card network</p>
                  </div>
                </div>
                <div className="bg-secondary rounded-lg p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Dispute window</span>
                    <span className="text-xs font-semibold text-foreground">120 days from transaction</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Chargeback fee</span>
                    <span className="text-xs font-semibold text-danger">$25.00</span>
                  </div>
                </div>
                {!canDispute && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <AlertCircle size={11} />
                    Dispute already filed for this transaction
                  </p>
                )}
                <button
                  disabled={!canDispute || actionLoading !== null}
                  onClick={() => handleAction('dispute')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-warning-bg text-warning border border-warning/30 hover:bg-warning/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === 'dispute' ? <Loader2 size={14} className="animate-spin" /> : <MessageSquareWarning size={14} />}
                  {actionLoading === 'dispute' ? 'Filing dispute…' : 'File Dispute'}
                </button>
              </div>

              {/* Retry */}
              <div className={`rounded-xl border p-5 space-y-3 ${canRetry ? 'border-border' : 'border-border/40 opacity-60'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <RefreshCw size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Retry Transaction</p>
                    <p className="text-xs text-muted-foreground">Re-attempt the failed payment with the same details</p>
                  </div>
                </div>
                {!canRetry && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <AlertCircle size={11} />
                    Retry is only available for failed transactions
                  </p>
                )}
                <button
                  disabled={!canRetry || actionLoading !== null}
                  onClick={() => handleAction('retry')}
                  className="btn-secondary w-full gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === 'retry' ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                  {actionLoading === 'retry' ? 'Queuing retry…' : 'Retry Transaction'}
                </button>
              </div>

              {/* Escalate */}
              <div className="rounded-xl border border-danger/20 p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-danger-bg flex items-center justify-center flex-shrink-0">
                    <Shield size={16} className="text-danger" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Escalate to Fraud Team</p>
                    <p className="text-xs text-muted-foreground">Flag for immediate manual review by the fraud operations team</p>
                  </div>
                </div>
                <button
                  disabled={actionLoading !== null}
                  onClick={() => {
                    toast.success(`${transaction.txId} escalated to fraud team`);
                  }}
                  className="btn-danger w-full gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Shield size={14} />
                  Escalate to Fraud Team
                </button>
              </div>

              {/* View full record */}
              <button className="btn-ghost w-full gap-2 text-sm">
                <ExternalLink size={14} />
                Open full audit record
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
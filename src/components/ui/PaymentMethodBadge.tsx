import React from 'react';
import { CreditCard, Building2, Wallet, Smartphone } from 'lucide-react';

export type PaymentMethodType =
  | 'visa' |'mastercard' |'amex' |'ach' |'wire' |'apple_pay' |'google_pay' |'gcash' |'maya' |'paypal';

interface PaymentMethodBadgeProps {
  method: PaymentMethodType;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const methodConfig: Record<
  PaymentMethodType,
  { label: string; shortLabel: string; icon: React.ReactNode; color: string }
> = {
  visa: {
    label: 'Visa',
    shortLabel: 'VISA',
    icon: <CreditCard size={12} />,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  mastercard: {
    label: 'Mastercard',
    shortLabel: 'MC',
    icon: <CreditCard size={12} />,
    color: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  amex: {
    label: 'Amex',
    shortLabel: 'AMEX',
    icon: <CreditCard size={12} />,
    color: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  ach: {
    label: 'ACH Transfer',
    shortLabel: 'ACH',
    icon: <Building2 size={12} />,
    color: 'bg-slate-50 text-slate-700 border-slate-200',
  },
  wire: {
    label: 'Wire Transfer',
    shortLabel: 'WIRE',
    icon: <Building2 size={12} />,
    color: 'bg-slate-50 text-slate-700 border-slate-200',
  },
  apple_pay: {
    label: 'Apple Pay',
    shortLabel: 'APAY',
    icon: <Smartphone size={12} />,
    color: 'bg-gray-50 text-gray-800 border-gray-200',
  },
  google_pay: {
    label: 'Google Pay',
    shortLabel: 'GPAY',
    icon: <Wallet size={12} />,
    color: 'bg-green-50 text-green-700 border-green-200',
  },
  gcash: {
    label: 'GCash',
    shortLabel: 'GCASH',
    icon: <Wallet size={12} />,
    color: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  maya: {
    label: 'Maya',
    shortLabel: 'MAYA',
    icon: <Wallet size={12} />,
    color: 'bg-green-50 text-green-600 border-green-200',
  },
  paypal: {
    label: 'PayPal',
    shortLabel: 'PP',
    icon: <Wallet size={12} />,
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
};

export default function PaymentMethodBadge({
  method,
  showLabel = true,
  size = 'md',
}: PaymentMethodBadgeProps) {
  const config = methodConfig[method] ?? methodConfig.visa;
  return (
    <span
      className={`inline-flex items-center gap-1 border rounded font-semibold ${config.color} ${
        size === 'sm' ?'text-xs px-1.5 py-0.5' :'text-xs px-2 py-0.5'
      }`}
    >
      {config.icon}
      {showLabel ? config.label : config.shortLabel}
    </span>
  );
}
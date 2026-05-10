'use client';

import React, { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface DemoCredential {
  role: string;
  email: string;
  password: string;
  badge: string;
  badgeColor: string;
}

const demoCredentials: DemoCredential[] = [
  {
    role: 'Admin',
    email: 'admin@payflow.io',
    password: 'Admin@PF2026',
    badge: 'Full Access',
    badgeColor: 'bg-primary/10 text-primary',
  },
  {
    role: 'Merchant',
    email: 'merchant@nexusdigital.ph',
    password: 'Merchant@PF26',
    badge: 'Merchant View',
    badgeColor: 'bg-success-bg text-success',
  },
  {
    role: 'Viewer',
    email: 'viewer@payflow.io',
    password: 'Viewer@PF2026',
    badge: 'Read Only',
    badgeColor: 'bg-muted text-muted-foreground',
  },
];

interface Props {
  onSelect: (email: string, password: string) => void;
}

export default function DemoCredentials({ onSelect }: Props) {
  const [expanded, setExpanded] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 1500);
    });
  };

  return (
    <div className="mt-6 border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-4 py-3 bg-secondary hover:bg-muted transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-semibold text-foreground">
            Demo Accounts — click any row to autofill
          </span>
        </div>
        {expanded ? (
          <ChevronUp size={14} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={14} className="text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="divide-y divide-border">
          {/* Header row */}
          <div className="grid grid-cols-[80px_1fr_1fr_80px] gap-2 px-4 py-2 bg-secondary/50">
            {['Role', 'Email', 'Password', 'Use'].map((h) => (
              <span
                key={`cred-hdr-${h}`}
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                {h}
              </span>
            ))}
          </div>
          {demoCredentials.map((cred) => (
            <div
              key={`cred-${cred.role}`}
              className="grid grid-cols-[80px_1fr_1fr_80px] gap-2 px-4 py-2.5 items-center hover:bg-secondary/60 transition-colors group"
            >
              {/* Role */}
              <div>
                <span
                  className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${cred.badgeColor}`}
                >
                  {cred.role}
                </span>
              </div>
              {/* Email */}
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-xs text-foreground truncate font-mono">
                  {cred.email}
                </span>
                <button
                  onClick={() => copyToClipboard(cred.email, `email-${cred.role}`)}
                  className="flex-shrink-0 p-1 rounded text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                >
                  {copiedField === `email-${cred.role}` ? (
                    <Check size={10} className="text-success" />
                  ) : (
                    <Copy size={10} />
                  )}
                </button>
              </div>
              {/* Password */}
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-xs text-foreground font-mono truncate">
                  {cred.password}
                </span>
                <button
                  onClick={() => copyToClipboard(cred.password, `pass-${cred.role}`)}
                  className="flex-shrink-0 p-1 rounded text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                >
                  {copiedField === `pass-${cred.role}` ? (
                    <Check size={10} className="text-success" />
                  ) : (
                    <Copy size={10} />
                  )}
                </button>
              </div>
              {/* Use button */}
              <button
                onClick={() => onSelect(cred.email, cred.password)}
                className="text-xs font-semibold text-primary hover:underline text-left transition-colors"
              >
                Autofill →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
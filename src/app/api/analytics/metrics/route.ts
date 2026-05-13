import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createServerClient();

    const { data: txData, error: txError } = await supabase
      .from('transactions')
      .select('amount, status, fraud_score, settlement_status');

    if (txError) return NextResponse.json({ error: txError.message }, { status: 500 });

    const { data: fraudData, error: fraudError } = await supabase
      .from('fraud_alerts')
      .select('risk_level, status')
      .eq('status', 'open');

    if (fraudError) return NextResponse.json({ error: fraudError.message }, { status: 500 });

    const rows = txData ?? [];
    const grossVolume = rows.reduce((sum, t) => sum + (t.amount ?? 0), 0);
    const successCount = rows.filter((t) => t.status === 'completed').length;
    const successRate = rows.length > 0 ? (successCount / rows.length) * 100 : 0;
    const avgTxValue = rows.length > 0 ? grossVolume / rows.length : 0;

    const fraudAlerts = fraudData ?? [];
    const criticalCount = fraudAlerts.filter((a) => a.risk_level === 'critical').length;

    return NextResponse.json({
      data: {
        grossVolume,
        successRate: parseFloat(successRate.toFixed(1)),
        totalTransactions: rows.length,
        successCount,
        activeFraudAlerts: fraudAlerts.length,
        criticalFraudAlerts: criticalCount,
        avgTransactionValue: parseFloat(avgTxValue.toFixed(2)),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

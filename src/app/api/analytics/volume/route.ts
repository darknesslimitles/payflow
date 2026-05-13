import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(req.url);

    const range = searchParams.get('range') ?? 'today';
    const interval = searchParams.get('interval') ?? 'hourly';

    if (range === 'today' && interval === 'hourly') {
      const { data, error } = await supabase
        .from('analytics_metrics')
        .select('hour, gross_volume, transaction_count')
        .eq('metric_date', '2026-05-09')
        .not('hour', 'is', null)
        .order('hour', { ascending: true });

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      const hourLabels: Record<number, string> = {
        0: '12 AM', 1: '1 AM', 2: '2 AM', 3: '3 AM', 4: '4 AM', 5: '5 AM',
        6: '6 AM', 7: '7 AM', 8: '8 AM', 9: '9 AM', 10: '10 AM', 11: '11 AM',
        12: '12 PM', 13: '1 PM', 14: '2 PM', 15: '3 PM', 16: '4 PM', 17: '5 PM',
        18: '6 PM', 19: '7 PM', 20: '8 PM', 21: '9 PM', 22: '10 PM', 23: '11 PM',
      };

      const formatted = (data ?? []).map((row) => ({
        time: hourLabels[row.hour!] ?? `${row.hour}:00`,
        volume: row.gross_volume,
        count: row.transaction_count,
      }));

      return NextResponse.json({ data: formatted });
    }

    // Monthly data
    const { data, error } = await supabase
      .from('analytics_metrics')
      .select('metric_date, gross_volume, transaction_count, fraud_alert_count')
      .is('hour', null)
      .order('metric_date', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const monthNames: Record<string, string> = {
      '11': 'Nov', '12': 'Dec', '01': 'Jan', '02': 'Feb',
      '03': 'Mar', '04': 'Apr', '05': 'May',
    };

    const formatted = (data ?? []).map((row) => {
      const month = row.metric_date.slice(5, 7);
      return {
        month: monthNames[month] ?? month,
        volume: parseFloat((row.gross_volume / 1_000_000).toFixed(1)),
        transactions: row.transaction_count,
        fraud: row.fraud_alert_count,
      };
    });

    return NextResponse.json({ data: formatted });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

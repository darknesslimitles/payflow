import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '12');
    const status = searchParams.get('status');
    const method = searchParams.get('method');
    const risk = searchParams.get('risk');
    const search = searchParams.get('search');
    const sortField = searchParams.get('sort') ?? 'created_at';
    const sortDir = searchParams.get('dir') ?? 'desc';

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('transactions')
      .select('*', { count: 'exact' });

    if (status && status !== 'all') query = query.eq('status', status);
    if (method && method !== 'all') query = query.eq('method', method);
    if (risk && risk !== 'all') {
      if (risk === 'low') query = query.lt('fraud_score', 40);
      else if (risk === 'medium') query = query.gte('fraud_score', 40).lt('fraud_score', 70);
      else if (risk === 'high') query = query.gte('fraud_score', 70);
    }
    if (search) {
      query = query.or(
        `tx_id.ilike.%${search}%,merchant_name.ilike.%${search}%,customer_name.ilike.%${search}%,reference_no.ilike.%${search}%`
      );
    }

    const ascending = sortDir === 'asc';
    query = query.order(sortField, { ascending }).range(from, to);

    const { data, error, count } = await query;

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data, count, page, limit });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) return NextResponse.json({ error: 'Missing transaction id' }, { status: 400 });

    const { data, error } = await supabase
      .from('transactions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

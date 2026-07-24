import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || '00000000-0000-0000-0000-000000000000';

    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      const { data: feedback, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const total = feedback?.length || 0;
      const positive = feedback?.filter(f => f.sentiment === 'positive').length || 0;
      const negative = feedback?.filter(f => f.sentiment === 'negative').length || 0;
      const positivePct = total > 0 ? Math.round((positive / total) * 100) : 0;
      const negativePct = total > 0 ? Math.round((negative / total) * 100) : 0;

      const reports = [
        {
          id: '1',
          title: 'Automated Ingestion Summary',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          summary: `This report consolidates active telemetry events. Workspace contains ${total} total feedback signals. Sentiment is distributed at ${positivePct}% positive, and ${negativePct}% negative feedback tags. Ingestion pipeline is running with stable performance indices.`
        }
      ];

      return NextResponse.json({ reports });
    }

    return NextResponse.json({ reports: [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

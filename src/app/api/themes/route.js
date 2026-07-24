import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const getSupabase = (req) => {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  const supabaseOptions = authHeader ? { global: { headers: { Authorization: authHeader } } } : {};
  return createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    supabaseOptions
  );
};

export async function GET(req) {
  try {
    const supabase = getSupabase(req);
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      // 1. Fetch user's workspace
      const { data: member, error: memberError } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (memberError) throw memberError;
      if (!member) {
        return NextResponse.json({ themes: [] }); // User has no workspace
      }

      // 2. Fetch themes scoped to workspace
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .eq('workspace_id', member.workspace_id)
        .order('count', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ themes: data || [] });
    }

    return NextResponse.json({ themes: [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

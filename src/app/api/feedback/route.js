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
        return NextResponse.json({ feedback: [] }); // User has no workspace
      }

      // 2. Fetch feedback scoped to workspace
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('workspace_id', member.workspace_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ feedback: data || [] });
    }

    return NextResponse.json({ feedback: [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, status, userId } = body;

    if (!id || !status || !userId) {
      return NextResponse.json({ error: 'Missing parameters (id, status, or userId)' }, { status: 400 });
    }

    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      // Role enforcement
      const { data: member, error: memberError } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (memberError) throw memberError;
      if (!member || member.role === 'VIEWER') {
        return NextResponse.json({ error: 'Forbidden: Viewers cannot modify feedback' }, { status: 403 });
      }

      const { data, error } = await supabase
        .from('feedback')
        .update({ status })
        .eq('id', id)
        .select();

      if (error) throw error;
      return NextResponse.json({ success: true, feedback: data?.[0] });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json({ error: 'Missing id or userId parameters' }, { status: 400 });
    }

    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      // Role enforcement
      const { data: member, error: memberError } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (memberError) throw memberError;
      if (!member || member.role === 'VIEWER') {
        return NextResponse.json({ error: 'Forbidden: Viewers cannot delete feedback' }, { status: 403 });
      }

      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

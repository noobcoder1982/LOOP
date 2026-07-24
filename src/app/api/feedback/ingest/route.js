import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client (so we can bypass client-side scopes if needed or write directly)
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
    const supabaseOptions = authHeader ? { global: { headers: { Authorization: authHeader } } } : {};
    
    const supabase = createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseAnonKey || 'placeholder-key',
      supabaseOptions
    );

    const body = await req.json();
    const { text, channel, customer, userId, apiKey } = body;

    if (!text) {
      return NextResponse.json({ error: 'Feedback text is required' }, { status: 400, headers: corsHeaders });
    }

    // Default to guest/simulated user id if not provided (so users can test instantly)
    const activeUserId = userId || '00000000-0000-0000-0000-000000000000';
    const activeChannel = channel || 'Website Widget';
    const activeCustomer = customer || 'Anonymous Visitor';

    // AI Classification (Sentiment & Theme extraction)
    const nvidiaKey = apiKey || process.env.VITE_NVIDIA_API_KEY;
    let sentiment = 'neutral';
    let theme = 'General';

    if (nvidiaKey && !nvidiaKey.startsWith('your-')) {
      try {
        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${nvidiaKey}`
          },
          body: JSON.stringify({
            model: "deepseek-ai/deepseek-v4-flash",
            messages: [
              {
                role: "system",
                content: "You are an analytics classifier. Read the feedback text and output ONLY a valid JSON object with keys 'sentiment' (must be 'positive', 'negative', or 'neutral') and 'theme' (a short 2-3 word topic category like 'Pricing & Plans', 'Mobile App', 'Bug & Issues', 'Feature Request', 'Customer Support', 'API Access'). Do not include markdown formatting or extra text."
              },
              {
                role: "user",
                content: `Feedback: "${text}"`
              }
            ],
            temperature: 0.1,
            max_tokens: 100
          })
        });

        const data = await response.json();
        const contentStr = data.choices?.[0]?.message?.content || '';
        
        // Clean JSON formatting if AI returned markdown codeblocks
        const cleanJsonStr = contentStr.replace(/```json/i, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJsonStr);
        
        if (parsed.sentiment) sentiment = parsed.sentiment.toLowerCase();
        if (parsed.theme) theme = parsed.theme;
      } catch (aiError) {
        console.warn('[Ingestion AI Error] Using fallback classification:', aiError);
        // Fallback heuristics
        const lower = text.toLowerCase();
        if (lower.includes('great') || lower.includes('love') || lower.includes('awesome') || lower.includes('perfect')) {
          sentiment = 'positive';
        } else if (lower.includes('crash') || lower.includes('bug') || lower.includes('slow') || lower.includes('fail') || lower.includes('error')) {
          sentiment = 'negative';
        }
      }
    }

    // Save to Supabase (if configured)
    let savedData = null;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      // Find workspace_id for the user
      let activeWorkspaceId = null;
      const { data: member, error: memberError } = await supabase
        .from('workspace_members')
        .select('workspace_id, role')
        .eq('user_id', activeUserId)
        .maybeSingle();

      if (member) {
        if (member.role === 'VIEWER') {
           return NextResponse.json({ error: 'Forbidden: Viewers cannot ingest feedback.' }, { status: 403, headers: corsHeaders });
        }
        activeWorkspaceId = member.workspace_id;
      } else {
        // Fallback: assign to the first workspace so guest tests don't fail
        const { data: firstWs } = await supabase
          .from('workspaces')
          .select('id')
          .limit(1)
          .maybeSingle();
        if (firstWs) {
          activeWorkspaceId = firstWs.id;
        }
      }

      const { data, error } = await supabase
        .from('feedback')
        .insert([
          {
            user_id: activeUserId,
            workspace_id: activeWorkspaceId,
            text,
            sentiment,
            channel: activeChannel,
            customer: activeCustomer,
            theme,
            status: 'NEW'
          }
        ])
        .select();

      if (error) {
        console.error('[Supabase Insert Error]:', error);
        return NextResponse.json({ error: `Database Error: ${error.message}` }, { status: 500, headers: corsHeaders });
      } else {
        savedData = data?.[0];

        // Increment or insert theme counts scoped to workspace_id
        if (activeWorkspaceId) {
          const { data: themeExists } = await supabase
            .from('themes')
            .select('id, count')
            .eq('workspace_id', activeWorkspaceId)
            .eq('name', theme)
            .maybeSingle();

          if (themeExists) {
            await supabase
              .from('themes')
              .update({ count: themeExists.count + 1 })
              .eq('id', themeExists.id);
          } else {
            await supabase
              .from('themes')
              .insert([{ user_id: activeUserId, workspace_id: activeWorkspaceId, name: theme, count: 1 }]);
          }
        }
      }
    } else {
      return NextResponse.json({ error: 'Database environment variables are missing on the server.' }, { status: 500, headers: corsHeaders });
    }

    // Return the categorized item
    return NextResponse.json({
      success: true,
      feedback: savedData
    }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}

import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { model, messages, temperature, top_p, max_tokens, chat_template_kwargs } = body;

    // Securely pull the key from headers or local storage proxy or environment
    const authHeader = req.headers.get('Authorization') || '';
    let apiKey = authHeader.replace('Bearer ', '').trim();

    if (!apiKey || apiKey.startsWith('your-') || apiKey === 'undefined') {
      apiKey = process.env.VITE_NVIDIA_API_KEY;
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'NVIDIA API key not configured' }, { status: 400 });
    }

    const payload = {
      model: model || 'deepseek-ai/deepseek-v4-flash',
      messages: messages || [],
      temperature: temperature !== undefined ? temperature : 1,
      top_p: top_p !== undefined ? top_p : 0.95,
      max_tokens: max_tokens || 1024,
    };

    if (chat_template_kwargs) {
      payload.chat_template_kwargs = chat_template_kwargs;
    }

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: `NVIDIA API Error: ${errText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

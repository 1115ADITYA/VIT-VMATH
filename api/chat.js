export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format' });
  }

  // Support multiple env variable names in case user named it OPENROUTER_API_KEY
  const rawKey = process.env.API_KEY || process.env.OPENROUTER_API_KEY || process.env.OPEN_ROUTER_API_KEY;
  const cleanedKey = rawKey ? rawKey.trim().replace(/^Bearer\s+/i, '') : '';

  if (!cleanedKey || cleanedKey === 'undefined' || cleanedKey === 'null') {
    return res.status(500).json({
      error: "OpenRouter API Key missing. Please set 'API_KEY' (starts with sk-or-...) in your Vercel Environment Variables and redeploy."
    });
  }

  // 100% Non-Google Free Models
  const AI_MODEL = process.env.AI_MODEL || 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free';

  // Fallback array completely free of Google/Gemini models
  const fallbackModels = Array.from(new Set([
    AI_MODEL,
    'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
    'cohere/north-mini-code:free',
    'nvidia/nemotron-3.5-lightning:free',
    'liquid/lfm-2.5-2.6b:free',
    'openrouter/free'
  ]));

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanedKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': req.headers.referer || 'https://vmath.ai',
        'X-Title': 'VMath AI'
      },
      body: JSON.stringify({
        model: AI_MODEL,
        models: fallbackModels,
        messages: messages
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      let parsedErr = errText;
      try {
        const json = JSON.parse(errText);
        parsedErr = json.error?.message || errText;
      } catch (e) {}
      throw new Error(`API Error: ${response.status} - ${parsedErr}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

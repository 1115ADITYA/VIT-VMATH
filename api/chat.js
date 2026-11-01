export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format' });
  }

  const API_KEY = process.env.API_KEY;
  const AI_MODEL = process.env.AI_MODEL || 'openrouter/free';

  if (!API_KEY) {
    return res.status(500).json({ error: 'Server misconfiguration: API_KEY missing' });
  }

  // Automatic fallback array so a 429 upstream rate limit switches to the next free model seamlessly
  const fallbackModels = Array.from(new Set([
    AI_MODEL,
    'openrouter/free',
    'google/gemma-4-26b-a4b-it:free',
    'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free'
  ]));

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
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
      throw new Error(`API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

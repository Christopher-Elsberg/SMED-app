export async function POST(req: Request) {
  try {
    const apiKey = process.env.AI_GATEWAY_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing AI_GATEWAY_API_KEY' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const body = await req.json().catch(() => ({}));

    const prompt =
      body?.prompt ||
      'Skriv 3 korte forbedringsforslag til en produktionsomstilling';

    const response = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-5.5',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        stream: false
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        text: data?.choices?.[0]?.message?.content || ''
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'AI fejl',
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

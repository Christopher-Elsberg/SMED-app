import { streamText } from 'ai';

export async function POST() {
  try {
    const result = streamText({
      model: 'openai/gpt-5.5',
      prompt: 'Skriv 3 korte forbedringsforslag til en produktionsomstilling'
    });

    return result.toTextStreamResponse();
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'AI fejl' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export default async function handler(request, context) {
  // Only allow POST
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Optional: restrict to your own domain
  const origin = request.headers.get('origin') || '';
  const allowed = Deno.env.get('ALLOWED_ORIGIN') || '';
  if (allowed && origin !== allowed) {
    return new Response('Forbidden', { status: 403 });
  }

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: 'API key not configured on server.' } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: { message: 'Invalid JSON body.' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(body)
  });

  const data = await resp.json();

  return new Response(JSON.stringify(data), {
    status: resp.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export const config = { path: '/api/analyze' };

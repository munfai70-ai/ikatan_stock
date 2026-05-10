export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';

  // Only process HTML files
  if (!contentType.includes('text/html')) {
    return response;
  }

  const html = await response.text();

  const injected = html
    .replace('__SUPABASE_URL__', Deno.env.get('SUPABASE_URL') || '')
    .replace('__SUPABASE_KEY__', Deno.env.get('SUPABASE_KEY') || '')
    .replace('__APP_PASSWORD__', Deno.env.get('APP_PASSWORD') || '');

  return new Response(injected, {
    status: response.status,
    headers: response.headers,
  });
};

export const config = { path: '/*' };
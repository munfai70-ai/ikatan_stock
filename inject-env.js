export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';

  // Only process HTML files
  if (!contentType.includes('text/html')) {
    return response;
  }

  const html = await response.text();

  const injected = html
    .replace(/__SUPABASE_URL__/g, Deno.env.get('SUPABASE_URL') || '')
    .replace(/__SUPABASE_KEY__/g, Deno.env.get('SUPABASE_KEY') || '')
    .replace(/__APP_PASSWORD__/g, Deno.env.get('APP_PASSWORD') || '');

  // Create new headers to avoid immutable header issues
  const newHeaders = new Headers(response.headers);
  newHeaders.set('content-type', 'text/html; charset=utf-8');

  return new Response(injected, {
    status: response.status,
    headers: newHeaders,
  });
};

export const config = { path: '/*' };
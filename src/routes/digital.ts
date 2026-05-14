import { Env } from '../index';

export async function handleGetDigitalProducts(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');

  let query = 'SELECT * FROM products WHERE category IN ("code", "docs", "project")';
  const params: any[] = [];

  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }

  const results = await env.DB.prepare(query).bind(...params).all();
  return new Response(JSON.stringify(results.results), {
    headers: { 'Content-Type': 'application/json' }
  });
}
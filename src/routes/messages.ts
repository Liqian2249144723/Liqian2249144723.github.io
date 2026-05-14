import { Env } from '../index';

export async function handleCreateMessage(request: Request, env: Env): Promise<Response> {
  const body = await request.json();
  const { name, email, phone, message } = body;

  await env.DB.prepare(
    'INSERT INTO messages (name, email, phone, message, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(name, email, phone, message, new Date().toISOString()).run();

  return new Response(JSON.stringify({ success: true, message: '留言已提交' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function handleGetMessages(request: Request, env: Env): Promise<Response> {
  const token = request.headers.get('authorization');
  if (!token) {
    return new Response(JSON.stringify({ message: '需要管理员权限' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const user = await validateAdmin(token, env);
  if (!user) {
    return new Response(JSON.stringify({ message: '需要管理员权限' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const results = await env.DB.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
  return new Response(JSON.stringify(results.results), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function validateAdmin(token: string, env: Env): Promise<any> {
  const tokenRecord = await env.DB.prepare(
    'SELECT user_id FROM tokens WHERE token = ?'
  ).bind(token).first();

  if (!tokenRecord) return null;

  const user = await env.DB.prepare(
    'SELECT * FROM users WHERE id = ? AND role = ?'
  ).bind(tokenRecord.user_id, 'admin').first();

  return user;
}
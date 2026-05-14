import { Env } from '../index';

export async function handleGetStats(request: Request, env: Env): Promise<Response> {
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

  const [productCount, orderCount, userCount, messageCount, revenue] = await Promise.all([
    env.DB.prepare('SELECT COUNT(*) as count FROM products').first(),
    env.DB.prepare('SELECT COUNT(*) as count FROM orders').first(),
    env.DB.prepare('SELECT COUNT(*) as count FROM users').first(),
    env.DB.prepare('SELECT COUNT(*) as count FROM messages').first(),
    env.DB.prepare('SELECT COALESCE(SUM(total_price), 0) as total FROM orders WHERE status = ?').bind('completed').first()
  ]);

  return new Response(JSON.stringify({
    products: productCount?.count || 0,
    orders: orderCount?.count || 0,
    users: userCount?.count || 0,
    messages: messageCount?.count || 0,
    revenue: revenue?.total || 0
  }), { headers: { 'Content-Type': 'application/json' } });
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
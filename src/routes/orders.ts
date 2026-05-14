import { Env } from '../index';

export async function handleCreateOrder(request: Request, env: Env): Promise<Response> {
  const body = await request.json();
  const { productId, quantity, userId, email, payMethod, downloadLink, extractCode } = body;

  const product = await env.DB.prepare(
    'SELECT * FROM products WHERE id = ?'
  ).bind(productId).first();

  if (!product) {
    return new Response(JSON.stringify({ success: false, message: '商品不存在' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const orderId = generateOrderId();
  const totalPrice = product.price * (quantity || 1);

  await env.DB.prepare(
    'INSERT INTO orders (order_id, user_id, product_id, quantity, total_price, status, pay_method, email, download_link, extract_code, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(orderId, userId, productId, quantity || 1, totalPrice, 'pending', payMethod, email, downloadLink || '', extractCode || '', new Date().toISOString()).run();

  return new Response(JSON.stringify({
    success: true,
    orderId,
    product,
    totalPrice,
    status: 'pending'
  }), { headers: { 'Content-Type': 'application/json' } });
}

export async function handleGetOrders(request: Request, env: Env): Promise<Response> {
  const token = request.headers.get('authorization');
  if (!token) {
    return new Response(JSON.stringify({ message: '需要登录' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const tokenRecord = await env.DB.prepare(
    'SELECT user_id FROM tokens WHERE token = ?'
  ).bind(token).first();

  if (!tokenRecord) {
    return new Response(JSON.stringify({ message: '无效的token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const user = await env.DB.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(tokenRecord.user_id).first();

  let query = 'SELECT o.*, p.name as product_name, p.image as product_image FROM orders o JOIN products p ON o.product_id = p.id';
  const params: any[] = [];

  if (user.role !== 'admin') {
    query += ' WHERE o.user_id = ?';
    params.push(user.id);
  }

  const results = await env.DB.prepare(query).bind(...params).all();
  return new Response(JSON.stringify(results.results), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function handleConfirmOrder(request: Request, env: Env): Promise<Response> {
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

  const url = new URL(request.url);
  const id = parseInt(url.pathname.split('/')[3]);

  await env.DB.prepare(
    'UPDATE orders SET status = ?, confirmed_at = ? WHERE id = ?'
  ).bind('completed', new Date().toISOString(), id).run();

  return new Response(JSON.stringify({ success: true, message: '订单已确认' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function handleCancelOrder(request: Request, env: Env): Promise<Response> {
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

  const url = new URL(request.url);
  const id = parseInt(url.pathname.split('/')[3]);

  await env.DB.prepare(
    'UPDATE orders SET status = ?, cancelled_at = ? WHERE id = ?'
  ).bind('cancelled', new Date().toISOString(), id).run();

  return new Response(JSON.stringify({ success: true, message: '订单已取消' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

function generateOrderId(): string {
  return 'ORD' + Date.now().toString().slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
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
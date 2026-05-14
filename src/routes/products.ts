import { Env } from '../index';

export async function handleGetProducts(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const keyword = url.searchParams.get('keyword');

  let query = 'SELECT * FROM products';
  const params: any[] = [];

  if (category && category !== 'all') {
    query += ' WHERE category = ?';
    params.push(category);
  }

  if (keyword) {
    if (!query.includes('WHERE')) {
      query += ' WHERE';
    } else {
      query += ' AND';
    }
    query += ' (name LIKE ? OR description LIKE ?)';
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  const results = await env.DB.prepare(query).bind(...params).all();
  return new Response(JSON.stringify(results.results), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function handleGetProduct(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const id = parseInt(url.pathname.split('/')[3]);

  const result = await env.DB.prepare(
    'SELECT * FROM products WHERE id = ?'
  ).bind(id).first();

  if (!result) {
    return new Response(JSON.stringify({ message: '商品不存在' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function handleCreateProduct(request: Request, env: Env): Promise<Response> {
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

  const body = await request.json();
  const { name, price, originalPrice, category, description, image, stock, isHot } = body;

  const result = await env.DB.prepare(
    'INSERT INTO products (name, price, original_price, category, description, image, stock, sold, is_hot) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(name, price, originalPrice || price, category, description, image, stock || 100, 0, isHot ? 1 : 0).run();

  return new Response(JSON.stringify({
    id: result.lastInsertRowid,
    name, price, originalPrice, category, description, image, stock, sold: 0, isHot
  }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function handleUpdateProduct(request: Request, env: Env): Promise<Response> {
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
  const body = await request.json();

  const result = await env.DB.prepare(
    'UPDATE products SET name = ?, price = ?, original_price = ?, category = ?, description = ?, image = ?, stock = ?, is_hot = ? WHERE id = ?'
  ).bind(body.name, body.price, body.originalPrice, body.category, body.description, body.image, body.stock, body.isHot ? 1 : 0, id).run();

  if (result.changes === 0) {
    return new Response(JSON.stringify({ message: '商品不存在' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ ...body, id }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function handleDeleteProduct(request: Request, env: Env): Promise<Response> {
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

  const result = await env.DB.prepare(
    'DELETE FROM products WHERE id = ?'
  ).bind(id).run();

  if (result.changes === 0) {
    return new Response(JSON.stringify({ message: '商品不存在' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ message: '删除成功' }), {
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
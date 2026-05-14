import { Env } from '../index';

export async function handleLogin(request: Request, env: Env): Promise<Response> {
  const body = await request.json();
  const { username, password } = body;

  const result = await env.DB.prepare(
    'SELECT id, username, role FROM users WHERE username = ? AND password = ?'
  ).bind(username, password).first();

  if (!result) {
    return new Response(JSON.stringify({ success: false, message: '用户名或密码错误' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const token = generateToken();
  await env.DB.prepare(
    'INSERT INTO tokens (token, user_id, created_at) VALUES (?, ?, ?)'
  ).bind(token, result.id, new Date().toISOString()).run();

  return new Response(JSON.stringify({
    success: true,
    message: '登录成功',
    user: { id: result.id, username: result.username, role: result.role },
    token
  }), { headers: { 'Content-Type': 'application/json' } });
}

export async function handleRegister(request: Request, env: Env): Promise<Response> {
  const body = await request.json();
  const { username, password, email } = body;

  const exists = await env.DB.prepare(
    'SELECT id FROM users WHERE username = ?'
  ).bind(username).first();

  if (exists) {
    return new Response(JSON.stringify({ success: false, message: '用户名已存在' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const result = await env.DB.prepare(
    'INSERT INTO users (username, password, email, role, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(username, password, email, 'user', new Date().toISOString()).run();

  return new Response(JSON.stringify({
    success: true,
    message: '注册成功',
    user: { id: result.lastInsertRowid, username, role: 'user' }
  }), { headers: { 'Content-Type': 'application/json' } });
}

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
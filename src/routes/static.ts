import { Env } from '../index';

export async function handleRoot(): Promise<Response> {
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>原形工坊 - 嵌入式开发与单片机技术分享</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
    header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; }
    nav { display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; }
    .logo { font-size: 24px; font-weight: bold; }
    .nav-links { display: flex; gap: 20px; }
    .nav-links a { color: white; text-decoration: none; padding: 8px 16px; border-radius: 4px; }
    .nav-links a:hover { background: rgba(255,255,255,0.2); }
    .hero { text-align: center; padding: 60px 20px; }
    .hero h1 { font-size: 48px; margin-bottom: 20px; }
    .hero p { font-size: 18px; opacity: 0.9; }
    .btn { display: inline-block; background: white; color: #667eea; padding: 12px 30px; border-radius: 30px; text-decoration: none; font-weight: bold; margin-top: 20px; }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(102,126,234,0.4); }
    .features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; padding: 60px 20px; max-width: 1200px; margin: 0 auto; }
    .feature { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
    .feature i { font-size: 48px; color: #667eea; margin-bottom: 20px; }
    .feature h3 { font-size: 20px; margin-bottom: 10px; }
    .footer { background: #333; color: white; text-align: center; padding: 20px; margin-top: 40px; }
    @media (max-width: 768px) {
      .features { grid-template-columns: 1fr; }
      .hero h1 { font-size: 32px; }
      .nav-links { display: none; }
    }
  </style>
</head>
<body>
  <header>
    <nav>
      <div class="logo">原形工坊</div>
      <div class="nav-links">
        <a href="/"><i class="fas fa-home"></i> 首页</a>
        <a href="/products.html"><i class="fas fa-shopping-cart"></i> 数字资料</a>
        <a href="/admin.html"><i class="fas fa-user"></i> 登录</a>
      </div>
    </nav>
    <div class="hero">
      <h1>专注于嵌入式开发与单片机技术分享</h1>
      <p>STM32 | Linux | RTOS | 电子DIY</p>
      <a href="/products.html" class="btn">立即探索</a>
    </div>
  </header>
  <div class="features">
    <div class="feature">
      <i class="fas fa-code"></i>
      <h3>源码分享</h3>
      <p>提供高质量的嵌入式开发源码和项目实战案例</p>
    </div>
    <div class="feature">
      <i class="fas fa-book"></i>
      <h3>技术文档</h3>
      <p>详细的技术文档和教程，助你快速成长</p>
    </div>
    <div class="feature">
      <i class="fas fa-users"></i>
      <h3>社区交流</h3>
      <p>加入技术交流群，与同行共同进步</p>
    </div>
  </div>
  <div class="footer">
    <p>&copy; 2024 原形工坊. 专注于嵌入式开发与单片机技术分享.</p>
  </div>
</body>
</html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}

export async function handleStatic(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.substring(1);

  if (path === 'admin.html') {
    const html = await env.MY_BUCKET.get('admin.html');
    if (!html) return new Response('Not Found', { status: 404 });
    return new Response(await html.text(), { headers: { 'Content-Type': 'text/html' } });
  }

  if (path === 'products.html') {
    const html = await env.MY_BUCKET.get('products.html');
    if (!html) return new Response('Not Found', { status: 404 });
    return new Response(await html.text(), { headers: { 'Content-Type': 'text/html' } });
  }

  if (path === 'styles.css') {
    const css = await env.MY_BUCKET.get('styles.css');
    if (!css) return new Response('Not Found', { status: 404 });
    return new Response(await css.text(), { headers: { 'Content-Type': 'text/css' } });
  }

  if (path.startsWith('download/')) {
    const orderId = path.split('/')[1];
    const order = await env.DB.prepare(
      'SELECT * FROM orders WHERE order_id = ? AND status = ?'
    ).bind(orderId, 'completed').first();

    if (!order) return new Response('订单不存在或未完成', { status: 404 });

    const file = await env.MY_BUCKET.get(order.download_link);
    if (!file) return new Response('文件不存在', { status: 404 });

    return new Response(await file.blob(), {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${order.download_link}"`
      }
    });
  }

  return new Response('Not Found', { status: 404 });
}
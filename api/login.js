export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin123') {
    return res.json({
      success: true,
      message: '登录成功',
      user: { id: 1, username: 'admin', role: 'admin' }
    });
  }

  return res.json({ success: false, message: '用户名或密码错误' });
}
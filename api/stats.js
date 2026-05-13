module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // 返回模拟数据（因为 Vercel 函数不能持久化文件，我们使用静态数据演示）
  res.json({
    years: 3,
    videos: 100,
    students: 5000,
    projects: 50,
    totalProducts: 9,
    totalSold: 1384,
    totalStock: 2456,
    pendingMessages: 0,
    totalMessages: 2
  });
};
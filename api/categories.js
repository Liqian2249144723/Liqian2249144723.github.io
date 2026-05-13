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

  res.json([
    { id: 'all', name: '全部商品', icon: 'fa-box' },
    { id: 'development', name: '开发板', icon: 'fa-microchip' },
    { id: 'sensor', name: '传感器', icon: 'fa-thermometer-half' },
    { id: 'display', name: '显示屏', icon: 'fa-monitor' },
    { id: 'kit', name: '学习套件', icon: 'fa-box-open' },
    { id: 'actuator', name: '执行器', icon: 'fa-cog' }
  ]);
};
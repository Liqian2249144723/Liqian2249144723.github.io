module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 静态留言数据
  const messages = [
    { id: 1, name: '张同学', email: 'zhang@example.com', phone: '13800138001', content: '您好，请问STM32学习套件包含哪些传感器？', createdAt: '2024-01-15T10:30:00.000Z', replied: true, reply: '您好！套件包含：HC-SR04超声波、DS18B20温度、MQ-2烟雾、LED灯、继电器等10种传感器。' },
    { id: 2, name: '李同学', email: 'li@example.com', phone: '13900139002', content: '想咨询毕业设计相关的服务，怎么收费？', createdAt: '2024-01-16T14:20:00.000Z', replied: true, reply: '您好！毕业设计服务根据难度收费，一般在500-2000元之间。具体可以添加微信详聊。' }
  ];

  if (req.method === 'GET') {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return res.json({
      data: messages.slice(start, end),
      total: messages.length,
      page,
      totalPages: Math.ceil(messages.length / limit)
    });
  }

  if (req.method === 'POST') {
    const newMessage = {
      id: messages.length + 1,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      content: req.body.content,
      createdAt: new Date().toISOString(),
      replied: false,
      reply: ''
    };

    return res.status(201).json({
      success: true,
      message: '留言成功！我会尽快回复您（演示版本，数据不会保存）',
      data: newMessage
    });
  }

  res.status(405).json({ message: 'Method not allowed' });
};
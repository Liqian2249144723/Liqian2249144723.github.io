const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const productsFilePath = path.join(dataDir, 'products.json');
const messagesFilePath = path.join(dataDir, 'messages.json');
const usersFilePath = path.join(dataDir, 'users.json');

if (!fs.existsSync(productsFilePath)) {
    fs.writeFileSync(productsFilePath, JSON.stringify([
        {
            id: 1,
            name: 'STM32F103C8T6开发板',
            price: 45,
            originalPrice: 55,
            category: 'development',
            description: 'STM32F103C8T6最小系统板，核心板，学习板，支持USB下载',
            image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=STM32%20development%20board%20circuit%20microcontroller&image_size=square',
            stock: 100,
            sold: 326,
            isHot: true
        },
        {
            id: 2,
            name: 'HC-SR04超声波模块',
            price: 12,
            originalPrice: 15,
            category: 'sensor',
            description: '超声波测距模块，支持2cm-400cm测距，精度高',
            image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=ultrasonic%20sensor%20module%20electronic%20component&image_size=square',
            stock: 200,
            sold: 512,
            isHot: true
        },
        {
            id: 3,
            name: 'OLED显示屏 0.96寸',
            price: 18,
            originalPrice: 25,
            category: 'display',
            description: '0.96寸OLED显示屏，128x64分辨率，I2C接口',
            image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=OLED%20display%20screen%20small%20electronic&image_size=square',
            stock: 150,
            sold: 289,
            isHot: false
        },
        {
            id: 4,
            name: 'DS18B20温度传感器',
            price: 8,
            originalPrice: 10,
            category: 'sensor',
            description: '单总线温度传感器，-55°C~125°C，精度0.5°C',
            image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=temperature%20sensor%20DS18B20%20electronic%20component&image_size=square',
            stock: 500,
            sold: 891,
            isHot: true
        },
        {
            id: 5,
            name: 'STM32学习套件',
            price: 128,
            originalPrice: 168,
            category: 'kit',
            description: '包含STM32开发板+10种传感器+教程资料+杜邦线',
            image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=STM32%20learning%20kit%20electronic%20components%20box&image_size=square',
            stock: 50,
            sold: 156,
            isHot: true
        },
        {
            id: 6,
            name: 'ESP32开发板',
            price: 35,
            originalPrice: 45,
            category: 'development',
            description: 'ESP32-WROOM-32开发板，支持WiFi+蓝牙，物联网开发首选',
            image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=ESP32%20development%20board%20WiFi%20bluetooth&image_size=square',
            stock: 80,
            sold: 234,
            isHot: false
        },
        {
            id: 7,
            name: 'SG90舵机',
            price: 15,
            originalPrice: 18,
            category: 'actuator',
            description: '9g微型舵机，角度可控，适合机器人项目',
            image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=SG90%20servo%20motor%20robot%20part&image_size=square',
            stock: 120,
            sold: 445,
            isHot: false
        },
        {
            id: 8,
            name: 'MQ-2烟雾传感器',
            price: 18,
            originalPrice: 22,
            category: 'sensor',
            description: '烟雾气体传感器模块，检测液化气、甲烷、烟雾',
            image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=smoke%20sensor%20MQ2%20gas%20detector&image_size=square',
            stock: 100,
            sold: 178,
            isHot: false
        },
        {
            id: 9,
            name: 'Arduino Uno R3',
            price: 42,
            originalPrice: 55,
            category: 'development',
            description: 'Arduino Uno R3开发板，入门级单片机学习板',
            image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Arduino%20Uno%20R3%20development%20board&image_size=square',
            stock: 60,
            sold: 312,
            isHot: true
        }
    ], null, 2));
}

if (!fs.existsSync(messagesFilePath)) {
    fs.writeFileSync(messagesFilePath, JSON.stringify([
        {
            id: 1,
            name: '张同学',
            email: 'zhang@example.com',
            phone: '13800138001',
            content: '您好，请问STM32学习套件包含哪些传感器？',
            createdAt: '2024-01-15T10:30:00.000Z',
            replied: true,
            reply: '您好！套件包含：HC-SR04超声波、DS18B20温度、MQ-2烟雾、LED灯、继电器等10种传感器。'
        },
        {
            id: 2,
            name: '李同学',
            email: 'li@example.com',
            phone: '13900139002',
            content: '想咨询毕业设计相关的服务，怎么收费？',
            createdAt: '2024-01-16T14:20:00.000Z',
            replied: true,
            reply: '您好！毕业设计服务根据难度收费，一般在500-2000元之间。具体可以添加微信详聊。'
        }
    ], null, 2));
}

if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([
        {
            id: 1,
            username: 'admin',
            password: 'admin123',
            email: 'admin@example.com',
            role: 'admin',
            createdAt: '2024-01-01T00:00:00.000Z'
        }
    ], null, 2));
}

let currentUser = null;

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        res.json({ 
            success: true, 
            message: '登录成功',
            user: { id: user.id, username: user.username, role: user.role }
        });
    } else {
        res.json({ success: false, message: '用户名或密码错误' });
    }
});

app.post('/api/register', (req, res) => {
    const { username, password, email } = req.body;
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    
    if (users.find(u => u.username === username)) {
        return res.json({ success: false, message: '用户名已存在' });
    }
    
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        username,
        password,
        email,
        role: 'user',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.json({ success: true, message: '注册成功', user: newUser });
});

app.get('/api/products', (req, res) => {
    const category = req.query.category;
    const keyword = req.query.keyword;
    let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    
    if (category && category !== 'all') {
        products = products.filter(p => p.category === category);
    }
    
    if (keyword) {
        const kw = keyword.toLowerCase();
        products = products.filter(p => 
            p.name.toLowerCase().includes(kw) || 
            p.description.toLowerCase().includes(kw)
        );
    }
    
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: '商品不存在' });
    }
});

app.post('/api/products', (req, res) => {
    if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ message: '需要管理员权限' });
    }
    
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name: req.body.name,
        price: req.body.price,
        originalPrice: req.body.originalPrice || req.body.price,
        category: req.body.category || 'other',
        description: req.body.description || '',
        image: req.body.image || '',
        stock: req.body.stock || 100,
        sold: 0,
        isHot: req.body.isHot || false
    };
    
    products.push(newProduct);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
    if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ message: '需要管理员权限' });
    }
    
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    
    if (index !== -1) {
        products[index] = { ...products[index], ...req.body };
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
        res.json(products[index]);
    } else {
        res.status(404).json({ message: '商品不存在' });
    }
});

app.delete('/api/products/:id', (req, res) => {
    if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ message: '需要管理员权限' });
    }
    
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    const filtered = products.filter(p => p.id !== parseInt(req.params.id));
    
    if (filtered.length !== products.length) {
        fs.writeFileSync(productsFilePath, JSON.stringify(filtered, null, 2));
        res.json({ message: '删除成功' });
    } else {
        res.status(404).json({ message: '商品不存在' });
    }
});

app.post('/api/messages', (req, res) => {
    const messages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf8'));
    const newMessage = {
        id: messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        content: req.body.content,
        createdAt: new Date().toISOString(),
        replied: false,
        reply: ''
    };
    
    messages.push(newMessage);
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
    res.status(201).json({ success: true, message: '留言成功！我会尽快回复您', data: newMessage });
});

app.get('/api/messages', (req, res) => {
    const messages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf8'));
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    const paginatedMessages = messages.slice(start, end);
    res.json({
        data: paginatedMessages,
        total: messages.length,
        page,
        totalPages: Math.ceil(messages.length / limit)
    });
});

app.put('/api/messages/:id/reply', (req, res) => {
    if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ message: '需要管理员权限' });
    }
    
    const messages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf8'));
    const index = messages.findIndex(m => m.id === parseInt(req.params.id));
    
    if (index !== -1) {
        messages[index].replied = true;
        messages[index].reply = req.body.reply;
        fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
        res.json({ success: true, message: '回复成功', data: messages[index] });
    } else {
        res.status(404).json({ message: '留言不存在' });
    }
});

app.delete('/api/messages/:id', (req, res) => {
    if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ message: '需要管理员权限' });
    }
    
    const messages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf8'));
    const filtered = messages.filter(m => m.id !== parseInt(req.params.id));
    
    if (filtered.length !== messages.length) {
        fs.writeFileSync(messagesFilePath, JSON.stringify(filtered, null, 2));
        res.json({ message: '删除成功' });
    } else {
        res.status(404).json({ message: '留言不存在' });
    }
});

app.get('/api/contact', (req, res) => {
    res.json({
        phone: '16627878630',
        qq: '2249144723',
        wechat: 'li28430132',
        address: '江苏 常州',
        workTime: '9:00-18:00（周一到周六）'
    });
});

app.get('/api/stats', (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    const messages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf8'));
    
    const totalSold = products.reduce((sum, p) => sum + p.sold, 0);
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    
    res.json({
        years: 3,
        videos: 100,
        students: 5000,
        projects: 50,
        totalProducts: products.length,
        totalSold,
        totalStock,
        pendingMessages: messages.filter(m => !m.replied).length,
        totalMessages: messages.length
    });
});

app.get('/api/categories', (req, res) => {
    res.json([
        { id: 'all', name: '全部商品', icon: 'fa-box' },
        { id: 'development', name: '开发板', icon: 'fa-microchip' },
        { id: 'sensor', name: '传感器', icon: 'fa-thermometer-half' },
        { id: 'display', name: '显示屏', icon: 'fa-monitor' },
        { id: 'kit', name: '学习套件', icon: 'fa-box-open' },
        { id: 'actuator', name: '执行器', icon: 'fa-cog' }
    ]);
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log('API接口列表:');
    console.log('  GET  /api/products          - 获取商品列表');
    console.log('  GET  /api/products/:id      - 获取单个商品');
    console.log('  POST /api/products          - 添加商品(管理员)');
    console.log('  PUT  /api/products/:id      - 修改商品(管理员)');
    console.log('  DELETE /api/products/:id    - 删除商品(管理员)');
    console.log('  GET  /api/messages          - 获取留言列表');
    console.log('  POST /api/messages          - 提交留言');
    console.log('  PUT  /api/messages/:id/reply - 回复留言(管理员)');
    console.log('  POST /api/login             - 用户登录');
    console.log('  POST /api/register          - 用户注册');
    console.log('  GET  /api/stats             - 获取统计数据');
    console.log('  GET  /api/categories        - 获取商品分类');
    console.log('  GET  /api/contact           - 获取联系信息');
});
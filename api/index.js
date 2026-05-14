const express = require('express');
const next = require('next');

const app = express();
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../backend/data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const productsFilePath = path.join(dataDir, 'products.json');
const messagesFilePath = path.join(dataDir, 'messages.json');
const usersFilePath = path.join(dataDir, 'users.json');
const digitalProductsFilePath = path.join(dataDir, 'digital_products.json');
const ordersFilePath = path.join(dataDir, 'orders.json');
const tokensFilePath = path.join(dataDir, 'tokens.json');

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
            username: '2249144723',
            password: 'liqian666',
            email: 'admin@example.com',
            role: 'admin',
            createdAt: '2024-01-01T00:00:00.000Z'
        }
    ], null, 2));
}

if (!fs.existsSync(digitalProductsFilePath)) {
    fs.writeFileSync(digitalProductsFilePath, JSON.stringify([
        {
            id: 1,
            name: 'STM32F103C8T6 完整例程代码',
            price: 19.9,
            originalPrice: 29.9,
            description: '包含GPIO、定时器、串口、I2C、SPI等20+个例程，带详细注释',
            category: 'code',
            downloads: 156,
            panLink: 'https://pan.baidu.com/s/1abcdefg12345678',
            panPassword: '1234',
            files: [
                { name: '基础例程.zip', url: 'https://pan.baidu.com/s/1abcdefg12345678' },
                { name: '进阶例程.zip', url: 'https://pan.baidu.com/s/1hijklmn90123456' }
            ],
            isHot: true
        },
        {
            id: 2,
            name: 'STM32 HAL库开发指南 PDF',
            price: 9.9,
            originalPrice: 19.9,
            description: '从零开始学习STM32 HAL库开发，附大量实战项目',
            category: 'docs',
            downloads: 328,
            panLink: 'https://pan.baidu.com/s/1opqrstu98765432',
            panPassword: 'abcd',
            files: [
                { name: 'STM32 HAL开发指南.pdf', url: 'https://pan.baidu.com/s/1opqrstu98765432' }
            ],
            isHot: true
        },
        {
            id: 3,
            name: '物联网项目实战源码',
            price: 29.9,
            originalPrice: 49.9,
            description: '包含MQTT、HTTP、TCP等物联网通信项目源码',
            category: 'project',
            downloads: 89,
            panLink: 'https://pan.baidu.com/s/1vwxyzab56789012',
            panPassword: '5678',
            files: [
                { name: 'MQTT项目源码.zip', url: 'https://pan.baidu.com/s/1vwxyzab56789012' },
                { name: 'HTTP项目源码.zip', url: 'https://pan.baidu.com/s/1cdefghi34567890' }
            ],
            isHot: false
        },
        {
            id: 4,
            name: '毕业设计指导文档',
            price: 15.9,
            originalPrice: 25.9,
            description: 'STM32毕业设计选题、开题报告、答辩PPT模板',
            category: 'docs',
            downloads: 245,
            panLink: 'https://pan.baidu.com/s/1mnopqrs12345678',
            panPassword: 'wxyz',
            files: [
                { name: '毕设指导文档.pdf', url: 'https://pan.baidu.com/s/1mnopqrs12345678' },
                { name: 'PPT模板.zip', url: 'https://pan.baidu.com/s/1tuvwxyz90123456' }
            ],
            isHot: true
        }
    ], null, 2));
}

if (!fs.existsSync(ordersFilePath)) {
    fs.writeFileSync(ordersFilePath, JSON.stringify([], null, 2));
}

if (!fs.existsSync(tokensFilePath)) {
    fs.writeFileSync(tokensFilePath, JSON.stringify([], null, 2));
}

function checkUser(req) {
    const token = req.headers['authorization'] || req.query.token;
    if (!token) {
        return null;
    }
    
    const tokens = JSON.parse(fs.readFileSync(tokensFilePath, 'utf8'));
    const tokenRecord = tokens.find(t => t.token === token);
    
    if (!tokenRecord) {
        return null;
    }
    
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    const user = users.find(u => u.id === tokenRecord.userId);
    
    if (user) {
        return user;
    }
    return null;
}

function generateToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function checkAdmin(req) {
    const token = req.headers['authorization'] || req.query.token;
    if (!token) {
        return null;
    }
    
    const tokens = JSON.parse(fs.readFileSync(tokensFilePath, 'utf8'));
    const tokenRecord = tokens.find(t => t.token === token);
    
    if (!tokenRecord) {
        return null;
    }
    
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    const user = users.find(u => u.id === tokenRecord.userId);
    
    if (user && user.role === 'admin') {
        return user;
    }
    return null;
}

module.exports = (req, res) => {
    app.use(express.json());
    
    if (req.method === 'POST' && req.url === '/api/login') {
        const { username, password } = req.body;
        const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            const token = generateToken();
            const tokens = JSON.parse(fs.readFileSync(tokensFilePath, 'utf8'));
            tokens.push({ token, userId: user.id, createdAt: new Date().toISOString() });
            fs.writeFileSync(tokensFilePath, JSON.stringify(tokens, null, 2));
            
            res.status(200).json({ 
                success: true, 
                message: '登录成功',
                user: { id: user.id, username: user.username, role: user.role },
                token: token
            });
        } else {
            res.status(200).json({ success: false, message: '用户名或密码错误' });
        }
        return;
    }
    
    if (req.method === 'POST' && req.url === '/api/register') {
        const { username, password, email } = req.body;
        const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
        
        if (users.find(u => u.username === username)) {
            res.status(200).json({ success: false, message: '用户名已存在' });
            return;
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
        res.status(200).json({ success: true, message: '注册成功', user: newUser });
        return;
    }
    
    if (req.method === 'GET' && req.url.startsWith('/api/products')) {
        const url = new URL(req.url, 'http://localhost');
        const category = url.searchParams.get('category');
        const keyword = url.searchParams.get('keyword');
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
        
        res.status(200).json(products);
        return;
    }
    
    if (req.method === 'GET' && req.url.startsWith('/api/digital-products')) {
        const url = new URL(req.url, 'http://localhost');
        const category = url.searchParams.get('category');
        const keyword = url.searchParams.get('keyword');
        let products = JSON.parse(fs.readFileSync(digitalProductsFilePath, 'utf8'));
        
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
        
        res.status(200).json(products);
        return;
    }
    
    if (req.method === 'POST' && req.url === '/api/orders') {
        const { productId, email, buyerName, phone } = req.body;
        
        const products = JSON.parse(fs.readFileSync(digitalProductsFilePath, 'utf8'));
        const product = products.find(p => p.id === parseInt(productId));
        
        if (!product) {
            res.status(404).json({ success: false, message: '商品不存在' });
            return;
        }
        
        const token = req.headers['authorization'];
        let userId = null;
        if (token) {
            const tokens = JSON.parse(fs.readFileSync(tokensFilePath, 'utf8'));
            const tokenRecord = tokens.find(t => t.token === token);
            if (tokenRecord) {
                userId = tokenRecord.userId;
            }
        }
        
        const orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));
        const newOrder = {
            id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
            productId: product.id,
            productName: product.name,
            price: product.price,
            buyerName,
            email,
            phone,
            userId: userId,
            status: 'pending',
            downloadLinks: [],
            panLink: '',
            panPassword: '',
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        orders.push(newOrder);
        fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
        
        res.status(200).json({
            success: true,
            message: '订单已创建，请完成支付',
            order: newOrder,
            paymentInfo: {
                wechat: 'li28430132',
                phone: '16627878630'
            }
        });
        return;
    }
    
    if (req.method === 'PUT' && req.url.match(/\/api\/orders\/\d+\/confirm/)) {
        const token = req.headers['authorization'];
        if (!token) {
            res.status(403).json({ success: false, message: '需要管理员权限' });
            return;
        }
        
        const tokens = JSON.parse(fs.readFileSync(tokensFilePath, 'utf8'));
        const tokenRecord = tokens.find(t => t.token === token);
        if (!tokenRecord) {
            res.status(403).json({ success: false, message: '需要管理员权限' });
            return;
        }
        
        const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
        const admin = users.find(u => u.id === tokenRecord.userId && u.role === 'admin');
        if (!admin) {
            res.status(403).json({ success: false, message: '需要管理员权限' });
            return;
        }
        
        const orderId = parseInt(req.url.match(/\/api\/orders\/(\d+)\/confirm/)[1]);
        const orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));
        const index = orders.findIndex(o => o.id === orderId);
        
        if (index === -1) {
            res.status(404).json({ success: false, message: '订单不存在' });
            return;
        }
        
        const products = JSON.parse(fs.readFileSync(digitalProductsFilePath, 'utf8'));
        const product = products.find(p => p.id === orders[index].productId);
        
        if (!product) {
            res.status(404).json({ success: false, message: '商品不存在' });
            return;
        }
        
        orders[index].status = 'completed';
        orders[index].downloadLinks = product.files;
        orders[index].panLink = product.panLink || '';
        orders[index].panPassword = product.panPassword || '';
        
        fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
        
        product.downloads += 1;
        fs.writeFileSync(digitalProductsFilePath, JSON.stringify(products, null, 2));
        
        res.status(200).json({
            success: true,
            message: '订单已确认，下载链接已激活',
            order: orders[index]
        });
        return;
    }
    
    if (req.method === 'PUT' && req.url.match(/\/api\/orders\/\d+\/cancel/)) {
        const token = req.headers['authorization'];
        if (!token) {
            res.status(403).json({ success: false, message: '需要管理员权限' });
            return;
        }
        
        const tokens = JSON.parse(fs.readFileSync(tokensFilePath, 'utf8'));
        const tokenRecord = tokens.find(t => t.token === token);
        if (!tokenRecord) {
            res.status(403).json({ success: false, message: '需要管理员权限' });
            return;
        }
        
        const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
        const admin = users.find(u => u.id === tokenRecord.userId && u.role === 'admin');
        if (!admin) {
            res.status(403).json({ success: false, message: '需要管理员权限' });
            return;
        }
        
        const orderId = parseInt(req.url.match(/\/api\/orders\/(\d+)\/cancel/)[1]);
        const orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));
        const index = orders.findIndex(o => o.id === orderId);
        
        if (index === -1) {
            res.status(404).json({ success: false, message: '订单不存在' });
            return;
        }
        
        orders[index].status = 'cancelled';
        
        fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
        
        res.status(200).json({
            success: true,
            message: '订单已取消',
            order: orders[index]
        });
        return;
    }
    
    if (req.method === 'GET' && req.url === '/api/orders') {
        const token = req.headers['authorization'];
        if (!token) {
            res.status(403).json({ message: '需要登录' });
            return;
        }
        
        const tokens = JSON.parse(fs.readFileSync(tokensFilePath, 'utf8'));
        const tokenRecord = tokens.find(t => t.token === token);
        if (!tokenRecord) {
            res.status(403).json({ message: '需要登录' });
            return;
        }
        
        const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
        const user = users.find(u => u.id === tokenRecord.userId);
        if (!user) {
            res.status(403).json({ message: '需要登录' });
            return;
        }
        
        const orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));
        
        if (user.role === 'admin') {
            res.status(200).json(orders);
        } else {
            const url = new URL(req.url, 'http://localhost');
            const email = url.searchParams.get('email');
            const userOrders = orders.filter(o => 
                o.email === email || 
                (o.userId !== undefined && o.userId !== null && o.userId === user.id) ||
                (o.userId === undefined && o.email === (user.username + '@example.com'))
            );
            res.status(200).json(userOrders);
        }
        return;
    }
    
    if (req.method === 'POST' && req.url === '/api/messages') {
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
        return;
    }
    
    if (req.method === 'GET' && req.url === '/api/messages') {
        const messages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf8'));
        res.status(200).json({
            data: messages,
            total: messages.length,
            page: 1,
            totalPages: 1
        });
        return;
    }
    
    if (req.method === 'GET' && req.url === '/api/contact') {
        res.status(200).json({
            phone: '16627878630',
            qq: '2249144723',
            wechat: 'li28430132',
            address: '江苏 常州',
            workTime: '9:00-18:00（周一到周六）'
        });
        return;
    }
    
    if (req.method === 'GET' && req.url === '/api/stats') {
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
        const messages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf8'));
        
        const totalSold = products.reduce((sum, p) => sum + p.sold, 0);
        const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
        
        res.status(200).json({
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
        return;
    }
    
    if (req.method === 'GET' && req.url === '/api/categories') {
        res.status(200).json([
            { id: 'all', name: '全部商品', icon: 'fa-box' },
            { id: 'development', name: '开发板', icon: 'fa-microchip' },
            { id: 'sensor', name: '传感器', icon: 'fa-thermometer-half' },
            { id: 'display', name: '显示屏', icon: 'fa-monitor' },
            { id: 'kit', name: '学习套件', icon: 'fa-box-open' },
            { id: 'actuator', name: '执行器', icon: 'fa-cog' }
        ]);
        return;
    }
    
    if (req.method === 'GET' && req.url === '/api/digital-categories') {
        res.status(200).json([
            { id: 'all', name: '全部', icon: 'fa-box' },
            { id: 'code', name: '源码代码', icon: 'fa-code' },
            { id: 'docs', name: '文档资料', icon: 'fa-file-pdf' },
            { id: 'project', name: '项目实战', icon: 'fa-folder-open' }
        ]);
        return;
    }
    
    const fs = require('fs');
    const path = require('path');
    
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }
    
    try {
        const content = fs.readFileSync(path.join(__dirname, '..', filePath), 'utf8');
        const ext = path.extname(filePath);
        
        let contentType = 'text/html';
        if (ext === '.css') contentType = 'text/css';
        if (ext === '.js') contentType = 'text/javascript';
        if (ext === '.json') contentType = 'application/json';
        if (ext === '.png') contentType = 'image/png';
        if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        if (ext === '.svg') contentType = 'image/svg+xml';
        
        res.setHeader('Content-Type', contentType);
        res.status(200).send(content);
    } catch (err) {
        res.status(404).send('Not Found');
    }
};
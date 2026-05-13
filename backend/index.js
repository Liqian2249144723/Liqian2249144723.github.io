const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const productsFilePath = path.join(dataDir, 'products.json');
const messagesFilePath = path.join(dataDir, 'messages.json');

if (!fs.existsSync(productsFilePath)) {
    fs.writeFileSync(productsFilePath, JSON.stringify([
        {
            id: 1,
            name: 'STM32F103C8T6开发板',
            price: 45,
            category: 'development',
            description: 'STM32F103C8T6最小系统板，核心板，学习板',
            image: 'STM32F103'
        },
        {
            id: 2,
            name: 'HC-SR04超声波模块',
            price: 12,
            category: 'sensor',
            description: '超声波测距模块，支持2cm-400cm测距',
            image: 'HC-SR04'
        },
        {
            id: 3,
            name: 'OLED显示屏 0.96寸',
            price: 18,
            category: 'display',
            description: '0.96寸OLED显示屏，128x64分辨率',
            image: 'OLED'
        },
        {
            id: 4,
            name: 'DS18B20温度传感器',
            price: 8,
            category: 'sensor',
            description: '单总线温度传感器，-55°C~125°C',
            image: 'DS18B20'
        },
        {
            id: 5,
            name: 'STM32学习套件',
            price: 128,
            category: 'kit',
            description: '包含STM32开发板+10种传感器+教程',
            image: 'STM32-Kit'
        },
        {
            id: 6,
            name: 'ESP32开发板',
            price: 35,
            category: 'development',
            description: 'ESP32-WROOM-32开发板，支持WiFi+蓝牙',
            image: 'ESP32'
        }
    ], null, 2));
}

if (!fs.existsSync(messagesFilePath)) {
    fs.writeFileSync(messagesFilePath, JSON.stringify([], null, 2));
}

app.get('/api/products', (req, res) => {
    const category = req.query.category;
    let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    
    if (category && category !== 'all') {
        products = products.filter(p => p.category === category);
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
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name: req.body.name,
        price: req.body.price,
        category: req.body.category || 'other',
        description: req.body.description || '',
        image: req.body.image || ''
    };
    
    products.push(newProduct);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
});

app.post('/api/messages', (req, res) => {
    const messages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf8'));
    const newMessage = {
        id: messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        content: req.body.content,
        createdAt: new Date().toISOString()
    };
    
    messages.push(newMessage);
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
    res.status(201).json({ message: '留言成功！', data: newMessage });
});

app.get('/api/messages', (req, res) => {
    const messages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf8'));
    res.json(messages);
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
    res.json({
        years: 3,
        videos: 100,
        students: 5000,
        projects: 50
    });
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
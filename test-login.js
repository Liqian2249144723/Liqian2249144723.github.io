const http = require('http');

const data = JSON.stringify({
    username: '2249144723',
    password: 'liqian666'
});

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let body = '';
    
    res.on('data', (chunk) => {
        body += chunk;
    });
    
    res.on('end', () => {
        console.log('登录测试结果:');
        console.log('状态码:', res.statusCode);
        console.log('响应:', body);
        
        try {
            const json = JSON.parse(body);
            if (json.success) {
                console.log('✅ 登录成功！');
            } else {
                console.log('❌ 登录失败！');
            }
        } catch (e) {
            console.log('❌ 响应解析失败');
        }
    });
});

req.on('error', (error) => {
    console.error('❌ 请求失败:', error);
});

req.write(data);
req.end();

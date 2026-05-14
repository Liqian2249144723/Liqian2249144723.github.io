const https = require('https');

const data = JSON.stringify({
    username: '2249144723',
    password: 'liqian666'
});

const options = {
    hostname: 'yuanxing-workshop.onrender.com',
    port: 443,
    path: '/api/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('正在测试 Render 后端...');
console.log('URL: https://yuanxing-workshop.onrender.com/api/login');
console.log('等待响应...');

const req = https.request(options, (res) => {
    console.log('\n=== 响应结果 ===');
    console.log('状态码:', res.statusCode);
    console.log('响应头:', JSON.stringify(res.headers, null, 2));
    
    let body = '';
    
    res.on('data', (chunk) => {
        body += chunk;
    });
    
    res.on('end', () => {
        console.log('响应体:', body);
        
        try {
            const json = JSON.parse(body);
            if (json.success) {
                console.log('\n✅ 登录成功！');
                console.log('用户:', json.user);
            } else {
                console.log('\n❌ 登录失败:', json.message);
            }
        } catch (e) {
            console.log('\n❌ 响应解析失败:', e.message);
        }
    });
});

req.on('error', (error) => {
    console.error('\n❌ 请求失败:', error.message);
});

req.write(data);
req.end();

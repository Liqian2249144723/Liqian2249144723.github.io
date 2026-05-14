const http = require('http');

function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch {
                    resolve(body);
                }
            });
        });
        req.on('error', reject);
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function debugOrderFlow() {
    console.log('=== 调试订单确认流程 ===\n');
    
    // 1. 普通用户登录
    console.log('1. 普通用户登录...');
    const userLoginResult = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { username: '123456', password: 'liqian666' });
    
    if (!userLoginResult.success) {
        console.log('❌ 用户登录失败:', userLoginResult.message);
        return;
    }
    const userToken = userLoginResult.token;
    const userId = userLoginResult.user.id;
    console.log('✅ 用户登录成功，ID:', userId);
    
    // 2. 查询用户订单（确认前）
    console.log('\n2. 用户查询订单（确认前）...');
    let userOrdersBefore = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/orders',
        method: 'GET',
        headers: { 'Authorization': userToken }
    });
    
    if (Array.isArray(userOrdersBefore)) {
        console.log('用户订单数量:', userOrdersBefore.length);
        const pendingOrders = userOrdersBefore.filter(o => o.status === 'pending');
        console.log('待确认订单数量:', pendingOrders.length);
        
        if (pendingOrders.length === 0) {
            console.log('⚠️ 没有待确认订单，创建一个新订单...');
            
            // 创建新订单
            const createOrderResult = await makeRequest({
                hostname: 'localhost',
                port: 3001,
                path: '/api/orders',
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': userToken }
            }, { 
                productId: 1, 
                email: '123456@example.com', 
                buyerName: '测试用户',
                phone: '13800138000'
            });
            
            if (createOrderResult.success) {
                console.log('✅ 订单创建成功，订单ID:', createOrderResult.order.id);
            } else {
                console.log('❌ 订单创建失败:', createOrderResult.message);
                return;
            }
        }
    } else {
        console.log('❌ 用户订单查询失败:', userOrdersBefore);
        return;
    }
    
    // 3. 管理员登录
    console.log('\n3. 管理员登录...');
    const adminLoginResult = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { username: '2249144723', password: 'liqian666' });
    
    if (!adminLoginResult.success) {
        console.log('❌ 管理员登录失败:', adminLoginResult.message);
        return;
    }
    const adminToken = adminLoginResult.token;
    console.log('✅ 管理员登录成功');
    
    // 4. 管理员查询订单找到待确认订单
    console.log('\n4. 管理员查询待确认订单...');
    const adminOrders = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/orders',
        method: 'GET',
        headers: { 'Authorization': adminToken }
    });
    
    const pendingOrder = adminOrders.find(o => o.status === 'pending');
    if (!pendingOrder) {
        console.log('❌ 没有待确认订单');
        return;
    }
    console.log('找到待确认订单ID:', pendingOrder.id);
    
    // 5. 管理员确认订单
    console.log('\n5. 管理员确认订单...');
    const confirmResult = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: `/api/orders/${pendingOrder.id}/confirm`,
        method: 'PUT',
        headers: { 'Authorization': adminToken }
    });
    
    if (!confirmResult.success) {
        console.log('❌ 订单确认失败:', confirmResult.message);
        return;
    }
    console.log('✅ 订单确认成功');
    
    // 6. 用户再次查询订单（确认后）
    console.log('\n6. 用户再次查询订单（确认后）...');
    const userOrdersAfter = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/orders',
        method: 'GET',
        headers: { 'Authorization': userToken }
    });
    
    if (Array.isArray(userOrdersAfter)) {
        console.log('用户订单数量:', userOrdersAfter.length);
        const completedOrders = userOrdersAfter.filter(o => o.status === 'completed');
        console.log('已完成订单数量:', completedOrders.length);
        
        if (completedOrders.length > 0) {
            const justCompleted = completedOrders.find(o => o.id === pendingOrder.id);
            if (justCompleted) {
                console.log('\n7. 检查刚确认的订单详情:');
                console.log('订单ID:', justCompleted.id);
                console.log('状态:', justCompleted.status);
                console.log('商品名称:', justCompleted.productName);
                console.log('网盘链接:', justCompleted.panLink || '无');
                console.log('提取码:', justCompleted.panPassword || '无');
                console.log('下载链接:', justCompleted.downloadLinks ? justCompleted.downloadLinks.length : 0, '个');
                
                if (justCompleted.panLink) {
                    console.log('\n✅ 修复成功！订单确认后用户可以看到下载信息');
                } else {
                    console.log('\n❌ 订单已确认但没有下载信息');
                }
            } else {
                console.log('\n❌ 用户看不到刚确认的订单！');
            }
        } else {
            console.log('\n❌ 用户没有已完成订单！');
        }
    } else {
        console.log('\n❌ 用户订单查询失败:', userOrdersAfter);
    }
    
    console.log('\n=== 调试完成 ===');
}

debugOrderFlow().catch(console.error);
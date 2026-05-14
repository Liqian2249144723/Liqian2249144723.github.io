export async function handleGetContact(): Promise<Response> {
  return new Response(JSON.stringify({
    wechat: 'your_wechat_id',
    qq: '2249144723',
    email: '2249144723@qq.com',
    phone: '16627878630',
    alipay: '16627878630'
  }), { headers: { 'Content-Type': 'application/json' } });
}
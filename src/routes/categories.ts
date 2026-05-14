export async function handleGetCategories(): Promise<Response> {
  return new Response(JSON.stringify([
    { id: 'all', name: '全部', icon: 'fa-box' },
    { id: 'stm32', name: 'STM32', icon: 'fa-microchip' },
    { id: 'linux', name: 'Linux', icon: 'fa-linux' },
    { id: 'rtos', name: 'RTOS', icon: 'fa-cog' },
    { id: 'code', name: '源码代码', icon: 'fa-code' },
    { id: 'docs', name: '文档资料', icon: 'fa-file-pdf' },
    { id: 'project', name: '项目实战', icon: 'fa-folder-open' }
  ]), { headers: { 'Content-Type': 'application/json' } });
}
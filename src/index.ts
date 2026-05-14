import { Router } from 'itty-router';
import { handleLogin } from './routes/auth';
import { handleRegister } from './routes/auth';
import { handleGetProducts } from './routes/products';
import { handleGetProduct } from './routes/products';
import { handleCreateProduct } from './routes/products';
import { handleUpdateProduct } from './routes/products';
import { handleDeleteProduct } from './routes/products';
import { handleGetOrders } from './routes/orders';
import { handleCreateOrder } from './routes/orders';
import { handleConfirmOrder } from './routes/orders';
import { handleCancelOrder } from './routes/orders';
import { handleGetDigitalProducts } from './routes/digital';
import { handleCreateMessage } from './routes/messages';
import { handleGetMessages } from './routes/messages';
import { handleGetStats } from './routes/stats';
import { handleGetContact } from './routes/contact';
import { handleGetCategories } from './routes/categories';
import { handleStatic } from './routes/static';
import { handleRoot } from './routes/static';

export interface Env {
  DB: D1Database;
  MY_BUCKET: R2Bucket;
  JWT_SECRET: string;
}

const router = Router();

router.post('/api/login', handleLogin);
router.post('/api/register', handleRegister);
router.get('/api/products', handleGetProducts);
router.get('/api/products/:id', handleGetProduct);
router.post('/api/products', handleCreateProduct);
router.put('/api/products/:id', handleUpdateProduct);
router.delete('/api/products/:id', handleDeleteProduct);
router.get('/api/digital-products', handleGetDigitalProducts);
router.post('/api/orders', handleCreateOrder);
router.get('/api/orders', handleGetOrders);
router.put('/api/orders/:id/confirm', handleConfirmOrder);
router.put('/api/orders/:id/cancel', handleCancelOrder);
router.post('/api/messages', handleCreateMessage);
router.get('/api/messages', handleGetMessages);
router.get('/api/stats', handleGetStats);
router.get('/api/contact', handleGetContact);
router.get('/api/categories', handleGetCategories);
router.get('/api/digital-categories', () => new Response(JSON.stringify([
  { id: 'all', name: '全部', icon: 'fa-box' },
  { id: 'code', name: '源码代码', icon: 'fa-code' },
  { id: 'docs', name: '文档资料', icon: 'fa-file-pdf' },
  { id: 'project', name: '项目实战', icon: 'fa-folder-open' }
]), { headers: { 'Content-Type': 'application/json' } }));
router.get('/download/:orderId', handleStatic);
router.get('/', handleRoot);
router.get('/admin.html', handleStatic);
router.get('/products.html', handleStatic);
router.get('/index.html', handleStatic);
router.get('/styles.css', handleStatic);

router.all('*', () => new Response('Not Found', { status: 404 }));

export default {
  fetch: (request: Request, env: Env) => router.handle(request, env)
};
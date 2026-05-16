/**
 * 百度网盘批量发布工具 - 原形工坊
 * 
 * 功能: 批量压缩项目→上传百度网盘→生成分享链接→更新网站数据
 * 
 * 使用:
 *   第一步: node baidu-publish.js auth       (百度授权，首次运行)
 *   第二步: node baidu-publish.js publish    (批量压缩+上传+分享)
 *   第三步: node baidu-publish.js refresh    (7天后刷新链接)
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const axios = require('axios');
const { execSync, spawn } = require('child_process');

// ===== 配置 =====
const CONFIG = {
  // 百度开发者应用信息
  appKey: '3JJYCo1okJ3dfgPOvKR8xuQkiCmPmz4n',
  secretKey: 'oLNn5pZKdaS3QMqIiiKv319sCJZKr6R9',
  
  // 项目源文件夹 (你的项目存放位置)
  sourceDir: 'D:\\毕设接单\\stm32\\Proj_finish',
  
  // 临时zip输出目录
  zipDir: path.join(__dirname, 'zips'),
  
  // 百度网盘上传目标目录
  remoteDir: '/原形工坊资料',
  
  // 网站数据输出 (直接替换网站的数字商品数据)
  outputFile: path.join(__dirname, '..', 'data', 'digital_products.json'),
  
  // Token 存储文件
  tokenFile: path.join(__dirname, '.baidu_token.json'),
  
  // 商品分类映射
  categories: {
    'stm32': { name: '源码代码', id: 'code', icon: 'fa-code' },
    '项目': { name: '项目实战', id: 'project', icon: 'fa-folder-open' },
    '文档': { name: '文档资料', id: 'docs', icon: 'fa-file-pdf' },
  }
};

// ===== 工具函数 =====

function log(msg) {
  console.log(`[${new Date().toLocaleString()}] ${msg}`);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/** 检测分类 */
function detectCategory(folderName) {
  const name = folderName.toLowerCase();
  if (name.includes('stm32') || name.includes('单片机') || name.includes('嵌入式')) return 'code';
  if (name.includes('项目') || name.includes('实战') || name.includes('系统')) return 'project';
  return 'docs';
}

/** 生成随机4位提取码 */
function generatePwd() {
  return Math.random().toString(36).substring(2, 6);
}

/** 安全文件名 */
function safeName(name) {
  return name.replace(/[<>:"/\\|?*]/g, '_').trim();
}

// ===== 百度 OAuth 授权 =====

async function doAuth() {
  log('=== 百度网盘授权 ===');
  log('请打开以下链接，登录百度账号并授权:');
  log('');
  const authUrl = `https://openapi.baidu.com/oauth/2.0/device/code?response_type=device_code&client_id=${CONFIG.appKey}&scope=basic,netdisk`;
  
  try {
    const resp = await axios.get(authUrl);
    const { device_code, user_code, verification_url, interval, expires_in } = resp.data;
    
    console.log('┌─────────────────────────────────────────────┐');
    console.log('│                                             │');
    console.log('│  请访问: ' + verification_url);
    console.log('│                                             │');
    console.log('│  输入代码: ' + user_code);
    console.log('│                                             │');
    console.log('│  有效期: ' + Math.floor(expires_in / 60) + ' 分钟');
    console.log('│                                             │');
    console.log('└─────────────────────────────────────────────┘');
    console.log('');
    log('授权完成后，按回车继续...');
    
    await new Promise(resolve => process.stdin.once('data', resolve));
    
    // 轮询获取 token
    const tokenUrl = `https://openapi.baidu.com/oauth/2.0/token?grant_type=device_token&code=${device_code}&client_id=${CONFIG.appKey}&client_secret=${CONFIG.secretKey}`;
    
    for (let i = 0; i < 60; i++) {
      try {
        const tokenResp = await axios.get(tokenUrl);
        if (tokenResp.data.access_token) {
          const tokenData = {
            access_token: tokenResp.data.access_token,
            refresh_token: tokenResp.data.refresh_token,
            expires_at: Date.now() + tokenResp.data.expires_in * 1000,
            scope: tokenResp.data.scope
          };
          fs.writeFileSync(CONFIG.tokenFile, JSON.stringify(tokenData, null, 2));
          log('✅ 授权成功！Token 已保存');
          console.log('Token有效期至:', new Date(tokenData.expires_at).toLocaleString());
          return tokenData;
        }
      } catch (e) {
        // 等待用户授权
      }
      await sleep(interval * 1000);
    }
    throw new Error('授权超时');
  } catch (e) {
    if (e.message === '授权超时') throw e;
    log('❌ 授权失败: ' + e.message);
    throw e;
  }
}

/** 获取已保存的 token，自动刷新 */
async function getToken() {
  if (!fs.existsSync(CONFIG.tokenFile)) {
    log('❌ 未找到 token，请先运行: node baidu-publish.js auth');
    return null;
  }
  
  const tokenData = JSON.parse(fs.readFileSync(CONFIG.tokenFile, 'utf8'));
  
  // 过期前5分钟就刷新
  if (Date.now() > tokenData.expires_at - 300000) {
    log('Token即将过期，自动刷新...');
    try {
      const resp = await axios.get(
        `https://openapi.baidu.com/oauth/2.0/token?grant_type=refresh_token&refresh_token=${tokenData.refresh_token}&client_id=${CONFIG.appKey}&client_secret=${CONFIG.secretKey}`
      );
      tokenData.access_token = resp.data.access_token;
      tokenData.refresh_token = resp.data.refresh_token || tokenData.refresh_token;
      tokenData.expires_at = Date.now() + (resp.data.expires_in || 2592000) * 1000;
      fs.writeFileSync(CONFIG.tokenFile, JSON.stringify(tokenData, null, 2));
      log('✅ Token 已刷新');
    } catch (e) {
      log('❌ Token 刷新失败: ' + e.message);
      return null;
    }
  }
  
  return tokenData.access_token;
}

// ===== 百度网盘 API =====

/** 获取文件列表（用于查找已上传的文件ID） */
async function getFileList(accessToken, dirPath) {
  try {
    const resp = await axios.get('https://pan.baidu.com/rest/2.0/xpan/file', {
      params: {
        method: 'list',
        access_token: accessToken,
        dir: dirPath,
        order: 'name',
        desc: 0,
        num: 500
      }
    });
    if (resp.data.errno === 0) {
      return resp.data.list || [];
    }
    return [];
  } catch (e) {
    log('获取文件列表失败: ' + e.message);
    return [];
  }
}

/** 创建目录 */
async function mkdir(accessToken, dirPath) {
  try {
    const resp = await axios.post(
      `https://pan.baidu.com/rest/2.0/xpan/file?method=create&access_token=${accessToken}`,
      `path=${encodeURIComponent(dirPath)}&isdir=1&rtype=1`
    );
    return resp.data.errno === 0;
  } catch (e) {
    return false;
  }
}

/** 上传文件到百度网盘 */
async function uploadFile(accessToken, localPath, remotePath) {
  const fileName = path.basename(localPath);
  const stats = fs.statSync(localPath);
  const fileSize = stats.size;
  
  log(`开始上传: ${fileName} (${(fileSize / 1024 / 1024).toFixed(1)}MB)`);
  
  // 预创建上传
  const precreateUrl = `https://pan.baidu.com/rest/2.0/xpan/file?method=precreate&access_token=${accessToken}`;
  const uploadId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  
  // 计算MD5（简化版 - 实际建议用完整MD5）
  const blockList = JSON.stringify([fileName]);
  
  const preForm = new URLSearchParams();
  preForm.append('path', remotePath);
  preForm.append('size', fileSize);
  preForm.append('isdir', '0');
  preForm.append('rtype', '1');
  preForm.append('uploadid', uploadId);
  preForm.append('block_list', blockList);
  preForm.append('autoinit', '1');
  
  try {
    const preResp = await axios.post(precreateUrl, preForm.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    if (preResp.data.errno !== 0 && preResp.data.errno !== -9) {
      // -9 表示文件已存在，直接返回
      if (preResp.data.errno === -9) {
        log(`文件已存在: ${fileName}`);
        return await getRemoteFsId(accessToken, remotePath);
      }
      log(`❌ 预创建失败: errno=${preResp.data.errno}`);
      return null;
    }
    
    // 上传文件内容
    const fileContent = fs.readFileSync(localPath);
    const uploadUrl = `https://pan.baidu.com/rest/2.0/xpan/file?method=upload&access_token=${accessToken}&type=tmpfile&path=${encodeURIComponent(remotePath)}&uploadid=${uploadId}&partseq=0`;
    
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', fileContent, {
      filename: fileName,
      contentType: 'application/octet-stream'
    });
    
    const uploadResp = await axios.post(uploadUrl, form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    
    if (uploadResp.data.errno !== 0 && uploadResp.data.errno !== -9) {
      log(`❌ 上传失败: errno=${uploadResp.data.errno}`);
      return null;
    }
    
    // 合并文件
    const createUrl = `https://pan.baidu.com/rest/2.0/xpan/file?method=create&access_token=${accessToken}`;
    const createForm = new URLSearchParams();
    createForm.append('path', remotePath);
    createForm.append('size', fileSize);
    createForm.append('isdir', '0');
    createForm.append('rtype', '1');
    createForm.append('uploadid', uploadId);
    createForm.append('block_list', blockList);
    
    const createResp = await axios.post(createUrl, createForm.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    if (createResp.data.errno === 0 || createResp.data.errno === -9) {
      log(`✅ 上传完成: ${fileName}`);
      return await getRemoteFsId(accessToken, remotePath);
    }
    
    log(`❌ 合并失败: errno=${createResp.data.errno}`);
    return null;
  } catch (e) {
    log(`❌ 上传出错: ${e.message}`);
    return null;
  }
}

/** 获取远程文件ID */
async function getRemoteFsId(accessToken, remotePath) {
  const dir = path.dirname(remotePath);
  const files = await getFileList(accessToken, dir.replace(/\\/g, '/'));
  const fileName = path.basename(remotePath);
  const file = files.find(f => f.filename === fileName);
  return file ? file.fs_id : null;
}

/** 创建分享链接 */
async function createShareLink(accessToken, fsId) {
  try {
    const pwd = generatePwd();
    const resp = await axios.post(
      `https://pan.baidu.com/rest/2.0/xpan/share?method=create&access_token=${accessToken}`,
      `fidlist=%5B${fsId}%5D&share_type=1&pwd=${pwd}`
    );
    
    if (resp.data.errno === 0 || resp.data.errno === 9) {
      // errno 9 = 分享已存在
      const link = resp.data.url_info ? resp.data.url_info[0].url : 
                   resp.data.link || `https://pan.baidu.com/s/1${resp.data.shareid}`;
      return { link: `https://pan.baidu.com/s/1${resp.data.shareid || ''}`, pwd };
    }
    log(`❌ 分享创建失败: errno=${resp.data.errno}`);
    return null;
  } catch (e) {
    log(`❌ 分享创建出错: ${e.message}`);
    return null;
  }
}

// ===== 压缩模块 =====

/** 压缩单个文件夹 */
async function zipFolder(folderPath, outputZip) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputZip);
    const archive = archiver('zip', { zlib: { level: 5 } });
    
    output.on('close', () => resolve(true));
    archive.on('error', err => reject(err));
    
    archive.pipe(output);
    archive.directory(folderPath, false);
    archive.finalize();
  });
}

/** 批量压缩所有项目 */
async function batchZip() {
  if (!fs.existsSync(CONFIG.sourceDir)) {
    log(`❌ 源文件夹不存在: ${CONFIG.sourceDir}`);
    return [];
  }
  
  if (!fs.existsSync(CONFIG.zipDir)) {
    fs.mkdirSync(CONFIG.zipDir, { recursive: true });
  }
  
  const items = fs.readdirSync(CONFIG.sourceDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name));
  
  log(`找到 ${items.length} 个项目文件夹`);
  
  const results = [];
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const folderPath = path.join(CONFIG.sourceDir, item.name);
    const zipName = safeName(item.name) + '.zip';
    const zipPath = path.join(CONFIG.zipDir, zipName);
    
    log(`[${i + 1}/${items.length}] 压缩: ${item.name}`);
    
    try {
      await zipFolder(folderPath, zipPath);
      const stats = fs.statSync(zipPath);
      results.push({
        name: item.name,
        zipPath,
        zipName,
        size: stats.size,
        category: detectCategory(item.name)
      });
    } catch (e) {
      log(`  ❌ 压缩失败: ${e.message}`);
    }
  }
  
  log(`✅ 压缩完成: ${results.length}/${items.length}`);
  return results;
}

// ===== 发布主流程 =====

async function publish() {
  log('=== 批量发布到百度网盘 ===');
  
  // 1. 获取token
  const accessToken = await getToken();
  if (!accessToken) return;
  
  // 2. 批量压缩
  const projects = await batchZip();
  if (projects.length === 0) {
    log('没有项目需要处理');
    return;
  }
  
  // 3. 创建远程目录
  await mkdir(accessToken, CONFIG.remoteDir);
  
  // 4. 逐个上传+分享
  const products = [];
  
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    const remotePath = `${CONFIG.remoteDir}/${encodeURIComponent(p.zipName)}`;
    
    log(`[${i + 1}/${projects.length}] 上传: ${p.zipName}`);
    
    // 上传
    const fsId = await uploadFile(accessToken, p.zipPath, remotePath);
    if (!fsId) {
      log(`  ⏭ 跳过分享创建`);
      continue;
    }
    
    // 创建分享链接
    await sleep(1000); // 避免频率限制
    const share = await createShareLink(accessToken, fsId);
    
    if (share) {
      log(`  ✅ 分享链接: ${share.link}  提取码: ${share.pwd}`);
      products.push({
        id: i + 1,
        name: p.name,
        price: 0,
        originalPrice: 0,
        description: `${p.name} - 嵌入式项目资料`,
        category: p.category,
        downloads: 0,
        isHot: false,
        panLink: share.link,
        panPassword: share.pwd,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
    } else {
      log(`  ❌ 分享创建失败`);
    }
  }
  
  // 5. 生成网站数据
  if (products.length > 0) {
    const outputData = products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      description: p.description,
      category: p.category,
      downloads: p.downloads,
      files: [],
      panLink: p.panLink,
      panPassword: p.panPassword,
      isHot: p.isHot,
      createdAt: p.createdAt,
      expiresAt: p.expiresAt
    }));
    
    fs.writeFileSync(CONFIG.outputFile, JSON.stringify(outputData, null, 2));
    log(`✅ 已生成网站数据: ${CONFIG.outputFile}`);
    log(`  共 ${products.length} 个商品`);
  }
}

// ===== 刷新链接（每7天运行）=====

async function refresh() {
  log('=== 刷新百度网盘分享链接 ===');
  
  const accessToken = await getToken();
  if (!accessToken) return;
  
  if (!fs.existsSync(CONFIG.outputFile)) {
    log('❌ 未找到商品数据文件');
    return;
  }
  
  const products = JSON.parse(fs.readFileSync(CONFIG.outputFile, 'utf8'));
  log(`当前有 ${products.length} 个商品`);
  
  // 获取远程文件列表
  const files = await getFileList(accessToken, CONFIG.remoteDir);
  log(`网盘有 ${files.length} 个文件`);
  
  // 重新创建分享链接
  let updated = 0;
  for (const product of products) {
    const zipName = safeName(product.name) + '.zip';
    const file = files.find(f => f.filename === zipName);
    
    if (file) {
      // 删除旧分享（可选）
      const share = await createShareLink(accessToken, file.fs_id);
      if (share) {
        product.panLink = share.link;
        product.panPassword = share.pwd;
        product.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        updated++;
        log(`✅ ${product.name}: ${share.link}  ${share.pwd}`);
      }
      await sleep(500);
    } else {
      log(`⚠️ 未找到文件: ${zipName}`);
    }
  }
  
  // 保存更新
  fs.writeFileSync(CONFIG.outputFile, JSON.stringify(products, null, 2));
  log(`✅ 刷新完成，已更新 ${updated}/${products.length} 个链接`);
}

// ===== 命令行入口 =====

async function main() {
  const cmd = process.argv[2];
  
  switch (cmd) {
    case 'auth':
      await doAuth();
      break;
    case 'publish':
      await publish();
      break;
    case 'refresh':
      await refresh();
      break;
    default:
      console.log(`
百度网盘批量发布工具

用法:
  node baidu-publish.js auth      首次授权（只需一次）
  node baidu-publish.js publish   批量压缩+上传+生成链接
  node baidu-publish.js refresh   刷新分享链接（每7天运行）
      `);
  }
}

main().catch(e => {
  console.error('错误:', e.message);
  process.exit(1);
});

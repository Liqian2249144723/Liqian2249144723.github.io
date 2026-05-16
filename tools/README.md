# 百度网盘批量发布工具

## 安装

```bash
cd tools
npm install
```

## 使用流程

### 第1步：授权（只需一次）

```bash
node baidu-publish.js auth
```

按提示打开链接，登录百度账号，输入授权码。

### 第2步：批量发布

```bash
node baidu-publish.js publish
```

自动完成：扫描文件夹 → 压缩 → 上传网盘 → 生成分享链接 → 更新网站数据

### 第3步：每7天刷新链接

```bash
node baidu-publish.js refresh
```

## 配置文件

编辑 `baidu-publish.js` 顶部 CONFIG 区域：

| 配置项 | 说明 |
|--------|------|
| `sourceDir` | 你的项目文件夹路径 |
| `remoteDir` | 百度网盘上传目录 |

## 注意

- 首次上传200个文件可能需要较长时间（取决于文件大小和网速）
- 百度API有频率限制，脚本已自动添加延时
- 分享链接7天过期后，运行 `refresh` 即可重新生成

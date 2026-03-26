# 🌐 PetKeeper 云平台部署步骤

## 📋 部署概览

- **后端**: Railway.app（免费）
- **前端**: Vercel（免费）
- **数据库**: Railway PostgreSQL（免费）

**总成本**: $0/月 ✨

---

## 第一步：部署后端到 Railway

### 1. 注册 Railway 账号

访问：https://railway.app

- 点击 "Start a New Project"
- 使用 GitHub 登录（推荐）

### 2. 创建项目

1. 点击 **"New Project"**
2. 选择 **"Deploy from GitHub repo"**
3. 授权 Railway 访问你的 GitHub
4. 选择仓库：`PTR123/ai-media-workflow`
5. 选择目录：`pet-keeper-backend`

### 3. 配置环境变量

在 Railway 项目页面：

1. 点击 **"Variables"** 标签
2. 添加以下变量：

```
NODE_ENV=production
PORT=3001
JWT_SECRET=petkeeper-super-secret-key-2026-change-in-production
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### 4. 添加 PostgreSQL 数据库

1. 点击 **"+ New"**
2. 选择 **"Database"** → **"Add PostgreSQL"**
3. Railway 会自动创建数据库并连接

### 5. 部署

Railway 会自动检测到代码更新并部署。

等待部署完成后，你会得到一个公网地址：

```
https://your-app-name.railway.app
```

### 6. 测试后端

访问：`https://your-app-name.railway.app/api/health`

应该返回：
```json
{"status": "ok", "message": "PetKeeper API is running"}
```

---

## 第二步：部署前端到 Vercel

### 1. 部署到 Vercel

在终端执行：

```bash
cd /Users/mac/my_gzh/zrby/pet-keeper
vercel
```

按提示操作：
- 选择项目范围（选择你的账号）
- 项目名称：`pet-keeper`（或自定义）
- Framework preset：`Vite`
- Build Command：`npm run build`（默认）
- Output Directory：`dist`（默认）

### 2. 配置环境变量

在 Vercel Dashboard：

1. 进入你的项目
2. 点击 **"Settings"** → **"Environment Variables"**
3. 添加：

```
VITE_API_URL = https://your-railway-app.railway.app/api
```

### 3. 重新部署

添加环境变量后：
1. 点击 **"Deployments"**
2. 找到最新的部署
3. 点击右侧的 **"..."** → **"Redeploy"**

### 4. 访问前端

你会得到一个地址：

```
https://pet-keeper.vercel.app
```

---

## 第三步：更新 GitHub 仓库

### 1. 提交更改

```bash
cd /Users/mac/my_gzh/zrby

# 添加所有文件
git add .

# 提交
git commit -m "🚀 准备云部署"

# 推送到 GitHub
git push origin main
```

### 2. 自动部署

推送后：
- Railway 会自动重新部署后端
- Vercel 会自动重新部署前端

---

## 第四步：测试部署

### 1. 测试后端 API

访问：
```
https://your-railway-app.railway.app/api/health
```

### 2. 测试前端

访问：
```
https://your-vercel-app.vercel.app
```

测试功能：
- ✅ 用户注册
- ✅ 登录
- ✅ 查看物种图鉴
- ✅ 创建宠物档案

### 3. 测试 API 连接

在前端应用中：
1. 注册一个新账号
2. 登录
3. 查看物种列表

如果能正常工作，说明前后端连接成功！

---

## 第五步：配置域名（可选）

### 自定义域名

**Railway（后端）：**
1. 在 Railway 项目设置中
2. 点击 **"Domains"**
3. 添加自定义域名：`api.yourdomain.com`

**Vercel（前端）：**
1. 在 Vercel 项目设置中
2. 点击 **"Domains"**
3. 添加自定义域名：`yourdomain.com`

---

## 🔧 环境变量汇总

### 后端（Railway）

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secret-key
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### 前端（Vercel）

```env
VITE_API_URL=https://your-railway-app.railway.app/api
```

---

## 📊 部署后管理

### Railway

- **查看日志**：点击项目 → Deployments → 查看日志
- **监控**：自动提供监控面板
- **数据库管理**：Data 标签可以查看和管理数据

### Vercel

- **查看日志**：Deployments → 选择部署 → Logs
- **分析**：Analytics 标签查看访问统计
- **预览部署**：每次 push 都会创建预览链接

---

## 🚨 常见问题

### Q1: Railway 部署失败？

检查：
- `package.json` 中是否有 `start` 脚本
- Node.js 版本是否兼容
- 查看部署日志定位错误

### Q2: 前端无法连接后端？

- 检查 `VITE_API_URL` 是否正确
- 确认后端地址是否可访问
- 检查 CORS 配置

### Q3: 数据库连接失败？

- 确认 PostgreSQL 已添加
- 检查 `DATABASE_URL` 变量
- Railway 会自动连接，不需要手动配置

---

## 📱 更新移动端配置

部署完成后，更新移动端 API 地址：

```bash
# 编辑移动端 .env 文件
nano PetKeeperMobile/.env
```

修改为：
```env
API_URL=https://your-railway-app.railway.app/api
```

重新构建 APK 即可连接到线上环境。

---

## ✅ 部署完成检查清单

- [ ] Railway 账号已创建
- [ ] 后端已部署
- [ ] PostgreSQL 数据库已添加
- [ ] 后端 API 可访问
- [ ] Vercel 账号已创建
- [ ] 前端已部署
- [ ] 前端可访问
- [ ] 用户注册/登录测试通过
- [ ] API 连接正常
- [ ] 自定义域名配置（可选）

---

## 🎉 部署成功！

现在你的应用已经在线：

- **前端**: `https://your-app.vercel.app`
- **后端**: `https://your-railway-app.railway.app/api`

可以分享给全世界访问了！🎊

---

## 💡 下一步

1. **配置自定义域名**（更专业）
2. **设置监控告警**（及时发现问题）
3. **优化性能**（CDN、缓存等）
4. **发布移动端**（应用商店）
# 🚀 PetKeeper 网页界面部署指南

## 部署概览

- **后端**: Railway.app (免费)
- **数据库**: Railway PostgreSQL (免费)
- **前端**: Vercel (免费)
- **总成本**: $0/月

---

## 第一步：部署后端到 Railway

### 1.1 注册/登录 Railway

1. 访问: https://railway.app
2. 点击 "Start a New Project"
3. 选择 "Login with GitHub"
4. 授权 Railway 访问你的 GitHub 账号

### 1.2 创建后端项目

1. 登录后，点击 **"New Project"**
2. 选择 **"Deploy from GitHub repo"**
3. 找到并选择 `pet-keeper-app` 仓库
4. 在 **"Root Directory"** 输入框中输入: `pet-keeper-backend`
5. 点击 **"Deploy Now"**

⚠️ **注意**: 第一次部署可能会失败，这是正常的，因为还没有配置数据库。

### 1.3 添加 PostgreSQL 数据库

1. 在项目页面，点击右上角的 **"+"** 按钮
2. 选择 **"Database"**
3. 选择 **"Add PostgreSQL"**
4. Railway 会自动创建数据库并设置 `DATABASE_URL` 环境变量

### 1.4 配置环境变量

1. 点击后端服务（通常叫 "web" 或 "pet-keeper-backend"）
2. 点击 **"Variables"** 标签
3. 点击 **"New Variable"** 添加以下变量：

```
JWT_SECRET=your-super-secret-key-change-this-to-random-string
NODE_ENV=production
```

**生成 JWT_SECRET 的方法**（在本地终端运行）：
```bash
openssl rand -base64 32
```

复制输出的字符串作为 JWT_SECRET 的值。

### 1.5 重新部署

1. 添加环境变量后，Railway 会自动触发重新部署
2. 或者点击 **"Deployments"** 标签
3. 点击最新部署旁的 **"Redeploy"** 按钮

### 1.6 获取后端 URL

1. 部署成功后，点击 **"Settings"** 标签
2. 在 **"Domains"** 部分，点击 **"Generate Domain"**
3. Railway 会提供一个 URL，例如: `https://pet-keeper-backend-production-abc123.up.railway.app`
4. 复制这个 URL，后面会用到

### 1.7 运行数据库迁移

⚠️ **重要**: 需要手动运行数据库迁移

在本地终端执行：

```bash
cd /Users/mac/zrby/pet-keeper-backend

# 连接到 Railway 项目
railway link

# 运行迁移
railway run npm run db:migrate:deploy

# 填充初始数据（可选）
railway run npm run db:seed
```

或者使用 Railway CLI：

```bash
# 登录 Railway
railway login

# 链接项目
cd pet-keeper-backend
railway link

# 运行迁移
railway run npm run db:migrate:deploy
railway run npm run db:seed
```

---

## 第二步：部署前端到 Vercel

### 2.1 注册/登录 Vercel

1. 访问: https://vercel.com
2. 点击 **"Sign Up"** 或 **"Log In"**
3. 选择 **"Continue with GitHub"**
4. 授权 Vercel 访问你的 GitHub 账号

### 2.2 导入项目

1. 登录后，点击 **"Add New..."** → **"Project"**
2. 在 **"Import Git Repository"** 部分
3. 找到 `pet-keeper-app` 仓库
4. 点击 **"Import"**

### 2.3 配置项目

**重要配置**:

1. **Framework Preset**: Next.js（自动检测）
2. **Root Directory**: 点击 **"Edit"**，输入 `pet-keeper`
3. **Build Command**: `npm run build`（默认）
4. **Output Directory**: `.next`（默认）

### 2.4 添加环境变量

在 **"Environment Variables"** 部分，添加：

- **Name**: `NEXT_PUBLIC_API_URL`
- **Value**: `https://你的后端地址.up.railway.app/api`

⚠️ **重要**: 将 `你的后端地址` 替换为你在第一步 1.6 获取的实际 URL

例如:
```
NEXT_PUBLIC_API_URL=https://pet-keeper-backend-production-abc123.up.railway.app/api
```

### 2.5 部署

1. 确认所有配置正确
2. 点击 **"Deploy"**
3. 等待部署完成（通常需要 2-3 分钟）

### 2.6 获取前端 URL

部署成功后，Vercel 会提供一个 URL，例如:
`https://pet-keeper-app-xyz.vercel.app`

---

## 第三步：验证部署

### 3.1 测试后端 API

在浏览器访问:
```
https://你的后端地址.up.railway.app/api
```

应该看到类似响应:
```json
{"message": "PetKeeper API is running"}
```

### 3.2 测试前端

访问你的 Vercel URL:
```
https://你的前端地址.vercel.app
```

应该能看到 PetKeeper 登录页面。

### 3.3 测试完整流程

1. 在前端页面注册新账号
2. 登录
3. 尝试添加宠物
4. 检查功能是否正常

---

## 第四步：配置 CORS（如果需要）

如果前端无法连接后端，需要更新后端的 CORS 配置。

编辑 `pet-keeper-backend/src/index.ts`，确保 CORS 配置包含你的前端域名：

```typescript
import cors from 'cors';

app.use(cors({
  origin: [
    'https://你的前端地址.vercel.app',
    'http://localhost:3002'
  ],
  credentials: true
}));
```

然后提交并推送代码，Railway 会自动重新部署。

---

## 第五步：自定义域名（可选）

### 5.1 前端自定义域名

1. 在 Vercel 项目页面，点击 **"Settings"** → **"Domains"**
2. 输入你的域名，例如: `petkeeper.com`
3. 按照提示配置 DNS 记录

### 5.2 后端自定义域名

1. 在 Railway 项目页面，点击 **"Settings"** → **"Domains"**
2. 点击 **"Custom Domain"**
3. 输入你的域名，例如: `api.petkeeper.com`
4. 配置 DNS CNAME 记录

---

## 📋 部署检查清单

### 后端部署 ✅

- [ ] 创建 Railway 账号并登录
- [ ] 从 GitHub 导入 `pet-keeper-app` 仓库
- [ ] 设置 Root Directory 为 `pet-keeper-backend`
- [ ] 添加 PostgreSQL 数据库
- [ ] 配置环境变量 (JWT_SECRET, NODE_ENV)
- [ ] 生成域名并复制后端 URL
- [ ] 运行数据库迁移
- [ ] 填充初始数据（可选）
- [ ] 测试 API 端点

### 前端部署 ✅

- [ ] 创建 Vercel 账号并登录
- [ ] 导入 `pet-keeper-app` 仓库
- [ ] 设置 Root Directory 为 `pet-keeper`
- [ ] 添加环境变量 NEXT_PUBLIC_API_URL
- [ ] 完成部署
- [ ] 测试前端页面

### 功能测试 ✅

- [ ] 用户注册功能正常
- [ ] 用户登录功能正常
- [ ] 可以添加宠物
- [ ] 可以查看物种图鉴
- [ ] 社区功能正常
- [ ] 图片上传功能正常

---

## 🔧 常见问题

### Q1: 后端部署失败

**原因**: 可能缺少环境变量或数据库连接失败

**解决**:
1. 检查是否添加了 PostgreSQL 数据库
2. 检查环境变量是否正确设置
3. 查看 Railway 部署日志

### Q2: 前端无法连接后端

**原因**: CORS 配置或 API URL 错误

**解决**:
1. 检查 NEXT_PUBLIC_API_URL 是否正确
2. 确保 URL 以 `/api` 结尾
3. 检查后端 CORS 配置

### Q3: 数据库迁移失败

**原因**: 需要在 Railway 环境运行迁移

**解决**:
```bash
railway login
railway link
railway run npm run db:migrate:deploy
```

### Q4: 图片上传失败

**原因**: Railway 文件系统是只读的

**解决**: 使用云存储服务（如 AWS S3、Cloudinary）

---

## 💰 成本说明

### 免费额度

- **Railway**: 每月 $5 免费额度（足够小型应用）
- **Vercel**: 完全免费（Hobby 计划）
- **PostgreSQL**: 包含在 Railway 免费额度内

### 如果超出免费额度

- Railway Hobby: $5/月
- Railway Pro: $20/月
- Vercel Pro: $20/月

---

## 📞 需要帮助？

如果在部署过程中遇到问题：

1. 查看 Railway 部署日志
2. 查看 Vercel 构建日志
3. 检查浏览器控制台错误
4. 查看后端 API 日志

---

**🎉 按照以上步骤，你的应用很快就能上线了！**
# 🚀 PetKeeper 在线部署完整指南

将你的异宠饲养管理平台部署到互联网，让全世界都能访问！

---

## 📋 部署概览

### 推荐方案（完全免费）

| 服务 | 平台 | 费用 |
|------|------|------|
| **后端 API** | Railway.app | 免费 |
| **数据库** | Railway PostgreSQL | 免费 |
| **Web 前端** | Vercel | 免费 |
| **移动端** | Expo EAS | 免费（开发版）|

**总成本**: $0/月 ✨

---

## 第一步：准备代码仓库

### 1. 创建 GitHub 账号
如果还没有，先注册：https://github.com

### 2. 初始化 Git 仓库

在后端目录执行：

```bash
cd /Users/mac/my_gzh/zrby/pet-keeper-backend

# 初始化 Git
git init

# 创建 .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
*.log
.DS_Store
dist/
uploads/
*.db
*.db-journal
EOF

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: PetKeeper Backend"

# 创建 GitHub 仓库后推送
git remote add origin https://github.com/你的用户名/pet-keeper-backend.git
git push -u origin main
```

在前端目录执行：

```bash
cd /Users/mac/my_gzh/zrby/pet-keeper

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: PetKeeper Frontend"

# 推送到 GitHub
git remote add origin https://github.com/你的用户名/pet-keeper-frontend.git
git push -u origin main
```

---

## 第二步：部署后端到 Railway

### 1. 注册 Railway
访问：https://railway.app
使用 GitHub 账号登录

### 2. 创建项目
1. 点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择 `pet-keeper-backend` 仓库
4. 点击 "Deploy Now"

### 3. 添加 PostgreSQL 数据库
1. 在项目中点击 "+"
2. 选择 "Database" → "PostgreSQL"
3. Railway 会自动创建数据库

### 4. 配置环境变量
在后端服务中添加环境变量：

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=production
PORT=3001
```

### 5. 修改后端配置

更新 `prisma/schema.prisma`：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

添加 `build` 脚本到 `package.json`：

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy",
    "postinstall": "prisma generate"
  }
}
```

创建 `railway.toml`：

```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm run build && npm start"
healthcheckPath = "/api/health"
healthcheckTimeout = 100
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 10
```

### 6. 推送更新

```bash
git add .
git commit -m "Add Railway deployment config"
git push
```

Railway 会自动重新部署。

### 7. 获取后端 URL
部署成功后，Railway 会提供一个 URL，类似：
`https://pet-keeper-backend-production.up.railway.app`

---

## 第三步：部署前端到 Vercel

### 1. 注册 Vercel
访问：https://vercel.com
使用 GitHub 账号登录

### 2. 导入项目
1. 点击 "New Project"
2. 选择 `pet-keeper-frontend` 仓库
3. 点击 "Import"

### 3. 配置环境变量
在 Vercel 项目设置中添加：

```env
NEXT_PUBLIC_API_URL=https://你的后端地址.railway.app/api
```

### 4. 部署
点击 "Deploy"，Vercel 会自动构建和部署。

部署成功后，你会得到一个 URL：
`https://pet-keeper.vercel.app`

---

## 第四步：生产环境优化

### 1. 更新前端 API 地址

修改 `.env.production`：

```env
NEXT_PUBLIC_API_URL=https://你的后端地址.railway.app/api
```

### 2. 配置 CORS

更新后端 `src/index.ts`：

```typescript
import cors from 'cors';

app.use(cors({
  origin: [
    'https://你的前端地址.vercel.app',
    'http://localhost:3002' // 开发环境
  ],
  credentials: true
}));
```

### 3. 数据库迁移

Railway 部署后需要运行迁移：

```bash
# 在本地连接到 Railway 数据库
railway run npx prisma migrate deploy

# 填充初始数据
railway run npx tsx src/seed.ts
```

---

## 第五步：自定义域名（可选）

### 购买域名
推荐：
- Namecheap: https://namecheap.com
- Cloudflare: https://cloudflare.com

### 配置域名

**Vercel 域名**:
1. 在 Vercel 项目设置 → Domains
2. 添加你的域名，如 `petkeeper.com`
3. 按提示配置 DNS

**Railway 域名**:
1. 在 Railway 项目设置 → Domains
2. 添加自定义域名，如 `api.petkeeper.com`
3. 配置 DNS CNAME 记录

---

## 第六步：移动端打包

### Android APK

```bash
cd /Users/mac/my_gzh/zrby/pet-keeper-mobile

# 配置生产 API
echo "EXPO_PUBLIC_API_URL=https://你的后端地址.railway.app/api" > .env

# 安装 EAS CLI
npm install -g eas-cli

# 登录 Expo
eas login

# 构建 APK
eas build --platform android --profile preview
```

### iOS IPA（需要 Mac + Apple 开发者账号）

```bash
eas build --platform ios --profile preview
```

### 发布到应用商店

```bash
# Android
eas submit --platform android

# iOS
eas submit --platform ios
```

---

## 🎯 快速部署清单

### ✅ 后端部署（15分钟）
- [ ] 创建 GitHub 仓库
- [ ] 推送代码到 GitHub
- [ ] 在 Railway 创建项目
- [ ] 添加 PostgreSQL 数据库
- [ ] 配置环境变量
- [ ] 运行数据库迁移
- [ ] 测试 API 健康检查

### ✅ 前端部署（10分钟）
- [ ] 创建 GitHub 仓库
- [ ] 推送代码到 GitHub
- [ ] 在 Vercel 导入项目
- [ ] 配置环境变量
- [ ] 等待自动部署
- [ ] 访问测试

### ✅ 移动端打包（20分钟）
- [ ] 更新 API 地址
- [ ] 安装 EAS CLI
- [ ] 构建 APK
- [ ] 测试应用

---

## 💰 成本分析

### 免费方案
- **Railway**: 免费 $5 额度/月（足够用）
- **Vercel**: 完全免费
- **数据库**: Railway 免费 PostgreSQL
- **总成本**: $0

### 付费方案（如需）
- **Railway Pro**: $20/月（更多资源）
- **Vercel Pro**: $20/月（团队协作）
- **域名**: $10-15/年
- **总成本**: $40/月 + 域名

---

## 🔐 安全配置

### 生产环境检查清单

- [ ] 更改 JWT_SECRET 为强密码
- [ ] 配置 CORS 白名单
- [ ] 启用 HTTPS（Vercel/Railway 自动）
- [ ] 数据库备份设置
- [ ] API 速率限制
- [ ] 输入验证
- [ ] SQL 注入防护（Prisma 已内置）

### 环境变量安全

**永远不要提交**:
- `.env` 文件
- JWT_SECRET
- DATABASE_URL
- API 密钥

---

## 📊 监控和日志

### Railway 监控
1. 项目仪表板查看部署状态
2. 实时日志查看
3. 指标监控（CPU、内存）

### Vercel 分析
1. 部署日志
2. 访问统计
3. 性能监控

---

## 🐛 常见问题

### Q: Railway 数据库连接失败
**A**: 检查 DATABASE_URL 环境变量，确保使用 Railway 提供的连接字符串。

### Q: Vercel 构建失败
**A**: 查看 Vercel 构建日志，检查依赖和脚本。

### Q: CORS 错误
**A**: 确保后端 CORS 配置包含前端域名。

### Q: 移动端无法连接 API
**A**: 检查 API URL 是否正确，确保使用 HTTPS。

---

## 🚀 一键部署脚本

创建 `deploy.sh`：

```bash
#!/bin/bash

echo "🚀 开始部署 PetKeeper..."

# 后端
echo "📦 部署后端..."
cd pet-keeper-backend
git add .
git commit -m "Deploy: $(date)"
git push

# 前端
echo "🌐 部署前端..."
cd ../pet-keeper
git add .
git commit -m "Deploy: $(date)"
git push

echo "✅ 部署完成！"
echo "后端: https://你的后端地址.railway.app"
echo "前端: https://你的前端地址.vercel.app"
```

---

## 📱 分享你的应用

部署完成后，你可以：

1. **分享链接**: 发送 Vercel URL 给朋友
2. **社交媒体**: 发布到微博、朋友圈
3. **应用商店**: 上架 Google Play / App Store
4. **演示视频**: 录制使用教程

---

**🎉 准备好让你的应用上线了吗？按照步骤开始吧！**
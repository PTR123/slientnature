# 方案C: 全云端部署快速指南

## 🎯 部署架构

```
前端: Vercel (免费)
├── 全球CDN加速
├── 自动SSL
└── 无限流量

后端: Railway (免费500小时/月)
├── Node.js API
├── PostgreSQL数据库 (免费1GB)
├── Redis缓存 (免费)
└── 自动部署

总计: 完全免费 ⭐
```

---

## 💰 成本分析

- **Vercel前端**: 完全免费，无限流量
- **Railway后端**: 免费500小时/月（够个人使用）
- **Railway PostgreSQL**: 免费1GB存储
- **Railway Redis**: 免费10MB
- **域名**: 50元/年（可选）

**总计**: 约50元/年（仅域名）或完全免费（不用域名）

---

## ⏱️ 预计耗时

- 前端部署: 5分钟
- 后端部署: 10分钟
- 配置连接: 2分钟
- **总计**: 约17分钟

---

## 🚀 部署步骤

### 第1步: 前端部署到Vercel

#### 1.1 准备前端项目
```bash
cd /Users/mac/zrby/pet-keeper

# 检查配置
cat vercel.json  # 已准备好
cat next.config.js  # 已配置standalone
```

#### 1.2 推送到GitHub
```bash
# 如果没有Git仓库
git init
git add .
git commit -m "Prepare for cloud deployment"

# 推送到GitHub
git remote add origin https://github.com/你的用户名/petkeeper-frontend.git
git push -u origin main

# 如果已有仓库
git push
```

#### 1.3 Vercel导入部署
```
1. 登录 https://vercel.com
2. Add New Project > Import Git Repository
3. 选择你的GitHub仓库
4. Framework Preset: Next.js
5. 点击 Deploy
6. 等待2-3分钟构建完成
```

#### 1.4 记录前端URL
```
部署完成后会得到URL:
https://petkeeper-frontend-xxx.vercel.app

或自定义域名:
https://www.yourdomain.com
```

---

### 第2步: 后端部署到Railway

#### 2.1 注册Railway账号
```
访问: https://railway.app

点击 "Start a New Project"
用GitHub账号登录（推荐，方便关联仓库）
```

#### 2.2 创建项目
```
Railway Dashboard:
1. 点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择你的后端仓库（需要先推送backend到GitHub）
```

#### 2.3 添加PostgreSQL数据库
```
在Railway项目中:
1. 点击 "+" 添加服务
2. 选择 "Database" > "PostgreSQL"
3. 等待数据库创建（1分钟）

Railway会自动设置环境变量:
DATABASE_URL=postgresql://...
```

#### 2.4 添加Redis
```
继续添加服务:
1. 点击 "+" 添加服务
2. 选择 "Database" > "Redis"
3. 等待Redis创建

Railway会自动设置:
REDIS_URL=redis://...
```

#### 2.5 配置后端环境变量
```
Railway Dashboard > 你的后端服务 > Variables

添加环境变量:
- JWT_SECRET=生成一个32位密钥
- CORS_ORIGIN=https://你的vercel前端地址.vercel.app
- NODE_ENV=production

Railway会自动注入:
- DATABASE_URL (PostgreSQL服务)
- REDIS_URL (Redis服务)
```

#### 2.6 后端构建配置
```
Railway会自动检测Node.js项目并构建

如果需要自定义:
Root Directory: pet-keeper-backend
Build Command: npm install && npm run build
Start Command: npm run start:prod
```

#### 2.7 运行数据库迁移
```
Railway Dashboard > 后端服务 > Settings > CLI

执行命令:
npx prisma migrate deploy
npx prisma db seed

或通过Railway Web Terminal:
railway run npx prisma migrate deploy
```

#### 2.8 记录后端URL
```
Railway会分配一个域名:
https://petkeeper-backend-production.up.railway.app

或自定义域名:
https://api.yourdomain.com
```

---

### 第3步: 配置前端连接后端

#### 3.1 在Vercel配置环境变量
```
Vercel Dashboard > 项目 > Settings > Environment Variables

添加:
NEXT_PUBLIC_API_URL=https://petkeeper-backend-production.up.railway.app

或使用自定义域名:
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

勾选:
Production ✓
Preview ✓
Development ✓
```

#### 3.2 重新部署前端
```
Vercel Dashboard > Deployments > 最新部署 > Redeploy

使环境变量生效
```

---

### 第4步: 测试验证

#### 4.1 测试后端API
```bash
curl https://你的railway后端地址/api/health

应该返回:
{"status":"ok","timestamp":"..."}
```

#### 4.2 测试前端访问
```
浏览器打开: https://你的vercel前端地址.vercel.app

应该能看到首页
```

#### 4.3 测试前端调用后端
```
打开前端页面 > 浏览器控制台 > Network标签

查看API请求是否成功
```

---

## 📋 完整部署流程总结

### 准备GitHub仓库
```bash
# 后端仓库
cd pet-keeper-backend
git init
git remote add origin https://github.com/username/petkeeper-backend.git
git push -u origin main

# 前端仓库
cd pet-keeper
git init
git remote add origin https://github.com/username/petkeeper-frontend.git
git push -u origin main
```

### Railway部署后端
```
1. railway.app > Login with GitHub
2. New Project > Deploy from GitHub > 选择backend仓库
3. Add PostgreSQL Database
4. Add Redis Database
5. 配置环境变量: JWT_SECRET, CORS_ORIGIN
6. 运行迁移: railway run npx prisma migrate deploy
7. 获取后端URL
```

### Vercel部署前端
```
1. vercel.com > Import GitHub repo > 选择frontend仓库
2. Deploy
3. 配置环境变量: NEXT_PUBLIC_API_URL
4. Redeploy
5. 获取前端URL
```

---

## 🔧 需要准备的东西

### GitHub账号
- 用于托管代码
- Railway和Vercel都用GitHub登录
- 如果没有，去 https://github.com 注册

### 两个GitHub仓库
```
petkeeper-frontend (前端代码)
petkeeper-backend (后端代码)
```

---

## ⚡ 快速命令（复制执行）

### 准备前端仓库
```bash
cd /Users/mac/zrby/pet-keeper
git init
git add .
git commit -m "Deploy to cloud"
# 替换为你的GitHub用户名
git remote add origin https://github.com/你的用户名/petkeeper-frontend.git
git push -u origin main
```

### 准备后端仓库
```bash
cd /Users/mac/zrby/pet-keeper-backend
git init
git add .
git commit -m "Deploy to cloud"
# 替换为你的GitHub用户名
git remote add origin https://github.com/你的用户名/petkeeper-backend.git
git push -u origin main
```

---

## 🆘 常见问题

**Q: Railway免费额度够用吗？**
```
免费额度:
- 500小时/月（约20天连续运行）
- $5免费额度（约500小时）

个人项目完全够用
如果超过可以:
- 暂停不用的服务节省额度
- 或付费$5/月增加额度
```

**Q: 数据库存储够用吗？**
```
Railway PostgreSQL:
- 免费1GB存储
- 个人项目够用

如果超过:
- 定期清理旧数据
- 或付费升级
```

**Q: 如何暂停服务节省额度？**
```
Railway Dashboard > 服务 > Settings > Sleep
暂停后会停止消耗额度
需要时手动唤醒
```

**Q: 后端部署失败？**
```
检查:
1. Railway构建日志
2. 环境变量是否正确
3. package.json scripts是否正确
4. Prisma schema配置
```

---

## 💡 优势

### 全云端部署
- ✅ 完全免费（Railway + Vercel免费额度够用）
- ✅ 自动部署（推送代码即更新）
- ✅ 全球CDN（Vercel前端加速）
- ✅ 无需服务器维护
- ✅ 快速上线（17分钟完成）
- ✅ 随时可以迁移到NAS

### 后续迁移到NAS
```
部署到云端后，随时可以:
1. NAS准备好后部署后端
2. 更新Vercel环境变量指向NAS API
3. 或完全迁移到NAS+Vercel混合方案

云端部署是临时方案，NAS是长期方案
```

---

## 🎯 现在开始

我可以帮你:
1. 准备GitHub仓库（前端+后端）
2. 生成Railway和Vercel部署配置
3. 提供完整部署指导

你只需要:
1. 有GitHub账号（如果没有先注册）
2. 告诉我你的GitHub用户名
3. 按步骤操作Railway和Vercel网页

---

## 立即执行

**现在请告诉我**:
1. 你有GitHub账号吗？（如果没有，我先帮你准备注册）
2. 你的GitHub用户名是什么？（我帮你准备仓库URL）

准备好了立即开始云部署！🚀
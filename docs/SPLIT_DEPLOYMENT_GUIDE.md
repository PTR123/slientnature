# 方案B: Vercel前端 + NAS后端 分开部署完整指南

## 🎯 部署架构

```
┌─────────────────────┐          ┌─────────────────────┐
│  Vercel (前端Web)   │          │   NAS (后端API)    │
│                     │          │                     │
│  • 全球CDN加速      │          │  • PostgreSQL数据库 │
│  • 自动SSL证书      │          │  • Redis缓存        │
│  • 免费无限流量      │          │  • Node.js API      │
│  • 推送代码自动更新  │          │  • 数据完全掌控      │
│                     │          │  • 文件存储          │
│  访问:              │          │                     │
│  https://xxx.vercel │          │  访问:              │
│  .app               │◄────────►│  https://api.xxx    │
│                     │   API    │  .com               │
│                     │  请求     │  或                 │
│                     │          │  Tailscale IP       │
└─────────────────────┘          └─────────────────────┘
         前端                               后端
```

---

## 📋 部署前准备

### 前端(Vercel)
- ✅ GitHub账号(用于推送代码)
- ✅ Vercel账号(免费注册 https://vercel.com)
- ✅ 前端项目已准备好(配置好环境变量)

### 后端(NAS)
- ✅ NAS已安装Docker和Docker Compose
- ✅ NAS已安装Tailscale(或配置好外网访问)
- ✅ 后端项目已准备好
- ✅ .env配置文件已创建

---

## 🚀 部署步骤

## 第一部分: 后端部署到NAS

### Step 1: 准备NAS环境

```bash
# 1. DSM安装Tailscale套件
DSM > 套件中心 > 搜索 "Tailscale" > 安装
打开Tailscale > 登录账号 > 连接 > 记下IP (如: 100.101.102.103)

# 2. 本地Mac安装Tailscale
brew install tailscale
sudo tailscale up  # 登录同一账号

# 3. DSM启用SSH服务
DSM > 控制面板 > 终端机和SNMP > 启用SSH服务 > 端口22

# 4. DSM安装Docker套件
DSM > 套件中心 > 搜索 "Docker" > 安装
```

### Step 2: 打包后端项目

```bash
# 在本地Mac执行:
cd /Users/mac/zrby

# 打包后端相关文件
./pack-backend.sh

# 会生成: backend-deploy.tar.gz
```

### Step 3: 上传后端到NAS

```bash
# 方法A: scp上传(通过Tailscale)
scp backend-deploy.tar.gz admin@100.101.102.103:/homes/admin/

# 方法B: DSM File Station上传
# DSM > File Station > 上传文件
```

### Step 4: SSH连接NAS部署后端

```bash
# SSH连接NAS
ssh admin@100.101.102.103

# 解压文件
cd /homes/admin
tar -xzf backend-deploy.tar.gz
cd petkeeper-backend

# 检查配置
cat .env
# 修改CORS_ORIGIN为Vercel前端域名
vim .env
# 添加/修改:
# CORS_ORIGIN=https://your-app.vercel.app,https://www.yourdomain.com

# 使用后端专用docker-compose部署
docker-compose -f docker-compose-backend.yml up -d --build

# 查看服务状态
docker-compose -f docker-compose-backend.yml ps

# 初始化数据库
docker-compose -f docker-compose-backend.yml exec backend npx prisma migrate deploy
docker-compose -f docker-compose-backend.yml exec backend npm run db:seed

# 测试API
curl http://localhost:3001/api/health

# 查看日志
docker-compose -f docker-compose-backend.yml logs -f backend
```

### Step 5: 配置后端外网访问

**方案A: 使用Tailscale(最简单)**
```bash
# API可通过Tailscale IP访问
# http://100.101.102.103:3001
# 前端环境变量配置这个地址即可
```

**方案B: 配置Cloudflare Tunnel**
```bash
# 如果需要外网用户访问(不通过Tailscale)

# 1. 在NAS安装cloudflared
docker run -d --name cloudflared \
  --restart always \
  --network host \
  -v ~/.cloudflared:/etc/cloudflared:ro \
  cloudflare/cloudflared:latest \
  tunnel run <tunnel-id>

# 2. 配置Tunnel路由
# api.yourdomain.com -> localhost:3001

# 3. API访问地址
# https://api.yourdomain.com
```

**方案C: 使用域名 + Let's Encrypt SSL**
```bash
# 详见: docs/DNS_AND_TUNNEL_GUIDE.md
```

---

## 第二部分: 前端部署到Vercel

### Step 1: 准备前端项目

```bash
# 在本地Mac前端目录
cd /Users/mac/zrby/pet-keeper

# 检查vercel.json配置
cat vercel.json

# 检查环境变量模板
cat .env.vercel
```

### Step 2: 推送代码到GitHub

```bash
# 如果还没有Git仓库
git init
git add .
git commit -m "Prepare for Vercel deployment"

# 推送到GitHub
git remote add origin https://github.com/your-username/petkeeper-frontend.git
git push -u origin main
```

### Step 3: Vercel导入项目

**方法A: 通过Vercel Dashboard(推荐)**
```
1. 登录 https://vercel.com
2. 点击 "Add New Project"
3. 选择 "Import Git Repository"
4. 选择你的GitHub仓库
5. Framework Preset: Next.js (自动检测)
6. Root Directory: ./ (默认)
7. Build Command: npm run build (默认)
8. Output Directory: .next (默认)
9. 点击 "Deploy"
```

**方法B: 通过Vercel CLI**
```bash
# 安装Vercel CLI
npm install -g vercel

# 登录
vercel login

# 在前端目录执行部署
cd pet-keeper
vercel

# 按提示选择:
# - Set up and deploy? Yes
# - Which scope? 你的账号
# - Link to existing project? No
# - Project name? petkeeper-frontend
# - In which directory? ./
# - Want to modify settings? No

# 部署到Production
vercel --prod
```

### Step 4: 配置Vercel环境变量

```
1. Vercel Dashboard > 你的项目 > Settings > Environment Variables

2. 添加环境变量:

   变量名: NEXT_PUBLIC_API_URL

   值(根据后端部署方式选择):

   - 如果用Tailscale:
     http://100.101.102.103:3001

   - 如果用Cloudflare Tunnel:
     https://api.yourdomain.com

   - 如果用域名:
     https://api.yourdomain.com

3. 选择Environment:
   Production ✓
   Preview ✓
   Development ✓

4. 点击 "Save"

5. 重新部署使环境变量生效:
   Deployments > 最新部署 > "Redeploy"
```

### Step 5: 验证前端部署

```bash
# 查看部署URL
vercel inspect --prod

# 或在Vercel Dashboard查看

# 测试访问
curl https://your-app.vercel.app

# 浏览器打开
https://your-app.vercel.app

# 测试API连接(前端应该能正常调用后端API)
# 打开浏览器控制台查看Network请求
```

---

## 🔧 配置调整

### 后端CORS配置

后端已配置智能CORS策略:
- ✅ 自动允许所有 *.vercel.app 前端域名
- ✅ 允许配置的自定义域名
- ✅ 支持credentials(认证)
- ✅ 开发环境允许所有来源

如需添加自定义域名,修改NAS上的 `.env`:
```bash
vim .env
# 添加:
CORS_ORIGIN=https://your-app.vercel.app,https://www.yourdomain.com
```

### Nginx配置

nginx已配置:
- ✅ CORS headers
- ✅ OPTIONS预检请求处理
- ✅ API反向代理
- ✅ 文件上传访问
- ✅ Gzip压缩

---

## 📊 完整部署流程总结

```bash
# ===== 后端部署(NAS) =====
# 1. NAS准备
DSM > 安装Tailscale + Docker + 启用SSH

# 2. 本地准备
brew install tailscale && sudo tailscale up
cd /Users/mac/zrby && ./pack-backend.sh

# 3. 上传部署
scp backend-deploy.tar.gz admin@100.x.x.x:/homes/admin/
ssh admin@100.x.x.x
tar -xzf backend-deploy.tar.gz && cd petkeeper-backend
docker-compose -f docker-compose-backend.yml up -d --build
docker-compose -f docker-compose-backend.yml exec backend npx prisma migrate deploy

# 4. 测试后端
curl http://localhost:3001/api/health

# ===== 前端部署(Vercel) =====
# 1. 推送代码
cd pet-keeper
git init && git add . && git commit -m "deploy"
git remote add origin https://github.com/xxx.git && git push

# 2. Vercel导入
vercel.com > Import Git Repository > Deploy

# 3. 配置环境变量
Vercel Dashboard > Settings > Environment Variables
NEXT_PUBLIC_API_URL = http://100.x.x.x:3001 (或https://api.xxx.com)

# 4. Redeploy
Deployments > Redeploy

# 5. 测试前端
https://your-app.vercel.app
```

---

## ✅ 验证清单

部署完成后验证:

**后端(NAS)**:
- [ ] PostgreSQL运行: `docker ps | grep postgres`
- [ ] Redis运行: `docker ps | grep redis`
- [ ] API健康检查: `curl http://localhost:3001/api/health`
- [ ] 数据库迁移: `docker-compose exec backend npx prisma migrate deploy`
- [ ] 种子数据: 数据库有初始数据
- [ ] CORS配置: 允许Vercel域名

**前端(Vercel)**:
- [ ] 部署成功: Vercel Dashboard显示成功
- [ ] 环境变量: NEXT_PUBLIC_API_URL已配置
- [ ] 前端访问: https://your-app.vercel.app 能打开
- [ ] API连接: 前端能调用后端API
- [ ] 功能测试: 登录、商品列表等功能正常

---

## 🔄 更新部署

### 后端更新
```bash
# 修改代码后:
cd /Users/mac/zrby
./pack-backend.sh
scp backend-deploy.tar.gz admin@100.x.x.x:/homes/admin/

ssh admin@100.x.x.x
cd petkeeper-backend
tar -xzf backend-deploy.tar.gz
docker-compose -f docker-compose-backend.yml up -d --build
```

### 前端更新
```bash
# 方法A: 推送代码自动部署
cd pet-keeper
git add .
git commit -m "update"
git push
# Vercel自动检测并部署

# 方法B: 手动触发部署
vercel --prod
```

---

## 🆘 常见问题

**Q1: 前端访问API出现CORS错误?**
```bash
# 检查后端CORS配置
ssh admin@100.x.x.x
cat .env | grep CORS_ORIGIN

# 添加Vercel域名
vim .env
CORS_ORIGIN=https://your-app.vercel.app

# 重启后端
docker-compose -f docker-compose-backend.yml restart backend
```

**Q2: Vercel环境变量不生效?**
```
# 需要重新部署
Vercel Dashboard > Deployments > 最新部署 > "Redeploy"
```

**Q3: 前端无法连接后端(Tailscale)?**
```bash
# 确认Tailscale连接
tailscale status

# 检查NAS防火墙
DSM > 控制面板 > 安全性 > 防火墙
确保3001端口开放

# 测试API
curl http://100.101.102.103:3001/api/health
```

**Q4: 如何让外网用户访问(不通过Tailscale)?**
```
方案1: 配置Cloudflare Tunnel
方案2: 使用域名 + Let's Encrypt SSL
详见: docs/DNS_AND_TUNNEL_GUIDE.md
```

---

## 💰 成本分析

- **Vercel前端**: 完全免费(无限流量)
- **NAS后端**: 已有设备(约80元/年电费)
- **域名**: 约50元/年(可选)
- **总计**: ~130元/年
- **体验**: 前端全球CDN加速，后端数据掌控 ⭐⭐⭐⭐⭐

---

## 🎉 完成!

现在你的应用:
- ✅ 前端部署在Vercel全球CDN
- ✅ 后端部署在NAS私有服务器
- ✅ 数据完全掌控在自己手中
- ✅ 前端免费无限流量
- ✅ 推送代码自动更新前端

享受现代化的部署体验吧! 🚀
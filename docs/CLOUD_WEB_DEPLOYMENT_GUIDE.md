# 云端部署网页操作完整指南 - PTR123

## ✅ 已完成步骤
- ✅ 代码已推送到GitHub: https://github.com/PTR123/pet-keeper-app
- ✅ Railway配置文件已准备
- ✅ CORS配置已优化
- ✅ PostgreSQL schema已修改

---

## 🚀 Railway部署后端（约10分钟）

### 第1步: 登录Railway（1分钟）

**打开浏览器访问**:
```
https://railway.app

点击右上角 "Login"
选择 "Continue with GitHub"
GitHub授权登录
```

### 第2步: 创建项目（1分钟）

**Railway Dashboard**:
```
点击 "New Project" 按钮

选择 "Deploy from GitHub repo"

找到并选择:
PTR123/pet-keeper-app

点击 "Deploy"
```

### 第3步: 配置Root Directory（重要！）⚠️

**因为仓库包含完整项目，需要指定后端目录**:

```
Railway Dashboard > 你的项目 > Settings

找到 "Root Directory" 设置
输入: pet-keeper-backend

点击 "Save"
```

这样Railway只会部署backend部分。

### 第4步: 添加PostgreSQL数据库（1分钟）

**在Railway项目中**:
```
点击 "+" 添加新服务

选择 "Database"

选择 "PostgreSQL"

等待1-2分钟创建完成

Railway会自动创建并注入 DATABASE_URL 环境变量
```

### 第5步: 添加Redis缓存（1分钟）

**继续添加服务**:
```
点击 "+" 添加新服务

选择 "Database"

选择 "Redis"

等待创建完成

Railway会自动注入 REDIS_URL 环境变量
```

### 第6步: 配置环境变量（2分钟）

**Railway Dashboard > pet-keeper-app服务 > Variables**:

添加以下环境变量：

```
点击 "New Variable" 按钮

1. JWT_SECRET
   名称: JWT_SECRET
   值: WfJEGdNL2t1+UP6V/+bTQSglHPEtv2dQPWSPsqVcXuM=
   (已为你生成32位密钥)

2. NODE_ENV
   名称: NODE_ENV
   值: production

3. PORT
   名称: PORT
   值: 3001

4. CORS_ORIGIN
   名称: CORS_ORIGIN
   值: https://你的vercel前端地址.vercel.app
   (稍后部署前端后更新)

Railway自动注入的变量（不需要手动添加）:
- DATABASE_URL (PostgreSQL服务)
- REDIS_URL (Redis服务)
```

### 第7步: 等待构建完成（2-3分钟）

**Railway会自动检测并构建**:
```
查看 Logs 标签页
等待构建完成

构建过程:
1. Installing dependencies (npm install)
2. Building project (npm run build)
3. Starting server (npm run start:prod)

看到 "Deploy SUCCESSFUL" 表示成功
```

### 第8步: 运行数据库迁移（1分钟）

**Railway Dashboard > pet-keeper-app服务 > Settings > CLI**

**执行命令**:
```
点击 "Terminal" 或 "CLI"

输入命令:
npx prisma migrate deploy

等待迁移完成

继续输入:
npm run db:seed

导入种子数据
```

### 第9步: 获取后端URL（30秒）

**Railway Dashboard > pet-keeper-app服务 > Settings > Domains**:

```
Railway会自动分配一个域名，类似:
https://pet-keeper-app-production.up.railway.app

或自定义域名:
点击 "Generate Domain"
输入自定义域名（如果有）

记下这个URL，后续前端需要用
```

### 第10步: 测试后端API（30秒）

**在浏览器或终端测试**:
```
curl https://你的railway地址/api/health

应该返回:
{"status":"ok","timestamp":"2026-04-17T..."}

测试其他API:
curl https://你的railway地址/api/products
curl https://你的railway地址/api/species
```

---

## 🌐 Vercel部署前端（约5分钟）

### 第1步: 登录Vercel（30秒）

**打开浏览器访问**:
```
https://vercel.com

点击右上角 "Sign Up" 或 "Log In"
选择 "Continue with GitHub"
GitHub授权登录
```

### 第2步: 导入项目（1分钟）

**Vercel Dashboard**:
```
点击 "Add New Project"

选择 "Import Git Repository"

找到并选择:
PTR123/pet-keeper-app

点击 "Import"
```

### 第3步: 配置Root Directory（重要！）⚠️

**因为仓库包含完整项目，需要指定前端目录**:

```
Framework Preset: Next.js (自动检测)

Root Directory 设置:
点击 "Root Directory" 编辑
输入: pet-keeper

点击 "Continue"

Build Command: npm run build (默认)
Output Directory: .next (默认)
Install Command: npm install (默认)
```

### 第4步: 点击Deploy（30秒）

```
点击 "Deploy" 按钮

等待2-3分钟构建完成

看到 "Building" 进度条
完成后显示 "Congratulations!"
```

### 第5步: 配置环境变量（1分钟）

**Vercel Dashboard > 你的项目 > Settings > Environment Variables**:

```
点击 "Add" 按钮

添加变量:
名称: NEXT_PUBLIC_API_URL
值: https://你的railway后端地址.up.railway.app

Environment选择:
Production ✓
Preview ✓
Development ✓

点击 "Save"
```

### 第6步: 重新部署（1分钟）

**使环境变量生效**:
```
Vercel Dashboard > Deployments

找到最新部署

点击 "..." 三点菜单

选择 "Redeploy"

等待重新部署完成（1-2分钟）
```

### 第7步: 获取前端URL（30秒）

**Vercel Dashboard > 你的项目 > Settings > Domains**:

```
Vercel会自动分配域名:
https://pet-keeper-app-xxx.vercel.app

或自定义域名:
https://www.yourdomain.com

记下这个URL
```

### 第8步: 更新后端CORS配置（1分钟）

**回到Railway Dashboard**:
```
Railway > pet-keeper-app服务 > Variables

更新 CORS_ORIGIN 变量:
值为: https://你的vercel前端地址.vercel.app

点击 "Update"
```

---

## ✅ 完整部署流程总结

### Railway后端部署
```
1. railway.app > Login with GitHub
2. New Project > PTR123/pet-keeper-app
3. Settings > Root Directory: pet-keeper-backend
4. Add PostgreSQL Database
5. Add Redis Database
6. Variables: JWT_SECRET, NODE_ENV, PORT, CORS_ORIGIN
7. Terminal: npx prisma migrate deploy
8. 获取后端URL
9. 测试API
```

### Vercel前端部署
```
1. vercel.com > Login with GitHub
2. Import > PTR123/pet-keeper-app
3. Root Directory: pet-keeper
4. Deploy
5. Variables: NEXT_PUBLIC_API_URL
6. Redeploy
7. 获取前端URL
8. 更新Railway CORS_ORIGIN
```

---

## 🎯 关键配置提醒 ⚠️

### Root Directory（非常重要）

**因为使用统一仓库，必须指定子目录**:

```
Railway后端:
Root Directory = pet-keeper-backend

Vercel前端:
Root Directory = pet-keeper

如果不设置，部署会失败！
```

### 环境变量配置顺序

```
正确顺序:
1. Railway部署后端并获取URL
2. Vercel部署前端（先不要配置API_URL）
3. Vercel配置 NEXT_PUBLIC_API_URL = Railway后端URL
4. Vercel Redeploy
5. Railway更新 CORS_ORIGIN = Vercel前端URL

这样前后端才能正常通信
```

---

## 🆘 常见问题

**Q1: Railway构建失败？**
```
检查:
1. Root Directory是否设置为 pet-keeper-backend
2. package.json scripts是否正确
3. Logs查看详细错误信息

常见错误:
- Root Directory未设置 → 设置为 pet-keeper-backend
- Build command找不到 → 检查 package.json scripts
- 环境变量缺失 → 添加 JWT_SECRET, NODE_ENV
```

**Q2: 前端无法连接后端？**
```
检查:
1. Vercel NEXT_PUBLIC_API_URL 是否正确
2. Railway CORS_ORIGIN 是否包含Vercel域名
3. 后端API是否正常运行(curl测试)

解决:
- 更新 NEXT_PUBLIC_API_URL 为正确的Railway URL
- Redeploy Vercel前端
- 更新 Railway CORS_ORIGIN
```

**Q3: 数据库迁移失败？**
```
Railway Terminal执行:
npx prisma migrate deploy

如果失败:
- 检查 DATABASE_URL 是否自动注入
- 查看Terminal错误信息
- 手动执行: npx prisma db push
```

**Q4: Railway免费额度不够？**
```
免费额度:
- 500小时/月
- PostgreSQL 1GB
- Redis 10MB

够个人使用
如果超过:
- 暂停服务节省额度
- 或付费$5/月升级
```

---

## 💰 成本分析

**Railway免费额度**:
- 500小时/月运行时间
- PostgreSQL 1GB存储
- Redis 10MB存储
- **完全够个人项目使用**

**Vercel免费额度**:
- 无限流量
- 100GB带宽/月
- 自动SSL证书
- 全球CDN加速
- **完全够个人项目使用**

**总计**: 完全免费 ⭐

---

## 📊 部署完成后架构

```
用户浏览器
    ↓
Vercel前端 (全球CDN)
https://pet-keeper-app-xxx.vercel.app
    ↓ API请求
Railway后端
https://pet-keeper-app-production.up.railway.app
    ├── PostgreSQL数据库
    ├── Redis缓存
    └── Node.js API
```

---

## 🔄 后续更新流程

**推送代码自动部署**:
```
git add .
git commit -m "update message"
git push

Railway和Vercel会自动检测并重新部署
无需手动操作
```

---

## 🎉 立即开始

**现在请执行**:

### Railway部署（10分钟）
1. ✅ 浏览器打开: https://railway.app
2. ✅ Login with GitHub
3. ✅ New Project > PTR123/pet-keeper-app
4. ✅ 设置Root Directory: pet-keeper-backend ⚠️
5. ✅ 添加PostgreSQL + Redis
6. ✅ 配置环境变量
7. ✅ 运行数据库迁移
8. ✅ 获取后端URL

### Vercel部署（5分钟）
1. ✅ 浏览器打开: https://vercel.com
2. ✅ Import > PTR123/pet-keeper-app
3. ✅ 设置Root Directory: pet-keeper ⚠️
4. ✅ Deploy
5. ✅ 配置NEXT_PUBLIC_API_URL
6. ✅ Redeploy

---

## ⏱️ 总耗时: 约15-20分钟

准备好开始了吗？
先去Railway部署后端，完成后告诉我后端URL！🚀
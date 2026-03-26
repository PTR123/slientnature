# 🚀 PetKeeper 项目完整部署指南

## 📦 项目组成

1. **后端 API** - Node.js + Express + SQLite
2. **Web 前端** - React + Vite
3. **移动端** - React Native (Android)

---

## 🎯 快速开始（本地开发）

### 一键启动所有服务

```bash
cd /Users/mac/my_gzh/zrby
./start-all.sh
```

访问：
- 后端: http://localhost:3001/api
- 前端: http://localhost:5173
- 移动端: 扫描二维码或运行 Android Studio

停止所有服务：
```bash
./stop-all.sh
```

---

## 🌐 在线部署方案

### 方案 A：免费云平台（推荐）

#### 1️⃣ 后端部署到 Railway

**步骤：**

```bash
# 1. 注册 Railway 账号
https://railway.app

# 2. 安装 Railway CLI
npm install -g @railway/cli

# 3. 登录
railway login

# 4. 初始化项目
cd pet-keeper-backend
railway init

# 5. 部署
railway up

# 6. 设置环境变量
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-secret-key

# 7. 获取公网地址
railway domain
```

**得到后端地址**：`https://your-app.railway.app`

---

#### 2️⃣ 前端部署到 Vercel

**步骤：**

```bash
# 1. 注册 Vercel 账号
https://vercel.com

# 2. 安装 Vercel CLI
npm install -g vercel

# 3. 登录
vercel login

# 4. 部署前端
cd pet-keeper
vercel

# 5. 配置环境变量
# 在 Vercel Dashboard 中设置：
# VITE_API_URL=https://your-backend.railway.app/api
```

**得到前端地址**：`https://your-app.vercel.app`

---

#### 3️⃣ 移动端发布

**构建 APK：**

```bash
cd PetKeeperMobile/android

# 设置环境变量
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"

# 构建 Release APK
./gradlew assembleRelease

# APK 位置
android/app/build/outputs/apk/release/app-release.apk
```

**发布到应用商店**（可选）：
- Google Play Console: https://play.google.com/console
- 上传 APK 并填写应用信息

---

### 方案 B：私有服务器部署

#### 准备工作

- 一台云服务器（推荐：阿里云、腾讯云、AWS）
- 操作系统：Ubuntu 20.04+
- 域名（可选）

#### 自动部署脚本

```bash
# 在服务器上执行
bash server-setup.sh
```

**或手动部署：**

```bash
# 1. 更新系统
sudo apt update && sudo apt upgrade -y

# 2. 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. 安装 PM2（进程管理）
sudo npm install -g pm2

# 4. 安装 Nginx
sudo apt install -y nginx

# 5. 克隆项目
git clone https://github.com/your-username/pet-keeper.git
cd pet-keeper

# 6. 部署后端
cd pet-keeper-backend
npm install
npm run build
pm2 start npm --name "pet-keeper-api" -- run start

# 7. 部署前端
cd ../pet-keeper
npm install
npm run build
sudo cp -r dist/* /var/www/html/

# 8. 配置 Nginx
sudo nano /etc/nginx/sites-available/pet-keeper
```

**Nginx 配置：**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/pet-keeper /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔧 环境变量配置

### 后端 (.env)

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secret-key-change-this
DATABASE_URL=./database.sqlite
```

### 前端 (.env)

```env
VITE_API_URL=https://your-api-domain.com/api
```

### 移动端 (.env)

```env
API_URL=https://your-api-domain.com/api
```

---

## 📱 移动端部署详情

### 开发版 APK（测试用）

```bash
cd PetKeeperMobile

# 构建 Debug APK
cd android
./gradlew assembleDebug

# 安装到连接的设备
adb install app/build/outputs/apk/debug/app-debug.apk
```

### 发布版 APK（正式发布）

```bash
# 1. 生成签名密钥
keytool -genkeypair -v -keystore pet-keeper.keystore -alias pet-keeper -keyalg RSA -keysize 2048 -validity 10000

# 2. 创建 android/gradle.properties
MYAPP_RELEASE_STORE_FILE=pet-keeper.keystore
MYAPP_RELEASE_KEY_ALIAS=pet-keeper
MYAPP_RELEASE_STORE_PASSWORD=your-password
MYAPP_RELEASE_KEY_PASSWORD=your-password

# 3. 构建 Release APK
./gradlew assembleRelease

# 4. APK 位置
android/app/build/outputs/apk/release/app-release.apk
```

---

## 🗄️ 数据库管理

### SQLite（当前）

```bash
# 查看数据库
cd pet-keeper-backend
sqlite3 database.sqlite

# 备份
cp database.sqlite database.backup.sqlite

# 导出数据
sqlite3 database.sqlite .dump > backup.sql
```

### 迁移到 PostgreSQL（生产环境推荐）

```bash
# 安装 PostgreSQL
sudo apt install postgresql postgresql-contrib

# 创建数据库
sudo -u postgres createdb petkeeper

# 修改后端配置
# database.ts
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  database: 'petkeeper',
  username: 'postgres',
  password: 'your-password'
});
```

---

## 🔒 安全配置

### 1. HTTPS 配置（Let's Encrypt）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

### 2. 防火墙设置

```bash
# 开放必要端口
sudo ufw allow 22      # SSH
sudo ufw allow 80      # HTTP
sudo ufw allow 443     # HTTPS
sudo ufw enable
```

### 3. JWT 密钥

```bash
# 生成强密钥
node -e "console.log(require('crypto').randomBytes(256).toString('base64'))"
```

---

## 📊 监控和日志

### PM2 监控

```bash
# 查看进程
pm2 status

# 查看日志
pm2 logs pet-keeper-api

# 监控面板
pm2 monit

# 开机自启
pm2 startup
pm2 save
```

### Nginx 日志

```bash
# 访问日志
tail -f /var/log/nginx/access.log

# 错误日志
tail -f /var/log/nginx/error.log
```

---

## 🚨 常见问题

### Q1: 后端无法启动？

```bash
# 检查端口占用
lsof -i :3001

# 检查日志
pm2 logs pet-keeper-api
```

### Q2: 前端构建失败？

```bash
# 清理缓存
npm run clean
rm -rf node_modules package-lock.json
npm install
```

### Q3: 移动端 API 无法连接？

- 检查 `.env` 中的 API_URL 配置
- 确保使用 HTTPS（HTTP 在真机上可能被阻止）
- 检查防火墙是否开放端口

### Q4: 数据库迁移？

```bash
# SQLite → PostgreSQL
npm install pg pg-hstore
# 修改数据库配置
npm run migrate
```

---

## 📦 完整部署检查清单

- [ ] 后端环境变量配置完成
- [ ] 数据库初始化完成
- [ ] 后端服务运行正常
- [ ] 前端环境变量配置完成
- [ ] 前端构建成功
- [ ] Nginx 配置正确
- [ ] HTTPS 证书配置完成
- [ ] 防火墙规则设置
- [ ] PM2 进程守护启动
- [ ] 移动端 API 地址配置
- [ ] APK 构建测试
- [ ] 所有功能测试通过

---

## 🎉 部署成功后

1. **测试所有功能**
   - 用户注册/登录
   - 宠物管理
   - 物种图鉴
   - 社区功能

2. **性能优化**
   - 开启 Gzip 压缩
   - 配置 CDN
   - 数据库索引优化

3. **监控告警**
   - 设置服务器监控
   - 配置错误日志告警
   - 数据库备份计划

---

## 📞 获取帮助

- 详细部署文档: `DEPLOYMENT_GUIDE.md`
- 私有服务器部署: `PRIVATE_SERVER_DEPLOYMENT.md`
- 部署检查清单: `DEPLOYMENT_CHECKLIST.md`
- 功能说明: `FEATURES.md`

---

**🎊 选择适合你的部署方案开始吧！**
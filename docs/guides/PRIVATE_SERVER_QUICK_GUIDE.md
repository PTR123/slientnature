# 🖥️ PetKeeper 私有服务器部署快速指南

## 部署架构

```
你的服务器
├── Nginx (反向代理 + SSL)
│   ├── api.yourdomain.com → 后端 API (Node.js)
│   └── yourdomain.com → 前端页面
├── PostgreSQL 数据库
└── PM2 进程管理
```

---

## 📋 部署前准备

### 服务器要求

**最低配置**：
- CPU: 1核
- 内存: 1GB
- 存储: 20GB
- 系统: Ubuntu 20.04/22.04 LTS

**推荐配置**：
- CPU: 2核
- 内存: 2GB
- 存储: 40GB

**服务器选择**：
- 阿里云：¥50-100/月
- 腾讯云：¥50-100/月
- AWS：$5-10/月
- Vultr：$5/月

**域名**（可选但推荐）：
- 用于配置 HTTPS
- 成本：¥50-70/年

---

## 🚀 部署方式

### 方式一：一键自动部署（推荐）

**步骤 1：连接到服务器**

```bash
ssh root@你的服务器IP
```

**步骤 2：下载并运行部署脚本**

```bash
# 下载脚本
curl -O https://raw.githubusercontent.com/PTR123/pet-keeper-app/main/server-setup.sh

# 添加执行权限
chmod +x server-setup.sh

# 运行脚本
./server-setup.sh
```

脚本会自动：
- 安装 Node.js、PostgreSQL、Nginx、PM2
- 配置数据库
- 设置防火墙
- 创建备份脚本
- 配置 SSL 证书工具

**步骤 3：上传代码**

在本地电脑执行：

```bash
# 打包后端代码
cd /Users/mac/zrby/pet-keeper-backend
tar -czf backend.tar.gz --exclude='node_modules' --exclude='.env' .

# 上传到服务器
scp backend.tar.gz root@你的服务器IP:/var/www/petkeeper/
```

在服务器上：

```bash
cd /var/www/petkeeper
mkdir -p backend
tar -xzf backend.tar.gz -C backend
cd backend
```

**步骤 4：配置并启动**

```bash
# 移动环境配置文件
mv ../backend.env .env

# 安装依赖
npm install

# 生成数据库
npx prisma generate

# 运行迁移
npx prisma migrate deploy

# 填充初始数据
npx tsx src/seed.ts

# 构建项目
npm run build

# 启动服务
cd ..
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**步骤 5：配置域名和 SSL**

```bash
# 获取 SSL 证书（如果有域名）
certbot --nginx -d api.yourdomain.com

# 测试自动续期
certbot renew --dry-run
```

---

### 方式二：手动逐步部署

如果你想了解每一步的细节，可以手动部署：

#### 第一步：连接服务器并更新系统

```bash
# SSH 连接
ssh root@你的服务器IP

# 更新系统
apt update && apt upgrade -y
```

#### 第二步：安装 Node.js 20

```bash
# 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v  # 应显示 v20.x.x
npm -v
```

#### 第三步：安装 PostgreSQL

```bash
# 安装 PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# 启动服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 创建数据库
sudo -u postgres psql

# 在 PostgreSQL 命令行中执行：
CREATE DATABASE petkeeper;
CREATE USER petkeeper_user WITH ENCRYPTED PASSWORD '你的强密码';
GRANT ALL PRIVILEGES ON DATABASE petkeeper TO petkeeper_user;
\q
```

#### 第四步：安装 Nginx

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 第五步：安装 PM2

```bash
sudo npm install -g pm2
```

#### 第六步：配置防火墙

```bash
# 允许 SSH 和 HTTP/HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'

# 启用防火墙
sudo ufw enable

# 检查状态
sudo ufw status
```

#### 第七步：上传后端代码

**方法 A：使用 Git**

```bash
# 在服务器上
mkdir -p /var/www/petkeeper
cd /var/www/petkeeper
git clone https://github.com/PTR123/pet-keeper-app.git
cd pet-keeper-app/pet-keeper-backend
```

**方法 B：使用 SCP**

在本地电脑：

```bash
# 打包代码
cd /Users/mac/zrby/pet-keeper-backend
tar -czf backend.tar.gz --exclude='node_modules' --exclude='.env' .

# 上传
scp backend.tar.gz root@你的服务器IP:/var/www/petkeeper/
```

在服务器：

```bash
cd /var/www/petkeeper
mkdir backend
tar -xzf backend.tar.gz -C backend
cd backend
```

#### 第八步：配置环境变量

```bash
nano .env
```

写入：

```env
# 数据库连接
DATABASE_URL="postgresql://petkeeper_user:你的密码@localhost:5432/petkeeper"

# JWT 密钥（生成一个随机字符串）
JWT_SECRET="your-random-secret-key"

# 环境
NODE_ENV="production"
PORT=3001

# 前端域名（CORS 配置）
FRONTEND_URL="https://yourdomain.com"
```

生成 JWT_SECRET：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 第九步：安装依赖和运行迁移

```bash
# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate deploy

# 填充初始数据
npx tsx src/seed.ts

# 构建项目
npm run build
```

#### 第十步：使用 PM2 启动后端

创建 PM2 配置：

```bash
nano ecosystem.config.js
```

写入：

```javascript
module.exports = {
  apps: [{
    name: 'petkeeper-api',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
```

启动：

```bash
# 启动应用
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs petkeeper-api

# 保存配置
pm2 save

# 设置开机自启
pm2 startup
```

#### 第十一步：配置 Nginx

创建 Nginx 配置：

```bash
sudo nano /etc/nginx/sites-available/petkeeper-api
```

写入：

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;  # 替换为你的域名或服务器IP

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

启用配置：

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/petkeeper-api /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

#### 第十二步：配置 SSL 证书

安装 Certbot：

```bash
sudo apt install certbot python3-certbot-nginx -y
```

获取证书：

```bash
sudo certbot --nginx -d api.yourdomain.com
```

按提示输入邮箱，同意服务条款。

测试自动续期：

```bash
sudo certbot renew --dry-run
```

---

## 🌐 前端部署

### 方案 A：部署到 Vercel（推荐）

**优势**：
- 免费托管
- 自动 HTTPS
- CDN 加速
- 简单配置

**步骤**：

1. 修改前端环境变量

创建 `.env.production`：

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

2. 推送到 GitHub

```bash
cd /Users/mac/zrby/pet-keeper
git add .
git commit -m "Update API URL for production"
git push
```

3. 在 Vercel 部署

- 访问 https://vercel.com
- 用 GitHub 登录
- 点击 "New Project"
- 选择 `pet-keeper-app` 仓库
- 设置 Root Directory 为 `pet-keeper`
- 点击 "Deploy"

4. 配置自定义域名

在 Vercel 项目设置 → Domains，添加你的域名。

### 方案 B：部署到同一台服务器

**步骤**：

1. 上传前端代码

```bash
# 在本地打包
cd /Users/mac/zrby/pet-keeper
npm run build

# 打包
tar -czf frontend.tar.gz .next public package.json package-lock.json next.config.js

# 上传
scp frontend.tar.gz root@你的服务器IP:/var/www/petkeeper/
```

2. 在服务器上启动

```bash
cd /var/www/petkeeper
mkdir frontend
tar -xzf frontend.tar.gz -C frontend
cd frontend
npm install --production

# 使用 PM2 启动
pm2 start npm --name "petkeeper-web" -- start
pm2 save
```

3. Nginx 配置

```bash
sudo nano /etc/nginx/sites-available/petkeeper-web
```

写入：

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用并获取 SSL：

```bash
sudo ln -s /etc/nginx/sites-available/petkeeper-web /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## ✅ 验证部署

### 测试后端 API

```bash
# 本地测试
curl http://localhost:3001/api

# 外网测试
curl https://api.yourdomain.com/api
```

应返回：

```json
{"message": "PetKeeper API is running"}
```

### 测试前端

访问你的域名：`https://yourdomain.com`

测试功能：
- 用户注册
- 用户登录
- 添加宠物
- 查看物种图鉴

---

## 📊 日常管理

### 查看应用状态

```bash
# PM2 状态
pm2 status

# 查看日志
pm2 logs petkeeper-api

# 实时监控
pm2 monit
```

### 重启服务

```bash
# 重启后端
pm2 restart petkeeper-api

# 重启前端
pm2 restart petkeeper-web

# 重启 Nginx
sudo systemctl restart nginx
```

### 更新代码

```bash
cd /var/www/petkeeper/pet-keeper-backend
git pull
npm install
npx prisma migrate deploy
npm run build
pm2 restart petkeeper-api
```

### 数据库备份

自动备份脚本已创建，每天凌晨 2 点自动备份。

手动备份：

```bash
/var/www/petkeeper/backup.sh
```

查看备份：

```bash
ls -lh /var/www/petkeeper/backups/
```

---

## 💰 成本估算

### 国内云服务商

- 1核1G：¥50-80/月
- 2核2G：¥100-150/月
- 域名：¥50-70/年

**年度总成本**：¥650-1900/年

### 海外云服务商

- 1核1G：$5/月
- 2核2G：$10-15/月
- 域名：$10-15/年

**年度总成本**：$70-195/年

---

## 🔐 安全加固

### 1. 配置 SSH 密钥登录

在本地电脑：

```bash
# 生成密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 复制到服务器
ssh-copy-id root@你的服务器IP

# 测试登录
ssh root@你的服务器IP
```

禁用密码登录：

```bash
sudo nano /etc/ssh/sshd_config
```

修改：

```
PasswordAuthentication no
PubkeyAuthentication yes
```

重启 SSH：

```bash
sudo systemctl restart sshd
```

### 2. 安装 Fail2Ban

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. 定期更新系统

```bash
# 设置自动安全更新
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 🐛 常见问题

### Q: 后端无法启动

**解决**：

```bash
# 查看日志
pm2 logs petkeeper-api

# 检查端口
lsof -i :3001

# 检查环境变量
cat .env
```

### Q: 前端无法连接后端

**解决**：

1. 检查 CORS 配置
2. 检查 Nginx 配置
3. 检查防火墙

### Q: 数据库连接失败

**解决**：

```bash
# 检查 PostgreSQL 状态
sudo systemctl status postgresql

# 测试连接
psql -U petkeeper_user -d petkeeper -h localhost
```

### Q: SSL 证书获取失败

**解决**：

1. 确保域名已解析到服务器 IP
2. 检查防火墙是否开放 80 和 443 端口
3. 检查 Nginx 配置

---

## 📱 移动端配置

更新移动端 API 地址：

```bash
cd /Users/mac/zrby/PetKeeperMobile
echo "EXPO_PUBLIC_API_URL=https://api.yourdomain.com/api" > .env
```

构建 APK：

```bash
eas build --platform android --profile preview
```

---

## 🎉 部署完成清单

- [ ] 服务器购买并配置完成
- [ ] 域名购买并解析完成
- [ ] 基础环境安装完成（Node.js、PostgreSQL、Nginx、PM2）
- [ ] 后端代码上传并配置完成
- [ ] 数据库迁移和初始数据填充完成
- [ ] PM2 进程启动成功
- [ ] Nginx 反向代理配置完成
- [ ] SSL 证书配置完成
- [ ] 前端部署完成
- [ ] 所有功能测试通过
- [ ] 数据库备份配置完成
- [ ] 监控和日志配置完成
- [ ] 安全加固完成

---

## 📞 需要帮助？

- 详细文档：`PRIVATE_SERVER_DEPLOYMENT.md`
- 部署检查清单：`DEPLOYMENT_CHECKLIST.md`
- 常见问题：查看上方 "常见问题" 部分

---

**🎊 按照本指南，你的应用就可以部署到自己的服务器了！**

访问地址：
- 前端：`https://yourdomain.com`
- 后端 API：`https://api.yourdomain.com`
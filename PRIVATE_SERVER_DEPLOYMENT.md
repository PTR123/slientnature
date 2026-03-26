# 🚀 PetKeeper 私有服务器部署指南

将后端部署到您自己的私有服务器，前端部署到 Vercel/Netlify 或同一台服务器。

---

## 📋 部署架构

```
用户 → 域名 → Nginx (反向代理)
              ├── frontend.yourdomain.com → 前端静态文件
              └── api.yourdomain.com → Node.js 后端 (PM2)
                                         └── PostgreSQL 数据库
```

**优势**：
- 完全掌控后端服务器
- 数据存储在私有服务器
- 可自定义配置和扩展
- 成本可控（仅需服务器费用）

---

## 第一步：准备服务器

### 1. 服务器要求

**最低配置**：
- CPU: 1核
- 内存: 1GB
- 存储: 20GB
- 系统: Ubuntu 20.04/22.04 LTS

**推荐配置**：
- CPU: 2核
- 内存: 2GB
- 存储: 40GB

### 2. 连接服务器

```bash
ssh root@你的服务器IP
```

### 3. 更新系统

```bash
apt update && apt upgrade -y
```

---

## 第二步：安装基础环境

### 1. 安装 Node.js 20

```bash
# 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v  # 应显示 v20.x.x
npm -v
```

### 2. 安装 PostgreSQL

```bash
# 安装 PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# 启动服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 切换到 postgres 用户
sudo -u postgres psql

# 在 psql 中执行
CREATE DATABASE petkeeper;
CREATE USER petkeeper_user WITH ENCRYPTED PASSWORD '你的强密码';
GRANT ALL PRIVILEGES ON DATABASE petkeeper TO petkeeper_user;
\q
```

### 3. 安装 Nginx

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 4. 安装 PM2

```bash
sudo npm install -g pm2
```

### 5. 安装 Git

```bash
sudo apt install git -y
```

---

## 第三步：配置防火墙

```bash
# 允许 SSH
sudo ufw allow OpenSSH

# 允许 HTTP 和 HTTPS
sudo ufw allow 'Nginx Full'

# 启用防火墙
sudo ufw enable

# 检查状态
sudo ufw status
```

---

## 第四步：部署后端代码

### 1. 创建应用目录

```bash
sudo mkdir -p /var/www/petkeeper
sudo chown $USER:$USER /var/www/petkeeper
cd /var/www/petkeeper
```

### 2. 上传代码（方法一：Git）

```bash
# 如果代码在 GitHub
git clone https://github.com/你的用户名/pet-keeper-backend.git backend
cd backend
```

### 3. 上传代码（方法二：SCP）

在您的本地电脑执行：

```bash
# 打包后端代码
cd /Users/mac/my_gzh/zrby/pet-keeper-backend
tar -czf backend.tar.gz .

# 上传到服务器
scp backend.tar.gz root@你的服务器IP:/var/www/petkeeper/

# 在服务器上解压
ssh root@你的服务器IP
cd /var/www/petkeeper
mkdir backend
tar -xzf backend.tar.gz -C backend
cd backend
```

### 4. 安装依赖

```bash
npm install
```

### 5. 配置环境变量

```bash
# 创建生产环境配置
nano .env
```

写入以下内容：

```env
# 数据库连接
DATABASE_URL="postgresql://petkeeper_user:你的强密码@localhost:5432/petkeeper"

# JWT 密钥（生成一个强密码）
JWT_SECRET="生成一个随机的32位字符串"

# 环境
NODE_ENV="production"
PORT=3001

# 前端域名（CORS 配置）
FRONTEND_URL="https://你的前端域名.com"
```

**生成 JWT_SECRET**：

```bash
# 生成随机密钥
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 6. 更新 Prisma 配置

修改 `prisma/schema.prisma`：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### 7. 运行数据库迁移

```bash
# 生成 Prisma Client
npx prisma generate

# 运行迁移
npx prisma migrate deploy

# 填充初始数据
npx tsx src/seed.ts
```

### 8. 构建项目

```bash
npm run build
```

如果 `package.json` 中没有 `build` 脚本，添加：

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### 9. 更新后端 CORS 配置

修改 `src/index.ts`，添加 CORS：

```typescript
import cors from 'cors';

app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:3002' // 开发环境
  ].filter(Boolean),
  credentials: true
}));
```

重新构建：

```bash
npm run build
```

---

## 第五步：使用 PM2 启动后端

### 1. 创建 PM2 配置文件

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

### 2. 启动应用

```bash
# 启动
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs petkeeper-api

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
```

执行 `pm2 startup` 后会输出一条命令，复制执行即可。

---

## 第六步：配置 Nginx 反向代理

### 1. 创建 Nginx 配置

```bash
sudo nano /etc/nginx/sites-available/petkeeper-api
```

写入：

```nginx
server {
    listen 80;
    server_name api.你的域名.com;  # 替换为您的域名

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

### 2. 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/petkeeper-api /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

---

## 第七步：配置 SSL 证书

### 1. 安装 Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 2. 获取 SSL 证书

```bash
sudo certbot --nginx -d api.你的域名.com
```

按提示输入您的邮箱，同意服务条款。

### 3. 自动续期测试

```bash
sudo certbot renew --dry-run
```

Certbot 会自动设置定时任务续期。

---

## 第八步：部署前端

### 方案一：部署到 Vercel（推荐）

#### 1. 准备前端代码

修改 `/Users/mac/my_gzh/zrby/pet-keeper/.env.production`：

```env
NEXT_PUBLIC_API_URL=https://api.你的域名.com/api
```

#### 2. 推送到 GitHub

```bash
cd /Users/mac/my_gzh/zrby/pet-keeper
git add .
git commit -m "Update production API URL"
git push
```

#### 3. 在 Vercel 部署

1. 访问 https://vercel.com
2. 使用 GitHub 登录
3. 点击 "New Project"
4. 选择 `pet-keeper` 仓库
5. 点击 "Deploy"

#### 4. 配置自定义域名

在 Vercel 项目设置 → Domains：
- 添加 `你的域名.com` 和 `www.你的域名.com`
- 按提示配置 DNS

#### 5. 更新后端 CORS

在服务器的 `/var/www/petkeeper/backend/.env` 中更新：

```env
FRONTEND_URL="https://你的域名.com"
```

重启后端：

```bash
pm2 restart petkeeper-api
```

---

### 方案二：部署到同一台服务器

#### 1. 上传前端代码

```bash
# 在本地打包
cd /Users/mac/my_gzh/zrby/pet-keeper
npm run build

# 打包输出目录
tar -czf frontend.tar.gz .next public package.json package-lock.json

# 上传
scp frontend.tar.gz root@你的服务器IP:/var/www/petkeeper/

# 在服务器解压
ssh root@你的服务器IP
cd /var/www/petkeeper
mkdir frontend
tar -xzf frontend.tar.gz -C frontend
cd frontend
npm install --production
```

#### 2. 使用 PM2 启动前端

```bash
pm2 start npm --name "petkeeper-web" -- start
pm2 save
```

#### 3. Nginx 配置

```bash
sudo nano /etc/nginx/sites-available/petkeeper-web
```

写入：

```nginx
server {
    listen 80;
    server_name 你的域名.com www.你的域名.com;

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
sudo certbot --nginx -d 你的域名.com -d www.你的域名.com
```

---

## 第九步：测试部署

### 1. 测试后端 API

```bash
# 健康检查
curl https://api.你的域名.com/api/health

# 应返回
{"status":"ok"}
```

### 2. 测试前端

访问 `https://你的域名.com`，测试：
- 注册新用户
- 登录
- 创建宠物档案
- 添加记录
- 发布帖子

---

## 第十步：监控和维护

### 1. 查看应用状态

```bash
pm2 status
pm2 logs
pm2 monit
```

### 2. 日志管理

```bash
# 查看后端日志
pm2 logs petkeeper-api

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 3. 数据库备份

创建备份脚本：

```bash
nano /var/www/petkeeper/backup.sh
```

写入：

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/www/petkeeper/backups"
mkdir -p $BACKUP_DIR

pg_dump -U petkeeper_user petkeeper > $BACKUP_DIR/petkeeper_$DATE.sql

# 删除 7 天前的备份
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: petkeeper_$DATE.sql"
```

设置定时任务：

```bash
chmod +x /var/www/petkeeper/backup.sh
crontab -e
```

添加：

```
0 2 * * * /var/www/petkeeper/backup.sh >> /var/www/petkeeper/backup.log 2>&1
```

每天凌晨 2 点自动备份。

### 4. 更新代码

```bash
cd /var/www/petkeeper/backend
git pull
npm install
npx prisma migrate deploy
npm run build
pm2 restart petkeeper-api
```

---

## 💰 成本估算

### 云服务器价格（参考）

**国内云服务商**（阿里云/腾讯云）：
- 1核1G: ¥50-80/月
- 2核2G: ¥100-150/月

**海外云服务商**（AWS/DO/Vultr）：
- 1核1G: $5/月
- 2核2G: $10-15/月

**域名费用**：
- .com: ¥50-70/年
- .cn: ¥30-50/年

### 总成本
- **最低配置**: ¥50/月 + 域名费
- **推荐配置**: ¥100/月 + 域名费

---

## 🔐 安全加固

### 1. 禁用 SSH 密码登录

```bash
# 先配置 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"
ssh-copy-id root@你的服务器IP

# 测试密钥登录成功后，禁用密码登录
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

### 2. 配置 Fail2Ban

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

### Q: 后端启动失败
**A**: 检查日志 `pm2 logs petkeeper-api`，常见原因：
- 数据库连接失败：检查 `.env` 中的 `DATABASE_URL`
- 端口被占用：`lsof -i :3001`

### Q: 前端无法连接后端
**A**: 检查：
- CORS 配置是否包含前端域名
- Nginx 反向代理是否正确
- 防火墙是否开放端口

### Q: 数据库连接失败
**A**: 检查 PostgreSQL 服务：
```bash
sudo systemctl status postgresql
sudo -u postgres psql -c "SELECT version();"
```

### Q: SSL 证书获取失败
**A**: 确保：
- 域名已正确解析到服务器 IP
- Nginx 配置正确
- 防火墙允许 80 和 443 端口

---

## 📊 性能优化

### 1. PM2 集群模式

已配置 `instances: 'max'`，会自动使用所有 CPU 核心。

### 2. Nginx 缓存

在 `/etc/nginx/nginx.conf` 中添加：

```nginx
http {
    # ...
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;
}
```

### 3. 数据库优化

```bash
sudo -u postgres psql
```

```sql
-- 创建索引
CREATE INDEX idx_pets_userId ON pets("userId");
CREATE INDEX idx_posts_authorId ON posts("authorId");
```

---

## 🚀 一键部署脚本

创建自动化部署脚本 `deploy.sh`：

```bash
#!/bin/bash

echo "🚀 开始部署 PetKeeper..."

# 拉取最新代码
cd /var/www/petkeeper/backend
git pull origin main

# 安装依赖
npm install

# 数据库迁移
npx prisma migrate deploy

# 构建
npm run build

# 重启服务
pm2 restart petkeeper-api

echo "✅ 后端部署完成！"

# 前端部署（如果使用同一服务器）
if [ -d "/var/www/petkeeper/frontend" ]; then
  cd /var/www/petkeeper/frontend
  git pull origin main
  npm install
  npm run build
  pm2 restart petkeeper-web
  echo "✅ 前端部署完成！"
fi

echo "🎉 全部部署完成！"
```

使用：

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 📱 移动端配置

更新移动端 API 地址：

在 `/Users/mac/my_gzh/zrby/pet-keeper-mobile/.env` 中：

```env
EXPO_PUBLIC_API_URL=https://api.你的域名.com/api
```

打包 APK：

```bash
cd /Users/mac/my_gzh/zrby/pet-keeper-mobile
eas build --platform android --profile preview
```

---

## 🎉 部署完成清单

- [ ] 服务器环境搭建完成
- [ ] PostgreSQL 数据库配置完成
- [ ] 后端代码部署成功
- [ ] PM2 进程管理配置完成
- [ ] Nginx 反向代理配置完成
- [ ] SSL 证书配置完成
- [ ] 前端部署成功（Vercel 或服务器）
- [ ] 域名解析配置完成
- [ ] 数据库备份定时任务配置完成
- [ ] 监控和日志配置完成
- [ ] 安全加固完成

---

**🎊 您的 PetKeeper 已成功部署到私有服务器！**

访问地址：
- 前端: `https://你的域名.com`
- 后端 API: `https://api.你的域名.com`
- 移动端 APK: 通过 EAS 构建下载
# 自然不语项目部署方案（完整指南）

## 项目架构概览

- **Web前端**：Next.js 14 + React + Tailwind CSS
- **后端API**：Express + Prisma + PostgreSQL
- **微信小程序**：原生微信小程序
- **数据库**：PostgreSQL + Redis（可选）

---

## 方案对比总览

| 方案 | 成本 | 复杂度 | 性能 | 适用场景 | 推荐指数 |
|-----|------|-------|------|---------|----------|
| 方案1：NAS私有化部署 | 低 | 中 | 中 | 已有NAS设备 | ⭐⭐⭐⭐⭐ |
| 方案2：云服务器部署 | 中 | 高 | 高 | 生产环境 | ⭐⭐⭐⭐ |
| 方案3：容器化平台 | 低 | 低 | 高 | 快速部署 | ⭐⭐⭐⭐ |
| 方案4：混合部署 | 中 | 高 | 高 | 企业级 | ⭐⭐⭐ |

---

## 方案1：NAS私有化部署（推荐）⭐⭐⭐⭐⭐

### 优点
- ✅ 零成本（使用现有NAS）
- ✅ 数据完全私有，安全可控
- ✅ 可内网穿透对外服务
- ✅ 适合个人或小型团队

### 缺点
- ⚠️ 需要配置内网穿透
- ⚠️ 外网访问速度可能较慢
- ⚠️ 需要一定的运维知识

### 部署步骤

#### 1. NAS环境准备

```bash
# SSH登录NAS
ssh admin@your-nas-ip

# 安装Docker（如果未安装）
# 群晖：通过套件中心安装 Docker
# 威联通：通过 Container Station 安装

# 创建项目目录
mkdir -p /volume1/docker/ziranbuyu
cd /volume1/docker/ziranbuyu
```

#### 2. 克隆代码

```bash
git clone https://github.com/your-repo/ziranbuyu.git .
```

#### 3. 配置环境变量

```bash
cp .env.example .env
vim .env
```

配置内容：
```env
# 数据库配置
POSTGRES_USER=ziranbuyu
POSTGRES_PASSWORD=your-secure-password
POSTGRES_DB=ziranbuyu

# Redis配置（可选）
REDIS_PASSWORD=your-redis-password

# JWT密钥（至少32字符）
JWT_SECRET=your-very-secure-jwt-secret-key-min-32-characters

# API配置
API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000

# 微信小程序配置（发布时需要）
WECHAT_APPID=your-appid
WECHAT_SECRET=your-secret
```

#### 4. 生成SSL证书

**选项A：Let's Encrypt免费证书（推荐）**
```bash
# 在有公网IP的服务器上申请
sudo certbot certonly --standalone -d api.yourdomain.com
sudo certbot certonly --standalone -d www.yourdomain.com

# 复制证书到NAS
scp /etc/letsencrypt/live/yourdomain.com/fullchain.pem admin@nas-ip:/volume1/docker/ziranbuyu/nginx/ssl/cert.pem
scp /etc/letsencrypt/live/yourdomain.com/privkey.pem admin@nas-ip:/volume1/docker/ziranbuyu/nginx/ssl/key.pem

# 设置自动续期（3个月）
# 在有公网IP的服务器上添加cron任务
0 0 1 * * certbot renew --deploy-hook "scp /etc/letsencrypt/live/yourdomain.com/*.pem admin@nas-ip:/volume1/docker/ziranbuyu/nginx/ssl/"
```

**选项B：自签名证书（开发环境）**
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem
```

#### 5. 启动服务

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 检查状态
docker-compose ps
```

#### 6. 配置内网穿透

**选项A：Cloudflare Tunnel（推荐）**
```bash
# 1. 安装cloudflared
docker run -d --name cloudflared \
  --restart unless-stopped \
  --network host \
  -v ~/.cloudflared:/etc/cloudflared \
  cloudflare/cloudflared:latest \
  tunnel --no-autoupdate run --token <your-tunnel-token>

# 2. 获取token步骤：
# - 登录 Cloudflare Zero Trust Dashboard
# - Networks -> Tunnels -> Create a tunnel
# - 选择 "Cloudflared" -> 复制token
# - 配置路由：
#   api.yourdomain.com -> http://localhost:3001
#   www.yourdomain.com -> http://localhost:3000
```

**选项B：frp内网穿透**
```bash
# 1. 在有公网IP的服务器上安装frps
wget https://github.com/fatedier/frp/releases/download/v0.52.3/frp_0.52.3_linux_amd64.tar.gz
tar -xzf frp_0.52.3_linux_amd64.tar.gz
cd frp_0.52.3_linux_amd64

# 配置 frps.toml
[server]
bind_port = 7000

# 启动服务端
./frps -c frps.toml

# 2. 在NAS上配置frpc
# frpc.toml
[client]
server_addr = your-server-ip
server_port = 7000

[tunnel-api]
type = tcp
local_ip = localhost
local_port = 3001
remote_port = 3001

[tunnel-web]
type = tcp
local_ip = localhost
local_port = 3000
remote_port = 3000

# 启动客户端
docker run -d --name frpc \
  --restart unless-stopped \
  -v $(pwd)/frpc.toml:/frpc.toml \
  snowzach/frpc:latest
```

#### 7. 微信小程序配置

```javascript
// pet-keeper-miniprogram/app.js
App({
  globalData: {
    apiBaseUrl: 'https://api.yourdomain.com/api' // 修改为实际API地址
  }
})
```

#### 8. 小程序发布

```bash
# 1. 在微信开发者工具中打开小程序
# 2. 修改project.config.json中的appid
# 3. 点击"上传"按钮
# 4. 登录微信公众平台提交审核
# 5. 审核通过后发布
```

### 成本估算
- NAS设备：已拥有（0元）
- 域名：约 ¥50-100/年
- Cloudflare Tunnel：免费
- 总成本：**¥50-100/年**

---

## 方案2：云服务器部署 ⭐⭐⭐⭐

### 优点
- ✅ 公网直接访问，速度稳定
- ✅ 完全可控，便于运维
- ✅ 性能可按需扩展
- ✅ 适合生产环境

### 缺点
- ⚠️ 需持续付费（约 ¥100-500/月）
- ⚠️ 需要运维知识
- ⚠️ 数据在云服务器上

### 推荐云服务商

| 服务商 | 价格 | 特点 | 推荐配置 |
|-------|------|------|---------|
| 阿里云 | ¥99-299/月 | 国内首选 | 2核4G 3M带宽 |
| 腾讯云 | ¥99-199/月 | 微信小程序集成方便 | 2核4G 3M带宽 |
| Vultr | $5-20/月 | 海外部署 | 2核4G |
| DigitalOcean | $6-24/月 | 简单易用 | 2核4G |

### 部署步骤

#### 1. 购买服务器

```bash
# 推荐配置：
# CPU: 2核
# 内存: 4GB
# 存储: 40GB SSD
# 带宽: 3Mbps
```

#### 2. 服务器初始化

```bash
# SSH登录
ssh root@your-server-ip

# 更新系统
apt update && apt upgrade -y

# 安装Docker
curl -fsSL https://get.docker.com | sh
apt install docker-compose -y

# 安装其他工具
apt install git nginx certbot -y

# 创建用户
adduser deploy
usermod -aG docker deploy
```

#### 3. 部署应用

```bash
# 切换用户
su deploy

# 克隆代码
cd /home/deploy
git clone https://github.com/your-repo/ziranbuyu.git
cd ziranbuyu

# 配置环境变量
cp .env.example .env
vim .env

# 启动服务
docker-compose up -d
```

#### 4. 配置域名和SSL

```bash
# 申请SSL证书
sudo certbot certonly --nginx -d api.yourdomain.com -d www.yourdomain.com

# 配置自动续期
sudo crontab -e
0 3 1 * * certbot renew --nginx --deploy-hook "docker-compose restart nginx"
```

#### 5. 配置Nginx反向代理

```nginx
# /etc/nginx/sites-available/ziranbuyu.conf
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

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

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/ziranbuyu.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 成本估算
- 云服务器：¥99-299/月
- 域名：¥50-100/年
- SSL证书：免费（Let's Encrypt）
- 总成本：**¥1000-3600/年**

---

## 方案3：容器化平台部署 ⭐⭐⭐⭐

### 推荐平台

| 平台 | 价格 | 特点 | 推荐指数 |
|------|------|------|----------|
| Railway.app | 免费额度+按需付费 | 简单易用，自动部署 | ⭐⭐⭐⭐⭐ |
| Render.com | 免费额度+按需付费 | 支持静态站点和API | ⭐⭐⭐⭐ |
| Fly.io | 免费额度+按需付费 | 全球边缘部署 | ⭐⭐⭐⭐ |
| Vercel | 免费（前端） | Next.js官方平台 | ⭐⭐⭐⭐⭐ |

### 部署步骤（Railway.app 推荐）

#### 1. 注册Railway

访问 https://railway.app 使用GitHub账号登录

#### 2. 部署PostgreSQL

```bash
# 在Railway Dashboard中：
# 1. 点击 "+ New Project"
# 2. 选择 "PostgreSQL"
# 3. 自动创建数据库并获取连接信息
```

#### 3. 部署后端API

```bash
# 1. 在项目中点击 "+ Add Service"
# 2. 选择 "GitHub Repo"
# 3. 选择你的仓库
# 4. 配置构建命令：
npm install && npm run build
# 5. 配置启动命令：
npm run start
# 6. 添加环境变量：
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-secret-key
REDIS_URL=${{Redis.REDIS_URL}}
# 7. 部署完成，获取URL：https://your-app.railway.app
```

#### 4. 部署Redis（可选）

```bash
# 在Dashboard中添加Redis服务
# 自动获取连接URL
```

#### 5. 部署前端（Vercel）

```bash
# 1. 访问 https://vercel.com
# 2. 导入GitHub仓库
# 3. 选择 pet-keeper 目录
# 4. 配置环境变量：
NEXT_PUBLIC_API_URL=https://your-api.railway.app/api
# 5. 自动部署，获得URL：https://your-app.vercel.app
```

#### 6. 自定义域名

**Railway自定义域名**：
```bash
# 在Railway Dashboard：
# Settings -> Domains -> Add custom domain
api.yourdomain.com
```

**Vercel自定义域名**：
```bash
# 在Vercel Dashboard：
# Settings -> Domains -> Add
www.yourdomain.com
```

#### 7. 配置DNS

```bash
# 在域名服务商配置：
api.yourdomain.com -> CNAME -> your-app.railway.app
www.yourdomain.com -> CNAME -> cname.vercel-dns.com
```

### 成本估算
- Railway免费额度：$5/月额度（够用）
- 超出部分：按使用付费
- Vercel：免费（个人项目）
- 域名：¥50-100/年
- 总成本：**¥50-100/年**（轻量使用）

---

## 方案4：混合部署（企业级）⭐⭐⭐

### 架构
- 前端：Vercel（免费，全球CDN）
- API：云服务器或NAS（私有数据）
- 数据库：云数据库服务（RDS）

### 部署组合

#### 组合A：Vercel + NAS + 云数据库

```
Web前端 (Vercel) -> API (NAS内网穿透) -> PostgreSQL (云数据库)
```

**优点**：
- 前端全球CDN加速
- API私有化部署
- 数据库专业托管

**缺点**：
- 配置复杂
- 需要跨网络连接

#### 组合B：Vercel + 云服务器 + 云数据库

```
Web前端 (Vercel) -> API (云服务器) -> PostgreSQL (阿里云RDS)
```

**优点**：
- 各部分专业托管
- 性能稳定
- 易于扩展

**缺点**：
- 成本较高

### 部署步骤（组合A）

#### 1. 部署云数据库

```bash
# 阿里云RDS PostgreSQL
# 1. 购买RDS实例
# 2. 配置白名单（NAS的公网IP）
# 3. 获取连接信息
```

#### 2. NAS部署API

```bash
# 环境变量配置：
DATABASE_URL=postgres://user:password@rds-host:5432/db
REDIS_URL=redis://nas-redis:6379

# 启动API服务
docker-compose up -d backend redis
```

#### 3. Vercel部署前端

```bash
# 环境变量：
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api

# 部署
vercel --prod
```

### 成本估算
- Vercel：免费
- NAS：已拥有（0元）
- 阿里云RDS：¥100-300/月
- 域名：¥50-100/年
- 总成本：**¥1200-3700/年**

---

## 微信小程序发布指南

### 1. 准备工作

#### 注册小程序账号
1. 访问 https://mp.weixin.qq.com
2. 注册小程序账号
3. 获取AppID和AppSecret

#### 配置服务器域名
```bash
# 在微信公众平台：
# 开发 -> 开发管理 -> 开发设置 -> 服务器域名

# request合法域名：
https://api.yourdomain.com

# uploadFile合法域名：
https://api.yourdomain.com

# downloadFile合法域名：
https://api.yourdomain.com
```

### 2. 修改配置

```javascript
// pet-keeper-miniprogram/project.config.json
{
  "appid": "your-appid",
  "projectname": "自然不语"
}

// pet-keeper-miniprogram/app.js
App({
  globalData: {
    apiBaseUrl: 'https://api.yourdomain.com/api'
  }
})
```

### 3. 上传代码

```bash
# 在微信开发者工具中：
# 1. 打开小程序项目
# 2. 点击右上角"上传"
# 3. 填写版本号和备注
# 4. 上传成功
```

### 4. 提交审核

```bash
# 登录微信公众平台：
# 1. 管理 -> 版本管理
# 2. 选择开发版本
# 3. 点击"提交审核"
# 4. 填写审核信息
# 5. 等待审核（通常1-7天）
```

### 5. 发布上线

```bash
# 审核通过后：
# 1. 点击"发布"
# 2. 填写发布信息
# 3. 确认发布
# 4. 用户可以搜索使用
```

---

## 数据库迁移指南

### 从SQLite迁移到PostgreSQL

```bash
cd pet-keeper-backend

# 1. 备份SQLite数据
sqlite3 prisma/dev.db .dump > backup.sql

# 2. 修改schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# 3. 生成Prisma客户端
npx prisma generate

# 4. 推送schema到PostgreSQL
npx prisma db push

# 5. 迁移数据（编写迁移脚本）
npx tsx scripts/migrate-sqlite-to-postgres.ts
```

---

## 性能优化建议

### 1. 启用Redis缓存

```javascript
// 在API中添加缓存层
const cache = require('redis-cache');

// 缓存热门数据
app.get('/api/posts', cache.middleware(300), async (req, res) => {
  // ...
});
```

### 2. CDN加速

```bash
# 配置Cloudflare CDN
# 1. 添加域名到Cloudflare
# 2. 配置CDN规则
# 3. 启用缓存
```

### 3. 数据库优化

```sql
-- 创建索引
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_post_author ON "Post"("authorId");
CREATE INDEX idx_order_user ON "Order"("userId");

-- 配置连接池
-- postgresql.conf
max_connections = 100
shared_buffers = 256MB
```

---

## 安全加固建议

### 1. 防火墙配置

```bash
# 只开放必要端口
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw enable
```

### 2. 定期备份

```bash
# 创建备份脚本
#!/bin/bash
BACKUP_DIR="/backup/ziranbuyu"
DATE=$(date +%Y%m%d_%H%M%S)

# 备份数据库
docker-compose exec -T postgres pg_dump -U ziranbuyu > $BACKUP_DIR/db_$DATE.sql

# 备份上传文件
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz uploads/

# 保留最近7天的备份
find $BACKUP_DIR -type f -mtime +7 -delete
```

### 3. 监控日志

```bash
# 配置日志轮转
/etc/logrotate.d/ziranbuyu

/var/log/ziranbuyu/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 644 deploy deploy
}
```

---

## 推荐方案总结

### 个人用户：方案1（NAS部署）⭐⭐⭐⭐⭐
- 成本最低
- 数据私有
- 适合学习和个人项目

### 小型团队：方案3（Railway + Vercel）⭐⭐⭐⭐
- 快速部署
- 自动化运维
- 成本可控

### 生产环境：方案2（云服务器）⭐⭐⭐⭐
- 性能稳定
- 完全可控
- 适合商业项目

### 企业级：方案4（混合部署）⭐⭐⭐
- 高可用性
- 易于扩展
- 专业托管

---

## 下一步行动

根据你的情况选择：

1. **已有NAS设备** → 选择方案1，开始部署
2. **快速上线测试** → 选择方案3（Railway + Vercel）
3. **稳定生产环境** → 选择方案2（阿里云/腾讯云）
4. **企业级需求** → 选择方案4（混合部署）

建议从方案1或方案3开始，成本低、部署快，适合快速验证和迭代！
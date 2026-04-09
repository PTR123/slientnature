# 自然不语项目 - NAS部署指南

## 📋 前置要求

### 硬件要求
- NAS设备（群晖/威联通等）
- 至少2GB内存
- 20GB可用存储空间
- 支持Docker

### 软件要求
- Docker & Docker Compose
- Git
- Node.js 20+（用于小程序构建）

---

## 🚀 部署步骤

### 1. 准备NAS环境

```bash
# SSH登录到NAS
ssh admin@your-nas-ip

# 创建项目目录
mkdir -p /volume1/projects/ziranbuyu
cd /volume1/projects/ziranbuyu

# 克隆代码
git clone https://github.com/your-repo/ziranbuyu.git .
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑配置
vim .env
```

必须配置的变量：
- `DB_PASSWORD` - 数据库密码
- `REDIS_PASSWORD` - Redis密码
- `JWT_SECRET` - JWT密钥（至少32字符）
- `API_URL` - API地址
- `FRONTEND_URL` - 前端地址

### 3. 生成SSL证书

#### 方案A：使用Let's Encrypt（推荐）
```bash
# 安装certbot
sudo apt-get install certbot

# 申请证书
sudo certbot certonly --standalone -d api.yourdomain.com -d www.yourdomain.com

# 复制证书
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem
```

#### 方案B：自签名证书（开发环境）
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem
```

### 4. 数据库迁移

```bash
# 从SQLite迁移到PostgreSQL
cd pet-keeper-backend

# 安装依赖
npm install

# 运行迁移脚本
npx tsx scripts/migrate-db.ts
```

### 5. 启动服务

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 检查服务状态
docker-compose ps
```

### 6. 配置内网穿透

#### 方案A：使用Cloudflare Tunnel（推荐）
```bash
# 安装cloudflared
docker run cloudflare/cloudflared:latest tunnel --no-autoupdate login

# 创建tunnel
docker run cloudflare/cloudflared:latest tunnel --no-autoupdate create ziranbuyu

# 配置路由
docker run cloudflare/cloudflared:latest tunnel route dns ziranbuyu api.yourdomain.com
docker run cloudflare/cloudflared:latest tunnel route dns ziranbuyu www.yourdomain.com

# 启动tunnel
docker run -d cloudflare/cloudflared:latest tunnel --no-autoupdate run ziranbuyu
```

#### 方案B：使用frp
```bash
# 服务端配置（有公网IP的服务器）
# frps.ini
[common]
bind_port = 7000

# 客户端配置（NAS）
# frpc.ini
[common]
server_addr = your-server-ip
server_port = 7000

[api]
type = tcp
local_ip = localhost
local_port = 3001
remote_port = 3001

[web]
type = tcp
local_ip = localhost
local_port = 3000
remote_port = 3000
```

---

## 📱 OTA更新

### 手动更新
```bash
# SSH到NAS
cd /volume1/projects/ziranbuyu

# 执行更新脚本
./scripts/ota-update.sh
```

### 自动更新（GitHub Actions）
1. 配置GitHub Secrets：
   - `NAS_HOST` - NAS的IP或域名
   - `NAS_USER` - SSH用户名
   - `NAS_SSH_KEY` - SSH私钥
   - `WEBHOOK_URL` - 通知webhook（可选）

2. 推送到main分支自动触发部署

---

## 🔧 运维命令

### 服务管理
```bash
# 启动服务
docker-compose start

# 停止服务
docker-compose stop

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f [service_name]

# 进入容器
docker-compose exec backend sh
```

### 数据库操作
```bash
# 连接数据库
docker-compose exec postgres psql -U ziranbuyu

# 备份数据库
./scripts/backup.sh

# 恢复数据库
gunzip < backup.sql.gz | docker-compose exec -T postgres psql -U ziranbuyu
```

### 监控
```bash
# 查看资源使用
docker stats

# 查看磁盘使用
df -h

# 查看容器健康状态
docker inspect --format='{{.State.Health.Status}}' ziranbuyu-api
```

---

## 🔐 安全加固

### 1. 防火墙配置
```bash
# 只开放必要端口
# 80, 443 - Web服务
# 22 - SSH（建议改为非标准端口）
```

### 2. 定期更新
```bash
# 更新Docker镜像
docker-compose pull
docker-compose up -d

# 更新系统包
sudo apt-get update && sudo apt-get upgrade
```

### 3. 监控日志
```bash
# 配置日志轮转
sudo vim /etc/logrotate.d/docker
```

---

## 📊 性能优化

### 1. 启用Redis缓存
已在docker-compose.yml中配置

### 2. 数据库优化
```bash
# 创建索引
docker-compose exec postgres psql -U ziranbuyu -c "
CREATE INDEX idx_user_email ON User(email);
CREATE INDEX idx_post_author ON Post(authorId);
CREATE INDEX idx_order_user ON Order(userId);
"
```

### 3. 启用Gzip压缩
已在nginx配置中启用

---

## 🆘 故障排查

### 服务无法启动
```bash
# 查看日志
docker-compose logs backend

# 检查端口占用
netstat -tunlp | grep -E '(3000|3001|5432|6379)'

# 检查容器状态
docker-compose ps
```

### 数据库连接失败
```bash
# 检查数据库状态
docker-compose exec postgres pg_isready

# 检查连接
docker-compose exec backend ping postgres
```

### 性能问题
```bash
# 查看资源使用
docker stats

# 查看慢查询
docker-compose exec postgres psql -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
```

---

## 📞 技术支持

遇到问题？
1. 查看日志：`docker-compose logs -f`
2. 检查配置：`docker-compose config`
3. 重启服务：`docker-compose restart`
4. 查看文档：本README文件

---

## 🎉 完成！

现在您的项目已经部署到NAS，可以通过域名访问：
- API: https://api.yourdomain.com
- Web: https://www.yourdomain.com
- 小程序：修改app.js中的API地址

享受零成本的私有化部署吧！
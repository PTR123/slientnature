# PetKeeper NAS部署方案（公网访问）

生成时间: 2026-04-02

---

## 🎯 部署架构

```
用户（公网）
    ↓
内网穿透服务（frp/ngrok/Cloudflare Tunnel）
    ↓
NAS (内网IP: 192.168.x.x)
    ├── Docker环境
    │   ├── Backend (Node.js API)
    │   ├── PostgreSQL (数据库)
    │   ├── Redis (缓存)
    │   └── Nginx (反向代理)
    └── 数据持久化
        ├── 数据库文件
        ├── 上传文件
        └── 日志文件
```

---

## 📋 前提条件

### NAS要求
- ✅ 支持Docker（群晖、威联通、铁威马等）
- ✅ 内存 ≥ 4GB（推荐8GB+）
- ✅ 存储空间 ≥ 50GB
- ✅ 网络连接稳定

### 公网访问方案
- ✅ 内网穿透工具（推荐优先级）：
  1. **Cloudflare Tunnel**（推荐，免费、稳定）
  2. **frp**（开源、可自建服务器）
  3. **ngrok**（简单易用）
  4. **花生壳**（国内服务）

---

## 🚀 部署步骤

### 第一步：NAS环境准备

#### 1. 安装Docker（群晖示例）

```bash
# 打开DSM
# 套件中心 → 搜索"Docker" → 安装

# SSH连接NAS
ssh admin@your-nas-ip

# 验证Docker安装
docker --version
docker-compose --version
```

#### 2. 创建项目目录

```bash
# SSH连接NAS后
mkdir -p /volume1/docker/petkeeper/{backend,postgres,redis,uploads,logs,backups}
cd /volume1/docker/petkeeper
```

---

### 第二步：上传项目文件

#### 方式一：Git Clone（推荐）

```bash
# SSH连接NAS
cd /volume1/docker/petkeeper/backend
git clone <your-repo-url> .
```

#### 方式二：上传压缩包

```bash
# 本地打包
tar -czf petkeeper-backend.tar.gz pet-keeper-backend/

# 通过DSM文件管理器上传
# 或使用scp上传
scp petkeeper-backend.tar.gz admin@nas-ip:/volume1/docker/petkeeper/backend/
```

---

### 第三步：配置环境变量

```bash
# 创建环境变量文件
cd /volume1/docker/petkeeper/backend
nano .env
```

**`.env`配置**:
```bash
# 服务器配置
NODE_ENV=production
PORT=3001

# 数据库配置
DATABASE_URL=postgresql://petkeeper:password@postgres:5432/petkeeper

# Redis配置
REDIS_URL=redis://redis:6379

# JWT配置（必须修改！）
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=30d

# CORS配置（修改为你的域名）
FRONTEND_URL=https://your-domain.com
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com

# 日志配置
LOG_LEVEL=info

# 文件上传配置
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

---

### 第四步：启动Docker服务

```bash
# 确保在项目目录
cd /volume1/docker/petkeeper/backend

# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f backend

# 初始化数据库
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run db:seed
```

---

### 第五步：配置内网穿透

#### 方案一：Cloudflare Tunnel（推荐）

**优点**:
- ✅ 完全免费
- ✅ 无需公网IP
- ✅ 自带HTTPS
- ✅ 无需开放端口
- ✅ 隐藏真实IP

**部署步骤**:

```bash
# 1. 安装Cloudflared
docker run -d \
  --name cloudflared \
  --restart unless-stopped \
  --network petkeeper_petkeeper-network \
  cloudflare/cloudflared:latest \
  tunnel --no-autoupdate run --token <your-tunnel-token>

# 2. 获取Tunnel Token
# 访问 https://one.dash.cloudflare.com/
# Networks → Tunnels → Create a tunnel
# 选择"Cloudflared" → 复制生成的token

# 3. 配置域名路由
# 在Cloudflare Dashboard中：
# your-domain.com/* → http://nginx:80
```

**完整配置示例**:

```bash
# 添加到docker-compose.yml
services:
  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared
    restart: unless-stopped
    command: tunnel --no-autoupdate run --token YOUR_TUNNEL_TOKEN
    networks:
      - petkeeper-network
```

---

#### 方案二：frp（自建服务器）

**服务器端（公网VPS）**:

```bash
# 安装frps
wget https://github.com/fatedier/frp/releases/download/v0.52.3/frp_0.52.3_linux_amd64.tar.gz
tar -xzf frp_0.52.3_linux_amd64.tar.gz
cd frp_0.52.3_linux_amd64

# 配置frps.ini
cat > frps.ini << 'EOF'
[common]
bind_port = 7000
vhost_http_port = 80
vhost_https_port = 443
EOF

# 启动服务
./frps -c frps.ini
```

**NAS端（frpc）**:

```bash
# 添加到docker-compose.yml
services:
  frpc:
    image: snowdreamtech/frpc:latest
    container_name: frpc
    restart: unless-stopped
    volumes:
      - ./frpc.ini:/etc/frp/frpc.ini
    networks:
      - petkeeper-network

# 创建frpc.ini
cat > frpc.ini << 'EOF'
[common]
server_addr = your-vps-ip
server_port = 7000

[petkeeper-http]
type = http
local_ip = nginx
local_port = 80
custom_domains = your-domain.com
EOF
```

---

#### 方案三：ngrok（简单易用）

```bash
# 注册账号：https://ngrok.com/
# 获取authtoken

# 使用Docker运行
docker run -d \
  --name ngrok \
  --restart unless-stopped \
  --network petkeeper_petkeeper-network \
  ngrok/ngrok:latest \
  ngrok http nginx:80 --authtoken=YOUR_AUTH_TOKEN

# 查看公网地址
docker logs ngrok
```

---

### 第六步：域名和HTTPS配置

#### 使用Cloudflare（推荐）

```bash
# 1. 添加域名到Cloudflare
# 2. 修改域名的NS记录为Cloudflare
# 3. 配置DNS记录

# DNS配置示例：
类型: CNAME
名称: @
目标: <tunnel-id>.cfargotunnel.com
代理: 已启用（橙色云朵）
```

**Cloudflare自动管理HTTPS**，无需手动配置证书。

---

#### 使用Let's Encrypt（自签名）

```bash
# 安装certbot
docker run -it --rm \
  -v /etc/letsencrypt:/etc/letsencrypt \
  certbot/certbot certonly --manual --preferred-challenges dns \
  -d your-domain.com

# 复制证书到项目
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/
cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/
```

---

## 🔧 性能优化

### NAS资源限制

```yaml
# docker-compose.yml中添加资源限制
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 512M

  postgres:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
```

### 数据库优化

```sql
-- 连接PostgreSQL
docker-compose exec postgres psql -U petkeeper

-- 创建索引
CREATE INDEX idx_product_category ON "Product"(categoryId);
CREATE INDEX idx_order_user ON "Order"(userId);
CREATE INDEX idx_order_status ON "Order"(status);

-- 分析查询
EXPLAIN ANALYZE SELECT * FROM "Product" WHERE categoryId = 'xxx';
```

---

## 🔒 安全加固

### 1. 防火墙配置（群晖）

```bash
# 控制面板 → 安全性 → 防火墙
# 只开放必要端口：
# - 80/443 (HTTP/HTTPS)
# - 22 (SSH，仅内网)
# - 其他管理端口仅限内网访问
```

### 2. 定期备份

```bash
# 设置定时任务
crontab -e

# 每天凌晨3点备份
0 3 * * * /volume1/docker/petkeeper/backend/scripts/backup.sh >> /volume1/docker/petkeeper/logs/backup.log 2>&1
```

### 3. 日志轮转

```bash
# 创建logrotate配置
cat > /etc/logrotate.d/petkeeper << 'EOF'
/volume1/docker/petkeeper/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 0644 admin users
}
EOF
```

### 4. 安全更新

```bash
# 定期更新Docker镜像
docker-compose pull
docker-compose up -d
```

---

## 📊 监控和维护

### 查看服务状态

```bash
# 查看所有容器状态
docker-compose ps

# 查看资源使用
docker stats

# 查看日志
docker-compose logs -f --tail=100 backend
```

### 数据库管理

```bash
# 进入PostgreSQL
docker-compose exec postgres psql -U petkeeper

# 查看数据库大小
SELECT pg_size_pretty(pg_database_size('petkeeper'));

# 查看连接数
SELECT count(*) FROM pg_stat_activity;
```

### 清理空间

```bash
# 清理Docker缓存
docker system prune -a

# 清理旧日志
find /volume1/docker/petkeeper/logs -name "*.log" -mtime +7 -delete

# 清理旧备份
find /volume1/docker/petkeeper/backups -name "*.gz" -mtime +30 -delete
```

---

## 🚨 故障排查

### 服务无法启动

```bash
# 检查端口占用
netstat -tunlp | grep -E '3001|5432|6379|80'

# 查看详细错误
docker-compose logs backend

# 重启单个服务
docker-compose restart backend
```

### 内网穿透问题

```bash
# Cloudflared日志
docker logs cloudflared

# frpc日志
docker logs frpc

# 检查网络连通性
docker-compose exec backend ping nginx
```

### 性能问题

```bash
# 查看资源使用
docker stats

# 查看数据库查询
docker-compose exec postgres psql -U petkeeper -c "SELECT * FROM pg_stat_activity;"

# 查看Redis状态
docker-compose exec redis redis-cli info
```

---

## 💰 成本估算

### 硬件成本（一次性）
- NAS设备：2000-5000元（已有）
- 内存升级：300-800元（如需要）
- 硬盘：500-1500元（如需要）

### 软件成本（月费）
- **Cloudflare Tunnel**: 免费 ✅
- **frp**: 免费（需VPS，约50-100元/月）
- **ngrok**: 免费版或$8/月
- **域名**: 50-100元/年

**总计**: 几乎零成本（仅需域名）

---

## 🎯 推荐配置

### 最佳实践（推荐）

1. **内网穿透**: Cloudflare Tunnel（免费、稳定）
2. **域名**: Cloudflare管理（免费HTTPS）
3. **数据库**: PostgreSQL（Docker容器）
4. **缓存**: Redis（Docker容器）
5. **备份**: 本地+云存储双备份

### 完整部署命令

```bash
# 1. SSH连接NAS
ssh admin@your-nas-ip

# 2. 创建项目目录
mkdir -p /volume1/docker/petkeeper
cd /volume1/docker/petkeeper

# 3. 克隆代码
git clone <your-repo-url> backend
cd backend

# 4. 配置环境变量
cp .env.example .env
nano .env  # 修改配置

# 5. 启动服务
docker-compose up -d

# 6. 初始化数据库
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run db:seed

# 7. 配置Cloudflare Tunnel
# 访问 https://one.dash.cloudflare.com/
# 创建tunnel并获取token
docker run -d --name cloudflared --restart unless-stopped \
  --network petkeeper_petkeeper-network \
  cloudflare/cloudflared:latest \
  tunnel --no-autoupdate run --token YOUR_TOKEN

# 8. 验证部署
curl https://your-domain.com/api/health
```

---

## ✅ 部署检查清单

- [ ] NAS Docker环境已安装
- [ ] 项目代码已上传
- [ ] 环境变量已配置
- [ ] Docker服务已启动
- [ ] 数据库已初始化
- [ ] 内网穿透已配置
- [ ] 域名DNS已解析
- [ ] HTTPS证书已配置
- [ ] 防火墙规则已设置
- [ ] 定时备份已配置
- [ ] 监控日志已查看

---

## 🎊 总结

**NAS部署优势**:
- ✅ 成本低（利用现有设备）
- ✅ 数据可控（本地存储）
- ✅ 稳定可靠（企业级NAS）
- ✅ 公网访问（内网穿透）

**推荐方案**:
- **内网穿透**: Cloudflare Tunnel（免费、稳定）
- **域名管理**: Cloudflare（免费HTTPS）
- **数据库**: PostgreSQL容器
- **缓存**: Redis容器

**开始部署**: 只需一台支持Docker的NAS和一个域名，即可零成本实现公网访问！

---

**需要帮助？查看详细文档**:
- `docs/guides/DEPENDENCY_INSTALL_GUIDE.md`
- `DEPLOYMENT.md`
- `docs/guides/START_GUIDE.md`
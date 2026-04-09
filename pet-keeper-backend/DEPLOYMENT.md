# PetKeeper 后端 - 生产环境部署指南

## 🚀 快速部署

### 1. 环境准备

```bash
# 安装Docker和Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 克隆代码
git clone <your-repo-url>
cd pet-keeper-backend
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
vim .env
```

**必须配置的变量**:
```bash
NODE_ENV=production
DATABASE_URL=postgresql://petkeeper:password@postgres:5432/petkeeper
REDIS_URL=redis://redis:6379
JWT_SECRET=your-super-secret-jwt-key-change-this
CORS_ORIGINS=https://yourdomain.com
```

### 3. SSL证书配置

#### 方式一：Let's Encrypt（推荐）

```bash
# 安装certbot
sudo apt install certbot

# 获取证书
sudo certbot certonly --standalone -d yourdomain.com

# 复制证书到项目
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/
```

#### 方式二：自签名证书（测试用）

```bash
# 创建SSL目录
mkdir -p ssl

# 生成自签名证书
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/privkey.pem \
  -out ssl/fullchain.pem
```

### 4. 启动服务

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 查看服务状态
docker-compose ps
```

### 5. 初始化数据库

```bash
# 运行数据库迁移
docker-compose exec backend npx prisma migrate deploy

# 创建管理员账号
docker-compose exec backend npm run db:seed
```

---

## 📊 服务管理

### 常用命令

```bash
# 停止所有服务
docker-compose down

# 重启服务
docker-compose restart

# 查看特定服务日志
docker-compose logs -f backend

# 进入容器
docker-compose exec backend sh

# 更新代码后重新部署
git pull
docker-compose up -d --build
```

### 数据库管理

```bash
# 备份数据库
docker-compose exec postgres pg_dump -U petkeeper petkeeper > backup_$(date +%Y%m%d).sql

# 恢复数据库
cat backup_20240331.sql | docker-compose exec -T postgres psql -U petkeeper petkeeper

# 查看数据库状态
docker-compose exec postgres psql -U petkeeper -d petkeeper -c "SELECT version();"
```

---

## 🔧 性能优化

### 1. 启用Redis缓存

已默认集成，商品列表和详情自动缓存。

### 2. 数据库优化

```sql
-- 添加索引
CREATE INDEX idx_product_category ON "Product"(categoryId);
CREATE INDEX idx_order_user ON "Order"(userId);
CREATE INDEX idx_order_status ON "Order"(status);

-- 分析查询性能
EXPLAIN ANALYZE SELECT * FROM "Product" WHERE categoryId = 'xxx';
```

### 3. Nginx优化

```nginx
# 增加worker进程
worker_processes auto;

# 启用缓存
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;
```

---

## 📈 监控与日志

### 查看日志

```bash
# 应用日志
tail -f logs/combined.log

# 错误日志
tail -f logs/error.log

# Docker日志
docker-compose logs -f --tail=100 backend
```

### 健康检查

```bash
# API健康检查
curl https://yourdomain.com/api/health

# 数据库连接检查
docker-compose exec backend npx prisma db execute --stdin <<< "SELECT 1;"

# Redis连接检查
docker-compose exec redis redis-cli ping
```

---

## 🔒 安全加固

### 1. 防火墙配置

```bash
# 只开放必要端口
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### 2. 定期备份

```bash
# 添加定时任务
crontab -e

# 每天凌晨2点备份
0 2 * * * /app/scripts/backup.sh >> /var/log/backup.log 2>&1
```

### 3. 日志轮转

```bash
# 创建logrotate配置
sudo vim /etc/logrotate.d/petkeeper

/app/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 0644 petkeeper petkeeper
}
```

---

## 🚨 故障排查

### 常见问题

**1. 服务无法启动**
```bash
# 检查端口占用
sudo lsof -i:3001

# 检查Docker日志
docker-compose logs backend
```

**2. 数据库连接失败**
```bash
# 检查PostgreSQL状态
docker-compose ps postgres

# 重启数据库
docker-compose restart postgres
```

**3. 内存不足**
```bash
# 查看容器资源使用
docker stats

# 增加Docker内存限制
# 在docker-compose.yml中添加
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 1G
```

---

## 📦 升级部署

```bash
# 1. 备份数据
./scripts/backup.sh

# 2. 拉取最新代码
git pull origin main

# 3. 重新构建
docker-compose build

# 4. 运行数据库迁移
docker-compose run --rm backend npx prisma migrate deploy

# 5. 重启服务
docker-compose up -d

# 6. 检查服务状态
docker-compose ps
docker-compose logs -f --tail=100
```

---

## 🔗 相关链接

- API文档: https://yourdomain.com/api/docs
- 健康检查: https://yourdomain.com/api/health
- 监控面板: https://yourdomain.com:3000 (可选配置)

---

**部署完成后记得修改默认密码！**
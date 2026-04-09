# PetKeeper 部署方案对比

---

## 📊 部署方案对比表

| 方案 | 成本 | 难度 | 稳定性 | 性能 | 安全性 | 推荐度 |
|------|------|------|--------|------|--------|--------|
| **NAS + Cloudflare Tunnel** | 免费 | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| NAS + frp | VPS费用 | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 云服务器 | 100-300元/月 | ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| VPS | 50-100元/月 | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 🎯 推荐方案：NAS + Cloudflare Tunnel

### 为什么推荐？

**成本优势**:
- ✅ 完全免费（仅需域名）
- ✅ 无需公网IP
- ✅ 无需VPS服务器

**技术优势**:
- ✅ 稳定性高（Cloudflare全球节点）
- ✅ 自带HTTPS（无需证书管理）
- ✅ 隐藏真实IP（安全性高）
- ✅ CDN加速（访问速度快）
- ✅ DDoS防护（免费基础防护）

**运维优势**:
- ✅ 数据本地存储（隐私保护）
- ✅ 简单易用（Docker一键部署）
- ✅ 低功耗（NAS全天运行）

---

## 🔧 快速部署脚本

### 一键部署到NAS

```bash
#!/bin/bash

# PetKeeper NAS一键部署脚本
# 适用于群晖、威联通等支持Docker的NAS

set -e

echo "🚀 PetKeeper NAS部署脚本"
echo "========================"

# 配置变量
PROJECT_DIR="/volume1/docker/petkeeper"
DOMAIN="your-domain.com"  # 修改为你的域名
CLOUDFLARE_TOKEN="your-token"  # 修改为你的Cloudflare Tunnel Token

# 1. 创建目录
echo "📁 创建项目目录..."
mkdir -p $PROJECT_DIR/{backend,postgres,redis,uploads,logs,backups}
cd $PROJECT_DIR/backend

# 2. 克隆代码
echo "📥 克隆项目代码..."
git clone https://github.com/your-repo/pet-keeper-backend.git .

# 3. 配置环境变量
echo "⚙️  配置环境变量..."
cat > .env << EOF
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://petkeeper:password@postgres:5432/petkeeper
REDIS_URL=redis://redis:6379
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=30d
FRONTEND_URL=https://$DOMAIN
CORS_ORIGINS=https://$DOMAIN
LOG_LEVEL=info
EOF

# 4. 启动Docker服务
echo "🐳 启动Docker服务..."
docker-compose up -d

# 5. 等待服务就绪
echo "⏳ 等待服务启动..."
sleep 30

# 6. 初始化数据库
echo "📊 初始化数据库..."
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run db:seed

# 7. 启动Cloudflare Tunnel
echo "🌐 配置公网访问..."
docker run -d \
  --name cloudflared \
  --restart unless-stopped \
  --network petkeeper_petkeeper-network \
  cloudflare/cloudflared:latest \
  tunnel --no-autoupdate run --token $CLOUDFLARE_TOKEN

# 8. 验证部署
echo "✅ 验证部署..."
sleep 10
curl -f https://$DOMAIN/api/health || echo "❌ 部署失败，请检查日志"

echo ""
echo "🎉 部署完成！"
echo "访问地址: https://$DOMAIN"
echo "管理后台: https://$DOMAIN/admin"
echo ""
echo "默认管理员账号:"
echo "  邮箱: admin@test.com"
echo "  密码: admin123"
echo ""
echo "⚠️  请立即修改管理员密码！"
```

---

## 📝 详细步骤

### 1. 准备工作

#### 购买域名
- 推荐：Cloudflare、阿里云、腾讯云
- 价格：.com域名约50-100元/年

#### 配置DNS
```bash
# 登录Cloudflare Dashboard
# 添加域名
# 修改NS记录为Cloudflare提供的NS服务器
```

#### 安装Docker
```bash
# 群晖：套件中心 → Docker
# 威联通：Container Station
# 铁威马：TOS应用中心 → Docker
```

---

### 2. 部署后端

```bash
# SSH连接NAS
ssh admin@nas-ip

# 创建项目目录
mkdir -p /volume1/docker/petkeeper
cd /volume1/docker/petkeeper

# 上传项目文件（方式一：Git）
git clone <your-repo> backend

# 或上传压缩包（方式二）
scp petkeeper-backend.tar.gz admin@nas-ip:/volume1/docker/petkeeper/
tar -xzf petkeeper-backend.tar.gz
mv pet-keeper-backend backend

# 配置环境变量
cd backend
nano .env
# 粘贴配置内容，保存退出

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

---

### 3. 配置内网穿透

#### Cloudflare Tunnel配置

**步骤**:
1. 访问 https://one.dash.cloudflare.com/
2. 选择你的账户 → Networks → Tunnels
3. 点击"Create a tunnel"
4. 输入Tunnel名称（如：petkeeper）
5. 选择"Cloudflared"安装方式
6. 复制生成的Token

**启动Tunnel**:
```bash
# 在NAS上执行
docker run -d \
  --name cloudflared \
  --restart unless-stopped \
  --network petkeeper_petkeeper-network \
  cloudflare/cloudflared:latest \
  tunnel --no-autoupdate run --token YOUR_TOKEN
```

**配置域名路由**:
```
# 在Cloudflare Tunnel配置中：
Public Hostname: your-domain.com
Service: http://nginx:80
```

---

### 4. 部署前端

```bash
# 本地构建前端
cd pet-keeper
npm install
npm run build

# 上传到NAS
scp -r out/ admin@nas-ip:/volume1/docker/petkeeper/frontend/

# 配置Nginx（已包含在后端docker-compose.yml中）
```

---

## 🔄 备份策略

### 自动备份脚本

```bash
#!/bin/bash
# /volume1/docker/petkeeper/backup.sh

BACKUP_DIR="/volume1/docker/petkeeper/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# 数据库备份
docker-compose exec -T postgres pg_dump -U petkeeper petkeeper > $BACKUP_DIR/db_$DATE.sql

# 压缩
gzip $BACKUP_DIR/db_$DATE.sql

# 上传到云存储（可选）
# aws s3 cp $BACKUP_DIR/db_$DATE.sql.gz s3://your-bucket/backups/

# 清理30天前的备份
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete

echo "Backup completed: db_$DATE.sql.gz"
```

### 设置定时任务

```bash
# 编辑crontab
crontab -e

# 每天凌晨3点备份
0 3 * * * /volume1/docker/petkeeper/backup.sh >> /volume1/docker/petkeeper/logs/backup.log 2>&1
```

---

## 🔐 安全建议

### 必须修改的配置

```bash
# 1. 修改JWT密钥
JWT_SECRET=$(openssl rand -base64 32)

# 2. 修改数据库密码
DATABASE_URL=postgresql://petkeeper:STRONG_PASSWORD@postgres:5432/petkeeper

# 3. 修改管理员密码
# 首次登录后立即修改

# 4. 配置防火墙
# 只开放80/443端口，其他端口仅内网访问

# 5. 启用HTTPS
# Cloudflare自动提供，无需配置
```

### 防火墙规则

```bash
# 群晖防火墙配置
# 控制面板 → 安全性 → 防火墙

# 规则：
# 允许：所有 → 80/443 (HTTP/HTTPS)
# 允许：内网IP → 所有端口
# 拒绝：其他 → 所有端口
```

---

## 📊 性能监控

### 监控脚本

```bash
#!/bin/bash
# /volume1/docker/petkeeper/monitor.sh

echo "=== PetKeeper Status ==="
echo ""

# 检查服务状态
docker-compose ps

echo ""
echo "=== Resource Usage ==="
docker stats --no-stream

echo ""
echo "=== Database Size ==="
docker-compose exec postgres psql -U petkeeper -c "SELECT pg_size_pretty(pg_database_size('petkeeper'));"

echo ""
echo "=== Recent Errors ==="
docker-compose logs --tail=20 backend | grep -i error
```

---

## 🎯 成本分析

### NAS部署成本

| 项目 | 成本 | 说明 |
|------|------|------|
| NAS设备 | 0元 | 已有设备 |
| 域名 | 50-100元/年 | .com域名 |
| Cloudflare | 0元 | 免费套餐 |
| SSL证书 | 0元 | Cloudflare提供 |
| 内网穿透 | 0元 | Cloudflare Tunnel免费 |
| **总计** | **50-100元/年** | 仅域名费用 |

### 对比云服务器

| 方案 | 月费用 | 年费用 | 说明 |
|------|--------|--------|------|
| **NAS部署** | 0元 | 50-100元 | 仅域名 |
| 云服务器 | 100-300元 | 1200-3600元 | 2核4G配置 |
| VPS | 50-100元 | 600-1200元 | 1核1G配置 |

**节省**: NAS部署每年可节省600-3500元！

---

## ✅ 部署验证

### 检查清单

```bash
# 1. 服务状态
docker-compose ps

# 2. 健康检查
curl https://your-domain.com/api/health

# 3. 数据库连接
docker-compose exec backend npx prisma db execute --stdin <<< "SELECT 1;"

# 4. Redis连接
docker-compose exec redis redis-cli ping

# 5. 公网访问
curl -I https://your-domain.com

# 6. HTTPS证书
curl -vI https://your-domain.com 2>&1 | grep "SSL certificate"
```

---

## 🎊 总结

**NAS + Cloudflare Tunnel方案**:
- ✅ **成本最低**: 仅需域名费用
- ✅ **最安全**: 隐藏真实IP，自带DDoS防护
- ✅ **最简单**: 无需配置SSL证书
- ✅ **最稳定**: Cloudflare全球CDN加速
- ✅ **最灵活**: 数据本地存储，完全可控

**立即开始**: 准备好域名后，按照 `docs/guides/NAS_DEPLOYMENT_GUIDE.md` 一步步操作即可！

---

**需要帮助？** 查看详细文档：
- `docs/guides/NAS_DEPLOYMENT_GUIDE.md` - NAS部署完整指南
- `DEPLOYMENT.md` - 生产环境部署文档
- `docs/guides/START_GUIDE.md` - 快速开始指南
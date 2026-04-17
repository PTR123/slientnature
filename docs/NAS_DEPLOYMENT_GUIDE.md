# NAS生产环境部署完整指南

## 📋 部署概览

本指南将帮助你将PetKeeper项目部署到NAS生产环境,包括:
- 后端API服务 (Node.js + Express)
- 前端Web应用 (Next.js)
- PostgreSQL数据库
- Redis缓存
- Nginx反向代理

---

## 🔧 前置准备

### 1. NAS要求检查
```bash
# SSH登录到NAS
ssh admin@your-nas-ip

# 检查Docker是否安装
docker --version
docker-compose --version

# 如果未安装Docker,请先安装:
# 群晖NAS: 通过套件中心安装Docker
# 威联通NAS: 通过App Center安装Container Station
```

### 2. 创建项目目录
```bash
# 创建项目目录(群晖默认路径)
mkdir -p /volume1/projects/petkeeper
cd /volume1/projects/petkeeper
```

---

## 📦 部署步骤

### Step 1: 克隆代码到NAS

**方案A: 从GitHub克隆(推荐)**
```bash
git clone https://github.com/your-username/petkeeper.git .
```

**方案B: 从本地复制**
```bash
# 在本地机器执行:
scp -r /Users/mac/zrby/* admin@your-nas-ip:/volume1/projects/petkeeper/
```

---

### Step 2: 配置环境变量

```bash
# SSH登录到NAS
cd /volume1/projects/petkeeper

# .env文件已自动生成,检查配置
cat .env

# 如果需要修改域名,编辑.env文件:
vim .env
# 修改以下两个变量:
# API_URL=https://api.yourdomain.com
# FRONTEND_URL=https://www.yourdomain.com
```

---

### Step 3: 准备SSL证书

**方案A: 使用现有域名申请Let's Encrypt证书**
```bash
# 1. DNS必须先配置并生效(详见docs/DNS_AND_TUNNEL_GUIDE.md)

# 2. 安装certbot(NAS可能需要手动安装)
# 群晖NAS:
sudo apt-get install certbot

# 3. 申请证书
sudo certbot certonly --standalone \
  -d api.yourdomain.com \
  -d www.yourdomain.com

# 4. 复制证书
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem
sudo chmod 644 nginx/ssl/*.pem
```

**方案B: 使用Cloudflare Tunnel(无需SSL证书配置)**
```bash
# Cloudflare Tunnel会自动处理SSL证书
# 详见docs/DNS_AND_TUNNEL_GUIDE.md第2部分
```

**方案C: 使用自签名证书(仅测试)**
```bash
# 已在本地生成,证书位于:
nginx/ssl/cert.pem
nginx/ssl/key.pem
```

---

### Step 4: 启动服务

```bash
# SSH登录到NAS
cd /volume1/projects/petkeeper

# 构建并启动所有服务(首次部署需要5-10分钟)
docker-compose up -d --build

# 查看启动日志
docker-compose logs -f

# 检查服务状态
docker-compose ps
```

**预期输出**:
```
NAME                STATUS              PORTS
ziranbuyu-db        running (healthy)   5432/tcp
ziranbuyu-redis     running (healthy)   6379/tcp
ziranbuyu-api       running (healthy)   0.0.0.0:3001->3001/tcp
ziranbuyu-web       running             0.0.0.0:3000->3000/tcp
ziranbuyu-nginx     running             0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
```

---

### Step 5: 初始化数据库

```bash
# 等待数据库启动(约30秒)
docker-compose exec postgres pg_isready -U ziranbuyu

# 运行数据库迁移
docker-compose exec backend npx prisma migrate deploy

# 运行种子数据(可选)
docker-compose exec backend npm run db:seed

# 查看数据库状态
docker-compose exec postgres psql -U ziranbuyu -c "\dt"
```

---

### Step 6: 健康检查

```bash
# 检查API健康状态
curl http://localhost:3001/api/health

# 预期返回:
# {"status":"ok","timestamp":"2026-04-16T..."}

# 检查前端访问
curl http://localhost:3000

# 检查所有容器健康状态
docker inspect --format='{{.State.Health.Status}}' ziranbuyu-api
docker inspect --format='{{.State.Health.Status}}' ziranbuyu-db
docker inspect --format='{{.State.Health.Status}}' ziranbuyu-redis
```

---

## 🌐 配置外网访问

### 方案A: Cloudflare Tunnel(推荐,无公网IP适用)

```bash
# 1. 在NAS上安装cloudflared
docker run -it --rm \
  -v ~/.cloudflared:/etc/cloudflared \
  cloudflare/cloudflared:latest \
  tunnel login

# 2. 创建tunnel
docker run -it --rm \
  -v ~/.cloudflared:/etc/cloudflared \
  cloudflare/cloudflared:latest \
  tunnel create petkeeper

# 3. 记录Tunnel ID
cat ~/.cloudflared/cert.pem
# 找到Tunnel ID,例如: 6ff42ae2-765d-4adf-8944-...

# 4. 配置路由(自动配置DNS)
docker run -it --rm \
  -v ~/.cloudflared:/etc/cloudflared \
  cloudflare/cloudflared:latest \
  tunnel route dns petkeeper api.yourdomain.com

docker run -it --rm \
  -v ~/.cloudflared:/etc/cloudflared \
  cloudflare/cloudflared:latest \
  tunnel route dns petkeeper www.yourdomain.com

# 5. 创建配置文件
mkdir -p ~/.cloudflared
vim ~/.cloudflared/config.yml
```

**config.yml内容**:
```yaml
tunnel: <your-tunnel-id>
credentials-file: /etc/cloudflared/<tunnel-id>.json

ingress:
  - hostname: api.yourdomain.com
    service: http://localhost:3001
  - hostname: www.yourdomain.com
    service: http://localhost:3000
  - service: http_status:404
```

```bash
# 6. 启动tunnel
docker run -d \
  --name cloudflared \
  --restart always \
  --network host \
  -v ~/.cloudflared:/etc/cloudflared:ro \
  cloudflare/cloudflared:latest \
  tunnel run petkeeper

# 7. 验证tunnel状态
docker logs cloudflared
```

---

### 方案B: 公网IP + DNS配置

```bash
# 1. 查看NAS公网IP
curl ifconfig.me

# 2. 在域名DNS管理面板添加A记录:
#    api.yourdomain.com -> NAS公网IP
#    www.yourdomain.com -> NAS公网IP

# 3. 配置路由器端口转发(如果NAS在内网):
#    外网端口80/443 -> NAS内网IP:80/443

# 4. 申请SSL证书(参考Step 3)

# 5. 测试访问
curl https://api.yourdomain.com/api/health
curl https://www.yourdomain.com
```

---

## ✅ 验证部署成功

### 1. API测试
```bash
curl https://api.yourdomain.com/api/health
curl https://api.yourdomain.com/api/products
```

### 2. Web前端测试
```bash
# 浏览器访问:
https://www.yourdomain.com

# 应该看到首页正常显示
```

### 3. 数据库测试
```bash
# 登录数据库
docker-compose exec postgres psql -U ziranbuyu

# 查看表结构
\dt

# 查看种子数据
SELECT * FROM "Species" LIMIT 5;
SELECT * FROM "ProductCategory";
SELECT * FROM "Product" LIMIT 5;

# 退出
\q
```

### 4. 日志检查
```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs backend
docker-compose logs web
docker-compose logs nginx
```

---

## 🔧 运维管理

### 服务管理
```bash
# 启动服务
docker-compose start

# 停止服务
docker-compose stop

# 重启服务
docker-compose restart

# 重启特定服务
docker-compose restart backend

# 查看服务状态
docker-compose ps

# 查看资源使用
docker stats
```

### 数据库管理
```bash
# 连接数据库
docker-compose exec postgres psql -U ziranbuyu

# 备份数据库
docker-compose exec postgres pg_dump -U ziranbuyu > backup_$(date +%Y%m%d).sql

# 恢复数据库
cat backup.sql | docker-compose exec -T postgres psql -U ziranbuyu

# 清理数据库(谨慎!)
docker-compose exec backend npx prisma migrate reset
```

### 日志管理
```bash
# 实时查看日志
docker-compose logs -f backend

# 查看最近100行
docker-compose logs --tail=100 backend

# 清理日志
docker-compose exec backend rm -rf logs/*
```

### 更新部署
```bash
# 1. 拉取最新代码
git pull origin main

# 2. 重新构建并启动
docker-compose up -d --build

# 3. 运行数据库迁移(如果有)
docker-compose exec backend npx prisma migrate deploy

# 4. 查看日志确认
docker-compose logs -f
```

---

## 🆘 故障排查

### 问题1: 服务无法启动
```bash
# 查看详细日志
docker-compose logs backend

# 检查端口占用
netstat -tunlp | grep -E '(3000|3001|5432|6379)'

# 检查容器状态
docker-compose ps

# 重启docker服务
systemctl restart docker
```

### 问题2: 数据库连接失败
```bash
# 检查数据库是否运行
docker-compose exec postgres pg_isready

# 检查数据库密码
cat .env | grep DB_PASSWORD

# 测试连接
docker-compose exec backend ping postgres

# 重启数据库
docker-compose restart postgres
```

### 问题3: 前端无法访问API
```bash
# 检查nginx配置
docker-compose exec nginx cat /etc/nginx/nginx.conf

# 测试nginx代理
curl -I http://localhost/api/health

# 检查防火墙
iptables -L | grep 443
```

### 问题4: Cloudflare Tunnel不工作
```bash
# 查看tunnel日志
docker logs cloudflared

# 检查配置
cat ~/.cloudflared/config.yml

# 重启tunnel
docker restart cloudflared

# 测试DNS解析
nslookup api.yourdomain.com
```

---

## 📊 性能监控

### 启用Portainer管理界面
```bash
# Portainer已在docker-compose.yml中配置
# 访问: http://your-nas-ip:9000

# 首次登录设置密码
# 选择Local Docker环境
```

### 资源监控
```bash
# 实时监控
docker stats

# 查看容器资源限制
docker inspect ziranbuyu-api | grep -A 10 "Memory"

# 查看磁盘使用
df -h /volume1
```

---

## 🎉 完成!

你的PetKeeper应用已成功部署到NAS生产环境!

**访问地址**:
- API: https://api.yourdomain.com
- Web: https://www.yourdomain.com
- Portainer管理: http://your-nas-ip:9000

**下一步**:
1. 测试所有功能是否正常
2. 配置定期备份脚本
3. 设置日志监控
4. 配置自动更新(GitHub Actions)

---

## 💡 建议

1. **定期备份**: 每周备份一次数据库
2. **日志监控**: 定期检查错误日志
3. **SSL证书续期**: Let's Encrypt证书90天过期,配置自动续期
4. **性能优化**: 根据实际使用调整Docker资源限制
5. **安全加固**: 定期更新系统和Docker镜像

---

**需要帮助?**
- 查看 docs/DNS_AND_TUNNEL_GUIDE.md 了解DNS和内网穿透配置
- 查看 DEPLOYMENT.md 了解更多部署细节
- 查看项目GitHub仓库提交Issue
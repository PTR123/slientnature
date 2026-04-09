# PetKeeper 分阶段部署方案（无需域名）

生成时间: 2026-04-02

---

## 🎯 部署策略

### 阶段一：NAS部署（内网访问）
**无需域名，立即可用**
- ✅ NAS内网访问（192.168.x.x）
- ✅ 完整功能体验
- ✅ 测试和开发环境

### 阶段二：公网访问（后期添加）
**有域名后升级**
- ✅ 购买域名
- ✅ 配置内网穿透
- ✅ HTTPS支持

---

## 📋 阶段一：NAS部署（无域名版）

### 第一步：部署到NAS

#### 1. SSH连接NAS

```bash
# 群晖示例
ssh admin@192.168.1.100  # 替换为你的NAS IP
```

#### 2. 创建项目目录

```bash
# 创建目录结构
mkdir -p /volume1/docker/petkeeper/{backend,postgres,redis,uploads,logs,backups}
cd /volume1/docker/petkeeper/backend
```

#### 3. 上传项目文件

**方式一：Git Clone（推荐）**

```bash
git clone <your-repo-url> .
```

**方式二：上传压缩包**

```bash
# 本地打包
tar -czf petkeeper.tar.gz pet-keeper-backend/

# 上传到NAS（在本地电脑执行）
scp petkeeper.tar.gz admin@192.168.1.100:/volume1/docker/petkeeper/backend/

# SSH到NAS解压
ssh admin@192.168.1.100
cd /volume1/docker/petkeeper/backend
tar -xzf petkeeper.tar.gz
```

---

#### 4. 配置环境变量（内网版）

```bash
# 创建环境变量文件
cd /volume1/docker/petkeeper/backend
nano .env
```

**内网配置（无需域名）**:

```bash
# 服务器配置
NODE_ENV=production
PORT=3001

# 数据库配置
DATABASE_URL=postgresql://petkeeper:PetKeeper2024@postgres:5432/petkeeper

# Redis配置
REDIS_URL=redis://redis:6379

# JWT配置（生成随机密钥）
JWT_SECRET=your-random-secret-key-change-this-later
JWT_EXPIRES_IN=30d

# CORS配置（内网IP）
FRONTEND_URL=http://192.168.1.100:3003
CORS_ORIGINS=http://192.168.1.100:3003,http://localhost:3003

# 日志配置
LOG_LEVEL=info

# 文件上传配置
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

**生成JWT密钥**:

```bash
# 生成随机密钥
openssl rand -base64 32
# 或
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

#### 5. 修改Nginx配置（内网版）

创建简化的nginx配置：

```bash
nano nginx-internal.conf
```

```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:3001;
    }

    # HTTP服务器（内网访问）
    server {
        listen 80;
        server_name _;  # 接受所有IP访问

        # Gzip压缩
        gzip on;
        gzip_vary on;
        gzip_types text/plain text/css application/json application/javascript;

        # API代理
        location /api/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_cache_bypass $http_upgrade;
        }

        # 上传文件访问
        location /uploads/ {
            alias /app/uploads/;
            expires 30d;
        }

        # 健康检查
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

---

#### 6. 启动服务

```bash
# 确保在项目目录
cd /volume1/docker/petkeeper/backend

# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f backend
```

**预期输出**:
```
NAME                COMMAND                  SERVICE             STATUS              PORTS
petkeeper-backend   "npm start"              backend             running             0.0.0.0:3001->3001/tcp
petkeeper-postgres  "docker-entrypoint.s…"   postgres            running             0.0.0.0:5432->5432/tcp
petkeeper-redis     "docker-entrypoint.s…"   redis               running             0.0.0.0:6379->6379/tcp
petkeeper-nginx     "nginx -g 'daemon of…"   nginx               running             0.0.0.0:80->80/tcp
```

---

#### 7. 初始化数据库

```bash
# 运行数据库迁移
docker-compose exec backend npx prisma migrate deploy

# 创建测试数据（可选）
docker-compose exec backend npm run db:seed
```

---

### 第二步：验证部署

#### 1. 检查服务健康

```bash
# SSH在NAS上测试
curl http://localhost:3001/api/health

# 预期返回
{
  "status": "ok",
  "timestamp": "2026-04-02T...",
  "uptime": 123.456
}
```

#### 2. 内网访问测试

**在同一局域网的电脑上**:

```bash
# 测试API
curl http://192.168.1.100:3001/api/health

# 测试商品列表
curl http://192.168.1.100:3001/api/products

# 测试前端
# 浏览器访问：http://192.168.1.100:3003
```

---

### 第三步：部署前端（可选）

#### 方式一：单独部署前端

```bash
# 本地构建
cd pet-keeper
npm install
npm run build

# 上传到NAS
scp -r out/ admin@192.168.1.100:/volume1/docker/petkeeper/frontend/

# 使用Nginx托管静态文件
# 修改nginx配置添加：
location / {
    root /var/www/frontend;
    try_files $uri $uri/ /index.html;
}
```

#### 方式二：Next.js独立部署

```bash
# 在NAS上
cd /volume1/docker/petkeeper
git clone <frontend-repo> frontend
cd frontend

# 构建和启动
npm install
npm run build
npm start
```

---

## 🔧 内网访问地址

部署完成后，局域网内可通过以下地址访问：

### API地址
```
http://192.168.1.100:3001/api
```

### 前端地址
```
http://192.168.1.100:3003
```

### 管理后台
```
http://192.168.1.100:3003/admin
```

### 默认账号
```
邮箱: admin@test.com
密码: admin123
```

---

## 📊 阶段一总结

### ✅ 已完成
- [x] NAS Docker环境搭建
- [x] 后端服务部署
- [x] PostgreSQL数据库部署
- [x] Redis缓存部署
- [x] Nginx反向代理
- [x] 数据库初始化
- [x] 内网访问测试

### 🎯 当前状态
- **访问方式**: 内网IP访问
- **公网访问**: 暂不可用
- **HTTPS**: 暂未配置
- **功能**: 完整可用

---

## 🚀 阶段二：添加域名和公网访问

**当准备好域名后执行此步骤**

---

### 第一步：购买域名

#### 推荐域名注册商

| 注册商 | 价格 | 优势 | 推荐度 |
|--------|------|------|--------|
| **Cloudflare** | $9.77/年 | 免费隐私保护 | ⭐⭐⭐⭐⭐ |
| 阿里云 | 55元/年 | 国内访问快 | ⭐⭐⭐⭐ |
| 腾讯云 | 55元/年 | 国内访问快 | ⭐⭐⭐⭐ |
| Namesilo | $8.99/年 | 便宜稳定 | ⭐⭐⭐⭐ |

#### 推荐域名
- `.com` - 国际通用，55-70元/年
- `.net` - 网络相关，60-80元/年
- `.cn` - 中国域名，29-39元/年

---

### 第二步：配置Cloudflare

#### 1. 添加域名到Cloudflare

```bash
# 访问 https://dash.cloudflare.com/
# 点击"Add a site"
# 输入你的域名
# 选择"Free"免费计划
```

#### 2. 修改NS记录

```bash
# Cloudflare会提供两个NS服务器
# 例如：
# dana.ns.cloudflare.com
# greg.ns.cloudflare.com

# 登录域名注册商后台
# 修改域名的NS记录为Cloudflare提供的NS
# 等待生效（通常1-24小时）
```

---

### 第三步：配置内网穿透

#### 方案一：Cloudflare Tunnel（推荐）

**1. 创建Tunnel**

```bash
# 访问 https://one.dash.cloudflare.com/
# 选择你的账户 → Networks → Tunnels
# 点击"Create a tunnel"
```

**2. 配置Tunnel**

```bash
# Tunnel名称: petkeeper
# 选择安装方式: Cloudflared
# 复制生成的Token
```

**3. 在NAS上启动Tunnel**

```bash
# SSH连接NAS
ssh admin@192.168.1.100

# 启动Cloudflared容器
docker run -d \
  --name cloudflared \
  --restart unless-stopped \
  --network petkeeper_petkeeper-network \
  cloudflare/cloudflared:latest \
  tunnel --no-autoupdate run --token YOUR_TUNNEL_TOKEN
```

**4. 配置Public Hostname**

```bash
# 在Cloudflare Tunnel配置中：
# Subdomain: (留空或www)
# Domain: your-domain.com
# Type: HTTP
# URL: nginx:80
```

---

#### 方案二：frp（自建服务器）

**1. 准备VPS服务器**
- 推荐：腾讯云轻量服务器（50元/月）
- 或AWS Free Tier（免费12个月）

**2. 配置frps（VPS端）**

```bash
# 在VPS上
wget https://github.com/fatedier/frp/releases/download/v0.52.3/frp_0.52.3_linux_amd64.tar.gz
tar -xzf frp_0.52.3_linux_amd64.tar.gz
cd frp_0.52.3_linux_amd64

# 配置frps.ini
cat > frps.ini << EOF
[common]
bind_port = 7000
vhost_http_port = 80
EOF

# 启动服务
./frps -c frps.ini
```

**3. 配置frpc（NAS端）**

```bash
# 在NAS上创建frpc.ini
cat > /volume1/docker/petkeeper/frpc.ini << EOF
[common]
server_addr = your-vps-ip
server_port = 7000

[petkeeper]
type = http
local_ip = nginx
local_port = 80
custom_domains = your-domain.com
EOF

# 添加到docker-compose.yml
# services:
#   frpc:
#     image: snowdreamtech/frpc:latest
#     volumes:
#       - ../frpc.ini:/etc/frp/frpc.ini
#     restart: unless-stopped
#     networks:
#       - petkeeper-network

# 重启服务
docker-compose up -d frpc
```

---

### 第四步：配置HTTPS

#### Cloudflare自动提供HTTPS

**无需额外配置！** Cloudflare自动为你的域名提供免费的SSL证书。

访问 `https://your-domain.com` 会自动启用HTTPS。

---

### 第五步：更新环境变量

```bash
# 编辑.env文件
nano /volume1/docker/petkeeper/backend/.env

# 修改为：
FRONTEND_URL=https://your-domain.com
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com

# 重启服务
docker-compose restart backend
```

---

### 第六步：验证公网访问

#### 1. DNS解析检查

```bash
# 检查域名解析
nslookup your-domain.com

# 预期返回Cloudflare的IP
```

#### 2. 访问测试

```bash
# 测试HTTP访问
curl http://your-domain.com/api/health

# 测试HTTPS访问
curl https://your-domain.com/api/health

# 浏览器访问
https://your-domain.com
```

---

## 📊 阶段二总结

### ✅ 已完成
- [x] 购买域名
- [x] 配置Cloudflare DNS
- [x] 设置内网穿透
- [x] 自动HTTPS
- [x] 公网访问测试

### 🎯 最终状态
- **访问方式**: 公网域名访问
- **HTTPS**: ✅ 已启用
- **安全性**: ✅ 隐藏真实IP
- **功能**: ✅ 完整可用

---

## 🔄 迁移指南（从内网到公网）

### 修改配置文件

```bash
# 1. 修改.env
FRONTEND_URL=https://your-domain.com
CORS_ORIGINS=https://your-domain.com

# 2. 修改nginx配置
# 添加HTTPS重定向（可选）

# 3. 重启服务
docker-compose restart
```

### 数据迁移

**无需迁移！** 所有数据都在NAS本地，直接升级即可。

---

## 💰 成本对比

### 方案对比

| 阶段 | 成本 | 功能 | 访问方式 |
|------|------|------|----------|
| **阶段一** | 0元 | 完整 | 内网IP |
| **阶段二** | 50-70元/年 | 完整 | 公网域名 |

### 总成本

- **部署成本**: 0元（使用现有NAS）
- **域名成本**: 50-70元/年（.com域名）
- **内网穿透**: 0元（Cloudflare Tunnel免费）
- **SSL证书**: 0元（Cloudflare免费提供）
- **年总成本**: **50-70元/年**

---

## ✅ 完整部署时间线

### 阶段一（无域名）: 1-2小时
- [ ] NAS环境准备（30分钟）
- [ ] 项目部署（30分钟）
- [ ] 数据库初始化（15分钟）
- [ ] 功能测试（15分钟）

### 阶段二（有域名后）: 30分钟
- [ ] 购买域名（10分钟）
- [ ] Cloudflare配置（10分钟）
- [ ] 内网穿透配置（10分钟）

---

## 🎊 总结

### 立即可做（无域名）
- ✅ 完整部署到NAS
- ✅ 内网完整访问
- ✅ 所有功能可用
- ✅ 测试和开发

### 后续升级（有域名）
- ✅ 购买域名
- ✅ 配置公网访问
- ✅ 启用HTTPS
- ✅ 对外提供服务

**建议**: 先部署阶段一测试功能，等确定要对外服务时再购买域名升级到阶段二！

---

## 📞 需要帮助？

查看详细文档：
- `docs/guides/NAS_DEPLOYMENT_GUIDE.md` - NAS部署完整指南
- `docs/guides/DEPENDENCY_INSTALL_GUIDE.md` - 依赖安装指南
- `DEPLOYMENT.md` - 生产环境部署文档

---

**现在就可以开始部署了！无需等待域名！** 🚀
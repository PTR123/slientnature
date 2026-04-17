# DNS配置和内网穿透指南

## 1. DNS配置步骤

### 前提条件
- 拥有一个域名(例如从阿里云、腾讯云、Cloudflare购买)
- NAS设备已连接到互联网并获得公网IP(或需要内网穿透)

### 配置步骤

#### 方案A: NAS有公网IP
```bash
# 1. 登录域名DNS管理面板
# 2. 添加两条A记录:
#    - api.yourdomain.com -> NAS公网IP
#    - www.yourdomain.com -> NAS公网IP
# 3. 等待DNS生效(通常5-30分钟)
```

#### 方案B: NAS无公网IP(需要内网穿透)
使用Cloudflare Tunnel或其他内网穿透工具,详见第2部分。

---

## 2. 内网穿透方案

### 方案A: Cloudflare Tunnel(推荐)

**优点**:
- 免费,无需公网IP
- 自动SSL证书
- 安全稳定
- 配置简单

**步骤**:
```bash
# 1. 在NAS上安装cloudflared
docker run -it cloudflare/cloudflared:latest tunnel login

# 2. 创建tunnel
docker run -it cloudflare/cloudflared:latest tunnel create petkeeper

# 3. 配置路由(会自动配置DNS)
# API域名
docker run -it cloudflare/cloudflared:latest tunnel route dns petkeeper api.yourdomain.com
# Web域名
docker run -it cloudflare/cloudflared:latest tunnel route dns petkeeper www.yourdomain.com

# 4. 创建配置文件 ~/.cloudflared/config.yml
tunnel: petkeeper
credentials-file: ~/.cloudflared/<tunnel-id>.json

ingress:
  - hostname: api.yourdomain.com
    service: http://localhost:3001
  - hostname: www.yourdomain.com
    service: http://localhost:3000
  - service: http_status:404

# 5. 启动tunnel
docker run -d \
  --name cloudflared \
  --restart always \
  -v ~/.cloudflared:/etc/cloudflared:ro \
  cloudflare/cloudflared:latest \
  tunnel run petkeeper
```

### 方案B: frp内网穿透

**前提**: 需要一台有公网IP的服务器(可以是便宜的VPS)

**服务端配置**(公网服务器):
```ini
# frps.ini
[common]
bind_port = 7000
dashboard_port = 7500
dashboard_user = admin
dashboard_pwd = admin
token = your_token_here
```

**客户端配置**(NAS):
```ini
# frpc.ini
[common]
server_addr = your-server-ip
server_port = 7000
token = your_token_here

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

**DNS配置**:
- api.yourdomain.com -> 公网服务器IP
- www.yourdomain.com -> 公网服务器IP

---

## 3. Let's Encrypt SSL证书申请

**前提**: DNS已配置并生效

```bash
# 1. 安装certbot
sudo apt-get install certbot

# 2. 申请证书(需要停止nginx临时占用80端口)
docker-compose stop nginx
sudo certbot certonly --standalone -d api.yourdomain.com -d www.yourdomain.com
docker-compose start nginx

# 3. 复制证书到项目
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem

# 4. 设置自动续期
sudo certbot renew --dry-run
```

---

## 4. 完整部署流程

```bash
# 1. SSH登录到NAS
ssh admin@your-nas-ip

# 2. 克隆代码
mkdir -p /volume1/projects/petkeeper
cd /volume1/projects/petkeeper
git clone https://github.com/your-repo/petkeeper.git .

# 3. 配置环境变量
cp .env.example .env
vim .env  # 修改API_URL和FRONTEND_URL为你的域名

# 4. 启动服务
docker-compose up -d

# 5. 检查服务状态
docker-compose ps
docker-compose logs -f

# 6. 配置内网穿透(选择方案A或B)
# ...按照上述方案配置...

# 7. 申请SSL证书
# ...按照第3部分步骤...

# 8. 访问测试
curl https://api.yourdomain.com/api/health
curl https://www.yourdomain.com
```

---

## 5. 常见问题

### Q: DNS多久生效?
A: 通常5-30分钟,最长可能需要48小时

### Q: 如何检查DNS是否生效?
```bash
# 检查DNS解析
nslookup api.yourdomain.com
dig api.yourdomain.com
```

### Q: Cloudflare Tunnel无法连接?
```bash
# 查看日志
docker logs cloudflared

# 检查配置
cat ~/.cloudflared/config.yml
```

### Q: frp连接失败?
```bash
# 检查服务端是否运行
netstat -tunlp | grep 7000

# 检查防火墙
sudo ufw allow 7000
sudo ufw allow 3000
sudo ufw allow 3001
```

---

## 6. 建议方案

**如果你没有域名**:
1. 暂时使用IP地址访问(需要公网IP)
2. 或申请免费域名(freenom等)
3. 或先本地测试,稍后再配置域名

**如果你有域名但无公网IP**:
强烈推荐使用Cloudflare Tunnel方案:
- 免费,无需额外服务器
- 自动SSL证书
- 配置简单,稳定可靠

**如果你有域名和公网IP**:
直接DNS配置 + Let's Encrypt SSL证书申请。
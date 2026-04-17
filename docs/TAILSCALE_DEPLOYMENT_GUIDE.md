# Tailscale VPN部署快速指南

## 🎯 优势
- ✅ 免费,无需公网IP
- ✅ 安装简单,5分钟搞定
- ✅ 安全稳定,自动穿透NAT
- ✅ 从任何地方都能SSH连接NAS

---

## 📋 操作步骤

### 第一步: 在NAS安装Tailscale

#### 群晖NAS安装步骤:
```
1. 通过QuickConnect登录DSM: https://quickconnect.to/你的ID

2. 打开套件中心(DSM主界面 > 套件中心)

3. 搜索 "Tailscale"

4. 点击"安装"

5. 安装完成后,打开Tailscale( DSM主界面 > Tailscale)

6. 点击"Login"登录Tailscale账号
   - 如果没有账号,可以去 https://tailscale.com 免费注册
   - 可以用Google/GitHub/Microsoft账号登录

7. 登录后点击"Connect"连接

8. 记下显示的Tailscale IP地址(100.x.x.x)
   例如: 100.101.102.103
```

---

### 第二步: 在本地Mac安装Tailscale

```bash
# 方法1: 使用Homebrew安装(推荐)
brew install tailscale

# 方法2: 手动下载安装
# 下载地址: https://tailscale.com/download/mac

# 启动Tailscale
sudo tailscale up

# 登录同一账号(浏览器会自动打开登录页面)
# 使用和NAS相同的账号登录

# 连接成功后查看状态
tailscale status

# 应该能看到你的NAS设备,例如:
# 100.101.102.103  your-nas-name  linux -

# 测试连接
ping 100.101.102.103
```

---

### 第三步: SSH连接NAS

```bash
# 现在可以直接SSH连接了!
ssh admin@100.101.102.103

# 如果SSH端口不是22,指定端口:
ssh admin@100.101.102.103 -p 你的SSH端口

# 首次连接会提示确认指纹,输入yes
# 输入NAS密码登录成功!

# 测试Docker是否安装
docker --version
docker-compose --version
```

---

### 第四步: 上传项目文件到NAS

#### 方法A: 使用scp直接传输(推荐)
```bash
# 在本地Mac执行:
cd /Users/mac/zrby

# 打包项目文件(排除不需要的文件)
tar -czf petkeeper.tar.gz \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='pet-keeper/node_modules' \
  --exclude='pet-keeper-backend/node_modules' \
  --exclude='pet-keeper-miniprogram/node_modules' \
  --exclude='.DS_Store' \
  --exclude='docs/*.md' \
  .

# 通过Tailscale IP上传到NAS
scp petkeeper.tar.gz admin@100.101.102.103:/homes/admin/

# SSH登录NAS解压
ssh admin@100.101.102.103
cd /homes/admin
mkdir -p petkeeper
tar -xzf petkeeper.tar.gz -C petkeeper
cd petkeeper
```

#### 方法B: 使用File Station上传
```
1. DSM > File Station
2. 创建目录: /homes/admin/petkeeper
3. 本地打包: tar -czf petkeeper.tar.gz .
4. File Station > 上传 > 选择压缩包
5. DSM > 任务计划 > 创建解压脚本:
   cd /homes/admin
   tar -xzf petkeeper.tar.gz -C petkeeper
```

---

### 第五步: 启用SSH服务(如果未启用)

```
如果SSH连接失败,需要在DSM启用SSH:

1. DSM > 控制面板 > 终端机和SNMP
2. 勾选"启用SSH服务"
3. 端口设置: 22(默认)或自定义端口如2222
4. 点击"应用"
5. 等待服务启动

现在可以SSH连接了:
ssh admin@100.101.102.103 -p 22
```

---

### 第六步: 安装Docker(如果未安装)

```
如果SSH后执行docker命令报错:

1. DSM > 套件中心
2. 搜索 "Docker"
3. 安装Docker套件
4. 安装完成后重启SSH会话

检查安装:
docker --version
docker-compose --version
```

---

### 第七步: 执行部署

```bash
# SSH连接到NAS
ssh admin@100.101.102.103

# 进入项目目录
cd /homes/admin/petkeeper

# 检查文件完整性
ls -la docker-compose.yml .env deploy-to-nas.sh

# 如果.env文件不存在或域名需要修改
vim .env
# 修改API_URL和FRONTEND_URL为你的域名
# 如果暂无域名,可以先用Tailscale IP测试

# 运行一键部署脚本
./deploy-to-nas.sh

# 或者手动部署:
docker-compose up -d --build
docker-compose logs -f
```

---

## 🎯 快速命令总结

```bash
# 本地Mac执行:
brew install tailscale && sudo tailscale up
cd /Users/mac/zrby
tar -czf petkeeper.tar.gz --exclude='.git' --exclude='node_modules' .
scp petkeeper.tar.gz admin@100.101.102.103:/homes/admin/

# SSH连接NAS:
ssh admin@100.101.102.103
cd /homes/admin && mkdir petkeeper
tar -xzf petkeeper.tar.gz -C petkeeper && cd petkeeper
./deploy-to-nas.sh

# 查看服务状态:
docker-compose ps
docker-compose logs -f

# 测试API:
curl http://localhost:3001/api/health
```

---

## ✅ 验证部署成功

```bash
# 在NAS上测试:
curl http://localhost:3001/api/health
curl http://localhost:3000

# 在本地Mac通过Tailscale测试:
curl http://100.101.102.103:3001/api/health
curl http://100.101.102.103:3000

# 浏览器访问:
http://100.101.102.103:3000
```

---

## 🔧 配置外网访问(可选)

如果要让外网用户访问(不通过Tailscale),可以配置Cloudflare Tunnel:

```bash
# 在NAS上安装并配置Cloudflare Tunnel
docker run -d --name cloudflared \
  --restart always \
  --network host \
  -v ~/.cloudflared:/etc/cloudflared:ro \
  cloudflare/cloudflared:latest \
  tunnel run <你的tunnel-id>

# 配置详见: docs/DNS_AND_TUNNEL_GUIDE.md
```

---

## 🆘 常见问题

**Q: Tailscale连接不上?**
- 检查NAS和Mac是否登录同一账号
- 重启Tailscale服务: DSM > Tailscale > Disconnect > Connect
- 查看连接状态: `tailscale status`

**Q: SSH连接失败?**
- DSM > 控制面板 > 终端机 > 确认SSH已启用
- 检查SSH端口是否正确
- 尝试指定端口: `ssh admin@100.x.x.x -p 22`

**Q: scp上传失败?**
- 检查SSH是否已启用
- 确认目录权限: `/homes/admin` 用户有写权限
- 尝试使用File Station上传

**Q: Docker命令找不到?**
- DSM > 套件中心 > 安装Docker套件
- 安装后重启SSH会话

**Q: 如何获取NAS的Tailscale IP?**
- DSM > Tailscale界面查看
- 或SSH后执行: `tailscale ip`

---

## 📊 部署架构

```
本地Mac (Tailscale已连接)
    ↓ Tailscale VPN加密通道
    ↓
NAS设备 (100.101.102.103)
    ├── PostgreSQL (:5432)
    ├── Redis (:6379)
    ├── Backend (:3001)
    ├── Web (:3000)
    ├── Nginx (:80/443)
    └── Portainer (:9000)

通过Tailscale访问:
- SSH: ssh admin@100.101.102.103
- API: http://100.101.102.103:3001
- Web: http://100.101.102.103:3000
```

---

## 🎉 完成!

现在你可以:
- ✅ 从任何地方SSH连接NAS(只要有网络)
- ✅ 部署和管理服务
- ✅ 通过Tailscale IP访问应用
- ✅ 配置Cloudflare Tunnel让外网用户访问

---

## 下一步

1. **安装Tailscale**: DSM套件中心安装
2. **本地连接**: Mac安装Tailscale并连接
3. **上传文件**: scp或File Station
4. **SSH部署**: 连接后执行deploy-to-nas.sh

需要任何帮助都可以问我! 🚀
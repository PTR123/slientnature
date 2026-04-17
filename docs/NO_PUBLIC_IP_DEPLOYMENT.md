# 无公网IP NAS部署方案

## 问题分析
- NAS无公网IP
- 只能通过群晖QuickConnect访问
- 无法直接SSH远程连接

## 解决方案

### 方案A: 通过DSM Web界面部署(推荐)

#### 步骤1: 通过QuickConnect登录DSM
```
1. 打开浏览器访问: https://quickconnect.to/你的QuickConnectID
2. 登录DSM管理界面
3. 打开 File Station
```

#### 步骤2: 上传项目文件
```
方法1: 使用File Station上传
- 在File Station中创建目录: /homes/admin/petkeeper
- 将项目文件打包: tar -czf petkeeper.tar.gz .
- 通过File Station上传压缩包
- 使用DSM任务计划解压

方法2: 使用Synology Drive同步
- 在本地电脑安装Synology Drive Client
- 设置同步文件夹到NAS的 /homes/admin/petkeeper
- 本地项目文件会自动同步到NAS
```

#### 步骤3: 启用SSH服务
```
1. DSM > 控制面板 > 终端机和SNMP
2. 启用SSH服务
3. 设置端口: 22(默认)或自定义端口
4. 在局域网内(或通过VPN)SSH连接:
   ssh admin@192.168.x.x -p 22
```

#### 步骤4: 配置VPN访问(推荐)
```
如果NAS在内网,通过VPN连接后可以SSH:

方法1: 群晖VPN Server
- DSM > 套件中心 > 安装VPN Server
- 配置OpenVPN或PPTP
- 从外网连接VPN后,SSH到NAS内网IP

方法2: Tailscale(最简单)
- DSM > 套件中心 > 安装Tailscale
- 登录Tailscale账号
- NAS会获得一个Tailscale IP(100.x.x.x)
- 从任何设备SSH: ssh admin@100.x.x.x
```

#### 步骤5: 通过任务计划部署
```
如果无法SSH,使用DSM任务计划:

1. DSM > 控制面板 > 任务计划
2. 创建 > 用户定义的脚本
3. 设置:
   - 用户: admin
   - 事件: 按需运行
   - 脚本内容:
     cd /homes/admin/petkeeper
     docker-compose up -d --build
4. 运行任务
```

---

### 方案B: 使用Cloudflare Tunnel(无需SSH)

#### 优势
- 不需要公网IP
- 不需要SSH访问
- 不需要VPN
- 直接从本地部署到Cloudflare

#### 步骤
```
1. 在本地机器创建Cloudflare Tunnel配置
2. Tunnel会自动连接到Cloudflare边缘节点
3. 用户访问域名时,Cloudflare会路由到你的NAS
4. NAS上的服务通过Tunnel暴露给外网

详细步骤见: docs/DNS_AND_TUNNEL_GUIDE.md
```

---

### 方案C: 使用路由器端口转发

#### 前提条件
- 路由器支持端口转发
- 路由器有公网IP(或动态DNS)

#### 步骤
```
1. 登录路由器管理界面
2. 设置端口转发:
   - 外网端口22 -> NAS内网IP:22 (SSH)
   - 外网端口80 -> NAS内网IP:80 (HTTP)
   - 外网端口443 -> NAS内网IP:443 (HTTPS)

3. 配置动态DNS(如果路由器IP会变化):
   - 使用路由器内置DDNS
   - 或使用第三方DDNS服务(如noip.com)

4. SSH连接:
   ssh admin@your-ddns-domain.com -p 22
```

---

### 方案D: 本地构建镜像并上传

#### 步骤
```
1. 在本地机器构建Docker镜像:
   docker-compose build

2. 保存镜像为文件:
   docker save ziranbuyu-api:latest | gzip > api-image.tar.gz
   docker save ziranbuyu-web:latest | gzip > web-image.tar.gz

3. 通过QuickConnect File Station上传镜像文件到NAS

4. 在NAS上加载镜像:
   docker load < api-image.tar.gz
   docker load < web-image.tar.gz

5. 启动服务(通过DSM任务计划):
   cd /homes/admin/petkeeper
   docker-compose up -d
```

---

## 推荐部署流程(无需SSH)

### 方法1: DSM任务计划 + Synology Drive同步

```
准备工作:
1. 安装Synology Drive Client
2. 设置同步文件夹映射到NAS项目目录

部署步骤:
1. 本地修改项目文件(自动同步到NAS)
2. DSM登录 > 控制面板 > 任务计划
3. 创建部署脚本任务:
   cd /homes/admin/petkeeper
   docker-compose down
   docker-compose up -d --build
4. 点击"运行"执行部署
5. DSM > Docker > 查看容器状态
```

### 方法2: Portainer Web管理界面

```
1. DSM > 套件中心 > 安装Docker
2. DSM > 套件中心 > 安装Portainer(如果可用)
3. 访问Portainer: http://nas-ip:9000
4. 通过Portainer Web界面:
   - 上传docker-compose.yml
   - 创建stacks
   - 管理容器
   - 查看日志
```

---

## 快速开始(最简单方案)

### Tailscale + SSH方案

#### 1. 在NAS安装Tailscale
```
DSM > 套件中心 > 搜索 "Tailscale" > 安装
打开Tailscale > 登录账号 > 连接
记下Tailscale IP: 100.x.x.x
```

#### 2. 在本地安装Tailscale
```
本地Mac安装:
brew install tailscale
或下载: https://tailscale.com/download

登录同一账号 > 连接
```

#### 3. SSH连接
```
ssh admin@100.x.x.x
# 现在可以从任何地方SSH连接NAS!
```

#### 4. 执行部署
```
cd /homes/admin/petkeeper
./deploy-to-nas.sh
```

---

## 检查清单

- [ ] 通过QuickConnect登录DSM
- [ ] DSM中启用SSH服务(控制面板 > 终端机)
- [ ] 安装Docker套件(DSM > 奖件中心)
- [ ] 上传项目文件(File Station或Synology Drive)
- [ ] 选择部署方式:
  - [ ] 方案A: VPN + SSH (推荐Tailscale)
  - [ ] 方案B: DSM任务计划
  - [ ] 方案C: Cloudflare Tunnel
  - [ ] 方案D: 路由器端口转发

---

## 需要帮助?

**如何在DSM中操作?**
- File Station上传文件: DSM主界面 > File Station > 上传
- 任务计划: 控制面板 > 任务计划 > 创建 > 用户定义的脚本
- Docker管理: DSM主界面 > Docker > 容器/镜像

**推荐使用哪种方案?**
- **最简单**: Tailscale VPN + SSH
- **无需VPN**: DSM任务计划 + Synology Drive同步
- **最稳定**: Cloudflare Tunnel(适合长期运行)

**我可以帮你远程部署吗?**
可以!我可以通过指导你在DSM界面操作来完成部署。

---

## 下一步建议

1. **安装Tailscale**: 最简单的VPN方案,几分钟搞定
2. **启用SSH**: DSM控制面板一键启用
3. **上传文件**: 使用File Station或Synology Drive
4. **执行部署**: SSH连接后运行deploy-to-nas.sh

选择最适合你的方案,我可以提供详细指导!
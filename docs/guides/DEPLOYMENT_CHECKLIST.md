# 🚀 PetKeeper 快速部署清单

适用于将后端部署到私有服务器的快速参考。

---

## 📋 部署前准备

### 需要准备的信息
- [ ] 服务器 IP 地址
- [ ] 域名（已解析到服务器 IP）
- [ ] 管理员邮箱（用于 SSL 证书）
- [ ] 数据库密码（自定义一个强密码）

### 本地文件准备
- [ ] 后端代码：`/Users/mac/my_gzh/zrby/pet-keeper-backend`
- [ ] 前端代码：`/Users/mac/my_gzh/zrby/pet-keeper`

---

## 🖥️ 服务器部署（第一次）

### 步骤 1：连接服务器

```bash
ssh root@你的服务器IP
```

### 步骤 2：运行自动部署脚本

**方法一：上传并运行脚本**

在本地电脑执行：
```bash
scp /Users/mac/my_gzh/zrby/server-setup.sh root@你的服务器IP:/root/
```

在服务器执行：
```bash
chmod +x /root/server-setup.sh
/root/server-setup.sh
```

**方法二：手动执行**

参考 `PRIVATE_SERVER_DEPLOYMENT.md` 中的详细步骤。

### 步骤 3：上传后端代码

在本地电脑执行：
```bash
cd /Users/mac/my_gzh/zrby/pet-keeper-backend

# 打包代码
tar -czf backend.tar.gz --exclude='node_modules' --exclude='.env' --exclude='prisma/dev.db' .

# 上传
scp backend.tar.gz root@你的服务器IP:/var/www/petkeeper/
```

在服务器执行：
```bash
cd /var/www/petkeeper
mkdir -p backend
tar -xzf backend.tar.gz -C backend
```

### 步骤 4：配置并启动后端

在服务器执行：
```bash
cd /var/www/petkeeper/backend

# 使用环境配置
mv ../backend.env .env

# 安装依赖
npm install

# 数据库初始化
npx prisma generate
npx prisma migrate deploy
npx tsx src/seed.ts

# 构建
npm run build

# 启动服务
cd /var/www/petkeeper
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # 执行输出的命令
```

### 步骤 5：获取 SSL 证书

```bash
certbot --nginx -d api.你的域名.com
```

按提示输入邮箱，同意条款。

### 步骤 6：验证后端部署

```bash
# 测试 API
curl https://api.你的域名.com/api/health

# 应返回
{"status":"ok"}
```

---

## 🌐 前端部署

### 方法一：部署到 Vercel（推荐）

1. **更新前端配置**

编辑 `/Users/mac/my_gzh/zrby/pet-keeper/.env.production`：
```env
NEXT_PUBLIC_API_URL=https://api.你的域名.com/api
```

2. **推送到 GitHub**
```bash
cd /Users/mac/my_gzh/zrby/pet-keeper
git add .
git commit -m "Update production API URL"
git push
```

3. **在 Vercel 部署**
   - 访问 https://vercel.com
   - 使用 GitHub 登录
   - 导入 `pet-keeper` 仓库
   - 点击 Deploy

4. **配置自定义域名**
   - 在 Vercel 项目设置 → Domains
   - 添加你的域名
   - 按提示配置 DNS

### 方法二：部署到同一台服务器

参考 `PRIVATE_SERVER_DEPLOYMENT.md` 第八步方案二。

---

## 🔄 日常更新部署

### 更新后端

```bash
# 在本地打包
cd /Users/mac/my_gzh/zrby/pet-keeper-backend
tar -czf backend.tar.gz --exclude='node_modules' --exclude='.env' --exclude='prisma/dev.db' .
scp backend.tar.gz root@你的服务器IP:/var/www/petkeeper/

# 在服务器更新
ssh root@你的服务器IP
cd /var/www/petkeeper/backend
tar -xzf ../backend.tar.gz
npm install
npx prisma migrate deploy
npm run build
pm2 restart petkeeper-api
```

### 更新前端（Vercel）

```bash
cd /Users/mac/my_gzh/zrby/pet-keeper
git add .
git commit -m "Update message"
git push
```

Vercel 会自动重新部署。

---

## 🔧 常用命令

### PM2 管理

```bash
pm2 status              # 查看所有应用状态
pm2 logs petkeeper-api  # 查看后端日志
pm2 restart petkeeper-api  # 重启后端
pm2 stop petkeeper-api  # 停止后端
pm2 monit              # 实时监控
```

### Nginx 管理

```bash
nginx -t               # 测试配置
systemctl reload nginx # 重载配置
systemctl status nginx # 查看状态
```

### 数据库操作

```bash
# 连接数据库
sudo -u postgres psql -d petkeeper

# 手动备份
/var/www/petkeeper/backup.sh

# 查看备份
ls -lh /var/www/petkeeper/backups/
```

### 日志查看

```bash
# 应用日志
pm2 logs petkeeper-api

# Nginx 访问日志
tail -f /var/log/nginx/access.log

# Nginx 错误日志
tail -f /var/log/nginx/error.log
```

---

## 🔐 安全检查清单

- [ ] SSH 密钥登录已配置
- [ ] SSH 密码登录已禁用
- [ ] 防火墙已启用（UFW）
- [ ] Fail2Ban 已安装
- [ ] SSL 证书已配置并自动续期
- [ ] 数据库密码足够强
- [ ] JWT_SECRET 已随机生成
- [ ] .env 文件权限正确（600）
- [ ] 定期备份已配置

---

## 📊 监控检查

### 每周检查
- [ ] 磁盘空间：`df -h`
- [ ] 内存使用：`free -m`
- [ ] 应用状态：`pm2 status`
- [ ] 错误日志：`pm2 logs --err`

### 每月检查
- [ ] 系统更新：`apt update && apt upgrade`
- [ ] SSL 证书续期状态
- [ ] 数据库备份完整性
- [ ] 清理旧日志

---

## 🆘 故障排查

### 后端无法启动

```bash
# 查看错误日志
pm2 logs petkeeper-api --lines 100

# 常见问题
# 1. 数据库连接失败
cat /var/www/petkeeper/backend/.env
sudo -u postgres psql -d petkeeper -U petkeeper_user

# 2. 端口被占用
lsof -i :3001

# 3. 依赖问题
cd /var/www/petkeeper/backend
rm -rf node_modules package-lock.json
npm install
```

### 前端无法访问

```bash
# 检查 Nginx
nginx -t
systemctl status nginx

# 检查防火墙
ufw status

# 检查后端是否运行
pm2 status
curl http://localhost:3001/api/health
```

### 数据库问题

```bash
# 检查 PostgreSQL
systemctl status postgresql

# 重启数据库
systemctl restart postgresql

# 检查连接
sudo -u postgres psql -c "SELECT version();"
```

---

## 📞 支持信息

### 重要文件位置
- 后端代码：`/var/www/petkeeper/backend/`
- 环境配置：`/var/www/petkeeper/backend/.env`
- PM2 配置：`/var/www/petkeeper/ecosystem.config.js`
- Nginx 配置：`/etc/nginx/sites-available/petkeeper-api`
- 备份目录：`/var/www/petkeeper/backups/`
- 日志目录：`/var/log/nginx/`

### 关键服务
- 后端：PM2（端口 3001）
- 数据库：PostgreSQL（端口 5432）
- Web 服务器：Nginx（端口 80, 443）

---

## ✅ 部署完成确认

- [ ] 后端 API 可访问：`https://api.你的域名.com/api/health`
- [ ] 前端页面可访问：`https://你的域名.com`
- [ ] 用户注册登录正常
- [ ] 创建宠物档案成功
- [ ] 添加饲养记录成功
- [ ] 发布帖子成功
- [ ] 点赞评论功能正常
- [ ] SSL 证书有效
- [ ] 自动备份运行正常

---

**🎉 完成以上清单后，您的 PetKeeper 应用已成功部署！**
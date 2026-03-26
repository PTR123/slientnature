#!/bin/bash

# PetKeeper 私有服务器一键部署脚本
# 适用于 Ubuntu 20.04/22.04 LTS

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  PetKeeper 服务器部署脚本${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}请使用 root 用户或 sudo 运行此脚本${NC}"
  exit 1
fi

# 获取用户输入
echo -e "${YELLOW}请输入以下信息：${NC}"
read -p "数据库密码（自定义一个强密码）: " DB_PASSWORD
read -p "您的域名（例如 example.com）: " DOMAIN
read -p "后端子域名（默认 api）: " API_SUBDOMAIN
API_SUBDOMAIN=${API_SUBDOMAIN:-api}
read -p "前端子域名（默认 www）: " WWW_SUBDOMAIN
WWW_SUBDOMAIN=${WWW_SUBDOMAIN:-www}
read -p "管理员邮箱（用于 SSL 证书）: " ADMIN_EMAIL

# 生成 JWT 密钥
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

echo ""
echo -e "${GREEN}配置信息：${NC}"
echo "数据库密码: $DB_PASSWORD"
echo "后端域名: $API_SUBDOMAIN.$DOMAIN"
echo "前端域名: $WWW_SUBDOMAIN.$DOMAIN"
echo "管理员邮箱: $ADMIN_EMAIL"
echo ""
read -p "确认继续？(y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
  echo "已取消部署"
  exit 0
fi

# 更新系统
echo -e "${YELLOW}[1/10] 更新系统...${NC}"
apt update && apt upgrade -y

# 安装 Node.js
echo -e "${YELLOW}[2/10] 安装 Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 安装 PostgreSQL
echo -e "${YELLOW}[3/10] 安装 PostgreSQL...${NC}"
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql

# 创建数据库
echo -e "${YELLOW}[4/10] 创建数据库...${NC}"
sudo -u postgres psql -c "CREATE DATABASE petkeeper;"
sudo -u postgres psql -c "CREATE USER petkeeper_user WITH ENCRYPTED PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE petkeeper TO petkeeper_user;"

# 安装 Nginx
echo -e "${YELLOW}[5/10] 安装 Nginx...${NC}"
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# 安装 PM2
echo -e "${YELLOW}[6/10] 安装 PM2...${NC}"
npm install -g pm2

# 安装 Certbot
echo -e "${YELLOW}[7/10] 安装 Certbot...${NC}"
apt install -y certbot python3-certbot-nginx

# 配置防火墙
echo -e "${YELLOW}[8/10] 配置防火墙...${NC}"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# 创建应用目录
echo -e "${YELLOW}[9/10] 创建应用目录...${NC}"
mkdir -p /var/www/petkeeper
cd /var/www/petkeeper

# 创建后端环境配置
cat > backend.env << EOF
DATABASE_URL="postgresql://petkeeper_user:$DB_PASSWORD@localhost:5432/petkeeper"
JWT_SECRET="$JWT_SECRET"
NODE_ENV="production"
PORT=3001
FRONTEND_URL="https://$WWW_SUBDOMAIN.$DOMAIN"
EOF

# 创建 Nginx 配置 - 后端
cat > /etc/nginx/sites-available/petkeeper-api << EOF
server {
    listen 80;
    server_name $API_SUBDOMAIN.$DOMAIN;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# 启用后端配置
ln -sf /etc/nginx/sites-available/petkeeper-api /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# 创建备份脚本
cat > /var/www/petkeeper/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/www/petkeeper/backups"
mkdir -p $BACKUP_DIR
pg_dump -U petkeeper_user petkeeper > $BACKUP_DIR/petkeeper_$DATE.sql
find $BACKUP_DIR -type f -mtime +7 -delete
echo "Backup completed: petkeeper_$DATE.sql"
EOF

chmod +x /var/www/petkeeper/backup.sh

# 设置定时备份
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/petkeeper/backup.sh >> /var/www/petkeeper/backup.log 2>&1") | crontab -

# 创建 PM2 ecosystem 配置
cat > /var/www/petkeeper/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'petkeeper-api',
    script: 'backend/dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
EOF

echo ""
echo -e "${GREEN}[10/10] 基础环境部署完成！${NC}"
echo ""
echo -e "${YELLOW}=====================================${NC}"
echo -e "${YELLOW}  下一步操作${NC}"
echo -e "${YELLOW}=====================================${NC}"
echo ""
echo "1. 上传后端代码："
echo "   scp -r /Users/mac/my_gzh/zrby/pet-keeper-backend root@$SERVER_IP:/var/www/petkeeper/backend"
echo ""
echo "2. 在服务器上完成部署："
echo "   cd /var/www/petkeeper/backend"
echo "   mv ../backend.env .env"
echo "   npm install"
echo "   npx prisma generate"
echo "   npx prisma migrate deploy"
echo "   npx tsx src/seed.ts"
echo "   npm run build"
echo "   cd .."
echo "   pm2 start ecosystem.config.js"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "3. 获取 SSL 证书："
echo "   certbot --nginx -d $API_SUBDOMAIN.$DOMAIN"
echo ""
echo "4. 部署前端到 Vercel:"
echo "   - 修改前端 .env.production 中的 API 地址为: https://$API_SUBDOMAIN.$DOMAIN/api"
echo "   - 推送到 GitHub"
echo "   - 在 Vercel 导入项目"
echo ""
echo -e "${GREEN}配置信息已保存在：${NC}"
echo "  - 数据库密码: /var/www/petkeeper/backend.env"
echo "  - JWT 密钥: 已自动生成"
echo "  - 备份脚本: /var/www/petkeeper/backup.sh"
echo ""
echo -e "${GREEN}部署脚本执行完成！${NC}"
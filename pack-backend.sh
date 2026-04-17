#!/bin/bash

# 后端打包脚本 - 用于上传到NAS部署
# 使用方法: ./pack-backend.sh

set -e

echo "📦 PetKeeper后端打包工具"
echo "=========================="
echo ""

# 检查当前目录
if [ ! -f "docker-compose-backend.yml" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    echo "当前目录应该是: /Users/mac/zrby/"
    exit 1
fi

# 定义输出文件名
OUTPUT_FILE="backend-deploy.tar.gz"

echo "🎯 打包后端相关文件..."
echo ""

# 创建临时目录
TEMP_DIR=$(mktemp -d)
PROJECT_DIR="$TEMP_DIR/petkeeper-backend"

mkdir -p "$PROJECT_DIR"

echo "📋 复制必要文件..."

# 复制后端docker-compose配置
cp docker-compose-backend.yml "$PROJECT_DIR/"
echo "✅ docker-compose-backend.yml 已复制"

# 复制环境配置
cp .env "$PROJECT_DIR/" 2>/dev/null || {
    echo "⚠️  .env不存在,使用.env.example"
    cp .env.example "$PROJECT_DIR/"
}
cp .env.example "$PROJECT_DIR/" 2>/dev/null || true

# 复制nginx配置
if [ -d "nginx" ]; then
    mkdir -p "$PROJECT_DIR/nginx/ssl"
    cp nginx/nginx-api.conf "$PROJECT_DIR/nginx/nginx.conf"
    cp nginx/ssl/*.pem "$PROJECT_DIR/nginx/ssl/" 2>/dev/null || {
        echo "⚠️  SSL证书不存在,将使用自签名证书"
    }
    echo "✅ nginx配置已复制"
fi

# 复制后端代码
if [ -d "pet-keeper-backend" ]; then
    mkdir -p "$PROJECT_DIR/pet-keeper-backend"
    rsync -av --exclude='node_modules' --exclude='.git' --exclude='dist' \
         --exclude='*.log' --exclude='.DS_Store' \
         pet-keeper-backend/ "$PROJECT_DIR/pet-keeper-backend/"
    echo "✅ 后端代码已复制"
else
    echo "❌ pet-keeper-backend目录不存在"
    exit 1
fi

# 复制部署文档(可选)
mkdir -p "$PROJECT_DIR/docs"
for doc in SPLIT_DEPLOYMENT_GUIDE.md TAILSCALE_DEPLOYMENT_GUIDE.md \
           DNS_AND_TUNNEL_GUIDE.md NO_PUBLIC_IP_DEPLOYMENT.md \
           NAS_DEPLOYMENT_GUIDE.md; do
    if [ -f "docs/$doc" ]; then
        cp "docs/$doc" "$PROJECT_DIR/docs/"
    fi
done
echo "✅ 部署文档已复制"

# 复制部署脚本
cp deploy-to-nas.sh "$PROJECT_DIR/" 2>/dev/null || true

# 创建README
cat > "$PROJECT_DIR/README.md" << 'EOF'
# PetKeeper后端部署包

## 文件结构
- docker-compose-backend.yml - 后端服务编排配置
- pet-keeper-backend/ - 后端API代码
- nginx/ - Nginx反向代理配置
- .env - 环境变量配置(需修改)
- docs/ - 部署文档

## 快速部署步骤

1. 修改环境变量:
   vim .env
   # 修改CORS_ORIGIN为你的Vercel前端域名
   # CORS_ORIGIN=https://your-app.vercel.app

2. 启动服务:
   docker-compose -f docker-compose-backend.yml up -d --build

3. 初始化数据库:
   docker-compose -f docker-compose-backend.yml exec backend npx prisma migrate deploy
   docker-compose -f docker-compose-backend.yml exec backend npm run db:seed

4. 测试API:
   curl http://localhost:3001/api/health

5. 查看日志:
   docker-compose -f docker-compose-backend.yml logs -f

详细步骤请参考: docs/SPLIT_DEPLOYMENT_GUIDE.md
EOF

echo ""
echo "🗜️  创建压缩包..."

# 创建tar.gz压缩包
cd "$TEMP_DIR"
tar -czf "$OUTPUT_FILE" petkeeper-backend

# 移动到原项目目录
mv "$OUTPUT_FILE" "/Users/mac/zrby/"

# 计算文件大小
FILE_SIZE=$(du -h "/Users/mac/zrby/$OUTPUT_FILE" | cut -f1)

echo ""
echo "✅ 打包完成!"
echo ""
echo "📦 文件信息:"
echo "   文件名: $OUTPUT_FILE"
echo "   位置: /Users/mac/zrby/$OUTPUT_FILE"
echo "   大小: $FILE_SIZE"
echo ""

# 清理临时目录
rm -rf "$TEMP_DIR"

echo "🚀 上传方式:"
echo ""
echo "方法1: 使用scp上传(通过Tailscale)"
echo "----------------------------------------"
echo "# 先获取NAS Tailscale IP"
echo "scp $OUTPUT_FILE admin@100.x.x.x:/homes/admin/"
echo ""
echo "方法2: 通过DSM File Station上传"
echo "----------------------------------------"
echo "1. 登录DSM: https://quickconnect.to/你的ID"
echo "2. 打开 File Station"
echo "3. 导航到 /homes/admin"
echo "4. 点击 上传 > 选择文件: $OUTPUT_FILE"
echo ""
echo "SSH部署命令(在NAS执行):"
echo "----------------------"
echo "ssh admin@100.x.x.x"
echo "cd /homes/admin"
echo "tar -xzf $OUTPUT_FILE"
echo "cd petkeeper-backend"
echo "# 修改.env配置CORS_ORIGIN"
echo "vim .env"
echo "# 启动服务"
echo "docker-compose -f docker-compose-backend.yml up -d --build"
echo "docker-compose -f docker-compose-backend.yml logs -f"
echo ""
echo "🎉 准备上传到NAS!"
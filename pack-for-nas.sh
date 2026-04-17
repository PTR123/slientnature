#!/bin/bash

# 项目打包脚本 - 用于上传到NAS
# 使用方法: ./pack-for-nas.sh

set -e

echo "📦 PetKeeper项目打包工具"
echo "=========================="
echo ""

# 检查当前目录
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

# 定义输出文件名
OUTPUT_FILE="petkeeper-deploy.tar.gz"

echo "🎯 打包项目文件..."
echo ""

# 创建临时目录
TEMP_DIR=$(mktemp -d)
PROJECT_DIR="$TEMP_DIR/petkeeper"

mkdir -p "$PROJECT_DIR"

echo "📋 复制必要文件..."

# 复制关键配置文件
cp docker-compose.yml "$PROJECT_DIR/"
cp .env "$PROJECT_DIR/" 2>/dev/null || echo "⚠️  .env文件不存在,将使用.env.example"
cp .env.example "$PROJECT_DIR/" 2>/dev/null || true
cp deploy-to-nas.sh "$PROJECT_DIR/" 2>/dev/null || echo "⚠️  deploy-to-nas.sh不存在"

# 复制nginx配置
if [ -d "nginx" ]; then
    cp -r nginx "$PROJECT_DIR/"
    echo "✅ nginx配置已复制"
fi

# 复制后端代码(排除node_modules和.git)
if [ -d "pet-keeper-backend" ]; then
    mkdir -p "$PROJECT_DIR/pet-keeper-backend"
    rsync -av --exclude='node_modules' --exclude='.git' --exclude='dist' \
         pet-keeper-backend/ "$PROJECT_DIR/pet-keeper-backend/"
    echo "✅ 后端代码已复制"
fi

# 复制前端代码(排除node_modules和.git)
if [ -d "pet-keeper" ]; then
    mkdir -p "$PROJECT_DIR/pet-keeper"
    rsync -av --exclude='node_modules' --exclude='.git' --exclude='.next' \
         pet-keeper/ "$PROJECT_DIR/pet-keeper/"
    echo "✅ 前端代码已复制"
fi

# 复制部署文档(可选)
if [ -d "docs" ]; then
    mkdir -p "$PROJECT_DIR/docs"
    # 只复制关键的部署文档
    for doc in NAS_DEPLOYMENT_GUIDE.md TAILSCALE_DEPLOYMENT_GUIDE.md \
               DNS_AND_TUNNEL_GUIDE.md DEPLOYMENT_READY.md \
               NO_PUBLIC_IP_DEPLOYMENT.md; do
        if [ -f "docs/$doc" ]; then
            cp "docs/$doc" "$PROJECT_DIR/docs/"
        fi
    done
    echo "✅ 部署文档已复制"
fi

# 复制README等说明文件
cp README.md "$PROJECT_DIR/" 2>/dev/null || true
cp DEPLOYMENT.md "$PROJECT_DIR/" 2>/dev/null || true

echo ""
echo "🗜️  创建压缩包..."

# 创建tar.gz压缩包
cd "$TEMP_DIR"
tar -czf "$OUTPUT_FILE" petkeeper

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
echo "方法1: 使用scp上传(需要Tailscale连接)"
echo "----------------------------------------"
echo "scp $OUTPUT_FILE admin@100.x.x.x:/homes/admin/"
echo ""
echo "方法2: 通过DSM File Station上传"
echo "----------------------------------------"
echo "1. 登录DSM: https://quickconnect.to/你的ID"
echo "2. 打开 File Station"
echo "3. 导航到 /homes/admin"
echo "4. 点击 上传 > 选择文件: $OUTPUT_FILE"
echo ""
echo "解压命令(在NAS执行):"
echo "-------------------"
echo "cd /homes/admin"
echo "tar -xzf $OUTPUT_FILE"
echo "cd petkeeper"
echo "./deploy-to-nas.sh"
echo ""
echo "🎉 准备上传到NAS!"
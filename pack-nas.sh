#!/bin/bash

# 打包 NAS 部署文件
# 使用方法: ./pack-nas.sh

set -e

OUTPUT_DIR="/Users/mac/zrby"
OUTPUT_FILE="$OUTPUT_DIR/nas-deploy.tar.gz"
TEMP_DIR=$(mktemp -d)

echo "📦 打包 NAS 后端部署文件..."
echo ""

# 复制 docker-compose
cp docker-compose-nas.yml "$TEMP_DIR/docker-compose.yml"

# 复制 .env (生产配置)
cp .env "$TEMP_DIR/.env"

# 复制后端代码 (排除 node_modules)
echo "  复制后端代码..."
rsync -a --exclude='node_modules' pet-keeper-backend/ "$TEMP_DIR/pet-keeper-backend/"

# 创建必要目录结构
mkdir -p "$TEMP_DIR/data/uploads"
mkdir -p "$TEMP_DIR/logs"
mkdir -p "$TEMP_DIR/backups"

# 创建 NAS 部署启动脚本
cat > "$TEMP_DIR/start.sh" << 'START_SCRIPT'
#!/bin/bash
set -e

echo "🚀 PetKeeper 后端部署"
echo "====================="

# 检查 Docker
if ! command -v docker &>/dev/null; then
    echo "❌ Docker 未安装"
    exit 1
fi

# 检查 docker-compose
if command -v docker-compose &>/dev/null; then
    COMPOSE="docker-compose"
elif docker compose version &>/dev/null; then
    COMPOSE="docker compose"
else
    echo "❌ Docker Compose 未安装"
    exit 1
fi

echo "✅ Docker: $(docker --version)"
echo "✅ Compose: $COMPOSE"
echo ""

# 停止旧服务
$COMPOSE down 2>/dev/null || true

# 构建并启动
echo "🏗️  构建镜像..."
$COMPOSE build

echo "🚀 启动服务..."
$COMPOSE up -d

echo "⏳ 等待服务启动..."
sleep 30

# 数据库迁移
echo "📊 运行数据库迁移..."
$COMPOSE exec -T backend npx prisma migrate deploy || echo "⚠️  迁移需要检查"

# 状态
echo ""
echo "📊 服务状态:"
$COMPOSE ps

echo ""
echo "✅ 部署完成!"
echo "   API: http://localhost:3001"
START_SCRIPT

chmod +x "$TEMP_DIR/start.sh"

# 打包
echo "  打包中..."
cd "$TEMP_DIR"
tar -czf "$OUTPUT_FILE" .

# 清理
rm -rf "$TEMP_DIR"

echo ""
echo "✅ 打包完成: $OUTPUT_FILE"
echo "   大小: $(du -h "$OUTPUT_FILE" | cut -f1)"
echo ""
echo "📤 上传方式:"
echo "   1. DSM 文件管理器上传到 /volume1/docker/pet-keeper/"
echo "   2. 或通过 SCP: scp nas-deploy.tar.gz admin@100.84.59.9:/volume1/docker/pet-keeper/"
echo ""
echo "📂 解压后运行: ./start.sh"
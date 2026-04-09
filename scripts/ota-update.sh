#!/bin/bash

# OTA自动更新脚本
# 用法: ./scripts/ota-update.sh [version]

set -e

echo "🚀 开始OTA更新..."

# 版本参数
VERSION=${1:-"latest"}
BRANCH=${2:-"main"}

echo "📦 更新版本: $VERSION"
echo "🌿 分支: $BRANCH"

# 1. 拉取最新代码
echo "⬇️  拉取最新代码..."
git fetch origin
git checkout $BRANCH
git pull origin $BRANCH

# 2. 备份数据库
echo "💾 备份数据库..."
BACKUP_FILE="backups/backup_$(date +%Y%m%d_%H%M%S).sql"
docker-compose exec -T postgres pg_dump -U ziranbuyu ziranbuyu > $BACKUP_FILE
echo "✅ 数据库备份完成: $BACKUP_FILE"

# 3. 拉取最新镜像（如果使用远程镜像）
# docker-compose pull

# 4. 构建新镜像
echo "🔨 构建新镜像..."
docker-compose build --no-cache

# 5. 停止旧服务
echo "🛑 停止旧服务..."
docker-compose down

# 6. 启动新服务
echo "▶️  启动新服务..."
docker-compose up -d

# 7. 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 8. 运行数据库迁移
echo "📊 运行数据库迁移..."
docker-compose exec backend npx prisma migrate deploy

# 9. 健康检查
echo "🏥 健康检查..."
for i in {1..10}; do
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        echo "✅ 服务健康"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "❌ 服务启动失败"
        exit 1
    fi
    echo "等待服务启动... ($i/10)"
    sleep 5
done

# 10. 清理旧镜像
echo "🧹 清理旧镜像..."
docker image prune -f

echo "✨ OTA更新完成！"
echo "📝 更新日志:"
git log -1 --pretty=format:"%h - %s (%cr)" HEAD

# 11. 发送通知（可选）
# curl -X POST "https://your-webhook-url" \
#   -H "Content-Type: application/json" \
#   -d "{\"text\":\"自然不语系统已更新到版本: $VERSION\"}"
#!/bin/bash

# 自动备份脚本
# 建议配置定时任务：0 2 * * * /path/to/backup.sh

set -e

# 配置
BACKUP_DIR="/volume1/backups/ziranbuyu"
DB_CONTAINER="ziranbuyu-db"
DB_NAME="ziranbuyu"
DB_USER="ziranbuyu"
KEEP_DAYS=30

# 创建备份目录
mkdir -p $BACKUP_DIR

# 时间戳
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"

echo "💾 开始备份数据库..."

# 备份数据库
docker exec $DB_CONTAINER pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_FILE

echo "✅ 数据库备份完成: $BACKUP_FILE"

# 备份上传文件
UPLOADS_BACKUP="$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz"
tar -czf $UPLOADS_BACKUP -C /volume1/docker/ziranbuyu data/uploads

echo "✅ 文件备份完成: $UPLOADS_BACKUP"

# 清理旧备份
echo "🧹 清理 $KEEP_DAYS 天前的备份..."
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +$KEEP_DAYS -delete
find $BACKUP_DIR -name "uploads_*.tar.gz" -mtime +$KEEP_DAYS -delete

echo "✨ 备份完成！"

# 上传到云存储（可选）
# rclone copy $BACKUP_FILE remote:backups/ziranbuyu/
# rclone copy $UPLOADS_BACKUP remote:backups/ziranbuyu/
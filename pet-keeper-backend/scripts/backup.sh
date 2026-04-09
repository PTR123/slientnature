#!/bin/bash

# 数据库备份脚本
# 支持SQLite和PostgreSQL

set -e

# 配置
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
DATABASE_URL="${DATABASE_URL:-file:./prisma/dev.db}"
RETENTION_DAYS=7

# 创建备份目录
mkdir -p $BACKUP_DIR

echo "🔄 开始数据库备份..."
echo "📅 时间: $(date)"
echo "📂 备份目录: $BACKUP_DIR"

# 检测数据库类型
if [[ $DATABASE_URL == postgres* ]]; then
    # PostgreSQL备份
    echo "📊 数据库类型: PostgreSQL"

    BACKUP_FILE="$BACKUP_DIR/postgres_$DATE.sql"

    # 导出数据库
    pg_dump $DATABASE_URL > $BACKUP_FILE

    # 压缩备份文件
    gzip $BACKUP_FILE
    BACKUP_FILE="${BACKUP_FILE}.gz"

    echo "✅ PostgreSQL备份完成: $BACKUP_FILE"
    echo "📦 大小: $(du -h $BACKUP_FILE | cut -f1)"

elif [[ $DATABASE_URL == file:* ]]; then
    # SQLite备份
    echo "📊 数据库类型: SQLite"

    DB_PATH="${DATABASE_URL#file:}"
    BACKUP_FILE="$BACKUP_DIR/sqlite_$DATE.db"

    if [ -f "$DB_PATH" ]; then
        # 复制数据库文件
        cp $DB_PATH $BACKUP_FILE

        # 压缩备份文件
        gzip $BACKUP_FILE
        BACKUP_FILE="${BACKUP_FILE}.gz"

        echo "✅ SQLite备份完成: $BACKUP_FILE"
        echo "📦 大小: $(du -h $BACKUP_FILE | cut -f1)"
    else
        echo "❌ 数据库文件不存在: $DB_PATH"
        exit 1
    fi
else
    echo "❌ 不支持的数据库类型: $DATABASE_URL"
    exit 1
fi

# 上传到云存储（可选）
if [ -n "$AWS_S3_BUCKET" ]; then
    echo "☁️  上传到S3: $AWS_S3_BUCKET"
    aws s3 cp $BACKUP_FILE s3://$AWS_S3_BUCKET/backups/$(basename $BACKUP_FILE)
    echo "✅ S3上传完成"
fi

# 清理旧备份
echo "🗑️  清理超过 $RETENTION_DAYS 天的旧备份..."
find $BACKUP_DIR -name "*.gz" -mtime +$RETENTION_DAYS -delete
echo "✅ 清理完成"

# 备份统计
TOTAL_SIZE=$(du -sh $BACKUP_DIR | cut -f1)
TOTAL_FILES=$(ls -1 $BACKUP_DIR/*.gz 2>/dev/null | wc -l)

echo ""
echo "📊 备份统计:"
echo "  总大小: $TOTAL_SIZE"
echo "  文件数量: $TOTAL_FILES"
echo ""
echo "✨ 备份任务完成！"
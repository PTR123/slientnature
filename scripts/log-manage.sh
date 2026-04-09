#!/bin/bash

# 日志管理脚本
# 自动清理和归档日志文件

set -e

LOG_DIR="/volume1/docker/ziranbuyu/logs"
ARCHIVE_DIR="$LOG_DIR/archive"
KEEP_DAYS=30

# 创建归档目录
mkdir -p $ARCHIVE_DIR

echo "📋 日志管理..."
echo "==============="

# 1. 归档旧日志
echo "📦 归档旧日志文件..."
find $LOG_DIR -name "*.log" -mtime +1 -exec gzip {} \; 2>/dev/null || true
find $LOG_DIR -name "*.log.gz" -mtime +1 -exec mv {} $ARCHIVE_DIR/ \; 2>/dev/null || true

# 2. 清理过期归档
echo "🧹 清理 $KEEP_DAYS 天前的归档..."
find $ARCHIVE_DIR -name "*.log.gz" -mtime +$KEEP_DAYS -delete

# 3. 日志统计
echo ""
echo "📊 日志统计："
echo "  当前日志: $(find $LOG_DIR -name "*.log" | wc -l) 个文件"
echo "  归档日志: $(find $ARCHIVE_DIR -name "*.log.gz" | wc -l) 个文件"

# 4. 磁盘占用
LOG_SIZE=$(du -sh $LOG_DIR | awk '{print $1}')
echo "  总大小: $LOG_SIZE"

# 5. 错误日志统计（如果有）
if [ -f "$LOG_DIR/error.log" ]; then
    ERROR_COUNT=$(grep -c "ERROR" $LOG_DIR/error.log 2>/dev/null || echo 0)
    echo "  错误数: $ERROR_COUNT"
fi

echo ""
echo "✨ 日志管理完成！"
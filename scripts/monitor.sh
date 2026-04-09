#!/bin/bash

# 自动监控和告警脚本
# 用法: ./scripts/monitor.sh

CONFIG_FILE="/volume1/docker/ziranbuyu/config/monitor.conf"
ALERT_LOG="/volume1/docker/ziranbuyu/logs/alerts.log"

# 加载配置
if [ -f $CONFIG_FILE ]; then
    source $CONFIG_FILE
fi

# 默认配置
THRESHOLD_CPU=${THRESHOLD_CPU:-80}
THRESHOLD_MEM=${THRESHOLD_MEM:-85}
THRESHOLD_DISK=${THRESHOLD_DISK:-90}
WEBHOOK_URL=${WEBHOOK_URL:-""}

# 日志函数
log_alert() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> $ALERT_LOG
}

# 发送告警
send_alert() {
    local message="$1"
    log_alert "$message"

    # 发送到Webhook（企业微信/钉钉/Slack等）
    if [ -n "$WEBHOOK_URL" ]; then
        curl -X POST "$WEBHOOK_URL" \
            -H "Content-Type: application/json" \
            -d "{\"text\":\"自然不语系统告警: $message\"}" 2>/dev/null
    fi
}

# 1. CPU使用率检查
check_cpu() {
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
    CPU_USAGE=${CPU_USAGE%.*}

    if [ $CPU_USAGE -gt $THRESHOLD_CPU ]; then
        send_alert "⚠️ CPU使用率过高: ${CPU_USAGE}%"
        return 1
    fi
    return 0
}

# 2. 内存使用检查
check_memory() {
    MEM_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')

    if [ $MEM_USAGE -gt $THRESHOLD_MEM ]; then
        send_alert "⚠️ 内存使用率过高: ${MEM_USAGE}%"
        return 1
    fi
    return 0
}

# 3. 磁盘空间检查
check_disk() {
    DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')

    if [ $DISK_USAGE -gt $THRESHOLD_DISK ]; then
        send_alert "⚠️ 磁盘空间不足: ${DISK_USAGE}%"
        return 1
    fi
    return 0
}

# 4. 容器状态检查
check_containers() {
    FAILED_CONTAINERS=""

    for container in $(docker-compose ps -q); do
        STATUS=$(docker inspect -f '{{.State.Status}}' $container)
        NAME=$(docker inspect -f '{{.Name}}' $container | sed 's/\///')

        if [ "$STATUS" != "running" ]; then
            FAILED_CONTAINERS="$FAILED_CONTAINERS $NAME"
        fi
    done

    if [ -n "$FAILED_CONTAINERS" ]; then
        send_alert "⚠️ 容器异常: $FAILED_CONTAINERS"
        return 1
    fi
    return 0
}

# 5. API健康检查
check_api() {
    if ! curl -f -s http://localhost:3001/api/health > /dev/null; then
        send_alert "⚠️ API服务无响应"
        return 1
    fi
    return 0
}

# 6. 数据库连接检查
check_database() {
    if ! docker-compose exec -T postgres pg_isready -U ziranbuyu > /dev/null 2>&1; then
        send_alert "⚠️ 数据库连接失败"
        return 1
    fi
    return 0
}

# 主函数
main() {
    ERRORS=0

    check_cpu || ((ERRORS++))
    check_memory || ((ERRORS++))
    check_disk || ((ERRORS++))
    check_containers || ((ERRORS++))
    check_api || ((ERRORS++))
    check_database || ((ERRORS++))

    if [ $ERRORS -eq 0 ]; then
        echo "✅ 所有检查通过"
    else
        echo "❌ 发现 $ERRORS 个问题"
    fi

    return $ERRORS
}

# 执行
main
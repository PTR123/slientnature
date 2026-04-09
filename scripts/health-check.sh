#!/bin/bash

# 系统健康检查脚本
# 用法: ./scripts/health-check.sh

set -e

echo "🏥 系统健康检查..."
echo "======================"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查结果数组
declare -a CHECKS

# 1. 检查Docker服务
echo -n "检查Docker服务... "
if docker info > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 正常${NC}"
    CHECKS+=("Docker: OK")
else
    echo -e "${RED}✗ 异常${NC}"
    CHECKS+=("Docker: FAILED")
fi

# 2. 检查数据库连接
echo -n "检查PostgreSQL... "
if docker-compose exec -T postgres pg_isready -U ziranbuyu > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 正常${NC}"
    CHECKS+=("PostgreSQL: OK")
else
    echo -e "${RED}✗ 异常${NC}"
    CHECKS+=("PostgreSQL: FAILED")
fi

# 3. 检查Redis连接
echo -n "检查Redis... "
if docker-compose exec -T redis redis-cli ping | grep -q "PONG"; then
    echo -e "${GREEN}✓ 正常${NC}"
    CHECKS+=("Redis: OK")
else
    echo -e "${RED}✗ 异常${NC}"
    CHECKS+=("Redis: FAILED")
fi

# 4. 检查后端API
echo -n "检查后端API... "
if curl -f -s http://localhost:3001/api/health > /dev/null; then
    echo -e "${GREEN}✓ 正常${NC}"
    CHECKS+=("Backend API: OK")
else
    echo -e "${RED}✗ 异常${NC}"
    CHECKS+=("Backend API: FAILED")
fi

# 5. 检查前端服务
echo -n "检查Web前端... "
if curl -f -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✓ 正常${NC}"
    CHECKS+=("Web Frontend: OK")
else
    echo -e "${RED}✗ 异常${NC}"
    CHECKS+=("Web Frontend: FAILED")
fi

# 6. 检查Nginx
echo -n "检查Nginx... "
if docker-compose exec -T nginx nginx -t > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 正常${NC}"
    CHECKS+=("Nginx: OK")
else
    echo -e "${RED}✗ 异常${NC}"
    CHECKS+=("Nginx: FAILED")
fi

# 7. 检查磁盘空间
echo -n "检查磁盘空间... "
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -lt 80 ]; then
    echo -e "${GREEN}✓ ${DISK_USAGE}%${NC}"
    CHECKS+=("Disk Usage: ${DISK_USAGE}%")
elif [ $DISK_USAGE -lt 90 ]; then
    echo -e "${YELLOW}⚠ ${DISK_USAGE}%${NC}"
    CHECKS+=("Disk Usage: ${DISK_USAGE}% (WARNING)")
else
    echo -e "${RED}✗ ${DISK_USAGE}%${NC}"
    CHECKS+=("Disk Usage: ${DISK_USAGE}% (CRITICAL)")
fi

# 8. 检查内存使用
echo -n "检查内存使用... "
MEM_USAGE=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
if (( $(echo "$MEM_USAGE < 80" | bc -l) )); then
    echo -e "${GREEN}✓ ${MEM_USAGE}%${NC}"
    CHECKS+=("Memory Usage: ${MEM_USAGE}%")
else
    echo -e "${YELLOW}⚠ ${MEM_USAGE}%${NC}"
    CHECKS+=("Memory Usage: ${MEM_USAGE}% (WARNING)")
fi

# 9. 检查Docker容器状态
echo -n "检查容器状态... "
RUNNING=$(docker-compose ps -q | xargs docker inspect -f '{{.State.Status}}' | grep -c "running" || echo 0)
TOTAL=$(docker-compose ps -q | wc -l)
if [ "$RUNNING" -eq "$TOTAL" ]; then
    echo -e "${GREEN}✓ $RUNNING/$TOTAL 运行中${NC}"
    CHECKS+=("Containers: $RUNNING/$TOTAL running")
else
    echo -e "${RED}✗ $RUNNING/$TOTAL 运行中${NC}"
    CHECKS+=("Containers: $RUNNING/$TOTAL running (FAILED)")
fi

# 10. 检查SSL证书有效期
echo -n "检查SSL证书... "
if [ -f "nginx/ssl/cert.pem" ]; then
    CERT_EXPIRY=$(openssl x509 -enddate -noout -in nginx/ssl/cert.pem | cut -d= -f2)
    CERT_DAYS=$(( ($(date -d "$CERT_EXPIRY" +%s) - $(date +%s)) / 86400 ))
    if [ $CERT_DAYS -gt 7 ]; then
        echo -e "${GREEN}✓ ${CERT_DAYS}天${NC}"
        CHECKS+=("SSL Certificate: ${CERT_DAYS} days left")
    else
        echo -e "${RED}✗ 仅剩${CERT_DAYS}天${NC}"
        CHECKS+=("SSL Certificate: ${CERT_DAYS} days left (CRITICAL)")
    fi
else
    echo -e "${YELLOW}⚠ 未配置${NC}"
    CHECKS+=("SSL Certificate: Not configured")
fi

# 输出汇总
echo ""
echo "======================"
echo "检查结果汇总："
for check in "${CHECKS[@]}"; do
    echo "  • $check"
done

# 统计失败数量
FAILED=$(printf '%s\n' "${CHECKS[@]}" | grep -c "FAILED\|CRITICAL" || echo 0)

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✨ 所有服务运行正常！${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}⚠ 发现 $FAILED 个问题需要处理${NC}"
    exit 1
fi
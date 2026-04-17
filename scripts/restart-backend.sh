#!/bin/bash

# 快速Backend重启脚本
# 确保只有一个backend进程运行

echo "=== Backend 快速重启 ==="
echo ""

# 1. 停止所有backend进程
echo "1. 停止所有backend进程..."
pkill -9 -f "node.*pet-keeper-backend"
sleep 2

# 检查是否全部停止
remaining=$(ps aux | grep "node.*pet-keeper-backend" | grep -v grep | wc -l)
if [ "$remaining" -gt 0 ]; then
    echo "⚠️  还有 $remaining 个进程残留"
    ps aux | grep "node.*pet-keeper-backend" | grep -v grep
    echo ""
    echo "尝试再次停止..."
    pkill -9 -f "tsx watch"
    sleep 1
fi

echo "✅ 所有进程已停止"
echo ""

# 2. 启动新的backend
echo "2. 启动backend服务..."
cd /Users/mac/zrby/pet-keeper-backend

# 检查是否已经在运行
if lsof -i :3001 > /dev/null 2>&1; then
    echo "⚠️  端口3001已被占用"
    lsof -i :3001
    echo ""
    echo "请手动停止占用端口的进程"
    exit 1
fi

# 启动backend（后台运行）
nohup npm run dev > /tmp/backend.log 2>&1 &
echo "Backend启动中..."

# 3. 等待服务就绪
sleep 3

# 4. 验证服务状态
echo ""
echo "3. 验证服务状态..."
echo ""

# 检查进程
process_count=$(ps aux | grep "node.*pet-keeper-backend" | grep -v grep | wc -l)
echo "运行进程数: $process_count"

# 检查端口
if lsof -i :3001 > /dev/null 2>&1; then
    echo "✅ 端口3001监听正常"
    lsof -i :3001 | head -5
else
    echo "❌ 端口3001未监听"
    echo ""
    echo "查看日志:"
    tail -20 /tmp/backend.log
    exit 1
fi

echo ""

# 测试API响应
echo "4. 测试API响应..."
response=$(curl -s -w "\nHTTP:%{http_code}\nTIME:%{time_total}s" http://localhost:3001/api/health)
http_code=$(echo "$response" | grep "HTTP:" | cut -d: -f2)
response_time=$(echo "$response" | grep "TIME:" | cut -d: -f2)
body=$(echo "$response" | grep -v "HTTP:" | grep -v "TIME:")

if [ "$http_code" = "200" ]; then
    echo "✅ API响应正常 (HTTP $http_code)"
    echo "   响应时间: $response_time"
    echo "   响应内容: $body"
else
    echo "❌ API响应异常 (HTTP $http_code)"
    echo "   响应: $body"
    echo ""
    echo "查看日志:"
    tail -20 /tmp/backend.log
    exit 1
fi

echo ""
echo "========================================="
echo "✅ Backend重启成功！"
echo "========================================="
echo ""
echo "进程信息:"
ps aux | grep "node.*pet-keeper-backend" | grep -v grep | awk '{print "  PID:", $2, "CMD:", $11, $12}'
echo ""
echo "日志位置: /tmp/backend.log"
echo ""
echo "下一步:"
echo "1. 在微信开发者工具中重新编译小程序"
echo "2. 清除小程序缓存"
echo "3. 重新尝试登录"
echo ""
echo "查看实时日志:"
echo "tail -f /tmp/backend.log"
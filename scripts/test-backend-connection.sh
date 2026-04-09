#!/bin/bash

# 测试后端API连接脚本

echo "=== 后端API连接测试 ==="
echo ""

# 测试 localhost
echo "1. 测试 localhost:3001"
echo "----------------------"
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" http://localhost:3001/api/health)
http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
body=$(echo "$response" | grep -v "HTTP_CODE")

if [ "$http_code" = "200" ]; then
  echo "✅ localhost 连接成功"
  echo "响应: $body"
else
  echo "❌ localhost 连接失败 (HTTP $http_code)"
fi

echo ""

# 测试局域网IP
echo "2. 测试局域网IP: 192.168.3.20:3001"
echo "----------------------------------"
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" http://192.168.3.20:3001/api/health 2>&1)
http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
body=$(echo "$response" | grep -v "HTTP_CODE")

if [ "$http_code" = "200" ]; then
  echo "✅ 局域网IP 连接成功"
  echo "响应: $body"
else
  echo "❌ 局域网IP 连接失败"
  echo "错误: $body"
fi

echo ""

# 测试登录端点
echo "3. 测试登录端点 (POST)"
echo "----------------------"
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}')
http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
body=$(echo "$response" | grep -v "HTTP_CODE")

echo "状态码: HTTP $http_code"
echo "响应: $body"

echo ""
echo "=== 测试完成 ==="
echo ""
echo "如果 localhost 和 IP 都能连接成功，说明后端运行正常"
echo "小程序无法连接是微信开发者工具的安全限制问题"
echo ""
echo "请查看 /docs/NETWORK_ERROR_FIX.md 了解如何配置微信开发者工具"
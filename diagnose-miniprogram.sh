#!/bin/bash

echo "========================================="
echo "小程序网络连接诊断"
echo "========================================="
echo ""

# 1. 检查后端服务
echo "1. 检查后端服务..."
BACKEND_RESPONSE=$(curl -s http://localhost:3001/api/health)
if echo "$BACKEND_RESPONSE" | grep -q "ok"; then
    echo "✅ 后端服务运行正常"
    echo "   响应: $BACKEND_RESPONSE"
else
    echo "❌ 后端服务未运行"
    echo "   请运行: cd /Users/mac/zrby/pet-keeper-backend && npm run dev"
    exit 1
fi
echo ""

# 2. 检查端口
echo "2. 检查端口监听..."
if lsof -i:3001 | grep -q LISTEN; then
    echo "✅ 端口3001正在监听"
else
    echo "❌ 端口3001未监听"
    exit 1
fi
echo ""

# 3. 检查小程序配置
echo "3. 检查小程序API配置..."
API_URL=$(grep "apiBaseUrl" /Users/mac/zrby/pet-keeper-miniprogram/app.js | head -1)
echo "当前配置: $API_URL"
echo ""

# 4. 测试不同地址
echo "4. 测试连接..."
echo "   测试 localhost..."
curl -s -o /dev/null -w "   状态码: %{http_code}\n" http://localhost:3001/api/health

echo "   测试 127.0.0.1..."
curl -s -o /dev/null -w "   状态码: %{http_code}\n" http://127.0.0.1:3001/api/health
echo ""

# 5. 获取本机IP
echo "5. 本机IP地址（手机预览需要）..."
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
if [ -n "$IP" ]; then
    echo "   本机IP: $IP"
    echo "   完整地址: http://$IP:3001/api"
else
    echo "   未找到本机IP"
fi
echo ""

echo "========================================="
echo "解决方案:"
echo "========================================="
echo ""
echo "方法1: 设置微信开发者工具（必须）"
echo "  1. 打开微信开发者工具"
echo "  2. 点击右上角'详情'"
echo "  3. 切换到'本地设置'标签"
echo "  4. 勾选'不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书'"
echo ""
echo "方法2: 修改小程序API地址"
echo "  编辑文件: /Users/mac/zrby/pet-keeper-miniprogram/app.js"
echo "  将第6行改为:"
echo "    apiBaseUrl: 'http://localhost:3001/api'"
echo ""
echo "方法3: 清除缓存"
echo "  微信开发者工具 → 清缓存 → 清除全部缓存"
echo "  然后点击'编译'重新加载"
echo ""
echo "方法4: 重启服务"
echo "  后端: cd /Users/mac/zrby/pet-keeper-backend && npm run dev"
echo "  开发工具: 完全关闭后重新打开"
echo ""

echo "✅ 诊断完成！"
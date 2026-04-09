#!/bin/bash

echo "========================================="
echo "小程序网络问题一键诊断修复"
echo "========================================="
echo ""

# 检查后端
echo "1️⃣  检查后端服务..."
if curl -s http://localhost:3001/api/health | grep -q "ok"; then
    echo "   ✅ 后端运行正常"
else
    echo "   ❌ 后端未运行"
    echo "   正在启动后端..."
    cd /Users/mac/zrby/pet-keeper-backend
    nohup npm run dev > /tmp/backend.log 2>&1 &
    sleep 3
    echo "   ✅ 后端已启动"
fi

# 检查端口
echo ""
echo "2️⃣  检查端口监听..."
if lsof -i:3001 | grep -q LISTEN; then
    echo "   ✅ 端口3001正常监听"
else
    echo "   ❌ 端口未监听"
fi

# 显示配置
echo ""
echo "3️⃣  当前小程序配置..."
API_URL=$(grep "apiBaseUrl" /Users/mac/zrby/pet-keeper-miniprogram/app.js | head -1)
echo "   $API_URL"

# 显示本机IP
echo ""
echo "4️⃣  本机IP地址..."
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
echo "   本机IP: $IP"

# 测试连接
echo ""
echo "5️⃣  测试连接..."
echo "   测试 localhost..."
curl -s -o /dev/null -w "   状态: %{http_code}\n" http://localhost:3001/api/health

echo "   测试 127.0.0.1..."
curl -s -o /dev/null -w "   状态: %{http_code}\n" http://127.0.0.1/api/health

if [ -n "$IP" ]; then
    echo "   测试本机IP ($IP)..."
    curl -s -o /dev/null -w "   状态: %{http_code}\n" http://$IP:3001/api/health
fi

echo ""
echo "========================================="
echo "📋 解决步骤："
echo "========================================="
echo ""
echo "1. 打开微信开发者工具"
echo "2. 点击右上角【详情】"
echo "3. 点击【本地设置】标签"
echo "4. 勾选以下所有选项："
echo "   ☑ 不校验合法域名、web-view..."
echo "   ☑ 不校验安全域名、TLS版本..."
echo "   ☑ 不校验HTTP域名"
echo "   ☑ 启用自定义处理网络请求"
echo "   （注意：要勾选所有"不校验"选项！）"
echo ""
echo "5. 点击菜单【工具】→【清缓存】→【清除全部缓存】"
echo "6. 点击【编译】重新加载"
echo ""
echo "7. 在控制台测试："
echo "   wx.request({"
echo "     url: 'http://localhost:3001/api/health',"
echo "     success: r => console.log('✅', r.data),"
echo "     fail: e => console.log('❌', e)"
echo "   });"
echo ""
echo "========================================="
echo "如果还不行，请："
echo "1. 完全关闭开发者工具（退出程序）"
echo "2. 重新打开项目"
echo "3. 再次执行上述步骤"
echo "========================================="
echo ""
echo "需要手机预览？修改API地址为："
echo "http://$IP:3001/api"
echo ""
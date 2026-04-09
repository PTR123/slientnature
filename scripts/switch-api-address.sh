#!/bin/bash

# 切换小程序API地址脚本
# 用于解决微信开发者工具网络连接问题

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_JS="$SCRIPT_DIR/../pet-keeper-miniprogram/app.js"
LOCAL_IP="192.168.3.20"

echo "=== 小程序API地址切换工具 ==="
echo ""
echo "当前可用选项:"
echo "1. localhost (当前配置)"
echo "2. 局域网IP地址 (192.168.3.20)"
echo ""
echo "请选择要使用的地址 [1/2]:"
read -r choice

case $choice in
  1)
    # 使用 localhost
    if grep -q "http://localhost:3001/api" "$APP_JS"; then
      echo "✅ 已经在使用 localhost，无需修改"
    else
      sed -i.bak "s|http://$LOCAL_IP:3001/api|http://localhost:3001/api|g" "$APP_JS"
      echo "✅ 已切换到 localhost"
      echo "📝 请在微信开发者工具中重新编译项目"
    fi
    ;;

  2)
    # 使用局域网IP
    if grep -q "http://$LOCAL_IP:3001/api" "$APP_JS"; then
      echo "✅ 已经在使用局域网IP，无需修改"
    else
      sed -i.bak "s|http://localhost:3001/api|http://$LOCAL_IP:3001/api|g" "$APP_JS"
      echo "✅ 已切换到局域网IP地址 (192.168.3.20)"
      echo ""
      echo "⚠️  重要提示:"
      echo "   1. 确保后端服务器允许局域网访问"
      echo "   2. 确保手机和电脑在同一局域网"
      echo "   3. 在微信开发者工具中重新编译项目"
      echo "   4. 可能需要配置微信开发者工具的本地设置"
    fi
    ;;

  *)
    echo "❌ 无效的选择，请输入 1 或 2"
    exit 1
    ;;
esac

echo ""
echo "当前配置:"
grep "apiBaseUrl" "$APP_JS" | head -1

echo ""
echo "完成后请:"
echo "1. 在微信开发者工具中点击 '编译' 按钮"
echo "2. 清除缓存 (详情 → 本地设置 → 清缓存)"
echo "3. 测试登录功能"
#!/bin/bash

# PetKeeper 快速部署脚本

echo "🚀 PetKeeper 部署工具"
echo "====================="
echo ""
echo "请选择部署方式："
echo ""
echo "1) 本地开发环境（一键启动）"
echo "2) 构建 APK（Android）"
echo "3) 部署到 Railway + Vercel（免费云）"
echo "4) 私有服务器部署"
echo "5) 查看部署状态"
echo "6) 停止所有服务"
echo ""
read -p "请输入选项 (1-6): " choice

case $choice in
  1)
    echo ""
    echo "📦 启动本地开发环境..."
    ./start-all.sh
    ;;
  2)
    echo ""
    echo "📱 构建 Android APK..."
    cd PetKeeperMobile/android
    export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
    export ANDROID_HOME="$HOME/Library/Android/sdk"
    ./gradlew assembleDebug
    echo ""
    echo "✅ APK 构建完成！"
    echo "位置: PetKeeperMobile/android/app/build/outputs/apk/debug/app-debug.apk"
    ;;
  3)
    echo ""
    echo "🌐 云平台部署指南"
    echo "=================="
    echo ""
    echo "后端部署（Railway）："
    echo "1. 访问 https://railway.app 注册账号"
    echo "2. 运行: railway login"
    echo "3. 运行: cd pet-keeper-backend && railway init && railway up"
    echo ""
    echo "前端部署（Vercel）："
    echo "1. 访问 https://vercel.com 注册账号"
    echo "2. 运行: vercel login"
    echo "3. 运行: cd pet-keeper && vercel"
    echo ""
    echo "详细步骤请查看: QUICK_DEPLOY_GUIDE.md"
    ;;
  4)
    echo ""
    echo "🖥️  私有服务器部署"
    echo "=================="
    echo ""
    echo "推荐配置："
    echo "- CPU: 2核+"
    echo "- 内存: 4GB+"
    echo "- 存储: 20GB+"
    echo "- 系统: Ubuntu 20.04+"
    echo ""
    read -p "是否继续？(y/n) " confirm
    if [ "$confirm" = "y" ]; then
      ./server-setup.sh
    fi
    ;;
  5)
    echo ""
    echo "📊 服务状态"
    echo "==========="
    echo ""
    echo "后端服务:"
    lsof -i :3001 | grep LISTEN && echo "✅ 后端运行中" || echo "❌ 后端未运行"
    echo ""
    echo "前端服务:"
    lsof -i :5173 | grep LISTEN && echo "✅ 前端运行中" || echo "❌ 前端未运行"
    echo ""
    if command -v pm2 &> /dev/null; then
      echo "PM2 进程:"
      pm2 list
    fi
    ;;
  6)
    echo ""
    echo "🛑 停止所有服务..."
    ./stop-all.sh
    echo "✅ 所有服务已停止"
    ;;
  *)
    echo ""
    echo "❌ 无效选项"
    ;;
esac
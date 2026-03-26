#!/bin/bash

# PetKeeper Android APK 构建脚本

echo "📦 开始构建 PetKeeper Android APK..."
echo ""

cd /Users/mac/my_gzh/zrby/pet-keeper-mobile

# 检查是否安装了EAS CLI
if ! command -v eas &> /dev/null; then
    echo "⚠️  EAS CLI 未安装"
    echo "正在安装 EAS CLI..."
    npm install -g eas-cli
fi

# 检查是否登录
echo ""
echo "📝 注意: 如果需要云端构建，请先运行 'eas login'"
echo ""

# 本地构建 APK
echo "🚀 开始本地构建..."
echo "⏱️  预计耗时: 5-10 分钟"
echo ""

npx expo run:android --variant release

echo ""
echo "✅ 构建完成！"
echo "📱 APK位置: android/app/build/outputs/apk/release/app-release.apk"
echo ""
echo "📲 安装方法:"
echo "   1. 将APK传输到手机"
echo "   2. 点击安装"
echo "   3. 允许未知来源安装"
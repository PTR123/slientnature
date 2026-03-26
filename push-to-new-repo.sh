#!/bin/bash

echo "🚀 推送代码到自然不语app 仓库"
echo "================================"
echo ""

# 尝试推送
echo "正在推送代码..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 推送成功！"
    echo ""
    echo "仓库地址: https://github.com/PTR123/ziranbuyu-app"
    echo ""
    echo "接下来可以部署到云平台了！"
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "可能的原因："
    echo "1. 网络连接问题"
    echo "2. GitHub 访问受限"
    echo ""
    echo "解决方案："
    echo ""
    echo "方法 1: 使用代理"
    echo "  git config --global http.proxy http://127.0.0.1:7890"
    echo "  git push origin main"
    echo ""
    echo "方法 2: 使用 GitHub Desktop"
    echo "  下载: https://desktop.github.com"
    echo "  登录后点击 Push 按钮"
    echo ""
    echo "方法 3: 等网络恢复后再试"
    echo "  稍后手动执行: git push origin main"
fi
#!/bin/bash

# 前端部署到Vercel脚本
# 使用方法: ./deploy-frontend-vercel.sh

set -e

echo "🚀 PetKeeper前端Vercel部署"
echo "============================"
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ] || [ ! -d "pages" ] || [ ! -d "app" ]; then
    echo "❌ 请在pet-keeper前端目录运行此脚本"
    echo "当前目录应该是: pet-keeper/"
    exit 1
fi

# 检查Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 Vercel CLI未安装，正在安装..."
    npm install -g vercel
fi

echo "✅ Vercel CLI已安装"
echo ""

# 检查是否已登录
echo "🔐 检查Vercel登录状态..."
if ! vercel whoami &> /dev/null; then
    echo "⚠️  未登录Vercel，请先登录:"
    vercel login
fi

echo "✅ 已登录Vercel: $(vercel whoami)"
echo ""

# 检查vercel.json配置
if [ ! -f "vercel.json" ]; then
    echo "⚠️  vercel.json不存在，请先创建配置文件"
    exit 1
fi

echo "✅ vercel.json配置文件已准备"
echo ""

# 显示当前环境变量配置
echo "📋 环境变量配置提示:"
echo ""
echo "部署前需要在Vercel Dashboard配置环境变量:"
echo "1. 登录 https://vercel.com"
echo "2. 进入项目 Settings > Environment Variables"
echo "3. 添加变量:"
echo "   - NEXT_PUBLIC_API_URL = https://api.yourdomain.com"
echo "   或使用NAS Tailscale IP:"
echo "   - NEXT_PUBLIC_API_URL = http://100.101.102.103:3001"
echo ""
read -p "是否已配置好环境变量? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "⚠️  请先配置环境变量后再部署"
    echo "参考: .env.vercel 文件"
    exit 0
fi

echo ""
echo "🚀 开始部署..."
echo ""

# 部署到Vercel
echo "📦 部署到Vercel Production环境..."
vercel --prod

echo ""
echo "✅ 部署完成!"
echo ""

# 获取部署URL
DEPLOY_URL=$(vercel inspect --prod 2>/dev/null | grep "Production URL" | awk '{print $3}' || echo "")

if [ -n "$DEPLOY_URL" ]; then
    echo "🌐 前端访问地址:"
    echo "   Production: $DEPLOY_URL"
    echo ""
else
    echo "🌐 查看部署地址:"
    echo "   Vercel Dashboard: https://vercel.com"
    echo "   或运行: vercel inspect --prod"
fi

echo ""
echo "⚠️  重要提示:"
echo "1. 确保后端API已部署并可访问"
echo "2. CORS配置允许Vercel域名访问"
echo "3. 测试前端功能是否正常"
echo ""
echo "🧪 测试命令:"
echo "curl $DEPLOY_URL"
echo "curl ${NEXT_PUBLIC_API_URL}/api/health"
echo ""

echo "🎉 前端部署成功!"
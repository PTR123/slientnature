#!/bin/bash

# PetKeeper Vercel 部署脚本

echo "🌐 开始部署前端到 Vercel..."
echo ""

# 读取后端 URL
read -p "请输入 Railway 后端 URL (例如: https://your-app.up.railway.app): " backend_url

# 进入前端目录
cd pet-keeper

# 部署到 Vercel
echo "📦 部署到 Vercel..."
vercel --prod

# 设置环境变量
echo "⚙️  设置环境变量..."
vercel env add NEXT_PUBLIC_API_URL production
echo "${backend_url}/api"

echo ""
echo "✅ 前端部署完成！"
echo "前端地址: https://your-app.vercel.app"
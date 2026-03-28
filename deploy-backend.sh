#!/bin/bash

# PetKeeper Railway 部署脚本

echo "🚀 开始部署后端到 Railway..."
echo ""

# 进入后端目录
cd pet-keeper-backend

# 初始化 Railway 项目
echo "📦 初始化 Railway 项目..."
railway init

# 添加 PostgreSQL 数据库
echo "🗄️  添加 PostgreSQL 数据库..."
railway add --plugin postgresql

# 设置环境变量
echo "⚙️  设置环境变量..."
railway variables set JWT_SECRET="$(openssl rand -base64 32)"
railway variables set NODE_ENV=production

# 部署
echo "🚀 部署到 Railway..."
railway up

# 运行数据库迁移
echo "📊 运行数据库迁移..."
railway run npm run db:migrate:deploy

# 填充初始数据
echo "🌱 填充初始数据..."
railway run npm run db:seed

# 获取域名
echo "🌐 获取后端 URL..."
railway domain

echo ""
echo "✅ 后端部署完成！"
echo "后端地址: https://your-app.up.railway.app"
#!/bin/bash

# 后端初始化脚本

echo "🚀 初始化 PetKeeper 后端..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js"
    exit 1
fi

# 安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 初始化数据库
if [ ! -f "prisma/dev.db" ]; then
    echo "🗄️ 初始化数据库..."
    npx prisma generate
    npx prisma db push
    npx tsx src/seed.ts
    echo "✅ 数据库初始化完成"
else
    echo "✅ 数据库已存在"
fi

# 启动服务器
echo "🌟 启动服务器..."
npm run dev
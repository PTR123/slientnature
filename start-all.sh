#!/bin/bash

# PetKeeper 一键启动脚本

echo "🚀 启动 PetKeeper 全栈应用..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 后端目录
BACKEND_DIR="/Users/mac/my_gzh/zrby/pet-keeper-backend"
FRONTEND_DIR="/Users/mac/my_gzh/zrby/pet-keeper"
MOBILE_DIR="/Users/mac/my_gzh/zrby/pet-keeper-mobile"

# 启动后端
echo ""
echo "📡 启动后端 API..."
cd "$BACKEND_DIR"

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "安装后端依赖..."
    npm install
fi

# 检查数据库
if [ ! -f "prisma/dev.db" ]; then
    echo "初始化数据库..."
    npx prisma generate
    npx prisma db push
    npx tsx src/seed.ts
fi

# 启动后端（后台运行）
npm run dev &
BACKEND_PID=$!
echo "✅ 后端已启动 (PID: $BACKEND_PID)"
echo "   地址: http://localhost:3001"

# 等待后端启动
sleep 3

# 启动 Web 前端
echo ""
echo "🌐 启动 Web 前端..."
cd "$FRONTEND_DIR"

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "安装前端依赖..."
    npm install
fi

# 启动前端（后台运行）
npm run dev &
FRONTEND_PID=$!
echo "✅ Web 前端已启动 (PID: $FRONTEND_PID)"
echo "   地址: http://localhost:3000"

echo ""
echo "🎉 所有服务启动完成！"
echo ""
echo "📍 访问地址："
echo "   - Web 应用: http://localhost:3000"
echo "   - API 文档: http://localhost:3001/api/health"
echo ""
echo "📝 测试账号："
echo "   - Email: test@example.com"
echo "   - Password: password123"
echo ""
echo "💡 提示："
echo "   - 按 Ctrl+C 停止所有服务"
echo "   - 查看日志: ps aux | grep 'node.*pet-keeper'"
echo ""

# 等待用户中断
trap "echo ''; echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

wait
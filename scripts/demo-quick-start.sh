#!/bin/bash

# 客户演示快速启动脚本
# 用于一键启动所有服务并检查状态

echo "🎯 准备客户演示环境..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js未安装${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js版本: $(node -v)${NC}"
echo ""

# 检查服务是否已运行
BACKEND_PID=$(lsof -ti:3001)
FRONTEND_PID=$(lsof -ti:3000)

if [ ! -z "$BACKEND_PID" ] && [ ! -z "$FRONTEND_PID" ]; then
    echo -e "${YELLOW}⚠️  服务已运行中${NC}"
    echo "   后端PID: $BACKEND_PID"
    echo "   前端PID: $FRONTEND_PID"
    echo ""

    # 测试API健康
    HEALTH=$(curl -s http://localhost:3001/api/health)
    if [ ! -z "$HEALTH" ]; then
        echo -e "${GREEN}✅ API健康检查: $HEALTH${NC}"
    else
        echo -e "${RED}❌ API健康检查失败${NC}"
        echo "   重启服务..."
        pkill -f "node.*pet-keeper"
        sleep 2
    fi
else
    echo "启动服务..."
    pkill -f "node.*pet-keeper"
    sleep 1
fi

# 启动后端
echo ""
echo "📡 启动后端API..."
cd pet-keeper-backend

if [ ! -d "node_modules" ]; then
    echo "安装后端依赖..."
    npm install
fi

if [ ! -f "prisma/dev.db" ]; then
    echo "初始化数据库..."
    npx prisma generate
    npx prisma db push
    npx tsx src/seed.ts
fi

# 启动后端（后台）
npm run dev > /tmp/pet-keeper-backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ 后端已启动 (PID: $BACKEND_PID)${NC}"
echo "   地址: http://localhost:3001"

sleep 3

# 启动前端
echo ""
echo "🌐 启动Web前端..."
cd ../pet-keeper

if [ ! -d "node_modules" ]; then
    echo "安装前端依赖..."
    npm install
fi

npm run dev > /tmp/pet-keeper-frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ 前端已启动 (PID: $FRONTEND_PID)${NC}"
echo "   地址: http://localhost:3000"

sleep 5

# 检查启动状态
echo ""
echo "🔍 检查服务状态..."

# 测试API
API_TEST=$(curl -s http://localhost:3001/api/health)
if [ ! -z "$API_TEST" ]; then
    echo -e "${GREEN}✅ 后端API正常${NC}"
else
    echo -e "${RED}❌ 后端API异常${NC}"
fi

# 测试前端
FRONTEND_TEST=$(curl -s http://localhost:3000 | grep -o "自然不语")
if [ ! -z "$FRONTEND_TEST" ]; then
    echo -e "${GREEN}✅ 前端页面正常${NC}"
else
    echo -e "${RED}❌ 前端页面异常${NC}"
fi

# 数据统计
echo ""
echo "📊 数据统计..."
SPECIES_COUNT=$(sqlite3 pet-keeper-backend/prisma/dev.db "SELECT COUNT(*) FROM Species;")
USER_COUNT=$(sqlite3 pet-keeper-backend/prisma/dev.db "SELECT COUNT(*) FROM User;")
PET_COUNT=$(sqlite3 pet-keeper-backend/prisma/dev.db "SELECT COUNT(*) FROM Pet;")

echo -e "${GREEN}   物种数量: $SPECIES_COUNT${NC}"
echo -e "${GREEN}   用户数量: $USER_COUNT${NC}"
echo -e "${GREEN}   宠物档案: $PET_COUNT${NC}"

echo ""
echo -e "${GREEN}🎉 演示环境已准备完成！${NC}"
echo ""
echo "📍 访问地址："
echo "   - Web应用: http://localhost:3000"
echo "   - API文档: http://localhost:3001/api/health"
echo "   - 物种图鉴: http://localhost:3000/species"
echo "   - 我的宠物: http://localhost:3000/my-pets"
echo "   - 社区板块: http://localhost:3000/community"
echo ""
echo "📝 演示账号："
echo "   - Email: test@example.com"
echo "   - Password: password123"
echo ""
echo "💡 提示："
echo "   - 按 Ctrl+C 停止服务"
echo "   - 查看日志: tail -f /tmp/pet-keeper-*.log"
echo "   - 演示指南: docs/CLIENT_DEMO_PREPARATION.md"
echo ""

# 等待用户中断
trap "echo ''; echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID; echo -e '${GREEN}✅ 服务已停止${NC}'; exit" INT

wait
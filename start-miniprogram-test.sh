#!/bin/bash

# PetKeeper 小程序本地测试启动脚本

echo "🚀 启动 PetKeeper 本地测试环境..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 启动后端
echo -e "${YELLOW}[1/3] 启动后端服务...${NC}"
cd /Users/mac/zrby/pet-keeper-backend
npm run dev &
BACKEND_PID=$!
echo "后端 PID: $BACKEND_PID"

# 等待后端启动
sleep 3

# 检查后端状态
echo -e "${YELLOW}[2/3] 检查后端状态...${NC}"
HEALTH_CHECK=$(curl -s http://localhost:3001/api/health)

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ 后端启动成功${NC}"
  echo "健康检查: $HEALTH_CHECK"
else
  echo "❌ 后端启动失败"
  kill $BACKEND_PID
  exit 1
fi

echo ""
echo -e "${GREEN}[3/3] 启动完成！${NC}"
echo ""
echo "==================================="
echo "📡 后端地址: http://localhost:3001"
echo "🏥 健康检查: http://localhost:3001/api/health"
echo "📱 小程序配置: localhost:3001/api"
echo "==================================="
echo ""
echo "📝 接下来："
echo "1. 打开微信开发者工具"
echo "2. 导入项目: /Users/mac/zrby/pet-keeper-miniprogram"
echo "3. 详情 → 本地设置 → 勾选'不校验合法域名'"
echo "4. 点击'编译'开始测试"
echo ""
echo "按 Ctrl+C 停止服务..."

# 等待中断信号
trap "echo ''; echo '🛑 停止服务...'; kill $BACKEND_PID; exit 0" INT TERM

# 保持运行
wait
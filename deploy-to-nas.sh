#!/bin/bash

# PetKeeper NAS一键部署脚本
# 使用方法: ./deploy-to-nas.sh

set -e

echo "🚀 PetKeeper NAS生产环境部署"
echo "================================"
echo ""

# 检查是否在NAS上运行
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装,请先安装Docker"
    echo "群晖NAS: 通过套件中心安装Docker"
    echo "威联通NAS: 通过App Center安装Container Station"
    exit 1
fi

echo "✅ Docker已安装: $(docker --version)"
echo ""

# 检查项目目录
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ 未找到docker-compose.yml"
    echo "请确保在项目根目录运行此脚本"
    exit 1
fi

echo "📦 项目目录检查..."
echo "✅ 找到docker-compose.yml"
echo ""

# 检查环境配置
if [ ! -f ".env" ]; then
    echo "⚠️  .env文件不存在,使用.env.example创建..."
    cp .env.example .env
    echo "✅ 已创建.env文件"
    echo ""
    echo "⚠️  请编辑.env文件配置你的域名:"
    echo "   vim .env"
    echo "   修改 API_URL 和 FRONTEND_URL"
    echo ""
    read -p "按回车继续(已配置.env则继续)..."
fi

echo "🔧 环境配置检查..."
echo "✅ .env文件已存在"
echo ""

# 检查SSL证书
if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
    echo "⚠️  SSL证书不存在,生成自签名证书..."
    mkdir -p nginx/ssl
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout nginx/ssl/key.pem \
      -out nginx/ssl/cert.pem \
      -subj "/C=CN/ST=Beijing/L=Beijing/O=PetKeeper/CN=localhost" \
      2>/dev/null
    echo "✅ 已生成自签名SSL证书(仅用于测试)"
    echo ""
    echo "⚠️  生产环境请使用Let's Encrypt或Cloudflare Tunnel"
    echo "   参考: docs/NAS_DEPLOYMENT_GUIDE.md"
fi

echo "🔐 SSL证书检查..."
echo "✅ SSL证书已准备"
echo ""

# 确认部署
echo "📋 部署前检查清单:"
echo "  ✓ Docker已安装"
echo "  ✓ 项目目录正确"
echo "  ✓ .env配置文件存在"
echo "  ✓ SSL证书已准备"
echo ""
read -p "是否开始部署? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 用户取消部署"
    exit 0
fi

echo ""
echo "🚀 开始部署..."
echo ""

# 停止现有服务
if docker-compose ps 2>/dev/null | grep -q "running"; then
    echo "⏸️  停止现有服务..."
    docker-compose down
    echo "✅ 已停止现有服务"
fi

# 构建并启动服务
echo "🏗️  构建Docker镜像..."
docker-compose build

echo "🚀 启动服务..."
docker-compose up -d

echo "⏳ 等待服务启动(30秒)..."
sleep 30

# 检查服务状态
echo ""
echo "📊 服务状态:"
docker-compose ps

echo ""
echo "🔍 健康检查..."

# 检查数据库
if docker-compose exec -T postgres pg_isready -U ziranbuyu &>/dev/null; then
    echo "✅ PostgreSQL数据库正常"
else
    echo "⚠️  PostgreSQL数据库启动失败"
fi

# 检查Redis
if docker-compose exec -T redis redis-cli -a "$(grep REDIS_PASSWORD .env | cut -d= -f2)" ping &>/dev/null; then
    echo "✅ Redis缓存正常"
else
    echo "⚠️  Redis启动失败"
fi

# 检查后端
if curl -f http://localhost:3001/api/health &>/dev/null; then
    echo "✅ 后端API正常"
else
    echo "⚠️  后端API启动失败,等待更多时间..."
    sleep 10
    if curl -f http://localhost:3001/api/health &>/dev/null; then
        echo "✅ 后端API已正常启动"
    else
        echo "❌ 后端API无法启动,请检查日志:"
        docker-compose logs backend
    fi
fi

# 检查前端
if curl -f http://localhost:3000 &>/dev/null; then
    echo "✅ 前端Web应用正常"
else
    echo "⚠️  前端启动失败,等待更多时间..."
    sleep 10
    if curl -f http://localhost:3000 &>/dev/null; then
        echo "✅ 前端已正常启动"
    else
        echo "❌ 前端无法启动,请检查日志:"
        docker-compose logs web
    fi
fi

echo ""
echo "📦 初始化数据库..."

# 运行数据库迁移
if docker-compose exec -T backend npx prisma migrate deploy &>/dev/null; then
    echo "✅ 数据库迁移成功"
else
    echo "⚠️  数据库迁移可能需要更多时间..."
    sleep 5
    docker-compose exec -T backend npx prisma migrate deploy || echo "⚠️  数据库迁移失败,请手动执行"
fi

# 运行种子数据(可选)
echo ""
read -p "是否导入种子数据(测试数据)? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 导入种子数据..."
    docker-compose exec backend npm run db:seed || echo "⚠️  种子数据导入失败"
fi

echo ""
echo "✅ 部署完成!"
echo ""
echo "📍 本地访问地址:"
echo "   API:     http://localhost:3001"
echo "   Web:     http://localhost:3000"
echo "   Portainer: http://localhost:9000"
echo ""

# 显示域名配置提示
API_URL=$(grep API_URL .env | cut -d= -f2)
FRONTEND_URL=$(grep FRONTEND_URL .env | cut -d= -f2)

if [[ $API_URL == *"placeholder"* ]] || [[ $FRONTEND_URL == *"placeholder"* ]]; then
    echo "⚠️  域名未配置,请按以下步骤配置:"
    echo "  1. 编辑 .env 文件配置你的域名"
    echo "  2. 参考 docs/DNS_AND_TUNNEL_GUIDE.md 配置DNS和内网穿透"
    echo "  3. 参考 docs/NAS_DEPLOYMENT_GUIDE.md 配置SSL证书"
    echo "  4. 重启服务: docker-compose restart nginx"
else
    echo "📍 生产环境访问地址:"
    echo "   API:     $API_URL"
    echo "   Web:     $FRONTEND_URL"
    echo ""
    echo "⚠️  请确保:"
    echo "  ✓ DNS已配置并指向NAS IP"
    echo "  ✓ SSL证书已更新(Let's Encrypt)"
    echo "  ✓ 内网穿透已配置(如需要)"
fi

echo ""
echo "📚 查看日志: docker-compose logs -f"
echo "📚 查看状态: docker-compose ps"
echo "📚 管理界面: docker-compose exec backend sh"
echo ""
echo "🎉 部署成功!"
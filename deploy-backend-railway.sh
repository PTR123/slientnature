#!/bin/bash

# Railway部署后端脚本
# 使用方法: ./deploy-backend-railway.sh

set -e

echo "🚀 PetKeeper后端Railway部署"
echo "=============================="
echo ""

# 检查railway.json配置
if [ ! -f "railway.json" ]; then
    echo "❌ railway.json不存在"
    exit 1
fi

echo "✅ railway.json配置已准备"
echo ""

# 检查GitHub仓库
if [ ! -d ".git" ]; then
    echo "🔧 初始化Git仓库..."
    git init
    echo "✅ Git已初始化"
fi

# 提示用户信息
echo "📋 Railway部署步骤:"
echo ""
echo "1. 访问 https://railway.app"
echo "2. 点击 'Start a New Project'"
echo "3. 选择 'Deploy from GitHub repo'"
echo "4. 选择你的后端GitHub仓库"
echo "5. Railway会自动检测配置并构建"
echo ""
echo "6. 在Railway项目中添加服务:"
echo "   - PostgreSQL Database"
echo "   - Redis Database"
echo ""
echo "7. 配置环境变量(Railway Dashboard > Variables):"
echo "   - JWT_SECRET (至少32字符)"
echo "   - CORS_ORIGIN=https://你的vercel前端地址"
echo "   - NODE_ENV=production"
echo ""
echo "8. 运行数据库迁移:"
echo "   Railway Dashboard > Settings > CLI"
echo "   执行: npx prisma migrate deploy"
echo "   执行: npx prisma db seed"
echo ""
echo "9. 获取后端URL并测试:"
echo "   https://xxx.up.railway.app/api/health"
echo ""

echo "💡 提示:"
echo "- Railway会自动注入 DATABASE_URL 和 REDIS_URL"
echo "- 推送代码到GitHub后Railway自动部署"
echo "- 每次推送代码都会触发重新部署"
echo ""

echo "🎉 Railway配置完成!"
echo ""
echo "下一步: 推送代码到GitHub"
echo ""
read -p "是否现在推送代码到GitHub? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "稍后手动推送:"
    echo "git add ."
    echo "git commit -m 'Deploy to Railway'"
    echo "git remote add origin https://github.com/用户名/petkeeper-backend.git"
    echo "git push -u origin main"
    exit 0
fi

echo ""
echo "📤 推送代码..."

git add .
git commit -m "Deploy to Railway - $(date +%Y%m%d-%H%M%S)" || echo "⚠️  无新改动"

# 检查remote
if ! git remote | grep -q "origin"; then
    echo ""
    echo "⚠️  需要配置Git remote"
    echo ""
    read -p "请输入GitHub仓库URL: " REPO_URL
    git remote add origin "$REPO_URL"
fi

git push origin main || git push -u origin main

echo ""
echo "✅ 代码已推送到GitHub!"
echo ""
echo "🌐 现在去Railway部署:"
echo "   https://railway.app > New Project > Deploy from GitHub"
echo ""
echo "部署完成后,后端URL类似:"
echo "   https://petkeeper-backend-production.up.railway.app"
echo ""
echo "🎉 完成!"
#!/bin/bash

# 前端打包脚本 - 用于推送GitHub和Vercel部署
# 使用方法: ./pack-frontend.sh

set -e

echo "📦 PetKeeper前端打包工具"
echo "=========================="
echo ""

# 检查是否在项目根目录
if [ ! -d "pet-keeper" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    echo "当前目录应该是: /Users/mac/zrby/"
    exit 1
fi

# 进入前端目录
cd pet-keeper

echo "🎯 检查前端项目..."
echo ""

# 检查必要文件
if [ ! -f "package.json" ]; then
    echo "❌ package.json不存在"
    exit 1
fi

if [ ! -f "next.config.js" ]; then
    echo "❌ next.config.js不存在"
    exit 1
fi

# 检查vercel.json
if [ ! -f "vercel.json" ]; then
    echo "⚠️  vercel.json不存在,创建默认配置..."
    cat > vercel.json << 'EOF'
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "regions": ["hkg1", "sfo1", "iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
EOF
fi

echo "✅ 前端项目检查完成"
echo ""

# 检查是否是Git仓库
if [ ! -d ".git" ]; then
    echo "🔧 初始化Git仓库..."
    git init
    echo "✅ Git仓库已初始化"
fi

# 检查Git状态
echo "📋 检查Git状态..."
git status --short

echo ""
echo "环境变量配置提醒:"
echo "------------------"
echo "部署前需要在Vercel配置环境变量:"
echo ""
echo "变量名: NEXT_PUBLIC_API_URL"
echo ""
echo "值(根据后端部署方式选择):"
echo "1. Tailscale: http://100.101.102.103:3001"
echo "2. Cloudflare Tunnel: https://api.yourdomain.com"
echo "3. 域名: https://api.yourdomain.com"
echo ""
echo "在Vercel Dashboard > Settings > Environment Variables配置"
echo ""

# 添加所有文件到Git
echo "📦 添加文件到Git..."
git add .

# 显示即将提交的文件
echo ""
echo "即将提交的文件:"
git status --short
echo ""

read -p "是否继续提交并推送? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 用户取消操作"
    exit 0
fi

# Git提交
COMMIT_MSG="Prepare for Vercel deployment - $(date +%Y%m%d-%H%M%S)"
echo "💾 Git提交..."
git commit -m "$COMMIT_MSG"

echo "✅ Git提交完成"
echo ""

# 检查remote
if ! git remote | grep -q "origin"; then
    echo "⚠️  Git remote origin未配置"
    echo ""
    read -p "是否现在配置GitHub远程仓库? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        read -p "请输入GitHub仓库URL (如: https://github.com/username/petkeeper-frontend.git): " REPO_URL
        git remote add origin "$REPO_URL"
        echo "✅ Git remote已配置: $REPO_URL"
    else
        echo "⚠️  请稍后手动配置:"
        echo "git remote add origin https://github.com/your-username/petkeeper-frontend.git"
        exit 0
    fi
fi

# 推送到GitHub
echo "🚀 推送到GitHub..."
git push -u origin main || git push origin main

echo "✅ 代码已推送到GitHub"
echo ""

# 部署到Vercel
echo "🌐 Vercel部署步骤:"
echo "==================="
echo ""
echo "方法1: Vercel Dashboard(推荐)"
echo "------------------------------"
echo "1. 登录 https://vercel.com"
echo "2. 点击 'Add New Project'"
echo "3. 选择 'Import Git Repository'"
echo "4. 选择你的GitHub仓库"
echo "5. Framework: Next.js"
echo "6. 点击 'Deploy'"
echo ""
echo "方法2: Vercel CLI"
echo "-----------------"
echo "# 安装Vercel CLI"
echo "npm install -g vercel"
echo ""
echo "# 登录"
echo "vercel login"
echo ""
echo "# 部署"
echo "vercel --prod"
echo ""
echo "🎉 前端准备完成!"
echo ""
echo "下一步:"
echo "1. 在Vercel导入GitHub仓库"
echo "2. 配置环境变量 NEXT_PUBLIC_API_URL"
echo "3. 等待部署完成"
echo "4. 访问 https://your-app.vercel.app"
echo ""
echo "详细步骤请参考: ../docs/SPLIT_DEPLOYMENT_GUIDE.md"
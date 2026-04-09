#!/bin/bash

echo "========================================="
echo "图片功能诊断脚本"
echo "========================================="
echo ""

# 1. 检查后端服务
echo "1. 检查后端服务状态..."
BACKEND_RUNNING=$(curl -s http://localhost:3001/api/health | grep -c "ok")
if [ $BACKEND_RUNNING -eq 1 ]; then
    echo "✅ 后端服务运行正常"
else
    echo "❌ 后端服务未运行"
    echo "   请运行: cd /Users/mac/zrby/pet-keeper-backend && npm run dev"
fi
echo ""

# 2. 检查uploads目录
echo "2. 检查uploads目录..."
if [ -d "/Users/mac/zrby/pet-keeper-backend/uploads" ]; then
    FILE_COUNT=$(ls -1 /Users/mac/zrby/pet-keeper-backend/uploads/*.jpg 2>/dev/null | wc -l)
    FILE_COUNT=$((FILE_COUNT + $(ls -1 /Users/mac/zrby/pet-keeper-backend/uploads/*.png 2>/dev/null | wc -l)))
    echo "✅ uploads目录存在"
    echo "   图片文件数量: $FILE_COUNT"
else
    echo "❌ uploads目录不存在"
    echo "   创建中..."
    mkdir -p /Users/mac/zrby/pet-keeper-backend/uploads
    echo "✅ 目录已创建"
fi
echo ""

# 3. 测试图片访问
echo "3. 测试图片访问..."
FIRST_IMAGE=$(ls -t /Users/mac/zrby/pet-keeper-backend/uploads/*.jpg 2>/dev/null | head -1)
if [ -n "$FIRST_IMAGE" ]; then
    FILENAME=$(basename "$FIRST_IMAGE")
    IMAGE_URL="http://localhost:3001/uploads/$FILENAME"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$IMAGE_URL")
    if [ "$HTTP_CODE" -eq 200 ]; then
        echo "✅ 图片可以访问"
        echo "   URL: $IMAGE_URL"
        echo "   状态码: $HTTP_CODE"
    else
        echo "❌ 图片访问失败"
        echo "   URL: $IMAGE_URL"
        echo "   状态码: $HTTP_CODE"
    fi
else
    echo "⚠️  没有找到图片文件"
    echo "   请先上传一张图片"
fi
echo ""

# 4. 检查前端服务
echo "4. 检查前端服务状态..."
FRONTEND_RUNNING=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$FRONTEND_RUNNING" -eq 200 ]; then
    echo "✅ 前端服务运行正常"
else
    echo "❌ 前端服务未运行"
    echo "   请运行: cd /Users/mac/zrby/pet-keeper && npm run dev"
fi
echo ""

# 5. 显示可测试的URL
echo "========================================="
echo "测试URL列表:"
echo "========================================="
echo "后端健康检查: http://localhost:3001/api/health"
echo "前端首页: http://localhost:3000"
echo "物种图鉴: http://localhost:3000/species"
echo "管理后台: http://localhost:3000/admin"

if [ -n "$FIRST_IMAGE" ]; then
    echo ""
    echo "测试图片URL: $IMAGE_URL"
fi
echo ""

# 6. 显示最近的图片文件
echo "========================================="
echo "最近的图片文件:"
echo "========================================="
ls -lt /Users/mac/zrby/pet-keeper-backend/uploads/*.{jpg,png} 2>/dev/null | head -5 | awk '{print $9, "(" $5 " bytes)"}'
echo ""

echo "诊断完成！"
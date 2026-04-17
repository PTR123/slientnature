#!/bin/bash

# 小程序页面空白问题诊断脚本

echo "========================================="
echo "   小程序页面空白诊断"
echo "========================================="
echo ""

MINIPROGRAM_DIR="/Users/mac/zrby/pet-keeper-miniprogram"

# 1. 检查关键文件
echo "1. 检查关键文件是否存在"
echo "-------------------"

files=(
    "$MINIPROGRAM_DIR/app.js"
    "$MINIPROGRAM_DIR/app.json"
    "$MINIPROGRAM_DIR/pages/index/index.js"
    "$MINIPROGRAM_DIR/pages/index/index.wxml"
    "$MINIPROGRAM_DIR/pages/index/index.wxss"
    "$MINIPROGRAM_DIR/utils/api.js"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        dir=$(dirname "$file" | sed 's|.*/||')
        echo "✓ $dir/$filename"
    else
        echo "✗ 文件缺失: $file"
    fi
done

echo ""

# 2. 检查语法错误
echo "2. 检查JavaScript语法"
echo "-------------------"

cd "$MINIPROGRAM_DIR"

# 检查app.js
if node -c app.js 2>&1 | grep -q "SyntaxError"; then
    echo "✗ app.js 语法错误:"
    node -c app.js 2>&1 | grep "SyntaxError" -A 2
else
    echo "✓ app.js 语法正确"
fi

# 检查pages/index/index.js
if node -c pages/index/index.js 2>&1 | grep -q "SyntaxError"; then
    echo "✗ pages/index/index.js 语法错误:"
    node -c pages/index/index.js 2>&1 | grep "SyntaxError" -A 2
else
    echo "✓ pages/index/index.js 语法正确"
fi

# 检查utils/api.js
if node -c utils/api.js 2>&1 | grep -q "SyntaxError"; then
    echo "✗ utils/api.js 语法错误:"
    node -c utils/api.js 2>&1 | grep "SyntaxError" -A 2
else
    echo "✓ utils/api.js 语法正确"
fi

echo ""

# 3. 检查API配置
echo "3. 检查API配置"
echo "-------------------"

api_url=$(grep "apiBaseUrl" app.js | grep -o "'[^']*'" | head -1)
echo "当前API地址: $api_url"

if echo "$api_url" | grep -q "localhost"; then
    echo "✓ 使用localhost（适合模拟器）"
elif echo "$api_url" | grep -q "192.168"; then
    echo "⚠️  使用局域网IP（需要真机或配置）"
else
    echo "⚠️  API地址可能不正确"
fi

echo ""

# 4. 检查app.json
echo "4. 检查app.json配置"
echo "-------------------"

if [ -f "app.json" ]; then
    # 检查pages配置
    first_page=$(grep -A1 '"pages"' app.json | grep '"' | head -1 | grep -o '"[^"]*"' | tr -d '"')
    echo "首页路径: $first_page"

    if [ -f "$first_page.js" ]; then
        echo "✓ 首页JS文件存在"
    else
        echo "✗ 首页JS文件不存在"
    fi

    # 检查tabBar配置
    if grep -q '"tabBar"' app.json; then
        echo "✓ tabBar 已配置"
        tabbar_count=$(grep -c '"pagePath"' app.json)
        echo "  Tab数量: $((tabbar_count / 2))"
    else
        echo "⚠️  tabBar 未配置"
    fi
else
    echo "✗ app.json 不存在"
fi

echo ""

# 5. 检查图片资源
echo "5. 检查TabBar图标"
echo "-------------------"

if [ -d "assets/tabbar" ]; then
    icon_count=$(ls -1 assets/tabbar/*.png 2>/dev/null | wc -l)
    echo "图标文件数: $icon_count"

    if [ "$icon_count" -lt 8 ]; then
        echo "⚠️  TabBar图标不完整（需要8个）"
        echo "缺失的图标:"
        for name in home catalog community profile; do
            if [ ! -f "assets/tabbar/${name}-normal.png" ]; then
                echo "  ✗ ${name}-normal.png"
            fi
            if [ ! -f "assets/tabbar/${name}-selected.png" ]; then
                echo "  ✗ ${name}-selected.png"
            fi
        done
    else
        echo "✓ TabBar图标完整"
    fi
else
    echo "✗ assets/tabbar 目录不存在"
fi

echo ""

# 6. 测试Backend连接
echo "6. 测试Backend连接"
echo "-------------------"

if curl -s -w "HTTP:%{http_code}\n" http://localhost:3001/api/health | grep -q "HTTP:200"; then
    echo "✓ Backend响应正常"
else
    echo "✗ Backend无法连接"
fi

echo ""

# 7. 生成诊断建议
echo "========================================="
echo "           诊断建议"
echo "========================================="
echo ""

# 根据检查结果给出建议
if [ ! -f "assets/tabbar/home-normal.png" ]; then
    echo "❌ 问题: TabBar图标缺失"
    echo ""
    echo "解决方案:"
    echo "1. 创建图标目录: mkdir -p assets/tabbar"
    echo "2. 添加图标文件（8个PNG文件）"
    echo "   或暂时注释掉app.json中的tabBar配置"
    echo ""
fi

if curl -s http://localhost:3001/api/health 2>&1 | grep -q "Connection refused"; then
    echo "❌ 问题: Backend未运行"
    echo ""
    echo "解决方案:"
    echo "cd pet-keeper-backend && npm run dev"
    echo ""
fi

echo "通用解决方案:"
echo "1. 在微信开发者工具中点击「编译」重新编译"
echo "2. 点击「详情」→「本地设置」→「清除全部缓存」"
echo "3. 查看 Console 标签的错误信息"
echo "4. 查看 Network 标签的请求状态"
echo ""

echo "调试命令:"
echo "// 在Console中执行:"
echo "const app = getApp()"
echo "console.log('API:', app.globalData.apiBaseUrl)"
echo "console.log('Token:', app.globalData.token)"
echo "console.log('UserInfo:', app.globalData.userInfo)"
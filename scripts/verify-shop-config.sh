#!/bin/bash

# 商城tabBar配置验证脚本

echo "========================================="
echo "   商城TabBar配置验证"
echo "========================================="
echo ""

MINIPROGRAM_DIR="/Users/mac/zrby/pet-keeper-miniprogram"

cd "$MINIPROGRAM_DIR"

echo "1. 检查商城页面文件"
echo "-------------------"
if [ -f "pages/shop/shop.js" ]; then
    echo "✅ shop.js 存在"
else
    echo "❌ shop.js 不存在"
fi

if [ -f "pages/shop/shop.wxml" ]; then
    echo "✅ shop.wxml 存在"
else
    echo "❌ shop.wxml 不存在"
fi

echo ""

echo "2. 检查tabBar图标文件"
echo "-------------------"
if [ -f "assets/tabbar/shop-normal.png" ]; then
    echo "✅ shop-normal.png 存在"
else
    echo "❌ shop-normal.png 不存在"
fi

if [ -f "assets/tabbar/shop-selected.png" ]; then
    echo "✅ shop-selected.png 存在"
else
    echo "❌ shop-selected.png 不存在"
fi

echo ""

echo "3. 检查app.json配置"
echo "-------------------"
if grep -q '"pages/shop/shop"' app.json; then
    echo "✅ pages/shop/shop 已在pages数组中"
else
    echo "❌ pages/shop/shop 不在pages数组中"
fi

if grep -q '"pagePath": "pages/shop/shop"' app.json; then
    echo "✅ 商城tab已添加到tabBar"
else
    echo "❌ 商城tab未添加到tabBar"
fi

echo ""

echo "4. TabBar统计"
echo "-------------------"
tab_count=$(grep -c '"pagePath"' app.json | head -1)
echo "Tab数量: $tab_count"
if [ "$tab_count" = "5" ]; then
    echo "✅ 达到tabBar上限（5个）"
elif [ "$tab_count" -lt "5" ]; then
    echo "ℹ️  还可以添加 $((5 - tab_count)) 个tab"
else
    echo "⚠️  超过tabBar上限（最多5个）"
fi

echo ""

echo "========================================="
echo "           配置状态"
echo "========================================="

if [ -f "pages/shop/shop.js" ] && [ -f "assets/tabbar/shop-normal.png" ] && grep -q '"pagePath": "pages/shop/shop"' app.json; then
    echo ""
    echo "✅ 商城功能配置完成！"
    echo ""
    echo "下一步操作:"
    echo "1. 在微信开发者工具中点击「编译」"
    echo "2. 查看底部tabBar是否显示「商城」"
    echo "3. 点击「商城」tab测试商城功能"
    echo ""
else
    echo ""
    echo "❌ 商城功能配置不完整"
    echo ""
    echo "缺少的组件:"
    [ ! -f "pages/shop/shop.js" ] && echo "  - shop.js页面文件"
    [ ! -f "assets/tabbar/shop-normal.png" ] && echo "  - shop-normal.png图标"
    [ ! -f "assets/tabbar/shop-selected.png" ] && echo "  - shop-selected.png图标"
    ! grep -q '"pagePath": "pages/shop/shop"' app.json && echo "  - tabBar配置"
    echo ""
    echo "请修复以上问题后重新编译"
fi
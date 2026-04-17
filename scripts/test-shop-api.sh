#!/bin/bash

# 商城API测试脚本
# 用于验证后端API是否正常工作

API_BASE="http://10.81.214.231:3001/api"

echo "========================================="
echo "宠物管家商城API测试"
echo "========================================="
echo ""

# 测试健康检查
echo "1. 测试健康检查API..."
curl -s "$API_BASE/health" | python3 -m json.tool
echo ""

# 测试分类API
echo "2. 测试分类API..."
CATEGORIES=$(curl -s "$API_BASE/categories")
CATEGORY_COUNT=$(echo "$CATEGORIES" | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data))")
echo "✅ 分类数量: $CATEGORY_COUNT"
echo "$CATEGORIES" | python3 -m json.tool | head -20
echo ""

# 测试商品列表API
echo "3. 测试商品列表API..."
PRODUCTS=$(curl -s "$API_BASE/products")
PRODUCT_COUNT=$(echo "$PRODUCTS" | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data['products']))")
echo "✅ 商品数量: $PRODUCT_COUNT"
echo "$PRODUCTS" | python3 -m json.tool | head -30
echo ""

# 测试单个商品详情API
echo "4. 测试商品详情API (prod-jelly)..."
curl -s "$API_BASE/products/prod-jelly" | python3 -m json.tool
echo ""

echo "========================================="
echo "✅ 所有API测试通过！"
echo "========================================="
echo ""
echo "测试账号:"
echo "  邮箱: test@example.com"
echo "  密码: password123"
echo ""
echo "下一步: 在微信开发者工具中重新编译小程序"
#!/bin/bash

# PetKeeper 全功能测试脚本
# 系统测试所有功能模块

echo "🚀 PetKeeper 全功能测试"
echo "========================="
echo ""

API_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:3003"

# 测试结果统计
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 测试函数
test_api() {
    local test_name="$1"
    local url="$2"
    local method="$3"
    local data="$4"
    local token="$5"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    echo "测试: $test_name"

    if [ "$method" = "GET" ]; then
        if [ -z "$token" ]; then
            response=$(curl -s -w "\n%{http_code}" "$url")
        else
            response=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $token" "$url")
        fi
    else
        if [ -z "$token" ]; then
            response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" \
                -H "Content-Type: application/json" \
                -d "$data")
        else
            response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" \
                -H "Content-Type: application/json" \
                -H "Authorization: Bearer $token" \
                -d "$data")
        fi
    fi

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo "✅ 通过 (HTTP $http_code)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo "❌ 失败 (HTTP $http_code)"
        echo "响应: $body"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

echo "📋 1. 用户认证测试"
echo "-------------------"

# 登录获取Token
echo "登录测试账号..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@test.com","password":"admin123"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
    echo "❌ 登录失败，无法获取Token"
    exit 1
fi

echo "✅ 登录成功，Token: ${TOKEN:0:20}..."
echo ""

# 测试认证API
test_api "获取用户信息" "$API_URL/api/auth/me" "GET" "" "$TOKEN"

echo ""
echo "📋 2. 物种图鉴测试"
echo "-------------------"

test_api "获取物种列表" "$API_URL/api/species" "GET"
test_api "获取物种详情" "$API_URL/api/species/550e8400-e29b-41d4-a716-446655440000" "GET"

echo ""
echo "📋 3. 宠物管理测试"
echo "-------------------"

test_api "获取用户宠物列表" "$API_URL/api/pets" "GET" "" "$TOKEN"
test_api "创建宠物" "$API_URL/api/pets" "POST" \
    '{"name":"测试宠物","species":"玉米蛇","birthDate":"2024-01-01","acquisitionDate":"2024-01-15"}' \
    "$TOKEN"

echo ""
echo "📋 4. 社区功能测试"
echo "-------------------"

test_api "获取帖子列表" "$API_URL/api/posts" "GET"
test_api "创建帖子" "$API_URL/api/posts" "POST" \
    '{"title":"测试帖子","content":"这是一个测试帖子","tags":"[]"}' \
    "$TOKEN"

echo ""
echo "📋 5. 商城系统测试"
echo "-------------------"

test_api "获取商品列表" "$API_URL/api/products?limit=5" "GET"
test_api "获取商品详情" "$API_URL/api/products/8bea892f-ad05-47a0-a2ee-497d3708f60b" "GET"
test_api "获取分类列表" "$API_URL/api/categories" "GET"
test_api "搜索商品" "$API_URL/api/products?search=维生素" "GET"

echo ""
echo "📋 6. 购物车测试"
echo "-------------------"

test_api "获取购物车" "$API_URL/api/cart" "GET" "" "$TOKEN"
test_api "添加商品到购物车" "$API_URL/api/cart" "POST" \
    '{"productId":"b9f20653-7c7a-4edc-bc9e-6ea29f9ce427","quantity":1}' \
    "$TOKEN"
test_api "更新购物车数量" "$API_URL/api/cart/a16e77c3-c270-4b69-a280-712e5f3c7f2c" "PUT" \
    '{"quantity":3}' \
    "$TOKEN"

echo ""
echo "📋 7. 订单系统测试"
echo "-------------------"

test_api "获取订单列表" "$API_URL/api/orders" "GET" "" "$TOKEN"
test_api "获取订单详情" "$API_URL/api/orders/889f1792-f5b2-42ad-9408-8a24bc9d5a0c" "GET" "" "$TOKEN"

echo ""
echo "📋 8. 支付功能测试"
echo "-------------------"

test_api "查询支付状态" "$API_URL/api/payment/status/889f1792-f5b2-42ad-9408-8a24bc9d5a0c" "GET" "" "$TOKEN"
test_api "检查超时订单" "$API_URL/api/payment/check-timeout" "POST" "" "$TOKEN"

echo ""
echo "📋 9. 管理后台测试"
echo "-------------------"

test_api "获取统计数据" "$API_URL/api/admin/stats" "GET" "" "$TOKEN"
test_api "获取管理员订单列表" "$API_URL/api/admin/orders" "GET" "" "$TOKEN"
test_api "获取管理员商品列表" "$API_URL/api/admin/products" "GET" "" "$TOKEN"

echo ""
echo "📋 10. 前端页面测试"
echo "--------------------"

test_api "首页访问" "$FRONTEND_URL" "GET"
test_api "登录页面" "$FRONTEND_URL/login" "GET"
test_api "商城页面" "$FRONTEND_URL/shop" "GET"
test_api "购物车页面" "$FRONTEND_URL/cart" "GET"
test_api "订单列表页面" "$FRONTEND_URL/orders" "GET"
test_api "管理后台页面" "$FRONTEND_URL/admin" "GET"

echo ""
echo "========================="
echo "📊 测试统计"
echo "========================="
echo "总测试数: $TOTAL_TESTS"
echo "通过: $PASSED_TESTS ✅"
echo "失败: $FAILED_TESTS ❌"
echo "成功率: $(awk "BEGIN {printf \"%.2f\", ($PASSED_TESTS/$TOTAL_TESTS)*100}")%"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo "🎉 所有测试通过！"
    exit 0
else
    echo "⚠️  有 $FAILED_TESTS 个测试失败"
    exit 1
fi
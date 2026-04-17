#!/bin/bash

# 综合功能测试脚本
# 测试所有已修复的关键功能

echo "========================================="
echo "   Pet Keeper 综合功能测试"
echo "========================================="
echo ""

API_BASE="http://localhost:3001/api"
PASS=0
FAIL=0

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试函数
test_endpoint() {
    local name="$1"
    local url="$2"
    local method="$3"
    local expected_status="$4"

    echo -n "测试 $name: "

    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\nSTATUS:%{http_code}" "$url")
    else
        response=$(curl -s -w "\nSTATUS:%{http_code}" -X "$method" "$url")
    fi

    status=$(echo "$response" | grep "STATUS:" | cut -d: -f2)
    body=$(echo "$response" | grep -v "STATUS:")

    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $status)"
        PASS=$((PASS + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_status, got $status)"
        echo "   Response: $body"
        FAIL=$((FAIL + 1))
        return 1
    fi
}

# 1. Backend 基础健康检查
echo "1. Backend 基础检查"
echo "-------------------"
test_endpoint "Backend 健康检查" "$API_BASE/health" "GET" "200"
echo ""

# 2. Species 路由测试（修复：路由顺序）
echo "2. Species 路由测试"
echo "-------------------"
test_endpoint "Species 分类列表" "$API_BASE/species/meta/categories" "GET" "200"
test_endpoint "Species 列表" "$API_BASE/species" "GET" "200"

# 测试单个物种详情
species_id=$(curl -s "$API_BASE/species" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -n "$species_id" ]; then
    test_endpoint "Species 详情 ($species_id)" "$API_BASE/species/$species_id" "GET" "200"
else
    echo -e "${YELLOW}⚠ 跳过 Species 详情测试（无数据）${NC}"
fi
echo ""

# 3. Products 路由测试
echo "3. Products 路由测试"
echo "-------------------"
test_endpoint "Products 列表" "$API_BASE/products" "GET" "200"
test_endpoint "Categories 列表" "$API_BASE/categories" "GET" "200"
echo ""

# 4. Auth 路由测试
echo "4. Auth 路由测试"
echo "-------------------"
# 测试登录端点是否存在（应该返回 401 无token或 400 缺少参数）
response=$(curl -s -w "\nSTATUS:%{http_code}" -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{}')
status=$(echo "$response" | grep "STATUS:" | cut -d: -f2)

if [ "$status" = "400" ] || [ "$status" = "401" ]; then
    echo -e "${GREEN}✓ PASS${NC} Auth 登录端点正常 (HTTP $status)"
    PASS=$((PASS + 1))
else
    echo -e "${RED}✗ FAIL${NC} Auth 登录端点异常 (HTTP $status)"
    FAIL=$((FAIL + 1))
fi
echo ""

# 5. Upload 路由测试
echo "5. Upload 路由测试"
echo "-------------------"
# Upload 需要认证，测试端点是否存在
response=$(curl -s -w "\nSTATUS:%{http_code}" -X POST "$API_BASE/upload/image")
status=$(echo "$response" | grep "STATUS:" | cut -d: -f2)

if [ "$status" = "401" ]; then
    echo -e "${GREEN}✓ PASS${NC} Upload 端点存在且需要认证 (HTTP 401)"
    PASS=$((PASS + 1))
else
    echo -e "${RED}✗ FAIL${NC} Upload 端点异常 (HTTP $status)"
    FAIL=$((FAIL + 1))
fi
echo ""

# 6. Cart 路由测试（修复：路由参数）
echo "6. Cart 路由测试"
echo "-------------------"
# Cart 需要认证，测试端点是否存在
response=$(curl -s -w "\nSTATUS:%{http_code}" "$API_BASE/cart")
status=$(echo "$response" | grep "STATUS:" | cut -d: -f2)

if [ "$status" = "401" ]; then
    echo -e "${GREEN}✓ PASS${NC} Cart 端点存在且需要认证 (HTTP 401)"
    PASS=$((PASS + 1))
else
    echo -e "${RED}✗ FAIL${NC} Cart 端点异常 (HTTP $status)"
    FAIL=$((FAIL + 1))
fi

# 测试 Cart 路由参数格式
response=$(curl -s -w "\nSTATUS:%{http_code}" -X PUT "$API_BASE/cart/test-id")
status=$(echo "$response" | grep "STATUS:" | cut -d: -f2)

if [ "$status" = "401" ]; then
    echo -e "${GREEN}✓ PASS${NC} Cart/:id 路由格式正确 (HTTP 401)"
    PASS=$((PASS + 1))
else
    echo -e "${RED}✗ FAIL${NC} Cart/:id 路由异常 (HTTP $status)"
    FAIL=$((FAIL + 1))
fi
echo ""

# 7. Orders 路由测试
echo "7. Orders 路由测试"
echo "-------------------"
response=$(curl -s -w "\nSTATUS:%{http_code}" "$API_BASE/orders")
status=$(echo "$response" | grep "STATUS:" | cut -d: -f2)

if [ "$status" = "401" ]; then
    echo -e "${GREEN}✓ PASS${NC} Orders 端点存在且需要认证 (HTTP 401)"
    PASS=$((PASS + 1))
else
    echo -e "${RED}✗ FAIL${NC} Orders 端点异常 (HTTP $status)"
    FAIL=$((FAIL + 1))
fi
echo ""

# 8. Species 数据格式测试
echo "8. Species 数据格式测试"
echo "-------------------"
if [ -n "$species_id" ]; then
    species_data=$(curl -s "$API_BASE/species/$species_id")

    # 检查 diet 字段是否是数组（已解析）
    if echo "$species_data" | grep -q '"diet":\['; then
        echo -e "${GREEN}✓ PASS${NC} Diet 字段已解析为数组"
        PASS=$((PASS + 1))
    else
        echo -e "${RED}✗ FAIL${NC} Diet 字段格式异常"
        FAIL=$((FAIL + 1))
    fi

    # 检查 substrate 字段
    if echo "$species_data" | grep -q '"substrate":\['; then
        echo -e "${GREEN}✓ PASS${NC} Substrate 字段已解析为数组"
        PASS=$((PASS + 1))
    else
        echo -e "${RED}✗ FAIL${NC} Substrate 字段格式异常"
        FAIL=$((FAIL + 1))
    fi
else
    echo -e "${YELLOW}⚠ 跳过数据格式测试（无species数据）${NC}"
fi
echo ""

# 9. CORS 测试
echo "9. CORS 配置测试"
echo "-------------------"
response=$(curl -s -I "$API_BASE/health" | grep -i "access-control-allow-origin")
if [ -n "$response" ]; then
    echo -e "${GREEN}✓ PASS${NC} CORS 已配置"
    echo "   $response"
    PASS=$((PASS + 1))
else
    echo -e "${RED}✗ FAIL${NC} CORS 未配置"
    FAIL=$((FAIL + 1))
fi
echo ""

# 10. Uploads 目录检查
echo "10. 文件系统检查"
echo "-------------------"
uploads_dir="/Users/mac/zrby/pet-keeper-backend/uploads"
if [ -d "$uploads_dir" ]; then
    file_count=$(ls -1 "$uploads_dir" | grep -v ".gitkeep" | wc -l)
    echo -e "${GREEN}✓ PASS${NC} Uploads 目录存在"
    echo "   文件数量: $file_count"
    PASS=$((PASS + 1))
else
    echo -e "${RED}✗ FAIL${NC} Uploads 目录不存在"
    FAIL=$((FAIL + 1))
fi
echo ""

# 结果汇总
echo "========================================="
echo "           测试结果汇总"
echo "========================================="
echo -e "${GREEN}通过: $PASS${NC}"
echo -e "${RED}失败: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ 所有测试通过！${NC}"
    exit 0
else
    echo -e "${RED}✗ 有 $FAIL 个测试失败${NC}"
    echo ""
    echo "建议检查："
    echo "1. Backend 是否正常运行"
    echo "2. Database 是否有数据"
    echo "3. 路由配置是否正确"
    exit 1
fi
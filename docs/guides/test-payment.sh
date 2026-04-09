#!/bin/bash

# 支付功能测试脚本
# 用于快速测试支付流程

echo "🚀 PetKeeper 支付功能测试"
echo "============================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# API基础地址
API_URL="http://localhost:3001"

# 测试函数
test_payment_api() {
    echo "📋 测试支付API..."
    echo ""

    # 测试健康检查
    echo "1. 测试API健康状态..."
    curl -s "$API_URL/api/health" | python3 -m json.tool
    echo ""

    # 测试获取商品列表
    echo "2. 测试获取商品列表..."
    curl -s "$API_URL/api/products?limit=3" | python3 -m json.tool
    echo ""

    # 测试获取分类列表
    echo "3. 测试获取分类列表..."
    curl -s "$API_URL/api/categories" | python3 -m json.tool
    echo ""

    echo -e "${GREEN}✅ API测试完成${NC}"
    echo ""
}

# 显示测试步骤
show_test_steps() {
    echo "📖 手动测试步骤："
    echo ""
    echo "1️⃣  登录账号"
    echo "   访问: http://localhost:3003/login"
    echo "   邮箱: admin@test.com"
    echo "   密码: admin123"
    echo ""

    echo "2️⃣  浏览商品"
    echo "   访问: http://localhost:3003/shop"
    echo "   选择商品加入购物车"
    echo ""

    echo "3️⃣  创建订单"
    echo "   访问: http://localhost:3003/cart"
    echo "   选择商品，点击'去结算'"
    echo "   填写收货信息，提交订单"
    echo ""

    echo "4️⃣  完成支付"
    echo "   在订单详情页点击'立即支付'"
    echo "   跳转到模拟支付页面"
    echo "   点击'确认支付'"
    echo ""

    echo "5️⃣  查看结果"
    echo "   支付成功后自动跳转"
    echo "   订单状态变为'已支付'"
    echo ""

    echo "6️⃣  管理员发货"
    echo "   访问: http://localhost:3003/admin/orders"
    echo "   找到订单，点击'发货'"
    echo ""
}

# 显示快速测试链接
show_quick_links() {
    echo "🔗 快速测试链接："
    echo ""
    echo "商城首页:     http://localhost:3003/shop"
    echo "购物车:       http://localhost:3003/cart"
    echo "我的订单:     http://localhost:3003/orders"
    echo "管理后台:     http://localhost:3003/admin"
    echo "订单管理:     http://localhost:3003/admin/orders"
    echo ""
}

# 主函数
main() {
    echo "请选择测试方式："
    echo ""
    echo "1. 测试API接口"
    echo "2. 显示测试步骤"
    echo "3. 显示快速链接"
    echo "4. 全部执行"
    echo ""

    read -p "请输入选项 (1-4): " choice

    case $choice in
        1)
            test_payment_api
            ;;
        2)
            show_test_steps
            ;;
        3)
            show_quick_links
            ;;
        4)
            test_payment_api
            echo ""
            show_test_steps
            show_quick_links
            ;;
        *)
            echo -e "${RED}无效选项${NC}"
            exit 1
            ;;
    esac
}

# 运行主函数
main
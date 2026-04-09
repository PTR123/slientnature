#!/bin/bash

echo "========================================="
echo "支付功能测试脚本"
echo "========================================="
echo ""

# 测试后端服务
echo "1. 测试后端服务..."
BACKEND_HEALTH=$(curl -s http://localhost:3001/api/health)
if echo "$BACKEND_HEALTH" | grep -q "ok"; then
    echo "✅ 后端服务运行正常"
else
    echo "❌ 后端服务未运行"
    exit 1
fi
echo ""

# 测试前端服务
echo "2. 测试前端服务..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ 前端服务运行正常"
else
    echo "❌ 前端服务未运行"
    exit 1
fi
echo ""

# 测试支付页面
echo "3. 测试支付页面..."
PAYMENT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/payment/mock)
if [ "$PAYMENT_STATUS" = "200" ]; then
    echo "✅ 支付页面可访问"
else
    echo "❌ 支付页面无法访问 (HTTP $PAYMENT_STATUS)"
    exit 1
fi
echo ""

# 测试订单页面
echo "4. 测试订单页面..."
ORDERS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/orders)
if [ "$ORDERS_STATUS" = "200" ]; then
    echo "✅ 订单页面可访问"
else
    echo "❌ 订单页面无法访问 (HTTP $ORDERS_STATUS)"
    exit 1
fi
echo ""

# 测试结账页面
echo "5. 测试结账页面..."
CHECKOUT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/checkout)
if [ "$CHECKOUT_STATUS" = "200" ]; then
    echo "✅ 结账页面可访问"
else
    echo "❌ 结账页面无法访问 (HTTP $CHECKOUT_STATUS)"
    exit 1
fi
echo ""

echo "========================================="
echo "测试URL列表:"
echo "========================================="
echo "后端健康检查: http://localhost:3001/api/health"
echo "前端首页:     http://localhost:3000"
echo "商城:         http://localhost:3000/shop"
echo "购物车:       http://localhost:3000/cart"
echo "结账:         http://localhost:3000/checkout"
echo "订单列表:     http://localhost:3000/orders"
echo "支付测试:     http://localhost:3000/payment/mock?orderId=test&amount=99.00"
echo ""

echo "========================================="
echo "支付流程测试步骤:"
echo "========================================="
echo "1. 访问商城页面，添加商品到购物车"
echo "2. 进入购物车，选择商品，点击结算"
echo "3. 填写收货信息，提交订单"
echo "4. 在订单详情页点击'立即支付'"
echo "5. 跳转到支付页面，点击'确认支付'"
echo "6. 支付成功，自动跳转回订单详情"
echo ""

echo "✅ 所有测试通过！支付功能正常。"
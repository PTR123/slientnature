# 支付页面404问题修复

## 问题描述
用户报告支付页面返回404错误

## 问题分析

### 1. 检查结果
✅ 支付页面文件存在: `/Users/mac/zrby/pet-keeper/app/payment/mock/page.tsx`
✅ 页面可以访问: `http://localhost:3000/payment/mock` (返回200)
✅ 订单页面存在: `/Users/mac/zrby/pet-keeper/app/orders/[id]/page.tsx`

### 2. 根本原因
后端支付接口返回的支付URL错误：

**问题代码** (pet-keeper-backend/src/routes/payment.ts):
```typescript
payUrl: `${process.env.FRONTEND_URL || 'http://localhost:3003'}/payment/mock?...`
```

**问题分析**:
- 默认FRONTEND_URL设置为 `http://localhost:3003`
- 实际前端运行在 `http://localhost:3000`
- 导致支付跳转到错误的地址，返回404

## 解决方案

### 修复代码
修改 `/Users/mac/zrby/pet-keeper-backend/src/routes/payment.ts`:

```typescript
payUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/mock?orderId=${order.id}&amount=${order.payAmount}`
```

### 环境变量配置
创建 `/Users/mac/zrby/pet-keeper-backend/.env`:
```env
PORT=3001
BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
```

## 支付流程说明

### 完整流程
```
1. 用户在购物车选择商品
   ↓
2. 点击"结算"进入结账页面 (/checkout)
   ↓
3. 填写收货信息，提交订单
   ↓
4. 跳转到订单详情页 (/orders/[id])
   ↓
5. 点击"立即支付"按钮
   ↓
6. 调用后端API创建支付 (POST /api/payment/create)
   ↓
7. 后端返回支付URL (http://localhost:3000/payment/mock?orderId=xxx&amount=xxx)
   ↓
8. 前端跳转到模拟支付页面
   ↓
9. 用户点击"确认支付"
   ↓
10. 调用后端API完成支付 (POST /api/payment/mock/pay)
   ↓
11. 支付成功，跳转回订单详情页
```

### 涉及的页面

| 页面 | 路径 | 文件位置 |
|------|------|---------|
| 购物车 | /cart | app/cart/page.tsx |
| 结账 | /checkout | app/checkout/page.tsx |
| 订单列表 | /orders | app/orders/page.tsx |
| 订单详情 | /orders/[id] | app/orders/[id]/page.tsx |
| 模拟支付 | /payment/mock | app/payment/mock/page.tsx |

## 后端API接口

### 1. 创建支付
```
POST /api/payment/create
Headers: Authorization: Bearer {token}
Body: {
  "orderId": "订单ID",
  "paymentMethod": "mock"
}

Response: {
  "success": true,
  "data": {
    "orderId": "xxx",
    "orderNo": "xxx",
    "amount": 99.00,
    "paymentMethod": "mock",
    "timestamp": 1234567890,
    "payUrl": "http://localhost:3000/payment/mock?orderId=xxx&amount=99.00"
  }
}
```

### 2. 完成支付
```
POST /api/payment/mock/pay
Headers: Authorization: Bearer {token}
Body: {
  "orderId": "订单ID"
}

Response: {
  "success": true,
  "order": {
    "id": "xxx",
    "status": "paid",
    "paidAt": "2026-04-07T12:00:00Z"
  },
  "message": "支付成功"
}
```

### 3. 查询支付状态
```
GET /api/payment/status/:orderId
Headers: Authorization: Bearer {token}

Response: {
  "success": true,
  "order": {
    "id": "xxx",
    "status": "paid",
    "payAmount": 99.00,
    "transactionId": "MOCK_xxx"
  }
}
```

## 测试步骤

### 1. 准备测试数据
- 确保有商品数据
- 确保商品有库存

### 2. 完整支付流程测试
```bash
# 1. 登录
访问: http://localhost:3000/login
使用测试账号登录

# 2. 添加商品到购物车
访问: http://localhost:3000/shop
点击"加入购物车"

# 3. 进入购物车
访问: http://localhost:3000/cart
选择商品，点击"结算"

# 4. 填写收货信息
访问: http://localhost:3000/checkout
填写姓名、手机、地址
点击"提交订单"

# 5. 查看订单并支付
在订单详情页点击"立即支付"
应该跳转到: http://localhost:3000/payment/mock?orderId=xxx&amount=xxx

# 6. 确认支付
在支付页面点击"确认支付"
应该显示"支付成功"
3秒后跳转回订单详情页
```

### 3. 测试支付页面直接访问
```bash
# 模拟支付链接
访问: http://localhost:3000/payment/mock?orderId=test123&amount=99.00
应该显示支付页面
```

## 常见问题

### 问题1: 支付页面404
**原因**: 后端返回的URL错误
**解决**: 已修复默认FRONTEND_URL为 http://localhost:3000

### 问题2: 订单创建失败
**原因**: 商品库存不足或已下架
**解决**: 检查商品状态和库存

### 问题3: 支付按钮无响应
**原因**: token过期或网络问题
**解决**: 重新登录，检查网络连接

### 问题4: 支付成功但订单状态未更新
**原因**: 后端API调用失败
**解决**: 查看浏览器控制台和网络请求

## 服务配置

### 端口配置
- 前端: http://localhost:3000
- 后端: http://localhost:3001

### 启动命令
```bash
# 后端
cd /Users/mac/zrby/pet-keeper-backend
npm run dev

# 前端
cd /Users/mac/zrby/pet-keeper
npm run dev
```

## 安全说明

### 模拟支付特点
- 这是沙箱测试环境
- 无需真实资金
- 用于开发测试
- 生产环境需要接入真实支付接口

### 生产环境建议
1. 使用真实支付网关（微信支付、支付宝等）
2. 添加支付签名验证
3. 实现异步通知处理
4. 记录支付日志
5. 防止重复支付

## 修复清单

- [x] 修复后端支付URL默认值
- [x] 重启后端服务
- [x] 创建测试文档
- [ ] 配置环境变量文件
- [ ] 添加支付超时检查
- [ ] 实现支付日志记录

## 后续优化

### 1. 支付超时处理
已实现30分钟自动取消未支付订单

### 2. 支付状态通知
建议实现WebSocket或轮询更新支付状态

### 3. 支付方式扩展
预留了paymentMethod参数，可扩展支持：
- 微信支付
- 支付宝
- 银行卡支付

## 验证修复

运行以下命令验证：
```bash
# 1. 检查后端服务
curl http://localhost:3001/api/health

# 2. 测试支付页面
curl -I http://localhost:3000/payment/mock

# 3. 查看后端日志
tail -f /tmp/backend.log
```

## 总结

**问题**: 支付跳转URL错误导致404
**原因**: 后端默认FRONTEND_URL配置为错误端口
**解决**: 修改默认值为正确的端口3000
**状态**: ✅ 已修复

现在支付功能应该可以正常使用了！
# 💳 支付功能集成完整指南

## 📋 概述

本文档详细介绍如何在 PetKeeper 中集成支付功能，包括微信支付和支付宝支付两种方案。

---

## 🎯 支付流程设计

### 整体流程图

```
用户下单 → 创建订单（待支付）
    ↓
选择支付方式
    ↓
调用支付接口 → 获取支付参数
    ↓
用户完成支付
    ↓
支付平台回调 → 更新订单状态
    ↓
订单状态变为"已支付" → 等待发货
```

### 数据流程

```
1. 前端 → 后端：创建订单请求
2. 后端 → 数据库：创建订单记录
3. 后端 → 支付平台：统一下单
4. 支付平台 → 后端：返回支付参数
5. 后端 → 前端：返回支付参数
6. 前端 → 支付平台：唤起支付
7. 用户完成支付
8. 支付平台 → 后端：异步通知
9. 后端 → 数据库：更新订单状态
10. 前端轮询/WebSocket：获取支付结果
```

---

## 💰 方案一：微信支付集成

### 1. 准备工作

#### 申请微信支付商户号
1. 访问：https://pay.weixin.qq.com
2. 注册商户号
3. 完成企业认证
4. 获取以下信息：
   - **AppID**: 微信公众号/小程序的AppID
   - **MchID**: 商户号
   - **API Key**: API密钥
   - **API证书**: apiclient_cert.pem, apiclient_key.pem

#### 费率
- **小程序支付**: 0.6%
- **H5支付**: 0.6%
- **Native支付**: 0.6%

---

### 2. 后端实现

#### 安装依赖
```bash
cd pet-keeper-backend
npm install wechatpay-node-v3-ts
# 或
npm install wechatpay-node-v3
```

#### 配置环境变量
```bash
# .env
WECHAT_APPID=wx1234567890abcdef
WECHAT_MCHID=1234567890
WECHAT_SERIAL_NUMBER=1234567890ABCDEF1234567890ABCDEF12345678
WECHAT_API_KEY=your-32-character-api-key-here
WECHAT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----"

# 回调地址（必须是HTTPS）
WECHAT_NOTIFY_URL=https://yourdomain.com/api/payment/wechat/notify
```

#### 创建支付路由
```typescript
// src/routes/payment.ts

import { Router } from 'express';
import { Payment } from 'wechatpay-node-v3';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// 初始化微信支付
const pay = new Payment({
  appid: process.env.WECHAT_APPID,
  mchid: process.env.WECHAT_MCHID,
  serial_no: process.env.WECHAT_SERIAL_NUMBER,
  privateKey: process.env.WECHAT_PRIVATE_KEY,
  apiv3_private_key: process.env.WECHAT_API_KEY,
});

// 创建支付订单
router.post('/wechat/create', authenticate, async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user!.id;

    // 查询订单
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId, status: 'pending' }
    });

    if (!order) {
      return res.status(404).json({ error: '订单不存在或已支付' });
    }

    // 调用微信支付统一下单
    const result = await pay.transactions_jsapi({
      description: `PetKeeper订单-${order.orderNo}`,
      out_trade_no: order.orderNo,
      notify_url: process.env.WECHAT_NOTIFY_URL,
      amount: {
        total: Math.round(order.payAmount * 100), // 单位：分
        currency: 'CNY'
      },
      payer: {
        openid: req.user.openid // 用户openid
      }
    });

    // 返回支付参数给前端
    res.json({
      prepay_id: result.prepay_id,
      ...result
    });
  } catch (error) {
    console.error('创建支付失败:', error);
    res.status(500).json({ error: '创建支付失败' });
  }
});

// 支付回调
router.post('/wechat/notify', async (req, res) => {
  try {
    // 验证签名
    const signature = req.headers['wechatpay-signature'];
    const timestamp = req.headers['wechatpay-timestamp'];
    const nonce = req.headers['wechatpay-nonce'];

    // 解密通知数据
    const decrypted = pay.decipher(
      req.body.resource.ciphertext,
      req.body.resource.associated_data,
      req.body.resource.nonce
    );

    const data = JSON.parse(decrypted);

    // 更新订单状态
    const order = await prisma.order.update({
      where: { orderNo: data.out_trade_no },
      data: {
        status: 'paid',
        paidAt: new Date(),
        transactionId: data.transaction_id
      }
    });

    // 返回成功响应
    res.json({ code: 'SUCCESS', message: '成功' });
  } catch (error) {
    console.error('支付回调失败:', error);
    res.status(500).json({ code: 'FAIL', message: '失败' });
  }
});

export default router;
```

---

### 3. 前端实现（小程序）

```javascript
// miniprogram/pages/orders/pay.js

Page({
  data: {
    order: null
  },

  onLoad(options) {
    this.loadOrder(options.orderId);
  },

  // 发起支付
  async handlePay() {
    try {
      wx.showLoading({ title: '发起支付...' });

      // 1. 获取支付参数
      const res = await request({
        url: `${apiUrl}/payment/wechat/create`,
        method: 'POST',
        data: { orderId: this.data.order.id },
        header: {
          'Authorization': `Bearer ${wx.getStorageSync('token')}`
        }
      });

      // 2. 唤起微信支付
      wx.requestPayment({
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.package,
        signType: res.signType,
        paySign: res.paySign,
        success: () => {
          wx.hideLoading();
          wx.showToast({ title: '支付成功' });

          // 3. 更新订单状态
          setTimeout(() => {
            wx.redirectTo({
              url: `/pages/orders/detail?id=${this.data.order.id}`
            });
          }, 1500);
        },
        fail: (err) => {
          wx.hideLoading();
          if (err.errMsg.includes('cancel')) {
            wx.showToast({ title: '已取消支付', icon: 'none' });
          } else {
            wx.showToast({ title: '支付失败', icon: 'error' });
          }
        }
      });
    } catch (error) {
      wx.hideLoading();
      wx.showToast({ title: error.message || '支付失败', icon: 'error' });
    }
  }
});
```

---

## 💳 方案二：支付宝支付集成

### 1. 准备工作

#### 申请支付宝商户号
1. 访问：https://open.alipay.com
2. 创建应用
3. 完成企业认证
4. 获取以下信息：
   - **APPID**: 应用ID
   - **应用私钥**: private_key
   - **支付宝公钥**: alipay_public_key
   - **签名方式**: RSA2

#### 费率
- **手机网站支付**: 0.6%
- **电脑网站支付**: 0.6%
- **APP支付**: 0.6%

---

### 2. 后端实现

#### 安装依赖
```bash
npm install alipay-sdk
```

#### 配置环境变量
```bash
# .env
ALIPAY_APPID=2021001234567890
ALIPAY_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----"
ALIPAY_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
...
-----END PUBLIC KEY-----"
ALIPAY_NOTIFY_URL=https://yourdomain.com/api/payment/alipay/notify
ALIPAY_RETURN_URL=https://yourdomain.com/orders
```

#### 创建支付路由
```typescript
// src/routes/payment.ts (续)

import Alipay from 'alipay-sdk';

const alipay = new Alipay({
  appId: process.env.ALIPAY_APPID,
  privateKey: process.env.ALIPAY_PRIVATE_KEY,
  alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY,
});

// 创建支付宝支付
router.post('/alipay/create', authenticate, async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user!.id;

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId, status: 'pending' }
    });

    if (!order) {
      return res.status(404).json({ error: '订单不存在或已支付' });
    }

    // 生成支付表单
    const formData = new FormData();
    formData.addField('returnUrl', process.env.ALIPAY_RETURN_URL);
    formData.addField('notifyUrl', process.env.ALIPAY_NOTIFY_URL);
    formData.addField('bizContent', {
      outTradeNo: order.orderNo,
      productCode: 'FAST_INSTANT_TRADE_PAY',
      totalAmount: order.payAmount.toFixed(2),
      subject: `PetKeeper订单-${order.orderNo}`,
      body: '宠物用品'
    });

    const url = alipay.exec(
      'alipay.trade.page.pay',
      {},
      { formData: formData }
    );

    res.json({ payUrl: url });
  } catch (error) {
    console.error('创建支付宝支付失败:', error);
    res.status(500).json({ error: '创建支付失败' });
  }
});

// 支付宝回调
router.post('/alipay/notify', async (req, res) => {
  try {
    // 验证签名
    const signVerified = alipay.checkNotifySign(req.body);

    if (!signVerified) {
      return res.send('fail');
    }

    const {
      out_trade_no,
      trade_no,
      trade_status
    } = req.body;

    // 支付成功
    if (trade_status === 'TRADE_SUCCESS') {
      await prisma.order.update({
        where: { orderNo: out_trade_no },
        data: {
          status: 'paid',
          paidAt: new Date(),
          transactionId: trade_no
        }
      });
    }

    res.send('success');
  } catch (error) {
    console.error('支付宝回调失败:', error);
    res.send('fail');
  }
});
```

---

### 3. 前端实现（Web）

```typescript
// app/orders/[id]/page.tsx (续)

const handlePay = async () => {
  try {
    setPaying(true);

    // 1. 获取支付链接
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/alipay/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ orderId: order.id })
      }
    );

    const data = await response.json();

    // 2. 跳转到支付宝
    window.location.href = data.payUrl;
  } catch (error: any) {
    alert(error.message || '发起支付失败');
  } finally {
    setPaying(false);
  }
};

// 支付按钮
{order.status === 'pending' && (
  <Button
    className="w-full"
    size="lg"
    onClick={handlePay}
    disabled={paying}
  >
    <CreditCard className="h-5 w-5 mr-2" />
    {paying ? '发起支付中...' : '立即支付'}
  </Button>
)}
```

---

## 🔒 数据库修改

### 更新 Order 表
```prisma
model Order {
  id              String   @id @default(uuid())
  orderNo         String   @unique
  userId          String
  totalAmount     Float
  payAmount       Float
  status          String   @default("pending")

  // 新增支付相关字段
  transactionId   String?  // 第三方支付流水号
  paymentMethod   String?  // 支付方式: wechat, alipay
  paidAt          DateTime?

  receiverName    String
  receiverPhone   String
  receiverAddress String
  remark          String?
  shippedAt       DateTime?
  completedAt     DateTime?
  cancelledAt     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user  User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  items OrderItem[]
}
```

### 运行迁移
```bash
npx prisma migrate dev --name add_payment_fields
npx prisma generate
```

---

## 🎯 方案三：沙箱测试（推荐初期使用）

### 微信支付沙箱
1. 访问：https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=23_1
2. 获取沙箱环境配置
3. 使用沙箱API进行测试
4. 无需真实资金

### 支付宝沙箱
1. 访问：https://openhome.alipay.com/platform/appDaily.htm
2. 下载沙箱APP
3. 使用沙箱账号测试
4. 模拟真实支付流程

---

## 📊 支付状态管理

### 订单状态流转
```
pending (待支付)
   ↓ [支付成功]
paid (已支付)
   ↓ [管理员发货]
shipped (已发货)
   ↓ [用户确认]
completed (已完成)

或

pending → cancelled (用户取消)
paid → refunded (退款，待实现)
```

### 支付超时处理

#### 添加定时任务
```typescript
// src/jobs/orderTimeout.ts

import cron from 'node-cron';
import prisma from '../lib/prisma.js';

// 每5分钟检查一次超时订单
cron.schedule('*/5 * * * *', async () => {
  try {
    // 查找30分钟未支付的订单
    const timeoutOrders = await prisma.order.findMany({
      where: {
        status: 'pending',
        createdAt: {
          lt: new Date(Date.now() - 30 * 60 * 1000)
        }
      }
    });

    // 取消超时订单
    for (const order of timeoutOrders) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'cancelled',
          cancelledAt: new Date()
        }
      });

      console.log(`订单 ${order.orderNo} 超时已取消`);
    }
  } catch (error) {
    console.error('检查超时订单失败:', error);
  }
});
```

---

## 🔐 安全考虑

### 1. 签名验证
- ✅ 验证回调签名
- ✅ 验证订单金额
- ✅ 验证商户号

### 2. 防止重复支付
```typescript
// 在处理回调时检查订单状态
const order = await prisma.order.findUnique({
  where: { orderNo: data.out_trade_no }
});

if (order.status !== 'pending') {
  return res.json({ code: 'SUCCESS', message: '已处理' });
}
```

### 3. 幂等性处理
```typescript
// 使用数据库事务
await prisma.$transaction(async (tx) => {
  // 更新订单
  await tx.order.update({
    where: { orderNo },
    data: { status: 'paid', paidAt: new Date() }
  });

  // 记录支付日志
  await tx.paymentLog.create({
    data: {
      orderNo,
      transactionId,
      amount: payAmount,
      method: 'wechat'
    }
  });
});
```

### 4. 金额验证
```typescript
// 验证回调金额是否匹配订单金额
if (parseFloat(data.total_amount) !== order.payAmount) {
  throw new Error('金额不匹配');
}
```

---

## 📱 前端轮询支付结果

```typescript
// 前端轮询检查支付状态
const checkPaymentStatus = async (orderId: string) => {
  let attempts = 0;
  const maxAttempts = 30; // 最多轮询30次

  const timer = setInterval(async () => {
    attempts++;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const order = await response.json();

      if (order.status === 'paid') {
        clearInterval(timer);
        alert('支付成功！');
        router.push(`/orders/${orderId}`);
      }

      if (attempts >= maxAttempts) {
        clearInterval(timer);
        alert('支付结果确认中，请稍后在订单列表查看');
        router.push('/orders');
      }
    } catch (error) {
      console.error('查询订单状态失败:', error);
    }
  }, 2000); // 每2秒查询一次
};
```

---

## 💡 开发流程建议

### 阶段一：沙箱测试（1-2天）
1. ✅ 注册沙箱账号
2. ✅ 配置沙箱环境
3. ✅ 完成支付流程测试
4. ✅ 验证回调处理

### 阶段二：正式环境申请（3-7天）
1. ✅ 准备企业资质
2. ✅ 提交申请材料
3. ✅ 等待审核
4. ✅ 获取正式配置

### 阶段三：正式环境集成（2-3天）
1. ✅ 更新配置
2. ✅ 小额真实测试
3. ✅ 验证所有流程
4. ✅ 上线发布

---

## 📊 费用估算

### 微信支付
- **费率**: 0.6%
- **示例**: ¥100订单，手续费 ¥0.6
- **结算周期**: T+1

### 支付宝
- **费率**: 0.6%
- **示例**: ¥100订单，手续费 ¥0.6
- **结算周期**: T+1

---

## 🚀 快速开始

### 1. 更新数据库
```bash
cd pet-keeper-backend
npx prisma migrate dev --name add_payment_fields
npx prisma generate
```

### 2. 安装依赖
```bash
# 选择一个支付平台
npm install wechatpay-node-v3  # 微信支付
# 或
npm install alipay-sdk         # 支付宝
```

### 3. 配置环境变量
```bash
# 复制支付配置到 .env
# 从支付平台获取配置信息
```

### 4. 重启服务
```bash
npm run dev
```

---

## 📚 参考资料

### 微信支付
- 官方文档: https://pay.weixin.qq.com/wiki/doc/apiv3/index.shtml
- SDK文档: https://github.com/klover2/wechatpay-node-v3-ts

### 支付宝
- 官方文档: https://opendocs.alipay.com/open/284
- SDK文档: https://github.com/alipay/alipay-sdk-nodejs-all

---

## ✅ 完成检查清单

### 后端
- [ ] 安装支付SDK
- [ ] 配置支付参数
- [ ] 实现创建支付接口
- [ ] 实现支付回调接口
- [ ] 添加支付超时处理
- [ ] 测试支付流程

### 前端
- [ ] 实现支付按钮
- [ ] 唤起支付功能
- [ ] 支付结果轮询
- [ ] 错误处理
- [ ] 订单状态展示

### 安全
- [ ] 签名验证
- [ ] 金额验证
- [ ] 幂等性处理
- [ ] 超时处理

---

**准备好集成支付功能了吗？选择一个方案开始吧！** 🎉
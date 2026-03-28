# 🔐 微信一键登录 & 手机号登录实现指南

## ✅ 前端已完成

小程序前端已实现以下功能：

### 登录页面
- ✅ 邮箱 + 密码登录
- ✅ 手机号 + 短信验证码登录
- ✅ 微信手机号一键登录
- ✅ 登录方式切换（Tab）

### 注册页面
- ✅ 邮箱注册
- ✅ 手机号注册
- ✅ 注册方式切换（Tab）

---

## 🔧 后端需要实现的 API

### 1. 发送短信验证码

**接口**: `POST /api/auth/sms/send`

**请求参数**:
```json
{
  "phone": "13800138000"
}
```

**响应**:
```json
{
  "success": true,
  "message": "验证码已发送"
}
```

**实现要点**:
- 验证手机号格式
- 生成6位随机验证码
- 使用短信服务商发送验证码
- 将验证码存储（Redis 推荐），有效期5分钟
- 同一手机号1分钟内只能发送一次

**短信服务商推荐**:
- 阿里云短信
- 腾讯云短信
- 云片短信

---

### 2. 手机号登录/注册

**接口**: `POST /api/auth/login/phone`

**请求参数**:
```json
{
  "phone": "13800138000",
  "code": "123456"
}
```

**响应**:
```json
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "phone": "13800138000",
    "username": "user_13800138000",
    "avatar": null
  }
}
```

**实现要点**:
- 验证手机号和验证码
- 验证码正确后删除（一次性使用）
- 如果用户不存在，自动创建用户
- 生成 JWT Token
- 返回用户信息和 Token

---

### 3. 微信手机号一键登录

**接口**: `POST /api/auth/login/wechat`

**请求参数**:
```json
{
  "code": "wx-login-code",
  "encryptedData": "encrypted-phone-data",
  "iv": "initialization-vector"
}
```

**响应**:
```json
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "phone": "13800138000",
    "username": "user_13800138000",
    "avatar": null
  }
}
```

**实现步骤**:

#### 步骤 1: 获取微信 SessionKey

```javascript
// 使用 code 换取 session_key
const response = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
  params: {
    appid: process.env.WX_APPID,
    secret: process.env.WX_SECRET,
    js_code: code,
    grant_type: 'authorization_code'
  }
})

const { openid, session_key } = response.data
```

#### 步骤 2: 解密手机号

```javascript
// 使用 WXBizDataCrypt 解密
const WXBizDataCrypt = require('wechat-mini-program-crypt')

const crypt = new WXBizDataCrypt(APPID, session_key)
const data = crypt.decryptData(encryptedData, iv)

// data 包含:
// {
//   phoneNumber: "13800138000",
//   purePhoneNumber: "13800138000",
//   countryCode: "86",
//   watermark: {...}
// }
```

#### 步骤 3: 用户处理

```javascript
// 查找或创建用户
let user = await prisma.user.findUnique({
  where: { phone: data.phoneNumber }
})

if (!user) {
  // 自动创建用户
  user = await prisma.user.create({
    data: {
      phone: data.phoneNumber,
      username: `user_${data.phoneNumber.substr(-4)}`,
      password: '' // 微信登录用户密码可为空
    }
  })
}

// 生成 Token
const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
  expiresIn: '30d'
})

return { token, user }
```

---

### 4. 更新数据库 Schema

修改 `prisma/schema.prisma`：

```prisma
model User {
  id        String   @id @default(uuid())
  email     String?  @unique  // 改为可选
  phone     String?  @unique  // 新增
  username  String   @unique
  password  String?           // 改为可选
  avatar    String?
  role      String   @default("user")
  isBanned  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  pets     Pet[]
  posts    Post[]
  comments Comment[]
  likes    Like[]
}

// 新增短信验证码表
model SmsCode {
  id        String   @id @default(uuid())
  phone     String
  code      String
  type      String   // login, register, reset
  used      Boolean  @default(false)
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([phone, code])
}
```

运行迁移：
```bash
npx prisma migrate dev --name add_phone_login
npx prisma generate
```

---

### 5. 更新注册接口

**接口**: `POST /api/auth/register`

支持两种方式：

#### 邮箱注册
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

#### 手机号注册
```json
{
  "phone": "13800138000",
  "code": "123456",
  "username": "username",
  "password": "password123"
}
```

**实现要点**:
- 根据参数判断注册方式
- 手机号注册需验证短信验证码
- 邮箱或手机号至少有一个
- 密码加密存储

---

## 📦 依赖安装

```bash
cd pet-keeper-backend

# 微信数据解密
npm install wechat-mini-program-crypt

# 短信发送（选择一个）
npm install @alicloud/dysmsapi20170525  # 阿里云
# 或
npm install tencentcloud-sdk-nodejs     # 腾讯云
```

---

## 🔑 微信小程序配置

### 1. 获取微信 AppID 和 AppSecret

登录微信公众平台：
https://mp.weixin.qq.com

开发 → 开发管理 → 开发设置

复制：
- AppID
- AppSecret

### 2. 配置环境变量

在 `.env` 中添加：

```env
# 微信小程序
WX_APPID=your-appid
WX_SECRET=your-secret

# 短信服务（以阿里云为例）
ALIYUN_ACCESS_KEY_ID=your-key-id
ALIYUN_ACCESS_KEY_SECRET=your-key-secret
ALIYUN_SMS_SIGN_NAME=PetKeeper
ALIYUN_SMS_TEMPLATE_CODE=SMS_123456789
```

---

## 💻 后端实现示例

### 短信验证码发送（阿里云）

```typescript
// src/routes/auth.ts

import Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import * as OpenApi from '@alicloud/openapi-client';

// 发送验证码
router.post('/sms/send', async (req, res) => {
  try {
    const { phone } = req.body

    // 验证手机号
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ error: '手机号格式错误' })
    }

    // 检查发送频率（1分钟内只能发送一次）
    const recentCode = await prisma.smsCode.findFirst({
      where: {
        phone,
        createdAt: {
          gte: new Date(Date.now() - 60000)
        }
      }
    })

    if (recentCode) {
      return res.status(400).json({ error: '验证码发送过于频繁' })
    }

    // 生成6位验证码
    const code = Math.random().toString().slice(-6)

    // 发送短信
    const client = new Dysmsapi20170525(new OpenApi.Config({
      accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
      accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
    }))

    await client.sendSms({
      phoneNumbers: phone,
      signName: process.env.ALIYUN_SMS_SIGN_NAME,
      templateCode: process.env.ALIYUN_SMS_TEMPLATE_CODE,
      templateParam: JSON.stringify({ code }),
    })

    // 保存验证码
    await prisma.smsCode.create({
      data: {
        phone,
        code,
        type: 'login',
        expiresAt: new Date(Date.now() + 300000), // 5分钟
      }
    })

    res.json({ success: true, message: '验证码已发送' })
  } catch (error) {
    console.error('发送验证码失败:', error)
    res.status(500).json({ error: '发送失败' })
  }
})
```

### 手机号登录

```typescript
// 手机号登录
router.post('/login/phone', async (req, res) => {
  try {
    const { phone, code } = req.body

    // 验证验证码
    const savedCode = await prisma.smsCode.findFirst({
      where: {
        phone,
        code,
        used: false,
        expiresAt: { gte: new Date() }
      }
    })

    if (!savedCode) {
      return res.status(400).json({ error: '验证码错误或已过期' })
    }

    // 标记验证码已使用
    await prisma.smsCode.update({
      where: { id: savedCode.id },
      data: { used: true }
    })

    // 查找或创建用户
    let user = await prisma.user.findUnique({
      where: { phone }
    })

    if (!user) {
      // 自动创建用户
      user = await prisma.user.create({
        data: {
          phone,
          username: `user_${phone.substr(-4)}`,
          password: '',
        }
      })
    }

    // 生成 Token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '30d'
    })

    res.json({
      user: {
        id: user.id,
        phone: user.phone,
        username: user.username,
        avatar: user.avatar,
      },
      token
    })
  } catch (error) {
    console.error('手机号登录失败:', error)
    res.status(500).json({ error: '登录失败' })
  }
})
```

### 微信一键登录

```typescript
import WXBizDataCrypt from 'wechat-mini-program-crypt'

// 微信手机号登录
router.post('/login/wechat', async (req, res) => {
  try {
    const { code, encryptedData, iv } = req.body

    // 获取 session_key
    const wxResponse = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: process.env.WX_APPID,
        secret: process.env.WX_SECRET,
        js_code: code,
        grant_type: 'authorization_code'
      }
    })

    const { openid, session_key } = wxResponse.data

    // 解密手机号
    const crypt = new WXBizDataCrypt(process.env.WX_APPID, session_key)
    const phoneData = crypt.decryptData(encryptedData, iv)

    const phone = phoneData.purePhoneNumber

    // 查找或创建用户
    let user = await prisma.user.findUnique({
      where: { phone }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          username: `user_${phone.substr(-4)}`,
          password: '',
        }
      })
    }

    // 生成 Token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '30d'
    })

    res.json({
      user: {
        id: user.id,
        phone: user.phone,
        username: user.username,
        avatar: user.avatar,
      },
      token
    })
  } catch (error) {
    console.error('微信登录失败:', error)
    res.status(500).json({ error: '登录失败' })
  }
})
```

---

## 🧪 测试步骤

### 1. 邮箱登录测试

```
邮箱: test@example.com
密码: password123
```

### 2. 手机号登录测试

1. 输入手机号
2. 点击"发送验证码"
3. 输入收到的验证码
4. 点击"登录"

### 3. 微信一键登录测试

1. 点击"微信手机号一键登录"按钮
2. 授权手机号
3. 自动登录成功

---

## 📊 数据流程

### 邮箱登录
```
用户输入 → 前端验证 → API 验证 → 返回 Token
```

### 手机号登录
```
用户输入手机号 → 发送验证码 → 存储验证码
→ 用户输入验证码 → API 验证 → 返回 Token
```

### 微信一键登录
```
用户点击按钮 → 微信授权 → 获取 encryptedData
→ 前端调用 wx.login 获取 code
→ API 使用 code 换取 session_key
→ API 解密 encryptedData 获取手机号
→ 查找或创建用户 → 返回 Token
```

---

## ⚠️ 重要提示

1. **安全性**
   - 短信验证码必须加密存储
   - 验证码一次性使用，使用后删除
   - 防止短信轰炸（限制发送频率）

2. **合规性**
   - 微信小程序手机号登录需要企业认证
   - 短信模板需要提前审批
   - 需要用户隐私协议

3. **成本**
   - 短信费用：约 0.045元/条
   - 微信登录：免费

---

## 🎉 完成后

- ✅ 用户可选择多种方式登录
- ✅ 提升用户体验
- ✅ 降低注册门槛
- ✅ 微信一键登录无需记忆密码

---

**需要帮助？**

如有问题，请查看：
- 微信官方文档: https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html
- 阿里云短信文档: https://help.aliyun.com/document_detail/101414.html

---

**🎊 实现这些 API 后，小程序的微信一键登录功能就可以使用了！**
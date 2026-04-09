# 🎯 后端 API 需求清单

## 📋 概述

小程序和 Web 端已完成，现在需要后端提供以下 API 支持多种登录方式。

---

## ✅ 已有的 API（无需修改）

### 认证相关
- `POST /api/auth/register` - 邮箱注册 ✅
- `POST /api/auth/login` - 邮箱登录 ✅
- `GET /api/auth/me` - 获取当前用户 ✅

### 其他
- 所有宠物、物种、社区相关的 API 已完整 ✅

---

## 🔧 需要新增的 API

### 1. 发送短信验证码

**接口**: `POST /api/auth/sms/send`

**请求**:
```json
{
  "phone": "13800138000",
  "type": "login"  // 可选: login, register, reset
}
```

**响应**:
```json
{
  "success": true,
  "message": "验证码已发送"
}
```

**后端需要做的**:
1. 验证手机号格式（11位数字）
2. 生成6位随机验证码
3. 调用短信服务商API发送验证码
4. 将验证码存入数据库或Redis，有效期5分钟
5. 限制同一手机号60秒内只能发送一次

**短信服务商**（任选其一）:
- 阿里云短信
- 腾讯云短信
- 云片短信

---

### 2. 手机号登录/注册

**接口**: `POST /api/auth/login/phone`

**请求**:
```json
{
  "phone": "13800138000",
  "code": "123456"
}
```

**响应**:
```json
{
  "token": "jwt-token-string",
  "user": {
    "id": "uuid",
    "phone": "13800138000",
    "username": "user_8000",
    "email": null,
    "avatar": null
  }
}
```

**后端需要做的**:
1. 验证手机号和验证码
2. 验证码正确后标记为已使用
3. 查找用户：
   - 如果存在：直接登录
   - 如果不存在：自动创建用户
4. 生成 JWT Token
5. 返回用户信息和 Token

---

### 3. 微信小程序一键登录

**接口**: `POST /api/auth/login/wechat`

**请求**:
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
  "token": "jwt-token-string",
  "user": {
    "id": "uuid",
    "phone": "13800138000",
    "username": "user_8000",
    "email": null,
    "avatar": null
  }
}
```

**后端需要做的**:
1. 使用 code 调用微信 API 获取 session_key
2. 使用 session_key 解密 encryptedData 获取手机号
3. 查找或创建用户
4. 生成 JWT Token
5. 返回用户信息和 Token

**需要的信息**:
- 微信小程序 AppID
- 微信小程序 AppSecret

---

### 4. 微信 Web 扫码登录

**接口 1**: `GET /api/auth/wechat/qrconnect`

**请求参数**:
```
?redirect_uri=https://your-frontend.com
```

**功能**:
重定向到微信扫码登录页面

**接口 2**: `GET /api/auth/wechat/callback`

**请求参数**:
```
?code=wechat-auth-code&state=random-state
```

**功能**:
微信回调接口，处理扫码后的回调

**响应**:
重定向到前端页面并携带 token

**需要的信息**:
- 微信开放平台 AppID
- 微信开放平台 AppSecret
- 已备案的域名

---

### 5. 更新注册接口（支持手机号注册）

**接口**: `POST /api/auth/register`

**新增支持**:

**手机号注册**:
```json
{
  "phone": "13800138000",
  "code": "123456",
  "username": "myusername",
  "password": "password123"
}
```

**响应**: 与邮箱注册相同

**后端需要做的**:
1. 判断注册方式（邮箱或手机号）
2. 如果是手机号注册，验证短信验证码
3. 创建用户时允许 email 或 phone 为空
4. 返回用户信息和 Token

---

## 📊 数据库修改

### 修改 User 表

```sql
-- 添加 phone 字段
ALTER TABLE User ADD COLUMN phone VARCHAR(20) UNIQUE;
ALTER TABLE User MODIFY COLUMN email VARCHAR(255) NULL;  -- 改为可选
ALTER TABLE User MODIFY COLUMN password TEXT NULL;  -- 改为可选（微信登录用户可能没有密码）
```

### 新增 SmsCode 表

```sql
CREATE TABLE SmsCode (
  id VARCHAR(36) PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  type VARCHAR(20) NOT NULL,  -- login, register, reset
  used BOOLEAN DEFAULT FALSE,
  expiresAt DATETIME NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_phone_code (phone, code)
);
```

### Prisma Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String?  @unique
  phone     String?  @unique
  username  String   @unique
  password  String?
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

---

## 🔑 需要提供的配置信息

### 1. 短信服务（任选其一）

#### 阿里云短信
```
ALIYUN_ACCESS_KEY_ID=your-key-id
ALIYUN_ACCESS_KEY_SECRET=your-key-secret
ALIYUN_SMS_SIGN_NAME=PetKeeper
ALIYUN_SMS_TEMPLATE_CODE=SMS_123456789
```

#### 腾讯云短信
```
TENCENT_SECRET_ID=your-secret-id
TENCENT_SECRET_KEY=your-secret-key
TENCENT_SMS_APP_ID=your-app-id
TENCENT_SMS_SIGN_NAME=PetKeeper
TENCENT_SMS_TEMPLATE_ID=123456
```

### 2. 微信小程序登录

```
WX_MINIPROGRAM_APPID=wx1234567890abcdef
WX_MINIPROGRAM_SECRET=your-miniprogram-secret
```

### 3. 微信 Web 扫码登录（可选）

```
WX_OPEN_APPID=wx1234567890abcdef
WX_OPEN_SECRET=your-open-secret
```

---

## 💰 成本估算

### 短信费用
- 阿里云：约 0.045元/条
- 腾讯云：约 0.040元/条
- 假设每月1000条：约 40-50元/月

### 微信登录
- 微信小程序登录：免费
- 微信开放平台认证：300元/年（企业认证）

---

## 🚀 实现优先级

### 第一阶段（必须）
1. ✅ 发送短信验证码 API
2. ✅ 手机号登录/注册 API
3. ✅ 微信小程序一键登录 API
4. ✅ 数据库修改

### 第二阶段（可选）
1. 微信 Web 扫码登录
2. 找回密码功能
3. 手机号绑定/解绑

---

## 📝 实现建议

### 短信验证码
1. **安全性**：
   - 验证码5分钟过期
   - 使用后立即标记为已用
   - 限制发送频率（60秒一次）
   - 验证码加密存储

2. **存储**：
   - 推荐使用 Redis（更快，自动过期）
   - 或使用数据库 SmsCode 表

### 微信登录
1. **小程序登录**：
   - 使用 `wechat-mini-program-crypt` 库解密
   - 注意 session_key 有效期

2. **Web 扫码登录**：
   - 需要微信开放平台账号
   - 需要已备案域名
   - 需要企业认证

### 用户处理
1. **自动创建用户**：
   - 手机号登录时如果用户不存在，自动创建
   - 用户名自动生成：`user_${手机号后4位}`
   - 密码可为空（微信登录用户）

2. **账号合并**：
   - 同一手机号只能有一个账号
   - 同一邮箱只能有一个账号

---

## 🎯 快速实现清单

### 后端开发

- [ ] 安装依赖
  ```bash
  npm install wechat-mini-program-crypt @alicloud/dysmsapi20170525
  ```

- [ ] 更新数据库 Schema
  ```bash
  npx prisma migrate dev --name add_phone_login
  ```

- [ ] 实现 `POST /api/auth/sms/send`
  - 验证手机号
  - 生成验证码
  - 发送短信
  - 存储验证码

- [ ] 实现 `POST /api/auth/login/phone`
  - 验证验证码
  - 查找或创建用户
  - 生成 Token

- [ ] 实现 `POST /api/auth/login/wechat`（小程序）
  - 获取 session_key
  - 解密手机号
  - 查找或创建用户
  - 生成 Token

- [ ] 更新 `POST /api/auth/register`
  - 支持手机号注册
  - 支持邮箱注册

- [ ] 测试所有接口

---

## 📚 参考文档

- [微信小程序手机号快速验证](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html)
- [微信开放平台网页扫码登录](https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/WeChat_Login.html)
- [阿里云短信 API](https://help.aliyun.com/document_detail/101414.html)
- [腾讯云短信 API](https://cloud.tencent.com/document/product/382)

---

## ✅ 前端已就绪

**小程序端**:
- ✅ 邮箱登录
- ✅ 手机号登录
- ✅ 微信一键登录
- ✅ 邮箱注册
- ✅ 手机号注册

**Web 端**:
- ✅ 邮箱登录
- ✅ 手机号登录
- ✅ 微信扫码登录
- ✅ 邮箱注册
- ✅ 手机号注册

**所有前端功能已完成，只需后端实现以上 API 即可使用！**

---

## 🎊 完成后的用户体验

用户可以：
1. 使用邮箱 + 密码登录/注册
2. 使用手机号 + 验证码登录/注册
3. 微信小程序一键登录（无需输入密码）
4. Web 端微信扫码登录
5. 多种方式灵活切换

**降低注册门槛，提升用户体验！** 🚀
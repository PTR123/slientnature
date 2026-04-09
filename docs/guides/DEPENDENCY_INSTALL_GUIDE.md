# 依赖安装问题解决方案

## ⚠️ 问题：npm网络超时

由于网络问题，部分npm包安装失败。

---

## 🔧 解决方案

### 方案一：使用国内镜像源（推荐）

```bash
cd /Users/mac/zrby/pet-keeper-backend

# 切换到淘宝镜像
npm config set registry https://registry.npmmirror.com

# 安装依赖
npm install ioredis @types/ioredis helmet express-rate-limit winston @types/winston file-type sharp @types/sharp

# 恢复官方源（可选）
npm config set registry https://registry.npmjs.org
```

---

### 方案二：跳过类型定义包（开发环境）

如果只是测试功能，可以暂时不安装类型定义包：

```bash
# 只安装运行时依赖
npm install ioredis helmet express-rate-limit winston file-type sharp
```

---

### 方案三：使用已有的Redis客户端

项目已经创建了Redis集成代码，但可以暂时不安装依赖运行：

1. **修改`src/lib/redis.ts`**（使其可选）

```typescript
// Redis可选支持
let redis: any = null;

export const initRedis = () => {
  try {
    if (process.env.REDIS_URL) {
      const Redis = require('ioredis');
      redis = new Redis(process.env.REDIS_URL);
      console.log('✅ Redis connected');
    }
  } catch (error) {
    console.log('⚠️  Redis not available, running without cache');
  }
  return redis;
};

// 缓存函数降级处理
export const cache = {
  get: async () => null,  // 无Redis时返回null
  set: async () => false, // 无Redis时返回false
  del: async () => false,
  delPattern: async () => false
};
```

---

## 📦 核心依赖说明

### 必需依赖（已安装）
```json
{
  "express": "^4.21.0",
  "prisma": "^5.20.0",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3"
}
```

### 新增依赖（可选）

**性能优化**:
- `ioredis` - Redis客户端（推荐安装）

**安全增强**:
- `helmet` - HTTP安全头（推荐安装）
- `express-rate-limit` - 速率限制（推荐安装）

**日志系统**:
- `winston` - 日志框架（推荐安装）

**文件处理**:
- `sharp` - 图片处理（可选）
- `file-type` - 文件类型检测（可选）

---

## ✅ 临时解决方案

### 1. 注释掉Redis导入

在`src/routes/products.ts`中：

```typescript
// import { cache } from '../lib/redis.js';

// 暂时不使用缓存
// const cached = await cache.get(cacheKey);
// if (cached) return res.json(cached);
```

### 2. 简化文件上传处理

在`src/lib/upload.ts`中移除sharp和file-type依赖：

```typescript
// 简化版本，仅使用multer
import multer from 'multer';

const upload = multer({
  dest: './uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }
});
```

---

## 🚀 快速启动（不依赖新包）

项目核心功能不依赖这些包，可以正常运行：

```bash
# 启动后端
npm run dev

# 测试基础功能
curl http://localhost:3001/api/health
```

---

## 📝 推荐安装顺序

**优先级P0**（立即安装）:
```bash
npm install helmet express-rate-limit winston
```

**优先级P1**（性能优化）:
```bash
npm install ioredis
```

**优先级P2**（文件处理）:
```bash
npm install sharp file-type
```

---

## 🎯 总结

**核心功能不受影响**：
- ✅ 用户认证
- ✅ 商品管理
- ✅ 订单系统
- ✅ 支付功能

**可选功能**：
- ⏸️ Redis缓存（需安装ioredis）
- ⏸️ 文件上传验证（需安装sharp）
- ⏸️ 高级日志（需安装winston）

**建议**：
1. 先运行项目，确保核心功能正常
2. 网络恢复后再安装优化依赖
3. 或使用国内镜像源安装
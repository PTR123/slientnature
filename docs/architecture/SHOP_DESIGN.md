# 🛍️ PetKeeper 商城系统设计文档

## 📊 数据库设计

### 1. 商品分类表 (ProductCategory)

```prisma
model ProductCategory {
  id          String   @id @default(uuid())
  name        String
  description String?
  image       String?
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  products Product[]
}
```

### 2. 商品表 (Product)

```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  description String
  content     String   // 商品详情（富文本）
  categoryId  String
  images      String   // JSON 数组
  price       Float
  originalPrice Float?
  stock       Int      @default(0)
  sales       Int      @default(0)
  unit        String   @default("件")
  isHot       Boolean  @default(false)
  isNew       Boolean  @default(false)
  isRecommend Boolean  @default(false)
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  category     ProductCategory @relation(fields: [categoryId], references: [id])
  cartItems    CartItem[]
  orderItems   OrderItem[]
}
```

### 3. 购物车表 (CartItem)

```prisma
model CartItem {
  id        String   @id @default(uuid())
  userId    String
  productId String
  quantity  Int      @default(1)
  selected  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user     User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product  Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([userId, productId])
}
```

### 4. 订单表 (Order)

```prisma
model Order {
  id            String   @id @default(uuid())
  orderNo       String   @unique
  userId        String
  totalAmount   Float
  payAmount     Float
  status        String   @default("pending") // pending, paid, shipped, completed, cancelled
  receiverName  String
  receiverPhone String
  receiverAddress String
  remark        String?
  paidAt        DateTime?
  shippedAt     DateTime?
  completedAt   DateTime?
  cancelledAt   DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user      User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  items     OrderItem[]
}
```

### 5. 订单项表 (OrderItem)

```prisma
model OrderItem {
  id        String   @id @default(uuid())
  orderId   String
  productId String
  productName String
  productImage String
  price     Float
  quantity  Int
  createdAt DateTime @default(now())

  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])
}
```

### 6. 更新 User 模型

在现有 User 模型中添加：

```prisma
model User {
  // ... 现有字段

  cartItems  CartItem[]
  orders     Order[]
}
```

---

## 🔌 后端 API 设计

### 商品管理 API

#### 1. 获取商品列表
```
GET /api/products
Query: ?page=1&limit=10&categoryId=xxx&keyword=xxx&sort=price_asc
```

#### 2. 获取商品详情
```
GET /api/products/:id
```

#### 3. 创建商品（管理员）
```
POST /api/admin/products
Body: {
  name, description, content, categoryId, images, price, originalPrice, stock, unit, isHot, isNew, isRecommend
}
```

#### 4. 更新商品（管理员）
```
PUT /api/admin/products/:id
```

#### 5. 删除商品（管理员）
```
DELETE /api/admin/products/:id
```

#### 6. 上传商品图片（管理员）
```
POST /api/admin/products/upload
```

### 商品分类 API

#### 1. 获取分类列表
```
GET /api/categories
```

#### 2. 创建分类（管理员）
```
POST /api/admin/categories
```

#### 3. 更新分类（管理员）
```
PUT /api/admin/categories/:id
```

#### 4. 删除分类（管理员）
```
DELETE /api/admin/categories/:id
```

### 购物车 API

#### 1. 获取购物车
```
GET /api/cart
```

#### 2. 添加到购物车
```
POST /api/cart
Body: { productId, quantity }
```

#### 3. 更新购物车项
```
PUT /api/cart/:id
Body: { quantity, selected }
```

#### 4. 删除购物车项
```
DELETE /api/cart/:id
```

#### 5. 全选/取消全选
```
POST /api/cart/select-all
Body: { selected }
```

### 订单 API

#### 1. 创建订单
```
POST /api/orders
Body: { cartItemIds, receiverName, receiverPhone, receiverAddress, remark }
```

#### 2. 获取订单列表
```
GET /api/orders
Query: ?status=pending&page=1&limit=10
```

#### 3. 获取订单详情
```
GET /api/orders/:id
```

#### 4. 取消订单
```
POST /api/orders/:id/cancel
```

#### 5. 确认收货
```
POST /api/orders/:id/complete
```

### 管理员订单 API

#### 1. 获取所有订单
```
GET /api/admin/orders
```

#### 2. 发货
```
POST /api/admin/orders/:id/ship
```

#### 3. 订单统计
```
GET /api/admin/orders/stats
```

---

## 🎨 前端页面设计

### 小程序页面

1. **商品列表** `pages/shop/list`
   - 分类筛选
   - 搜索功能
   - 上拉加载

2. **商品详情** `pages/shop/detail`
   - 商品图片轮播
   - 商品信息
   - 加入购物车
   - 立即购买

3. **购物车** `pages/cart/cart`
   - 商品列表
   - 数量调整
   - 全选功能
   - 结算

4. **订单列表** `pages/orders/list`
   - 订单状态筛选
   - 订单卡片

5. **订单详情** `pages/orders/detail`
   - 订单信息
   - 物流跟踪

### Web 端页面

1. **商城首页** `/shop`
   - 轮播图
   - 热门商品
   - 新品推荐
   - 分类导航

2. **商品列表** `/shop/list`
3. **商品详情** `/shop/[id]`
4. **购物车** `/cart`
5. **订单列表** `/orders`
6. **订单详情** `/orders/[id]`

### 管理后台页面

1. **商品管理** `/admin/products`
   - 商品列表
   - 搜索筛选
   - 批量操作

2. **添加/编辑商品** `/admin/products/create` `/admin/products/[id]/edit`
   - 商品信息表单
   - 图片上传
   - 富文本编辑器

3. **分类管理** `/admin/categories`
   - 分类列表
   - 添加/编辑分类

4. **订单管理** `/admin/orders`
   - 订单列表
   - 订单详情
   - 发货处理

---

## 📝 实现步骤

### 第一阶段：数据库和后端 API

1. ✅ 更新 Prisma Schema
2. ✅ 运行数据库迁移
3. ✅ 创建商品路由
4. ✅ 创建分类路由
5. ✅ 创建购物车路由
6. ✅ 创建订单路由

### 第二阶段：管理后台

1. ✅ 商品列表页面
2. ✅ 商品创建/编辑页面
3. ✅ 分类管理页面
4. ✅ 订单管理页面

### 第三阶段：前端展示

1. ✅ 商城首页
2. ✅ 商品列表页
3. ✅ 商品详情页
4. ✅ 购物车页
5. ✅ 订单页面

---

## 🔐 权限控制

### 用户权限
- 浏览商品
- 购物车操作
- 下单购买
- 查看自己的订单

### 管理员权限
- 商品管理（增删改查）
- 分类管理
- 订单管理
- 查看所有订单
- 发货处理

---

## 📦 商品状态

- **上架** (`isActive: true`): 用户可见可购买
- **下架** (`isActive: false`): 用户不可见

## 📦 订单状态

- **待支付** (`pending`): 订单已创建，等待支付
- **已支付** (`paid`): 支付成功，等待发货
- **已发货** (`shipped`): 商家已发货
- **已完成** (`completed`): 用户确认收货
- **已取消** (`cancelled`): 订单已取消

---

## 🎯 下一步

我将按照以下顺序实现：

1. 数据库迁移
2. 后端 API（商品、分类、购物车、订单）
3. 管理后台页面
4. 前端展示页面（小程序和 Web）

---

**开始实现商城功能！** 🚀
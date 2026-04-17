# 购物车401错误修复总结

## 错误描述

**错误信息**：
```
GET http://localhost:3001/api/cart 401 (Unauthorized)
Error: No token provided
```

**错误原因**：
- 购物车API需要认证（需要登录）
- 商城页面在用户未登录时尝试加载购物车数量
- 没有 token 导致401 Unauthorized

---

## 🔴 根本问题

### 问题1：未登录时请求购物车数据

**代码位置**：`pages/shop/shop.js:141-148`

**问题代码**：
```javascript
async loadCartCount() {
  try {
    const cart = await request('/cart', 'GET') // ❌ 未登录时也会请求
    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0)
    this.setData({ cartCount: count })
  } catch (err) {
    console.error('加载购物车数量失败:', err) // ❌ 没有设置默认值
  }
}
```

**触发时机**：
- `onLoad()` - 页面加载时
- `onShow()` - 页面显示时

**问题**：
- 未登录用户访问商城时，立即请求购物车API
- 后端返回401错误
- 前端没有处理未登录状态

---

### 问题2：加入购物车没有登录检查

**代码位置**：`pages/shop/shop.js:112-123`

**问题代码**：
```javascript
async addToCart(e) {
  const { id } = e.currentTarget.dataset

  try {
    await request('/cart', 'POST', {...}) // ❌ 未登录时也会请求
    util.showToast('已加入购物车', 'success')
    this.loadCartCount()
  } catch (err) {
    util.showToast(err.message || '添加失败')
  }
}
```

**问题**：
- 未登录用户点击"加购"按钮
- 直接请求购物车API
- 导致401错误

---

### 问题3：购物车跳转没有登录检查

**代码位置**：`pages/shop/shop.js:134-137`

**问题代码**：
```javascript
goToCart() {
  wx.switchTab({
    url: '/pages/cart/cart' // ❌ 未登录也能跳转
  })
}
```

**问题**：
- 未登录用户点击购物车图标
- 直接跳转到购物车页面
- 购物车页面会因为401错误无法显示数据

---

## ✅ 解决方案

### 1. loadCartCount添加登录检查

**修复代码**：
```javascript
async loadCartCount() {
  try {
    const app = getApp()

    // ✅ 先检查是否登录
    if (!app.isLoggedIn()) {
      this.setData({ cartCount: 0 }) // 未登录时设置为0
      return // 不请求API
    }

    const cart = await request('/cart', 'GET')
    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0)
    this.setData({ cartCount: count })
  } catch (err) {
    console.error('加载购物车数量失败:', err)
    this.setData({ cartCount: 0 }) // ✅ 失败时也设置为0
  }
}
```

**修复效果**：
- ✅ 未登录用户不请求购物车API
- ✅ 购物车数量显示为0（无徽章）
- ✅ 避免401错误

---

### 2. addToCart添加登录提示

**修复代码**：
```javascript
async addToCart(e) {
  const { id } = e.currentTarget.dataset

  // ✅ 检查是否登录
  const app = getApp()
  if (!app.isLoggedIn()) {
    wx.showModal({
      title: '提示',
      content: '请先登录后再加入购物车',
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/login/login'
          })
        }
      }
    })
    return
  }

  try {
    await request('/cart', 'POST', { productId: id, quantity: 1 })
    util.showToast('已加入购物车', 'success')
    this.loadCartCount()
  } catch (err) {
    util.showToast(err.message || '添加失败')
  }
}
```

**修复效果**：
- ✅ 未登录用户点击"加购"时弹出登录提示
- ✅ 引导用户去登录
- ✅ 避免401错误

---

### 3. goToCart添加登录检查

**修复代码**：
```javascript
goToCart() {
  // ✅ 检查是否登录
  const app = getApp()
  if (!app.isLoggedIn()) {
    wx.showModal({
      title: '提示',
      content: '请先登录后查看购物车',
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/login/login'
          })
        }
      }
    })
    return
  }

  wx.navigateTo({
    url: '/pages/cart/cart'
  })
}
```

**修复效果**：
- ✅ 未登录用户点击购物车图标时弹出登录提示
- ✅ 引导用户去登录
- ✅ 避免跳转到空白购物车页面

**注意**：
- 购物车不在tabBar中，使用 `wx.navigateTo` 而不是 `wx.switchTab`

---

## 📋 完整修复清单

### pages/shop/shop.js 修改

**修改1：loadCartCount**
```javascript
// 修改前 ❌
async loadCartCount() {
  const cart = await request('/cart', 'GET')
  ...
}

// 修改后 ✅
async loadCartCount() {
  const app = getApp()
  if (!app.isLoggedIn()) {
    this.setData({ cartCount: 0 })
    return
  }
  const cart = await request('/cart', 'GET')
  ...
}
```

**修改2：addToCart**
```javascript
// 修改前 ❌
async addToCart(e) {
  await request('/cart', 'POST', ...)
  ...
}

// 修改后 ✅
async addToCart(e) {
  if (!app.isLoggedIn()) {
    wx.showModal({...提示登录...})
    return
  }
  await request('/cart', 'POST', ...)
  ...
}
```

**修改3：goToCart**
```javascript
// 修改前 ❌
goToCart() {
  wx.switchTab({ url: '/pages/cart/cart' })
}

// 修改后 ✅
goToCart() {
  if (!app.isLoggedIn()) {
    wx.showModal({...提示登录...})
    return
  }
  wx.navigateTo({ url: '/pages/cart/cart' })
}
```

---

## 🎯 用户体验优化

### 未登录用户购物流程（修复后）

**场景1：浏览商城**
```
用户未登录 → 进入商城页面
→ 购物车图标显示（无数量徽章） ✅
→ 不会触发401错误 ✅
```

**场景2：点击"加购"**
```
未登录用户 → 点击"加购"按钮
→ 弹出登录提示："请先登录后再加入购物车"
→ 用户选择：
  - 点击"去登录" → 跳转登录页面 ✅
  - 点击"取消" → 继续浏览商品
```

**场景3：点击购物车图标**
```
未登录用户 → 点击购物车图标
→ 弹出登录提示："请先登录后查看购物车"
→ 用户选择：
  - 点击"去登录" → 跳转登录页面 ✅
  - 点击"取消" → 继续浏览商城
```

---

### 已登录用户购物流程（正常）

**场景1：浏览商城**
```
已登录用户 → 进入商城页面
→ 购物车图标显示（有数量徽章） ✅
→ 自动加载购物车数量 ✅
```

**场景2：点击"加购"**
```
已登录用户 → 点击"加购"按钮
→ 提示"已加入购物车" ✅
→ 购物车数量增加 ✅
```

**场景3：点击购物车图标**
```
已登录用户 → 点击购物车图标
→ 跳转购物车页面 ✅
→ 显示购物车内容 ✅
```

---

## 🔧 技术细节

### 登录状态检查

**app.js提供的检查方法**：
```javascript
App({
  isLoggedIn() {
    return !!this.globalData.token
  }
})
```

**使用方法**：
```javascript
const app = getApp()
if (app.isLoggedIn()) {
  // 已登录，可以请求购物车
} else {
  // 未登录，提示用户登录
}
```

---

### 购物车API认证要求

**后端代码**：`pet-keeper-backend/src/routes/cart.ts:8`

```javascript
// 所有购物车接口都需要登录
router.use(authenticate);
```

**认证中间件**：
- 检查请求头中的 `Authorization: Bearer <token>`
- 没有 token 或 token 无效 → 返回 401
- token 有效 → 继续处理请求

---

## 🧪 测试验证

### 测试清单

**未登录状态测试**：
- [ ] 进入商城页面，购物车图标无数量徽章 ✅
- [ ] 不触发401错误 ✅
- [ ] 点击"加购"按钮，弹出登录提示 ✅
- [ ] 点击购物车图标，弹出登录提示 ✅
- [ ] 点击"去登录"，跳转登录页面 ✅

**已登录状态测试**：
- [ ] 进入商城页面，购物车图标显示数量 ✅
- [ ] 自动加载购物车数量 ✅
- [ ] 点击"加购"，成功加入购物车 ✅
- [ ] 购物车数量增加 ✅
- [ ] 点击购物车图标，跳转购物车页面 ✅

---

## 💡 其他页面类似问题

### 需要登录检查的其他页面

**购物车页面**（pages/cart/cart.js）：
- ✅ 已有登录检查（购物车页面需要登录）

**订单页面**（pages/orders/orders.js）：
- ✅ 已有登录检查（订单页面需要登录）

**个人中心**（pages/profile/profile.js）：
- ✅ 已有登录检查（个人中心需要登录）

---

## 📊 修复效果对比

### 修复前（错误）

```
未登录用户访问商城：
1. onLoad() → loadCartCount()
2. 请求 /cart API
3. 返回 401 Unauthorized ❌
4. Console错误日志 ❌
5. 购物车数量未设置（undefined） ❌
```

### 修复后（正确）

```
未登录用户访问商城：
1. onLoad() → loadCartCount()
2. 检查登录状态 → 未登录
3. 设置 cartCount = 0 ✅
4. 不请求API ✅
5. 购物车图标正常显示（无徽章） ✅
```

---

## 总结

### ✅ 已修复的问题

1. **loadCartCount添加登录检查** ✅
   - 未登录时不请求购物车API
   - 设置cartCount为0

2. **addToCart添加登录提示** ✅
   - 未登录时弹出登录提示
   - 引导用户去登录

3. **goToCart添加登录检查** ✅
   - 未登录时弹出登录提示
   - 修改跳转方式（navigateTo）

### 🎯 修复效果

- ✅ 401错误消失
- ✅ 未登录用户体验良好
- ✅ 登录流程顺畅
- ✅ 购物车功能完整

---

**购物车401错误已修复！现在未登录用户不会触发401错误，体验流畅！** ✅
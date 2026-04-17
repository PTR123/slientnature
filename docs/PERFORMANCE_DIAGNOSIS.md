# 小程序性能问题排查与优化方案

## 发现的性能瓶颈

### 🔴 严重问题

### 1. API地址配置错误（最严重）

**位置**：`pet-keeper-miniprogram/app.js:6`

**问题**：
```javascript
apiBaseUrl: 'http://192.168.3.20:3001/api' // 内网地址
```

**影响**：
- ❌ 这是内网地址（192.168.3.20）
- ❌ 如果用户不在内网，请求会超时或极慢
- ❌ 导致所有页面加载缓慢

**解决方案**：
```javascript
// 方案1：使用公网地址（推荐）
apiBaseUrl: 'https://api.yourdomain.com/api'

// 方案2：使用localhost（本地开发）
apiBaseUrl: 'http://localhost:3001/api'

// 方案3：动态检测环境
apiBaseUrl: (() => {
  // 开发环境
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001/api'
  }
  // 生产环境
  return 'https://api.yourdomain.com/api'
})()
```

**优化效果**：预计提升 **50-80%**

---

### 2. 大量console.log输出（中等）

**位置**：`utils/api.js`

**问题**：
```javascript
console.log('🚀 API Request:', {...}) // 每个请求都输出
console.log('✅ API Response:', res)  // 每个响应都输出
console.error('❌ ...', ...)           // 大量错误日志
```

**影响**：
- console.log在真机上会影响性能
- 每个API请求都有3-5个log输出
- 影响渲染速度

**解决方案**：
```javascript
// 添加环境判断，只在开发环境输出日志
const isDev = false // 生产环境设置为false

function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    const token = app.globalData.token

    // 只在开发环境输出日志
    if (isDev) {
      console.log('🚀 API Request:', {
        url: `${app.globalData.apiBaseUrl}${url}`,
        method,
        data,
        hasToken: !!token
      })
    }

    wx.request({
      url: `${app.globalData.apiBaseUrl}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      timeout: 10000,
      success(res) {
        if (isDev) {
          console.log('✅ API Response:', res)
        }

        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          if (isDev) {
            console.error('❌ 401 Unauthorized:', res.data)
          }
          reject(new Error(res.data.error || '未授权'))
        }
        // ... 其他错误处理，只在dev环境输出console.error
      }
    })
  })
}
```

**优化效果**：预计提升 **5-10%**

---

### 3. 缺少数据缓存（中等）

**问题**：
- 每次进入页面都重新请求API
- 没有利用缓存数据
- 重复请求浪费时间和带宽

**解决方案**：

**实现缓存机制**：

```javascript
// utils/cache.js
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

class CacheManager {
  static get(key) {
    const cached = wx.getStorageSync(`cache_${key}`)
    if (!cached) return null

    const { data, timestamp } = cached
    const now = Date.now()

    // 缓存过期，删除
    if (now - timestamp > CACHE_DURATION) {
      wx.removeStorageSync(`cache_${key}`)
      return null
    }

    return data
  }

  static set(key, data) {
    wx.setStorageSync(`cache_${key}`, {
      data,
      timestamp: Date.now()
    })
  }

  static clear(key) {
    if (key) {
      wx.removeStorageSync(`cache_${key}`)
    } else {
      // 清除所有缓存
      const keys = wx.getStorageInfoSync().keys
      keys.forEach(k => {
        if (k.startsWith('cache_')) {
          wx.removeStorageSync(k)
        }
      })
    }
  }
}

module.exports = CacheManager
```

**在API中使用缓存**：

```javascript
// utils/api.js
const CacheManager = require('./cache')

const petApi = {
  getList() {
    // 先从缓存读取
    const cached = CacheManager.get('pets_list')
    if (cached) {
      return Promise.resolve(cached) // 立即返回缓存
    }

    // 缓存不存在，请求API
    return request('/pets').then(data => {
      CacheManager.set('pets_list', data) // 存入缓存
      return data
    })
  }
}
```

**优化效果**：
- 首次加载：正常速度
- 再次加载：**提升90%以上**（直接返回缓存）

---

### 4. 图片加载优化（轻微）

**问题**：
- 图片没有使用CDN
- 图片没有懒加载
- 图片没有压缩

**解决方案**：

**1. 图片懒加载**：
```xml
<image
  lazy-load="{{true}}"
  src="{{item.image}}"
  mode="aspectFill"
/>
```

**2. 图片压缩**：
```javascript
// 上传前压缩图片
async function compressImage(filePath) {
  const res = await wx.compressImage({
    src: filePath,
    quality: 80 // 压缩质量
  })
  return res.tempFilePath
}
```

**优化效果**：预计提升 **10-20%**

---

### 5. 并行请求优化（轻微）

**当前**：`pages/index/index.js:48`

```javascript
const [pets, posts] = await Promise.all([
  petApi.getList().catch(err => []),
  postApi.getList({ limit: 3, sort: 'hot' }).catch(err => [])
])
```

**优化**：添加优先级和降级策略

```javascript
// 优先显示页面框架
this.setData({
  userInfo: app.globalData.userInfo,
  dataLoading: true
})

// 并行请求，优先返回缓存数据
const cachedPets = CacheManager.get('pets_list')
const cachedPosts = CacheManager.get('posts_hot')

if (cachedPets || cachedPosts) {
  // 有缓存，立即显示
  this.setData({
    pets: cachedPets?.slice(0, 3) || [],
    recentPosts: cachedPosts || []
  })
}

// 后台更新数据
Promise.all([
  petApi.getList(),
  postApi.getList({ limit: 3, sort: 'hot' })
]).then(([pets, posts]) => {
  this.setData({
    pets: pets.slice(0, 3),
    recentPosts: posts,
    dataLoading: false
  })
}).catch(err => {
  console.error('后台更新失败:', err)
  this.setData({ dataLoading: false })
})
```

---

### 6. 请求拦截和去重（中等）

**问题**：
- 可能存在重复请求
- 没有请求取消机制

**解决方案**：

```javascript
// utils/api.js
const pendingRequests = new Map()

function request(url, method = 'GET', data = {}) {
  const requestKey = `${method}_${url}_${JSON.stringify(data)}`

  // 检查是否有相同请求正在进行
  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey) // 返回已有的Promise
  }

  const promise = new Promise((resolve, reject) => {
    const requestTask = wx.request({
      url: `${app.globalData.apiBaseUrl}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      timeout: 10000,
      success(res) {
        pendingRequests.delete(requestKey) // 移除记录
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(new Error(res.data.error || '请求失败'))
        }
      },
      fail(err) {
        pendingRequests.delete(requestKey)
        reject(new Error(err.errMsg || '网络失败'))
      }
    })

    // 保存请求任务，可用于取消
    pendingRequests.set(requestKey, {
      promise,
      task: requestTask
    })
  })

  return promise
}

// 页面卸载时取消未完成的请求
function cancelAllRequests() {
  pendingRequests.forEach(({ task }) => {
    task.abort() // 取消请求
  })
  pendingRequests.clear()
}
```

---

## 性能监控方案

### 添加性能监控

```javascript
// utils/performance.js
class PerformanceMonitor {
  static startTime = null

  static start(label) {
    this.startTime = Date.now()
    if (isDev) {
      console.log(`⏱️ [${label}] 开始`)
    }
  }

  static end(label) {
    const duration = Date.now() - this.startTime
    if (isDev) {
      console.log(`⏱️ [${label}] 结束: ${duration}ms`)
    }

    // 记录到小程序分析
    wx.reportPerformance(1001, duration, label)

    return duration
  }

  static measurePageLoad() {
    this.start('页面加载')

    // 页面渲染完成时调用
    setTimeout(() => {
      const duration = this.end('页面加载')

      // 性能预警
      if (duration > 3000) {
        console.warn(`⚠️ 页面加载超过3秒: ${duration}ms`)
      }
    }, 100)
  }
}

module.exports = PerformanceMonitor
```

**在页面中使用**：

```javascript
// pages/index/index.js
const PerfMonitor = require('../../utils/performance')

Page({
  onLoad() {
    PerfMonitor.measurePageLoad()
    this.loadData()
  }
})
```

---

## 综合优化方案

### 立即实施（高优先级）

**1. 修改API地址** ⚠️ **最关键**
```javascript
// app.js
apiBaseUrl: 'http://localhost:3001/api' // 本地测试
// 或
apiBaseUrl: 'https://api.yourdomain.com/api' // 生产环境
```

**2. 禁用生产环境日志**
```javascript
// utils/api.js
const isDev = false // 发布时设置为false
```

**3. 实现数据缓存**
```javascript
// 创建 utils/cache.js
// 在关键API中使用缓存
```

### 近期实施（中优先级）

**4. 图片懒加载**
```xml
<image lazy-load="{{true}}" />
```

**5. 请求去重**
```javascript
// 添加 pendingRequests Map
// 避免重复请求
```

**6. 添加性能监控**
```javascript
// 创建 utils/performance.js
// 监控关键页面加载时间
```

### 长期优化（低优先级）

**7. 数据预加载**
```javascript
// 在app.js中预加载常用数据
// 减少页面加载时间
```

**8. 分页加载**
```javascript
// 大列表使用分页
// 减少首次加载量
```

---

## 性能对比预估

### 当前性能（未优化）

```
首页加载：
- API请求：2-5秒（内网地址问题）
- console.log：0.5-1秒影响
- 数据解析：0.5秒
- 页面渲染：1秒
总计：4-7.5秒 ❌ 非常慢
```

### 优化后性能

```
首次加载（无缓存）：
- API请求：0.5-1秒（公网地址）
- console.log：0秒（已禁用）
- 数据解析：0.5秒
- 页面渲染：1秒
总计：2-2.5秒 ✅ 提升50-60%

再次加载（有缓存）：
- 缓存读取：0.1秒
- 页面渲染：0.5秒
总计：0.6秒 ✅ 提升80-90%
```

---

## 测试验证方法

### 微信开发者工具性能面板

```bash
1. 打开开发者工具
2. 点击 "调试" -> "性能监控"
3. 查看指标：
   - 页面加载时间
   - CPU使用率
   - 内存使用
4. 对比优化前后数据
```

### 真机测试

```bash
1. 编译小程序
2. 手机扫码预览
3. 测试关键页面：
   - 首页加载速度
   - 商品列表加载
   - 社区帖子加载
4. 记录加载时间
```

### 性能指标

| 页面 | 优化前 | 优化后 | 提升 |
|-----|-------|-------|------|
| 首页首次加载 | 4-7秒 | 2-2.5秒 | 50-60% |
| 首页再次加载 | 4-7秒 | 0.6秒 | 80-90% |
| 商城列表 | 3-5秒 | 1-1.5秒 | 60-70% |
| 社区帖子 | 3-5秒 | 1-1.5秒 | 60-70% |

---

## 快速修复代码

### 立即可用的优化代码

**1. 修改API地址**（最关键）
```javascript
// pet-keeper-miniprogram/app.js
App({
  globalData: {
    userInfo: null,
    token: null,
    // 使用localhost或公网地址
    apiBaseUrl: 'http://localhost:3001/api' // ✅ 修改这里
  },
  ...
})
```

**2. 禁用日志输出**（立即生效）
```javascript
// pet-keeper-miniprogram/utils/api.js
const isDev = false // ✅ 添加这行，生产环境禁用log

function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    const token = app.globalData.token

    // ✅ 只在开发环境输出
    if (isDev) {
      console.log('🚀 API Request:', {...})
    }

    wx.request({
      ...
      success(res) {
        if (isDev) {
          console.log('✅ API Response:', res)
        }
        ...
      }
    })
  })
}
```

---

## 总结

### 最关键的问题

⚠️ **API地址配置错误**：
- 当前使用内网地址 `192.168.3.20:3001`
- 用户在外网无法访问或响应极慢
- 这是导致页面响应慢的根本原因

### 立即修复

1. **修改API地址** - 改为localhost或公网地址
2. **禁用console.log** - 生产环境不输出日志
3. **添加数据缓存** - 减少重复请求

### 预期效果

- 首次加载提升 **50-60%**
- 再次加载提升 **80-90%**
- 整体体验流畅

---

**建议立即修改app.js中的API地址，这是最关键的优化！** 🔧
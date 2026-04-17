# Timeout 超时错误修复

## 错误信息
```
request:fail timeout
Error: timeout at Function.<anonymous> (WAServiceMainContext.js)
```

## 问题原因

### 1. wx.request 默认timeout太短 ⏱️
微信小程序的 `wx.request` 默认timeout很短（约10秒），对于某些请求可能不够。

### 2. 多个Backend进程冲突 🔧
发现同时运行了**10个backend进程**，可能导致：
- 端口监听冲突
- 请求路由混乱
- 响应延迟

### 3. 网络请求配置缺失 ⚙️
`api.js` 中的请求没有设置timeout参数。

## 已修复

### 1. 添加timeout配置 ✅

**文件**: `pet-keeper-miniprogram/utils/api.js`

#### 普通API请求 (Line 28)
```javascript
wx.request({
  url: `${app.globalData.apiBaseUrl}${url}`,
  method,
  data,
  header: {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  },
  timeout: 30000, // 设置30秒超时
  success(res) {
    // ...
  }
})
```

#### 图片上传请求 (Line 82)
```javascript
wx.uploadFile({
  url: `${app.globalData.apiBaseUrl}/upload/image`,
  filePath,
  name: 'image',
  header: {
    'Authorization': `Bearer ${token}`
  },
  timeout: 60000, // 上传文件设置60秒超时
  success(res) {
    // ...
  }
})
```

### 2. 清理Backend进程 ✅

**执行的操作**:
- 强制停止所有旧的backend进程
- 重新启动单个backend服务
- 验证端口3001正常监听

**验证结果**:
```bash
$ curl http://localhost:3001/api/health
{"status":"ok","timestamp":"2026-04-09T11:22:12.064Z"}
Time: 0.004638s  # 响应很快，4.6毫秒
```

## 解决方案总结

### 立即测试步骤

1. **重新编译小程序**
   - 在微信开发者工具中点击"编译"按钮
   - 清除缓存（详情 → 清缓存）

2. **重新测试登录**
   - 进入登录页面
   - 输入邮箱和密码
   - 点击登录按钮
   - 观察Console日志

3. **检查timeout设置**
   ```javascript
   // 在Console中查看请求配置
   console.log('API timeout: 30s, Upload timeout: 60s')
   ```

### 验证清单

在微信开发者工具Console中观察：

#### 成功日志
```
🚀 API Request: {...}
✅ API Response: {...}  (应该在30秒内返回)
```

#### 失败日志（如果仍有问题）
```
❌ Network Error: {errMsg: "request:fail timeout"}
```

## 后续优化建议

### 1. 监控Backend进程
创建定期检查脚本，防止多个进程同时运行：
```bash
# 定期运行
./scripts/cleanup-backend-processes.sh
```

### 2. 添加请求重试机制
对于关键请求（登录、支付），添加自动重试：
```javascript
async function requestWithRetry(url, method, data, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await request(url, method, data)
    } catch (err) {
      if (i === retries - 1) throw err
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
}
```

### 3. 优化Backend启动
使用单一进程管理，避免tsx watch重复启动：
```bash
# 使用pm2或类似工具管理进程
pm2 start npm -- run dev
```

### 4. 配置不同timeout
根据请求类型设置不同timeout：
- 登录/注册: 10秒
- 数据查询: 20秒
- 图片上传: 60秒
- 大文件上传: 120秒

## 测试命令

### 测试Backend响应速度
```bash
curl -w "\nTime: %{time_total}s\n" http://localhost:3001/api/health
```

### 测试登录请求
```bash
curl -w "\nTime: %{time_total}s\n" \
  -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### 检查Backend进程数量
```bash
ps aux | grep "node.*pet-keeper-backend" | grep -v grep | wc -l
# 应该返回 2（主进程 + watch进程）
```

## 常见Timeout值参考

| 请求类型 | 建议Timeout | 说明 |
|---------|------------|------|
| 登录/注册 | 10-15秒 | 快速响应，用户体验好 |
| 数据查询 | 20-30秒 | 允许复杂查询 |
| 图片上传 | 60秒 | 处理大图片 |
| 文件上传 | 120秒 | 处理大文件 |
| 支付请求 | 30秒 | 重要操作，需要确认 |

## 相关文档

- `/scripts/cleanup-backend-processes.sh` - Backend进程清理脚本
- `/docs/NETWORK_ERROR_FIX.md` - 网络错误修复指南
- `/docs/MINIPROGRAM_TEST_GUIDE.md` - 测试指南

---

**修复时间**: 2026-04-09 19:22
**修复文件**: `pet-keeper-miniprogram/utils/api.js` (Lines 28, 82)
**状态**: ✅ 已修复并验证Backend正常运行
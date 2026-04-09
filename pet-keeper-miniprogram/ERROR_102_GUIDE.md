# 小程序网络错误 102 排查指南

## 错误说明

微信小程序错误代码 102 表示网络请求失败，通常在开发环境中出现。

---

## 解决方案

### 1. 微信开发者工具设置（最重要）

**步骤：**
1. 打开微信开发者工具
2. 点击右上角「**详情**」按钮
3. 切换到「**本地设置**」选项卡
4. **勾选以下选项：**
   - ☑️ 不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书

![设置位置示意](设置在右上角详情-本地设置中)

**说明：**
- 开发环境使用 `http://localhost:3001` 不是 HTTPS
- 生产环境必须配置合法域名（HTTPS）
- 此设置仅用于开发测试

---

### 2. 检查后端服务是否运行

**验证后端是否启动：**
```bash
curl http://localhost:3001/api/health
```

**预期响应：**
```json
{"status":"ok","timestamp":"2026-04-02T13:48:01.747Z"}
```

**如果无响应：**
```bash
# 启动后端
cd /Users/mac/zrby/pet-keeper-backend
npm run dev
```

---

### 3. IPv6/IPv4 连接问题

**问题描述：**
- `localhost` 可能解析到 IPv6 (::1)
- 微信开发者工具可能不支持 IPv6

**解决方案：修改小程序配置**

编辑 `app.js`：
```javascript
globalData: {
  userInfo: null,
  token: null,
  // 使用 127.0.0.1 强制 IPv4
  apiBaseUrl: 'http://127.0.0.1:3001/api'
}
```

---

### 4. 端口被占用

**检查端口：**
```bash
lsof -i :3001
```

**如果多个进程占用：**
```bash
# 杀掉旧进程
kill -9 <PID>

# 重新启动
npm run dev
```

---

### 5. 请求超时

**增加超时时间：**

编辑 `utils/api.js`，添加 timeout：
```javascript
wx.request({
  url: `${app.globalData.apiBaseUrl}${url}`,
  method,
  data,
  header: {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  },
  timeout: 10000, // 10秒超时
  success(res) {
    // ...
  },
  fail(err) {
    // ...
  }
})
```

---

## 测试流程

### 1. 基本网络测试

**在微信开发者工具控制台执行：**
```javascript
wx.request({
  url: 'http://localhost:3001/api/health',
  success(res) {
    console.log('✅ 网络正常:', res.data)
  },
  fail(err) {
    console.error('❌ 网络错误:', err)
  }
})
```

**预期结果：**
```
✅ 网络正常: {status: "ok", timestamp: "..."}
```

---

### 2. 登录测试

**测试账号：**
- 要先注册账号或使用已有账号
- 后端返回具体错误信息

**错误信息对照：**
- `"Missing email or password"` - 输入为空
- `"Invalid credentials"` - 账号或密码错误
- `"网络连接失败，请检查网络或服务器地址"` - 后端未启动

---

## 常见问题

### Q1: 为什么生产环境没问题，开发环境报错？

**原因：**
- 生产环境使用 HTTPS + 合法域名
- 开发环境使用 HTTP + localhost
- 微信小程序对开发环境有特殊限制

---

### Q2: 设置了不校验域名，还是报错？

**检查项：**
1. 后端是否启动（`curl http://localhost:3001/api/health`）
2. 是否使用了 `127.0.0.1` 而不是 `localhost`
3. 控制台是否有更详细的错误信息
4. 微信开发者工具版本是否过旧

---

### Q3: 如何查看详细错误？

**在控制台查看：**
```
登录失败详情: Error: xxx
🚀 API Request: {...}
❌ API Error: {...}
```

---

## 正确配置总结

**小程序配置 (`app.js`):**
```javascript
globalData: {
  apiBaseUrl: 'http://127.0.0.1:3001/api' // 推荐 127.0.0.1
}
```

**微信开发者工具设置:**
- ☑️ 不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书

**后端运行:**
```bash
cd pet-keeper-backend
npm run dev
```

**验证步骤:**
1. 后端启动成功
2. curl 测试通过
3. 微信开发者工具设置正确
4. 小程序重新编译
5. 控制台测试网络请求

---

## 生产环境部署

**配置步骤：**
1. 购买域名并配置 HTTPS
2. 在微信公众平台配置服务器域名
3. 修改小程序 `apiBaseUrl` 为正式域名
4. 取消勾选「不校验合法域名」

**示例：**
```javascript
globalData: {
  apiBaseUrl: 'https://your-domain.com/api'
}
```

---

按此指南排查，90% 的 102 错误都能解决！
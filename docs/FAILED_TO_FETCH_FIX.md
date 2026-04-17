# Failed to Fetch 错误修复

## 错误信息
```
清除登录状态失败 TypeError: Failed to fetch [2.01.2510290][darwin-arm64]
```

## 问题原因

### API地址配置错误 ❌

**文件**: `pet-keeper-miniprogram/app.js` (Line 6)

**错误配置**:
```javascript
apiBaseUrl: 'http://192.168.3.20:3001/api'  // 局域网IP
```

**问题分析**:
1. Backend监听的是 `localhost:3001`
2. 小程序配置的是 `192.168.3.20:3001`
3. 在开发者工具模拟器中访问局域网IP会被阻止
4. 导致所有API请求失败："Failed to fetch"

### 为什么会出现这个问题？

之前为了解决网络连接问题，建议过使用IP地址，但那是在**真机调试**场景下。
在**开发者工具模拟器**中，应该使用 `localhost`。

## 已修复 ✅

**修改后**:
```javascript
apiBaseUrl: 'http://localhost:3001/api'  // 本地测试地址
```

## 配置说明

### 场景1: 开发者工具模拟器测试 ✅
```javascript
apiBaseUrl: 'http://localhost:3001/api'
```

**前提条件**:
- Backend运行在本机
- 微信开发者工具设置中勾选"不校验合法域名"

### 场景2: 真机调试（手机扫码） 📱
```javascript
apiBaseUrl: 'http://192.168.3.20:3001/api'
```

**前提条件**:
- Backend运行在电脑上
- 手机和电脑在同一WiFi网络
- 电脑防火墙允许局域网访问

### 场景3: 生产环境 🌐
```javascript
apiBaseUrl: 'https://api.yourdomain.com/api'
```

**前提条件**:
- 域名已备案
- HTTPS证书配置
- 在微信公众平台配置合法域名

## 快速切换工具

使用脚本快速切换API地址：

```bash
# 切换到localhost（模拟器测试）
./scripts/switch-api-address.sh
# 选择 1

# 切换到IP地址（真机调试）
./scripts/switch-api-address.sh
# 选择 2
```

## 测试步骤

### 1. 重新编译小程序
在微信开发者工具中：
- 点击"编译"按钮
- 或使用快捷键 `Cmd+B`

### 2. 清除缓存
- 点击"详情"
- "本地设置"标签页
- 点击"清除全部缓存"

### 3. 验证配置
在Console中执行：
```javascript
const app = getApp()
console.log('API地址:', app.globalData.apiBaseUrl)
// 应该显示: http://localhost:3001/api
```

### 4. 测试连接
在Console中执行：
```javascript
wx.request({
  url: 'http://localhost:3001/api/health',
  success(res) {
    console.log('✅ 连接成功:', res.data)
  },
  fail(err) {
    console.log('❌ 连接失败:', err)
  }
})
```

## 错误排查

### 如果仍然出现 "Failed to fetch"

#### 检查1: Backend是否运行
```bash
curl http://localhost:3001/api/health
```
**期望结果**: `{"status":"ok",...}`

#### 检查2: 微信开发者工具设置
- 详情 → 本地设置
- ✅ 不校验合法域名、web-view...
- ✅ 不校验安全域名...

#### 检查3: Console错误详情
查看完整的错误堆栈，确认是哪个请求失败。

#### 检查4: Network标签
- 打开Network标签
- 观察请求状态
- 查看失败的请求详情

## 常见错误对比

### Error 1: Failed to fetch
**原因**: API地址无法访问
**解决**: 使用正确的地址（localhost或IP）

### Error 2: ERR_CONNECTION_REFUSED -102
**原因**: 网络请求被阻止
**解决**: 配置微信开发者工具设置

### Error 3: request:fail timeout
**原因**: 请求超时
**解决**: 已在api.js中设置timeout（30秒）

### Error 4: CORS error
**原因**: 跨域问题
**解决**: Backend已配置CORS允许所有来源

## API地址决策树

```
开始测试
    │
    ├─ 在哪里测试？
    │   ├─ 开发者工具模拟器 → localhost:3001
    │   └─ 真机扫码预览 → 192.168.3.20:3001
    │
    └─ 是否连接失败？
        ├─ 是 → 检查Backend是否运行
        │       检查开发者工具设置
        │       查看Console详细错误
        └─ 否 → 测试成功 ✅
```

## 相关文档

- `/docs/NETWORK_ERROR_FIX.md` - 网络错误完整指南
- `/docs/TIMEOUT_ERROR_FIX.md` - 超时错误修复
- `/scripts/switch-api-address.sh` - API地址切换脚本

---

**修复时间**: 2026-04-09 19:30
**修复文件**: `pet-keeper-miniprogram/app.js` (Line 6)
**状态**: ✅ 已修复，请重新编译测试
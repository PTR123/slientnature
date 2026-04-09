# 🔧 小程序网络问题终极解决方案

## 📱 第一步：访问调试页面

我已经创建了一个调试页面，帮你快速诊断问题。

### 访问方法：
```
微信开发者工具 → 在地址栏输入: pages/debug/debug
或
控制台运行: wx.navigateTo({ url: '/pages/debug/debug' })
```

### 调试页面功能：
- ✅ 显示当前API地址配置
- ✅ 测试健康检查接口
- ✅ 测试登录接口
- ✅ 查看网络请求日志
- ✅ 一键清除缓存

---

## 🔍 第二步：检查配置

### 在调试页面你会看到：

```
API地址: http://localhost:3001/api
Token: 未登录
```

**如果API地址不是这个，说明配置有问题！**

---

## 🛠️ 第三步：运行测试

### 在调试页面点击：

1. **"测试健康检查"按钮**
   - 应该看到：✅ 连接成功！
   - 如果失败，查看详细错误信息

2. **"测试登录接口"按钮**
   - 测试登录接口是否可访问

3. **"清除缓存并重启"按钮**
   - 清除所有缓存数据
   - 重新加载配置

---

## ⚠️ 必须完成的设置

### 在微信开发者工具中：

```
1. 点击右上角"详情"按钮
2. 点击"本地设置"标签
3. 必须勾选以下选项（全部勾选）：
   ☑ 不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书
   ☑ 不校验安全域名、TLS版本以及HTTPS证书
```

**截图参考：**
```
┌───────────────────────────────────────┐
│ 详情 - 本地设置                         │
├───────────────────────────────────────┤
│ ☑ 不校验合法域名、web-view...         │
│ ☑ 不校验安全域名、TLS版本...          │
│ ☑ 启用自定义处理网络命令...           │
│ ☑ 不校验HTTP域名                      │
└───────────────────────────────────────┘
```

---

## 📋 完整排查步骤

### 步骤1: 确认后端运行
```bash
# 在终端运行
curl http://localhost:3001/api/health

# 应该返回:
{"status":"ok","timestamp":"..."}
```

### 步骤2: 访问调试页面
```
微信开发者工具 → 输入: pages/debug/debug
```

### 步骤3: 检查显示的API地址
```
应该显示: http://localhost:3001/api
如果不是，说明配置未生效，需要重启
```

### 步骤4: 测试连接
```
点击"测试健康检查"按钮
查看返回结果
```

### 步骤5: 查看日志
```
调试页面会显示所有请求日志
检查请求地址是否正确
```

---

## 🐛 常见问题及解决

### 问题1: 调试页面显示的API地址不对
**原因:** 小程序缓存了旧配置
**解决:**
```
1. 点击调试页面的"清除缓存并重启"
2. 或手动清除: 工具 → 清缓存 → 清除全部缓存
3. 点击"编译"重新加载
```

### 问题2: 测试连接失败 - ERR_CONNECTION_REFUSED
**原因:**
- 未勾选"不校验合法域名"
- 后端未启动
**解决:**
```
1. 确认已勾选开发者工具的所有"不校验"选项
2. 确认后端服务运行中
3. 重启微信开发者工具
```

### 问题3: 测试连接失败 - 请求地址错误
**原因:** app.globalData.apiBaseUrl 值错误
**解决:**
```javascript
// 检查 app.js 第6行
globalData: {
  apiBaseUrl: 'http://localhost:3001/api'
}
```

---

## 💡 立即尝试

### 在微信开发者工具控制台运行：

```javascript
// 方法1: 直接测试
wx.request({
  url: 'http://localhost:3001/api/health',
  success: (res) => {
    console.log('✅ 成功:', res.data);
  },
  fail: (err) => {
    console.log('❌ 失败:', err);
  }
});

// 方法2: 检查配置
const app = getApp();
console.log('API地址:', app.globalData.apiBaseUrl);

// 方法3: 跳转到调试页面
wx.navigateTo({ url: '/pages/debug/debug' });
```

---

## 🎯 成功标志

当调试页面显示：
```
✅ 连接成功！
{
  "status": "ok",
  "timestamp": "2026-04-07T..."
}
```

说明问题已解决！

---

## 📞 如果还是失败

### 请提供以下信息：

1. **调试页面截图**
   - API地址显示
   - 测试结果
   - 网络请求日志

2. **开发者工具设置截图**
   - "详情" → "本地设置"
   - 勾选了哪些选项

3. **控制台完整错误**
   - Console标签的错误信息
   - Network标签的请求详情

4. **运行诊断脚本**
```bash
cd /Users/mac/zrby
./diagnose-miniprogram.sh
```

---

## 📚 相关文件

- 调试页面: `/pages/debug/debug.wxml`
- API配置: `/app.js`
- 诊断脚本: `/Users/mac/zrby/diagnose-miniprogram.sh`

---

## 🚀 快速命令

```bash
# 检查后端
curl http://localhost:3001/api/health

# 运行诊断
cd /Users/mac/zrby && ./diagnose-miniprogram.sh

# 重启后端
cd /Users/mac/zrby/pet-keeper-backend
npm run dev
```

---

**现在就打开调试页面试试吧！** 📱

输入路径: `pages/debug/debug`

或运行命令:
```javascript
wx.navigateTo({ url: '/pages/debug/debug' });
```
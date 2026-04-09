# 小程序网络连接错误修复指南

## 错误信息分析

```
request:fail -102:net::ERR_CONNECTION_REFUSED
errno: 600001
```

**错误原因：** 小程序无法连接到后端服务器

## 问题诊断

### ✅ 检查1: 后端服务状态
```bash
curl http://localhost:3001/api/health
```
**结果：** ✅ 后端服务正常运行

### ⚠️ 检查2: 小程序API地址配置

当前配置（app.js）：
```javascript
globalData: {
  apiBaseUrl: 'http://127.0.0.1:3001/api'
}
```

### 问题分析

**ERR_CONNECTION_REFUSED 的可能原因：**

1. ❌ 后端服务未启动 → 已排除
2. ❌ IP地址配置错误
3. ❌ 端口配置错误
4. ❌ 小程序开发工具设置问题
5. ❌ 网络环境问题

## 解决方案

### 方案1: 检查微信开发者工具设置（最常见）

#### 步骤1: 允许不校验合法域名
```
微信开发者工具 → 右上角"详情" → 本地设置
勾选：
☑ 不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书
```

**位置示意：**
```
┌─────────────────────────────────┐
│ 详情                             │
├─────────────────────────────────┤
│ 本地设置                         │
│ ☑ 不校验合法域名...             │  ← 勾选这个
│ ☑ 不校验安全域名...             │
│ ☑ 不校验TLS版本...              │
└─────────────────────────────────┘
```

### 方案2: 修改API地址配置

#### 选项A: 使用 localhost
```javascript
// pet-keeper-miniprogram/app.js
globalData: {
  apiBaseUrl: 'http://localhost:3001/api'
}
```

#### 选项B: 使用实际IP地址
```javascript
// 查看本机IP
// macOS: ifconfig | grep "inet " | grep -v 127.0.0.1
// Windows: ipconfig

globalData: {
  apiBaseUrl: 'http://192.168.1.100:3001/api'  // 替换为你的本机IP
}
```

#### 选项C: 使用 0.0.0.0
```javascript
globalData: {
  apiBaseUrl: 'http://0.0.0.0:3001/api'
}
```

### 方案3: 检查后端服务端口

确认后端运行在3001端口：
```bash
# 检查端口占用
lsof -i:3001

# 或
netstat -an | grep 3001
```

### 方案4: 重启服务和开发工具

```bash
# 1. 重启后端
cd /Users/mac/zrby/pet-keeper-backend
npm run dev

# 2. 重启微信开发者工具
# 完全关闭后重新打开

# 3. 清除缓存
# 微信开发者工具 → 清缓存 → 清除全部缓存
```

## 快速修复步骤

### 第一步：设置开发者工具
```
1. 打开微信开发者工具
2. 点击右上角"详情"
3. 切换到"本地设置"标签
4. 勾选"不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书"
```

### 第二步：确认API地址

**查看当前配置：**
```javascript
// pet-keeper-miniprogram/app.js 第6行
apiBaseUrl: 'http://127.0.0.1:3001/api'
```

**建议配置（选择一个）：**
```javascript
// 推荐使用 localhost
apiBaseUrl: 'http://localhost:3001/api'
```

### 第三步：测试连接

在微信开发者工具控制台执行：
```javascript
wx.request({
  url: 'http://localhost:3001/api/health',
  success: (res) => {
    console.log('连接成功', res.data)
  },
  fail: (err) => {
    console.log('连接失败', err)
  }
})
```

## 常见问题FAQ

### Q1: 为什么会出现这个错误？
**A:** 微信小程序默认要求使用HTTPS和已备案域名。开发环境下需要在开发者工具中关闭校验。

### Q2: 127.0.0.1 和 localhost 有什么区别？
**A:** 
- `127.0.0.1` 是回环IP地址
- `localhost` 通常解析为 `127.0.0.1`
- 某些情况下小程序对 `localhost` 的处理更友好

### Q3: 手机预览时连接失败怎么办？
**A:** 手机预览需要：
1. 手机和电脑在同一局域网
2. 使用电脑的实际IP地址（如 192.168.1.100）
3. 后端需要监听 0.0.0.0 而不是 127.0.0.1

修改后端启动配置：
```typescript
// pet-keeper-backend/src/index.ts
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
```

### Q4: 如何查看本机IP地址？

**macOS:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# 输出类似: inet 192.168.1.100
```

**Windows:**
```bash
ipconfig
# 查找 "IPv4 地址"
```

### Q5: 生产环境怎么办？
**A:** 生产环境必须：
1. 使用HTTPS
2. 域名已备案
3. 在微信公众平台配置服务器域名

## 验证修复

### 测试步骤：

1. **确认后端运行**
   ```bash
   curl http://localhost:3001/api/health
   # 应该返回：{"status":"ok","timestamp":"..."}
   ```

2. **设置开发者工具**
   - 勾选"不校验合法域名"

3. **清除缓存**
   - 微信开发者工具 → 清缓存 → 清除全部缓存

4. **重新编译**
   - 点击"编译"按钮

5. **测试登录**
   - 尝试登录功能
   - 查看控制台是否有错误

## 如果还是失败

### 完整诊断步骤：

```bash
# 1. 检查后端服务
ps aux | grep "node.*3001"
# 应该看到进程

# 2. 测试后端API
curl http://localhost:3001/api/health
# 应该返回 {"status":"ok"...}

# 3. 检查端口监听
lsof -i:3001
# 应该看到 node 进程监听 3001 端口

# 4. 检查防火墙（如果有）
# macOS: 系统偏好设置 → 安全性与隐私 → 防火墙
# 确保允许 Node.js
```

### 提供以下信息以便进一步诊断：

1. 微信开发者工具版本
2. 操作系统版本
3. 后端是否在运行
4. 小程序 app.js 中的 apiBaseUrl 配置
5. 是否已勾选"不校验合法域名"

## 快速命令

```bash
# 一键检查
echo "=== 后端服务检查 ==="
curl -s http://localhost:3001/api/health && echo -e "\n✅ 后端正常" || echo "❌ 后端异常"

echo -e "\n=== 端口检查 ==="
lsof -i:3001 | grep -q LISTEN && echo "✅ 端口3001已监听" || echo "❌ 端口未监听"

echo -e "\n=== 小程序配置 ==="
grep "apiBaseUrl" /Users/mac/zrby/pet-keeper-miniprogram/app.js
```

## 总结

**最可能的原因：** 未在微信开发者工具中勾选"不校验合法域名"

**解决方案：**
1. ✅ 勾选开发者工具中的"不校验合法域名"
2. ✅ 确认后端服务运行正常
3. ✅ 清除缓存并重新编译

**如果问题持续，请提供：**
- 开发者工具截图
- 控制台完整错误信息
- 网络请求详情
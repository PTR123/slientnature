# 🔧 登录问题排查与测试指南

## ✅ 后端状态

- **后端地址**: http://localhost:3001
- **状态**: ✅ 正常运行
- **CORS**: ✅ 已配置允许所有来源
- **登录接口**: ✅ 测试通过

---

## 🚨 重要：微信开发者工具配置

**必须完成这一步，否则无法连接本地后端！**

### 步骤：

1. 在微信开发者工具右上角，点击 **"详情"**
2. 切换到 **"本地设置"** 标签页
3. **勾选以下选项**：
   ```
   ✅ 不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书
   ✅ 不校验安全域名、TLS版本以及HTTPS证书
   ```
4. 点击确定

**如果不勾选这些选项，小程序会被微信拦截，无法请求 localhost！**

---

## 🧪 测试步骤

### 1. 清除缓存

在微信开发者工具中：
- 点击顶部菜单 **"清缓存"**
- 选择 **"清除全部缓存"**
- 重新点击 **"编译"**

### 2. 使用正确的测试账号

**方式一：使用现有账号**
```
邮箱：test@example.com
密码：password123
```

**方式二：注册新账号**

点击"立即注册"，填写：
```
邮箱：your-email@example.com
用户名：yourname（3-20个字符）
密码：yourpassword（至少6个字符）
```

### 3. 查看详细错误信息

我已更新代码，现在会显示详细的错误信息：

- ✅ 网络错误会显示"网络错误，请检查连接"
- ✅ 参数错误会显示具体错误原因
- ✅ 登录失败会显示后端返回的错误信息

---

## 🔍 调试方法

### 方法一：查看控制台日志

1. 点击开发者工具底部的 **"Console"** 标签
2. 查看日志输出：
   ```
   🚀 API Request: { url: '...', method: 'POST', data: {...} }
   ✅ API Response: { ... }
   ```
3. 如果有错误，会显示：
   ```
   ❌ API Error: { ... }
   ```

### 方法二：查看网络请求

1. 点击开发者工具底部的 **"Network"** 标签
2. 点击登录按钮
3. 查看请求列表中的请求：
   - 状态码应该是 200（成功）
   - 如果是其他状态码，点击查看详情

### 方法三：查看后端日志

在终端运行：
```bash
tail -f /tmp/backend.log
```

或者在项目目录运行：
```bash
cd /Users/mac/zrby/pet-keeper-backend
npm run dev
```

---

## 🐛 常见错误及解决方案

### 错误 1: "网络错误，请检查连接"

**原因**：
- 后端未启动
- 未勾选"不校验合法域名"
- API 地址配置错误

**解决**：
1. 检查后端是否运行：
   ```bash
   curl http://localhost:3001/api/health
   ```
2. 确认已勾选"不校验合法域名"
3. 检查 `app.js` 中的 `apiBaseUrl` 是否为 `http://localhost:3001/api`

### 错误 2: "Invalid credentials"（登录失败）

**原因**：
- 邮箱或密码错误
- 用户不存在

**解决**：
1. 使用正确的测试账号：
   - 邮箱：test@example.com
   - 密码：password123
2. 或注册新账号

### 错误 3: "Missing email or password"

**原因**：
- 未填写邮箱或密码

**解决**：
- 确保填写了邮箱和密码

### 错误 4: 一直显示"登录中..."

**原因**：
- 网络请求超时
- 后端未响应

**解决**：
1. 检查后端是否运行
2. 查看控制台是否有错误
3. 检查 Network 面板

---

## 📝 完整测试流程

### 1. 启动后端

```bash
cd /Users/mac/zrby/pet-keeper-backend
npm run dev
```

等待看到：
```
🚀 Server running on http://localhost:3001
📚 API available at http://localhost:3001/api
```

### 2. 配置微信开发者工具

- 详情 → 本地设置 → ✅ 不校验合法域名

### 3. 清除缓存并重新编译

- 清缓存 → 清除全部
- 点击"编译"

### 4. 测试登录

填写表单：
```
邮箱：test@example.com
密码：password123
```

点击"登录"

### 5. 查看结果

**成功**：
- 显示"登录成功"
- 自动跳转到首页
- 首页显示用户信息

**失败**：
- 查看 Console 日志
- 查看 Network 请求
- 查看错误提示

---

## 🎯 预期行为

### 登录成功后：

1. 显示提示：**"登录成功"**（绿色对勾）
2. 1.5秒后自动跳转
3. 跳转到首页
4. 首页显示：
   - 物种分类
   - 我的宠物
   - 热门帖子

### 登录失败：

会显示具体错误信息，例如：
- "Invalid credentials" - 邮箱或密码错误
- "Missing email or password" - 未填写完整
- "网络错误，请检查连接" - 后端未运行

---

## 💡 额外提示

### 1. 查看当前用户信息

登录后，在 Console 中输入：
```javascript
getApp().globalData.userInfo
```

### 2. 查看存储的 Token

在 Console 中输入：
```javascript
wx.getStorageSync('token')
```

### 3. 手动登出

在 Console 中输入：
```javascript
getApp().logout()
```

### 4. 查看所有 API 请求

Network 标签会显示所有请求，包括：
- 请求 URL
- 请求方法
- 请求参数
- 响应状态
- 响应数据

---

## 🔄 如果还是不行

### 完全重置：

1. **停止后端**
   ```bash
   lsof -ti:3001 | xargs kill -9
   ```

2. **删除数据库重新初始化**
   ```bash
   cd /Users/mac/zrby/pet-keeper-backend
   rm -f dev.db
   npx prisma migrate dev
   npx tsx src/seed.ts
   ```

3. **重启后端**
   ```bash
   npm run dev
   ```

4. **清除小程序缓存**
   - 微信开发者工具 → 清缓存 → 清除全部

5. **重新编译**
   - 点击"编译"

6. **重新登录**
   - 邮箱：test@example.com
   - 密码：password123

---

## 📞 需要帮助？

如果按照以上步骤还是无法登录：

1. 截图 Console 日志
2. 截图 Network 请求
3. 提供具体的错误信息
4. 告诉我你在哪一步遇到了问题

---

**🎉 按照这个指南，应该能解决登录问题！**
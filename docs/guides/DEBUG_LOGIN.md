# 🔍 登录问题排查指南

## 当前状态
✅ 后端服务器运行正常 (port 3001)
✅ 前端服务器运行正常 (port 3000)
✅ 超管账号已创建
✅ API 端点测试通过

## 登录账号
```
邮箱: admin@petkeeper.com
密码: Admin123456
```

---

## 🛠️ 排查步骤

### 1. 检查浏览器控制台

1. 打开 http://localhost:3000/login
2. 按 `F12` 或 `右键 -> 检查` 打开开发者工具
3. 切换到 **Console** 标签页
4. 尝试登录，查看是否有红色错误信息
5. 将错误信息复制给我

### 2. 检查网络请求

1. 在开发者工具中切换到 **Network** 标签页
2. 点击登录按钮
3. 查看是否有请求发送到 `/api/auth/login`
4. 如果有请求：
   - 点击该请求查看详情
   - 查看 **Response** 标签页的内容
   - 将响应内容复制给我
5. 如果没有请求：
   - 说明前端 JavaScript 有错误
   - 查看 Console 标签页的错误

### 3. 使用测试页面

我已创建了一个独立测试页面，应该已在浏览器打开：
- 文件位置: `/tmp/test_login.html`
- 如果没打开，在浏览器访问: `file:///tmp/test_login.html`

这个页面会显示详细的调试信息，包括：
- 请求 URL
- 响应状态
- Token 保存
- 管理员接口测试

### 4. 手动测试 API

打开终端，运行以下命令测试登录：

\`\`\`bash
curl -X POST http://localhost:3001/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@petkeeper.com","password":"Admin123456"}'
\`\`\`

应该返回：
\`\`\`json
{
  "user": {
    "id": "...",
    "email": "admin@petkeeper.com",
    "username": "admin",
    "role": "admin"
  },
  "token": "..."
}
\`\`\`

---

## 🐛 常见问题

### 问题 1: 点击登录按钮完全没反应

**可能原因**:
- JavaScript 代码有错误
- 表单验证失败
- API 客户端配置问题

**解决方案**:
查看浏览器控制台的错误信息

### 问题 2: 显示"登录失败，请检查邮箱和密码"

**可能原因**:
- 邮箱或密码错误
- 后端服务器未启动
- 数据库连接问题

**解决方案**:
```bash
# 检查后端服务器
curl http://localhost:3001/api/health

# 如果无响应，重启后端
cd pet-keeper-backend
npm run dev
```

### 问题 3: CORS 错误

**错误信息**: "Access to fetch at ... has been blocked by CORS policy"

**解决方案**:
后端已配置 CORS，如果仍有问题，检查：
- 后端是否正常运行
- 前端 API_BASE_URL 配置是否正确

### 问题 4: Network Error

**可能原因**:
- 后端服务器未启动
- 端口被占用

**解决方案**:
```bash
# 检查 3001 端口
lsof -i:3001

# 如果被占用，杀死进程
kill -9 <PID>

# 重启后端
cd pet-keeper-backend
npm run dev
```

---

## 📊 当前 API 状态测试

运行以下命令检查所有服务：

\`\`\`bash
# 测试后端健康状态
curl http://localhost:3001/api/health

# 测试登录
curl -X POST http://localhost:3001/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@petkeeper.com","password":"Admin123456"}'

# 测试前端
curl http://localhost:3000
\`\`\`

---

## 💡 快速诊断命令

复制以下命令到终端运行：

\`\`\`bash
echo "=== 检查服务状态 ==="
echo "后端状态:"
curl -s http://localhost:3001/api/health || echo "❌ 后端未运行"

echo -e "\\n前端状态:"
curl -s http://localhost:3000 > /dev/null && echo "✅ 前端运行正常" || echo "❌ 前端未运行"

echo -e "\\n=== 测试登录 API ==="
curl -s -X POST http://localhost:3001/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@petkeeper.com","password":"Admin123456"}' | python3 -m json.tool

echo -e "\\n=== 检查进程 ==="
lsof -i:3000 -i:3001 | grep LISTEN
\`\`\`

---

## 📞 需要帮助？

如果以上步骤都无法解决，请提供以下信息：

1. 浏览器控制台的完整错误信息（截图）
2. Network 标签页的请求详情（截图）
3. 运行诊断命令的输出结果
4. 测试页面的结果（截图）

我会根据这些信息帮你进一步排查！

---

**提示**: 最常见的问题是浏览器控制台的 JavaScript 错误，请优先检查 Console 标签页！
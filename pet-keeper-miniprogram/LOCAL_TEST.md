# 微信小程序本地测试指南

## 🎯 本地测试环境已就绪！

后端已成功启动在：`http://localhost:3001`

### ✅ 当前配置

- 后端地址：http://localhost:3001/api
- 健康检查：http://localhost:3001/api/health
- 数据库：PostgreSQL/SQLite

---

## 🚀 开始测试

### 第一步：下载微信开发者工具

访问：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

选择对应系统版本：
- Windows 64位
- macOS
- Linux（如有）

### 第二步：导入项目

1. 打开微信开发者工具
2. 点击 "+" 或 "导入项目"
3. 选择项目目录：
   ```
   /Users/mac/zrby/pet-keeper-miniprogram
   ```
4. 项目名称：PetKeeper
5. AppID：
   - 如果没有 AppID，选择"测试号"
   - 或者使用你注册的 AppID

### 第三步：配置开发者工具（重要！）

**本地测试必须配置：**

1. 在开发者工具右上角，点击"详情"
2. 在"本地设置"标签页，勾选：
   - ✅ 不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书
   - ✅ 不校验安全域名、TLS 版本以及 HTTPS 证书
3. 点击"确定"保存

**如果不配置这一步，小程序无法连接本地后端！**

### 第四步：编译运行

点击工具栏的"编译"按钮，在模拟器中查看效果。

---

## 🧪 测试功能

### 1. 测试后端连接

打开小程序控制台（Console），应该看到：
- 后端 API 调用成功
- 没有网络错误

### 2. 测试用户注册

1. 点击"立即登录"
2. 点击"立即注册"
3. 填写信息：
   - 邮箱：test@example.com
   - 用户名：testuser
   - 密码：password123
4. 点击注册
5. 应该注册成功并自动登录

### 3. 测试登录

1. 输入刚才注册的邮箱和密码
2. 点击登录
3. 应该跳转到首页并显示用户信息

### 4. 测试 API 调用

登录后，在首页应该看到：
- 物种分类（昆虫、爬宠、水族等）
- 我的宠物列表（如果有）
- 热门帖子（如果有）

---

## 🔍 调试技巧

### 查看网络请求

在开发者工具中：
1. 点击"Network"标签
2. 查看所有 API 请求
3. 点击具体请求查看详情：
   - 请求 URL
   - 请求参数
   - 响应数据
   - 状态码

### 查看控制台日志

在开发者工具中：
1. 点击"Console"标签
2. 查看所有 console.log 输出
3. 查看错误信息

### 调试页面数据

在开发者工具中：
1. 点击"AppData"标签
2. 选择当前页面
3. 查看页面数据
4. 可以直接修改数据进行测试

---

## 🐛 常见问题

### Q1: 小程序显示"request:fail"

**原因**：未配置"不校验合法域名"

**解决**：
1. 详情 → 本地设置
2. 勾选"不校验合法域名..."

### Q2: 后端连接失败

**检查**：
```bash
# 检查后端是否运行
curl http://localhost:3001/api/health

# 应该返回：
# {"status":"ok","timestamp":"..."}
```

如果无响应，重启后端：
```bash
cd /Users/mac/zrby/pet-keeper-backend
npm run dev
```

### Q3: 404 Not Found

**检查**：
- 确认 API 路径是否正确
- 查看后端路由配置

### Q4: 数据库错误

**检查**：
```bash
# 检查数据库是否存在
cd /Users/mac/zrby/pet-keeper-backend
npx prisma studio
```

如果数据库为空，运行种子数据：
```bash
npx tsx src/seed.ts
```

---

## 📱 真机调试

### 方式一：局域网测试

**前提**：手机和电脑在同一 WiFi 网络

1. 查看电脑 IP 地址：
   ```bash
   # macOS
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

   假设 IP 是：`192.168.1.100`

2. 修改小程序 API 地址：
   ```javascript
   // app.js
   apiBaseUrl: 'http://192.168.1.100:3001/api'
   ```

3. 重新编译小程序

4. 点击"真机调试"
5. 扫描二维码
6. 在手机微信中测试

### 方式二：使用内网穿透

如果局域网测试不成功，可以使用内网穿透工具：

**推荐工具：**
- [ngrok](https://ngrok.com/)
- [cpolar](https://www.cpolar.com/)
- [localtunnel](https://localtunnel.github.io/www/)

**使用 ngrok 示例：**

```bash
# 安装 ngrok
brew install ngrok

# 启动内网穿透
ngrok http 3001

# 会得到一个公网地址，例如：
# https://abc123.ngrok.io
```

修改小程序 API 地址：
```javascript
apiBaseUrl: 'https://abc123.ngrok.io/api'
```

---

## 🔄 开发流程

### 本地开发流程

```
启动后端 → 配置小程序 → 开发者工具测试 → 修改代码 → 刷新测试
```

### 热重载

微信开发者工具支持热重载：
- 修改 WXML/WXSS → 自动刷新
- 修改 JS → 自动刷新
- 修改 app.json → 需要重新编译

---

## 📝 测试清单

### 基础功能测试

- [ ] 后端连接成功
- [ ] 用户注册功能
- [ ] 用户登录功能
- [ ] Token 保存认证
- [ ] 登出功能

### 页面测试

- [ ] 首页正常显示
- [ ] 登录页面样式正确
- [ ] 导航跳转正常
- [ ] TabBar 切换正常

### API 测试

- [ ] 注册接口
- [ ] 登录接口
- [ ] 获取用户信息
- [ ] 宠物列表
- [ ] 物种列表
- [ ] 帖子列表

---

## 🎨 测试数据

### 测试账号

邮箱：`test@example.com`
密码：`password123`

### 创建测试数据

```bash
cd /Users/mac/zrby/pet-keeper-backend

# 填充种子数据
npx tsx src/seed.ts

# 这会创建：
# - 测试用户
# - 物种数据
# - 示例帖子
```

---

## 💡 开发建议

### 1. 使用版本控制

```bash
# 在小程序目录
cd /Users/mac/zrby/pet-keeper-miniprogram
git init
git add .
git commit -m "Initial commit"
```

### 2. 模块化开发

- 将公共组件放在 `components/` 目录
- 将公共函数放在 `utils/` 目录
- 页面保持独立

### 3. 样式规范

- 使用全局样式（app.wxss）
- 页面样式局部化
- 遵循设计规范

---

## 🚀 下一步

### 完善功能

1. 实现注册页面
2. 实现宠物管理页面
3. 实现物种图鉴页面
4. 实现社区功能页面
5. 实现个人中心

### 优化体验

1. 添加加载动画
2. 优化错误提示
3. 添加下拉刷新
4. 添加上拉加载

### 准备发布

1. 准备图片资源
2. 配置服务器域名
3. 部署后端到云服务
4. 申请小程序账号
5. 提交审核

---

## 📞 需要帮助？

- 查看控制台错误信息
- 检查网络请求
- 查看后端日志
- 参考官方文档

---

**🎉 开始测试你的小程序吧！**

如有问题，随时查看控制台和 Network 面板进行调试。
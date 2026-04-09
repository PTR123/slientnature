# 🚀 完整启动指南

PetKeeper 全栈应用包含三个部分：后端 API、Web 前端、移动端。

---

## 📦 项目结构

```
/Users/mac/my_gzh/zrby/
├── pet-keeper-backend/    # Node.js + Express + Prisma 后端
├── pet-keeper/            # Next.js Web 前端
└── pet-keeper-mobile/     # React Native 移动端
```

---

## 🎯 快速启动（推荐顺序）

### 1️⃣ 启动后端 API（必须第一个启动）

```bash
# 进入后端目录
cd /Users/mac/my_gzh/zrby/pet-keeper-backend

# 安装依赖（如果还没安装）
npm install

# 初始化数据库
npx prisma generate
npx prisma db push
npx tsx src/seed.ts

# 启动服务器
npm run dev
```

**✅ 成功标志：**
```
🚀 Server running on http://localhost:3001
📚 API available at http://localhost:3001/api
```

**📝 测试账号：**
- Email: `test@example.com`
- Password: `password123`

---

### 2️⃣ 启动 Web 前端

```bash
# 新终端窗口 - 进入 Web 目录
cd /Users/mac/my_gzh/zrby/pet-keeper

# 启动开发服务器
npm run dev
```

**✅ 成功标志：**
- 浏览器访问: http://localhost:3000
- 可以注册、登录、浏览物种、创建宠物记录

---

### 3️⃣ 启动移动端（可选）

```bash
# 新终端窗口 - 进入移动端目录
cd /Users/mac/my_gzh/zrby/pet-keeper-mobile

# 启动 Expo
npm start

# 在终端中按 'a' 键在 Android 模拟器中运行
```

**或者：**
- 下载 **Expo Go** App
- 扫描终端中的二维码

---

## 🔧 完整功能列表

### ✅ 后端 API

**认证系统：**
- POST /api/auth/register - 注册
- POST /api/auth/login - 登录
- GET /api/auth/me - 获取当前用户

**物种管理：**
- GET /api/species - 获取所有物种（支持筛选、搜索）
- GET /api/species/:id - 获取物种详情

**宠物管理：**
- GET /api/pets - 获取用户的宠物列表
- POST /api/pets - 创建宠物
- PUT /api/pets/:id - 更新宠物
- DELETE /api/pets/:id - 删除宠物
- POST /api/pets/:id/records - 添加饲养记录
- GET /api/pets/:id/records - 获取记录列表

**社区功能：**
- GET /api/posts - 获取帖子（支持排序）
- POST /api/posts - 创建帖子
- GET /api/posts/:id - 获取帖子详情
- DELETE /api/posts/:id - 删除帖子
- POST /api/posts/:id/like - 点赞/取消点赞
- POST /api/posts/:id/comments - 添加评论

**文件上传：**
- POST /api/upload/image - 上传图片

---

### ✅ Web 前端功能

**已完成：**
- ✅ 完整的 UI 界面（6个页面）
- ✅ 物种图鉴浏览
- ✅ 用户注册登录
- ✅ 宠物档案管理
- ✅ 饲养记录
- ✅ 社区帖子浏览
- ✅ 图片上传

**需要集成：**
- ⏳ 连接真实后端 API（已创建 API 客户端）
- ⏳ 实现真实的用户认证流程
- ⏳ 替换 Mock 数据为 API 调用

---

### ✅ 移动端功能

**已完成：**
- ✅ 完整的移动端 UI（7个页面）
- ✅ 底部标签导航
- ✅ 所有页面展示

**需要集成：**
- ⏳ 连接后端 API
- ⏳ 用户认证
- ⏳ 数据持久化

---

## 🔗 数据库结构

**User（用户）：**
- id, email, username, password, avatar

**Species（物种）：**
- id, name, scientificName, category, 环境参数, 食性等

**Pet（宠物）：**
- id, name, image, birthDate, acquisitionDate
- 关联用户和物种

**Record（记录）：**
- id, type, date, notes, image, weight, length

**Post（帖子）：**
- id, title, content, image, tags

**Like（点赞）：**
- postId, userId

**Comment（评论）：**
- id, content, postId, userId

---

## 📱 API 使用示例

### 注册新用户

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"myuser","password":"mypassword"}'
```

### 登录

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"mypassword"}'
```

### 获取物种列表

```bash
curl http://localhost:3001/api/species
```

### 创建宠物（需要认证）

```bash
curl -X POST http://localhost:3001/api/pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"小绿","speciesId":"phelsuma-laticauda","birthDate":"2024-01-15","acquisitionDate":"2024-03-01"}'
```

---

## 🐛 常见问题

### 1. 后端启动失败

**检查：**
- Node.js 版本 >= 18
- 端口 3001 未被占用
- 依赖已安装

**解决：**
```bash
rm -rf node_modules
npm install
```

### 2. 数据库错误

**重新初始化：**
```bash
npx prisma db push --force-reset
npx tsx src/seed.ts
```

### 3. 前端无法连接后端

**检查：**
- 后端是否在运行（http://localhost:3001/api/health）
- .env.local 文件是否存在
- API_BASE_URL 是否正确

### 4. 移动端网络错误

**修改 API URL：**
- 如果使用真机，需要使用电脑的局域网 IP
- 例如：`http://192.168.1.100:3001/api`

---

## 🚀 部署建议

### 后端部署

**Railway.app（推荐，免费）：**
1. 连接 GitHub 仓库
2. 添加环境变量
3. 自动部署

**Render.com（免费）：**
1. 创建 Web Service
2. 连接代码仓库
3. 设置启动命令：`npm start`

### 数据库

**开发环境：SQLite**
- 已配置，开箱即用

**生产环境：PostgreSQL**
- 修改 DATABASE_URL
- 运行 `npm run db:migrate`
- 推荐：Railway PostgreSQL / Supabase / Neon

### Web 前端部署

**Vercel（推荐，免费）：**
```bash
npm install -g vercel
vercel
```

### 移动端发布

**EAS Build：**
```bash
npx eas-cli build --platform android
```

---

## 📊 技术栈总览

**后端：**
- Node.js + Express
- Prisma ORM
- SQLite / PostgreSQL
- JWT 认证
- Multer 文件上传

**Web 前端：**
- Next.js 14
- TypeScript
- Tailwind CSS
- React Context

**移动端：**
- React Native + Expo
- React Navigation
- TypeScript

---

## 📚 学习资源

- [Next.js 文档](https://nextjs.org/docs)
- [Prisma 文档](https://www.prisma.io/docs)
- [React Native 文档](https://reactnative.dev)
- [Express 文档](https://expressjs.com)

---

## 🎯 下一步建议

### 立即可做
1. 启动后端并测试 API
2. 在 Web 前端集成真实 API
3. 测试用户注册登录流程

### 后续开发
1. 添加数据验证（Zod）
2. 实现图片上传功能
3. 添加更多物种数据
4. 实现数据统计和可视化
5. 添加推送通知
6. 实现离线支持

---

**准备好了吗？开始启动后端吧！** 🚀
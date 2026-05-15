# PetKeeper - 异宠饲养管理平台

完整的全栈应用：后端 API + Web 前端 + 移动端

---

## 🎯 项目概览

PetKeeper 是一个专业的异宠饲养管理平台，提供物种图鉴、饲养记录、社区交流三大核心功能。

**技术架构：**
- **后端**: Node.js + Express + Prisma + SQLite/PostgreSQL
- **Web**: Next.js 14 + TypeScript + Tailwind CSS
- **Mobile**: React Native + Expo + TypeScript

---

## 🚀 快速启动

### 一键启动所有服务

```bash
cd /Users/mac/my_gzh/zrby
./start-all.sh
```

### 访问地址

- **Web 应用**: http://localhost:3000
- **API**: http://localhost:3001/api
- **API 健康检查**: http://localhost:3001/api/health

### 测试账号

- Email: `test@example.com`
- Password: `password123`

---

## 📁 项目结构

```
/Users/mac/my_gzh/zrby/
├── pet-keeper-backend/          # 后端 API
│   ├── src/
│   │   ├── routes/              # API 路由
│   │   ├── middleware/          # 中间件（认证、错误处理）
│   │   ├── lib/                 # 工具库
│   │   └── seed.ts              # 种子数据
│   ├── prisma/
│   │   └── schema.prisma        # 数据库模型
│   ├── uploads/                 # 图片存储
│   └── package.json
│
├── pet-keeper/                  # Web 前端
│   ├── app/                     # Next.js 页面
│   ├── components/              # React 组件
│   ├── lib/
│   │   ├── api.ts              # API 客户端
│   │   ├── data.ts             # Mock 数据
│   │   └── types.ts            # 类型定义
│   └── package.json
│
├── pet-keeper-mobile/           # 移动端
│   ├── App.tsx                  # 主入口
│   ├── src/
│   │   ├── screens/            # 页面组件
│   │   ├── data.ts             # 数据
│   │   └── types.ts            # 类型
│   └── package.json
│
├── start-all.sh                 # 一键启动脚本
├── stop-all.sh                  # 停止脚本
├── START_GUIDE.md               # 详细启动指南
└── README.md                    # 本文件
```

---

## ✅ 已实现的功能

### 🔐 用户系统
- [x] 用户注册
- [x] 用户登录
- [x] JWT 认证
- [x] 密码加密（bcrypt）

### 🦎 物种图鉴
- [x] 物种列表浏览
- [x] 分类筛选（昆虫、爬宠、水族等）
- [x] 搜索功能
- [x] 物种详情展示
- [x] 环境参数（温度、湿度）
- [x] 食性指南
- [x] 生命周期图示
- [x] 常见疾病

### 🐾 宠物管理
- [x] 创建宠物档案
- [x] 更新宠物信息
- [x] 删除宠物
- [x] 查看宠物列表
- [x] 宠物详情展示

### 📝 饲养记录
- [x] 添加饲养记录
- [x] 记录类型（蜕皮、喂食、称重等）
- [x] 记录时间轴
- [x] 图片记录
- [x] 体重/体长追踪

### 💬 社区功能
- [x] 发布帖子
- [x] 浏览帖子
- [x] 热门/最新排序
- [x] 点赞功能
- [x] 评论功能
- [x] 删除帖子

### 📸 文件上传
- [x] 图片上传
- [x] 文件大小限制（5MB）
- [x] 格式验证（jpg, png, gif, webp）

---

## 🗄️ 数据库结构

### User（用户）
- id, email, username, password, avatar
- 关联: pets, posts, comments, likes

### Species（物种）
- id, name, scientificName, category
- 环境参数、食性、生命周期
- 关联: pets

### Pet（宠物）
- id, name, image, birthDate, acquisitionDate
- 关联: user, species, records

### Record（饲养记录）
- id, type, date, notes, image
- weight, length
- 关联: pet

### Post（社区帖子）
- id, title, content, image, tags
- 关联: author, likes, comments

### Like（点赞）
- postId, userId（唯一约束）

### Comment（评论）
- id, content
- 关联: post, user

---

## 📱 API 端点

### 认证 `/api/auth`
- `POST /register` - 注册
- `POST /login` - 登录
- `GET /me` - 获取当前用户

### 物种 `/api/species`
- `GET /` - 获取所有物种（支持筛选）
- `GET /:id` - 获取物种详情
- `POST /` - 创建物种

### 宠物 `/api/pets`
- `GET /` - 获取用户宠物
- `POST /` - 创建宠物
- `GET /:id` - 获取宠物详情
- `PUT /:id` - 更新宠物
- `DELETE /:id` - 删除宠物
- `POST /:id/records` - 添加记录
- `GET /:id/records` - 获取记录

### 帖子 `/api/posts`
- `GET /` - 获取所有帖子
- `POST /` - 创建帖子
- `GET /:id` - 获取帖子详情
- `DELETE /:id` - 删除帖子
- `POST /:id/like` - 点赞/取消点赞
- `POST /:id/comments` - 添加评论

### 上传 `/api/upload`
- `POST /image` - 上传图片

---

## 🛠️ 开发命令

### 后端

```bash
cd pet-keeper-backend

# 开发
npm run dev

# 数据库管理
npm run db:studio        # 打开 Prisma Studio
npm run db:migrate       # 运行迁移
npx tsx src/seed.ts      # 填充种子数据

# 生产
npm run build
npm start
```

### Web 前端

```bash
cd pet-keeper

npm run dev              # 开发
npm run build            # 构建
npm start                # 生产
```

### 移动端

```bash
cd pet-keeper-mobile

npm start                # 启动 Expo
npm run android          # Android 模拟器
npm run ios              # iOS 模拟器
```

---

## 🚀 部署

### 后端部署

**Railway.app（推荐）:**
1. 连接 GitHub 仓库
2. 添加环境变量：
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`
3. 自动部署

**Render.com:**
1. 创建 Web Service
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`

### 数据库

**开发: SQLite**（已配置）

**生产: PostgreSQL**
```bash
# 修改 .env
DATABASE_URL="postgresql://user:password@host:5432/petkeeper"

# 运行迁移
npm run db:migrate
```

**推荐服务:**
- Railway PostgreSQL
- Supabase
- Neon
- PlanetScale

### Web 部署

**Vercel（推荐）:**
```bash
npm install -g vercel
vercel
```

### 移动端发布

**Android:**
```bash
npx eas-cli build --platform android
```

**iOS:**
```bash
npx eas-cli build --platform ios
```

---

## 🎨 设计特点

### 配色方案
- 主色: 森林绿 (#4a784a)
- 背景: 奶油色 (#fefdfb)
- 强调: 琥珀色、大地色系

### 用户体验
- 卡片式设计
- 圆角阴影
- 流畅动画
- 响应式布局

---

## 📊 技术栈

### 后端
- Node.js 18+
- Express 4
- Prisma 5
- SQLite / PostgreSQL
- JWT
- bcryptjs
- Multer

### Web
- Next.js 14
- React 18
- TypeScript 5
- Tailwind CSS 3
- Lucide React

### Mobile
- React Native 0.83
- Expo 55
- React Navigation 7
- TypeScript 5

---

## 📈 性能优化

### 后端
- 数据库索引优化
- API 响应缓存
- 文件上传压缩

### Web
- 图片优化（Next.js Image）
- 代码分割
- 静态资源CDN

### Mobile
- 图片懒加载
- FlatList 优化
- 动画性能优化

---

## 🔐 安全特性

- JWT Token 认证
- 密码 bcrypt 加密
- API 请求验证
- 文件上传限制
- SQL 注入防护（Prisma）

---

## 🧪 测试

### API 测试

```bash
# 健康检查
curl http://localhost:3001/api/health

# 注册
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"test","password":"password123"}'

# 登录
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 📚 文档

- `START_GUIDE.md` - 详细启动指南
- `pet-keeper-backend/README.md` - 后端文档
- `pet-keeper/README.md` - Web 前端文档
- `pet-keeper-mobile/README.md` - 移动端文档

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 👨‍💻 作者

Steve Yu

---

**🎉 享受你的异宠饲养之旅！**
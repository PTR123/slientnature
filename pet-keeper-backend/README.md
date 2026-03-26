# PetKeeper Backend

完整的 Node.js + Express + Prisma 后端 API。

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env` 文件并修改：

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3001
```

### 初始化数据库

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库结构
npm run db:push

# 填充种子数据
npm run db:seed
```

### 启动开发服务器

```bash
npm run dev
```

服务器将运行在 http://localhost:3001

## 📚 API 文档

### 认证接口

#### POST /api/auth/register
注册新用户

**请求体：**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password"
}
```

#### POST /api/auth/login
登录

**请求体：**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

#### GET /api/auth/me
获取当前用户信息（需要认证）

**Headers:**
```
Authorization: Bearer <token>
```

---

### 物种接口

#### GET /api/species
获取所有物种

**查询参数：**
- `category` - 分类筛选
- `subcategory` - 子分类筛选
- `search` - 搜索关键词

#### GET /api/species/:id
获取单个物种详情

#### POST /api/species
创建物种（管理员）

---

### 宠物接口

所有宠物接口都需要认证。

#### GET /api/pets
获取用户的所有宠物

#### POST /api/pets
创建新宠物

**请求体：**
```json
{
  "name": "小绿",
  "speciesId": "phelsuma-laticauda",
  "birthDate": "2024-01-15",
  "acquisitionDate": "2024-03-01",
  "image": "/uploads/xxx.jpg"
}
```

#### GET /api/pets/:id
获取单个宠物详情

#### PUT /api/pets/:id
更新宠物信息

#### DELETE /api/pets/:id
删除宠物

#### POST /api/pets/:id/records
添加饲养记录

**请求体：**
```json
{
  "type": "feeding",
  "date": "2024-03-20",
  "notes": "吃了一只蟋蟀",
  "image": "/uploads/xxx.jpg",
  "weight": 8.5,
  "length": 12
}
```

#### GET /api/pets/:id/records
获取宠物的所有记录

---

### 社区接口

#### GET /api/posts
获取所有帖子

**查询参数：**
- `sort` - 排序方式：`latest` 或 `trending`

#### POST /api/posts
创建帖子（需要认证）

**请求体：**
```json
{
  "title": "我的长戟大兜虫羽化成功！",
  "content": "分享我的饲养经验...",
  "image": "/uploads/xxx.jpg",
  "tags": ["甲虫", "羽化"]
}
```

#### GET /api/posts/:id
获取帖子详情

#### POST /api/posts/:id/like
点赞/取消点赞（需要认证）

#### POST /api/posts/:id/comments
添加评论（需要认证）

**请求体：**
```json
{
  "content": "太棒了！"
}
```

#### DELETE /api/posts/:id
删除帖子（需要认证）

---

### 文件上传

#### POST /api/upload/image
上传图片（需要认证）

**请求：**
- Content-Type: multipart/form-data
- Field name: `image`

**响应：**
```json
{
  "url": "/uploads/xxx.jpg",
  "filename": "xxx.jpg"
}
```

## 🗄️ 数据库结构

### User（用户）
- id, email, username, password, avatar
- 关联：pets, posts, comments, likes

### Species（物种）
- id, name, scientificName, category, subcategory
- 环境参数、食性、生命周期等
- 关联：pets

### Pet（宠物）
- id, name, image, birthDate, acquisitionDate
- 关联：user, species, records

### Record（饲养记录）
- id, type, date, notes, image, weight, length
- 关联：pet

### Post（帖子）
- id, title, content, image, tags
- 关联：author, likes, comments

### Like（点赞）
- postId, userId

### Comment（评论）
- id, content
- 关联：post, user

## 🛠️ 开发命令

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 生产模式
npm start

# 数据库管理
npm run db:studio

# 数据库迁移
npm run db:migrate
```

## 📦 技术栈

- **Node.js** + **Express** - Web 框架
- **Prisma** - ORM
- **SQLite** - 数据库（可切换到 PostgreSQL/MySQL）
- **JWT** - 认证
- **bcryptjs** - 密码加密
- **Multer** - 文件上传
- **Zod** - 数据验证

## 🔄 前端集成

### Web (Next.js)

创建 `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Mobile (Expo)

创建 `.env`:
```env
EXPO_PUBLIC_API_URL=http://localhost:3001/api
```

## 🚀 部署

### 使用 PostgreSQL

1. 修改 `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/petkeeper"
```

2. 运行迁移：
```bash
npm run db:migrate
```

### 部署到云平台

- **Railway** / **Render** / **Fly.io** - 推荐免费方案
- **Heroku** - 经典选择
- **VPS** - 完全控制

## 📝 许可证

MIT
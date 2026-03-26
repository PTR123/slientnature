# PetKeeper 开发指南

## 🎯 当前状态

✅ 前端 Demo 已完成，可以直接运行查看效果
✅ 所有核心页面已实现
✅ Mock 数据已准备就绪
✅ 响应式设计，支持移动端

## 🚀 快速查看

```bash
cd pet-keeper
npm run dev
```

访问 http://localhost:3000

## 📋 已实现的页面

### 1. 首页 (/)
- Hero 展示区
- 核心功能介绍
- 热门物种推荐
- 社区动态预览
- CTA 行动号召

### 2. 物种图鉴 (/species)
- 左侧分类筛选栏（桌面端）
- 搜索功能
- 卡片式物种展示
- 难度标签系统
- 环境参数显示

### 3. 物种详情 (/species/[id])
- Hero 图片展示
- 基础信息卡片
- 生命周期图示
- 食性指南
- 饲养环境建议
- 常见疾病处理
- 侧边栏快捷信息

### 4. 我的饲养记录 (/my-pets)
- Tab 切换（个体档案/日历视图/数据统计）
- 宠物卡片列表
- 年龄自动计算
- 最近记录时间

### 5. 宠物详情 (/my-pets/[id])
- 宠物档案信息
- 事件时间轴
- 多种记录类型
- 图片展示
- 环境参数提醒

### 6. 社区 (/community)
- 热门/最新排序
- 瀑布流布局
- 帖子卡片展示
- 标签系统
- 浮动发帖按钮

### 7. 帖子详情 (/community/[id])
- 作者信息
- 图文内容
- 点赞/评论/分享
- 评论区域（待开发）

## 🎨 设计特色

### 配色方案
- **主色调**: 森林绿 (Forest Green)
- **辅助色**: 琥珀色、苔藓绿、赤陶色
- **背景色**: 奶油色系
- **文字色**: 深森林绿

### 字体
- **标题**: Fraunces (衬线体，优雅大气)
- **正文**: Outfit (无衬线体，现代简洁)
- **代码**: JetBrains Mono

### 交互细节
- 卡片悬停提升效果
- 图片缩放动画
- 平滑过渡动画
- 响应式导航菜单
- 滚动触发动画

## 📦 如何修改数据

### 添加新物种

编辑 `lib/data.ts` 文件，在 `speciesData` 数组中添加：

```typescript
{
  id: 'unique-id',
  name: '物种名称',
  scientificName: '学名',
  category: 'insect' | 'reptile' | 'aquatic' | 'bird' | 'exotic',
  subcategory: '子分类',
  image: '图片URL',
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  // ... 其他字段
}
```

### 添加 Mock 宠物数据

编辑 `lib/mock-data.ts`，在 `mockPets` 数组中添加新宠物。

### 添加社区帖子

编辑 `lib/mock-data.ts`，在 `mockPosts` 数组中添加新帖子。

## 🔧 下一步开发建议

### 1. 后端集成（优先级：高）

#### 使用 Supabase（推荐）

```bash
npm install @supabase/supabase-js
```

创建 `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

#### 数据库表结构

```sql
-- 物种表
CREATE TABLE species (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  scientific_name TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  image TEXT,
  difficulty TEXT,
  -- ... 其他字段
);

-- 用户宠物表
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users,
  species_id UUID REFERENCES species,
  name TEXT NOT NULL,
  image TEXT,
  birth_date DATE,
  acquisition_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 饲养记录表
CREATE TABLE pet_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  image TEXT,
  weight NUMERIC,
  length NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 社区帖子表
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users,
  title TEXT NOT NULL,
  content TEXT,
  image TEXT,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. 用户认证

使用 Supabase Auth:

```typescript
// 注册
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
})

// 登录
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})
```

### 3. 图片上传

使用 Supabase Storage:

```typescript
const { data, error } = await supabase.storage
  .from('pet-images')
  .upload('file-path', file)
```

### 4. 实时数据

使用 Supabase Realtime:

```typescript
supabase
  .channel('posts')
  .on('postgres_changes', { event: 'INSERT', schema: 'public' }, payload => {
    console.log('New post:', payload.new)
  })
  .subscribe()
```

## 🚢 部署建议

### Vercel（推荐）

```bash
npm install -g vercel
vercel
```

### Docker

创建 `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

## 💡 功能扩展建议

### 短期（1-2周）

1. **数据持久化**: 集成 Supabase
2. **用户系统**: 登录注册
3. **图片上传**: 真实图片存储
4. **表单验证**: Zod + React Hook Form

### 中期（1-2月）

1. **数据可视化**: 使用 Chart.js 或 Recharts
2. **提醒系统**: 喂食、换水提醒
3. **搜索优化**: Algolia 或 MeiliSearch
4. **PWA**: 离线支持

### 长期（3-6月）

1. **移动应用**: React Native 或 Flutter
2. **AI 识别**: 物种识别功能
3. **社交功能**: 关注、私信
4. **商城接入**: 饲料、设备购买

## 🐛 已知问题

- [ ] 图片优化需要配置域名白名单
- [ ] 部分页面 SEO 需要优化
- [ ] 移动端部分交互可以优化

## 📚 学习资源

- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [shadcn/ui 组件库](https://ui.shadcn.com)

## 💬 技术支持

遇到问题可以：
1. 查看控制台错误信息
2. 检查 Network 面板
3. 阅读 Next.js 文档
4. 提交 Issue

---

祝开发顺利！🎉
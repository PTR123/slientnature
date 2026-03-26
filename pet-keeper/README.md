# PetKeeper - 异宠饲养管理平台

一个专业的异宠饲养记录、物种图鉴与社区交流平台。

## 🌿 项目特色

- **物种图鉴**: 涵盖昆虫、爬宠、水族、鸟类等多种异宠的专业数据库
- **饲养记录**: 为每只宠物建立独立档案，记录成长历程
- **社区交流**: 与异宠爱好者分享经验、交流心得

## 🎨 设计风格

采用自然系配色方案，以森林绿为主色调，搭配大地色系和奶油色背景，营造温馨、专业的视觉体验。

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 📁 项目结构

```
pet-keeper/
├── app/                    # Next.js App Router 页面
│   ├── page.tsx           # 首页
│   ├── species/           # 物种图鉴
│   │   ├── page.tsx      # 物种列表
│   │   └── [id]/page.tsx # 物种详情
│   ├── my-pets/           # 我的饲养记录
│   │   ├── page.tsx      # 宠物列表
│   │   └── [id]/page.tsx # 宠物详情
│   └── community/         # 社区
│       ├── page.tsx      # 帖子列表
│       └── [id]/page.tsx # 帖子详情
├── components/            # React 组件
│   ├── ui/               # UI 基础组件
│   ├── navigation.tsx    # 导航栏
│   └── footer.tsx        # 页脚
├── lib/                   # 工具函数和数据
│   ├── types.ts          # TypeScript 类型定义
│   ├── data.ts           # 物种数据
│   ├── mock-data.ts      # 模拟数据
│   └── utils.ts          # 工具函数
└── public/               # 静态资源
```

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **字体**: Fraunces (Display) + Outfit (Body)
- **图标**: Lucide React
- **图片**: Next.js Image Optimization

## 📱 核心功能

### 1. 物种图鉴

- 分类筛选（昆虫、爬宠、水族、鸟类、异宠）
- 物种搜索
- 详细饲养指南
  - 环境参数（温度、湿度）
  - 食性指南
  - 生命周期图示
  - 常见疾病处理

### 2. 我的饲养记录

- 个体档案管理
- 事件记录（蜕皮、喂食、称重、换水等）
- 时间轴展示
- 数据统计（开发中）

### 3. 社区交流

- 图文发帖
- 热门/最新排序
- 点赞、评论互动
- 标签分类

## 🎯 数据说明

当前版本使用 Mock 数据演示：

- **物种数据**: 15+ 种异宠，包含完整的饲养信息
- **宠物档案**: 5 个示例宠物及记录
- **社区帖子**: 8 篇示例帖子

后续可接入真实数据库（如 Supabase、PostgreSQL）。

## 🔧 后续开发计划

### Phase 1 - MVP 完善

- [ ] 后端 API 接口
- [ ] 数据库集成
- [ ] 用户认证系统
- [ ] 图片上传功能

### Phase 2 - 功能增强

- [ ] 数据可视化（成长曲线图）
- [ ] 智能提醒（换水、喂食）
- [ ] 导出 PDF 饲养手册
- [ ] 批量记录管理

### Phase 3 - 商业化

- [ ] 付费会员功能
- [ ] 专家问答服务
- [ ] 商城接入
- [ ] 移动端适配优化

## 📄 许可证

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

---

**注意**: 这是一个演示版本，数据均为模拟数据。生产环境需要配置真实的数据库和后端服务。
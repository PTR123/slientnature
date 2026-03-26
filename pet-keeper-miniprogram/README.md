# PetKeeper 微信小程序

PetKeeper 异宠饲养管理平台的微信小程序版本

---

## 📱 项目简介

PetKeeper 微信小程序让用户可以在微信中管理自己的异宠，查看物种图鉴，参与社区交流。

**核心功能：**
- 🦎 物种图鉴 - 浏览各类异宠饲养指南
- 🐾 宠物管理 - 创建和管理宠物档案
- 📝 饲养记录 - 记录宠物成长历程
- 💬 社区交流 - 分享经验，互动交流

---

## 🚀 快速开始

### 前置要求

1. **注册微信小程序**
   - 访问 [微信公众平台](https://mp.weixin.qq.com/)
   - 注册小程序账号
   - 获取 AppID

2. **安装开发工具**
   - 下载 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

3. **后端 API**
   - 部署后端服务（参考主项目部署文档）
   - 获取后端 API 地址

### 配置步骤

#### 1. 配置 AppID

打开 `project.config.json`，修改 `appid`：

```json
{
  "appid": "你的小程序AppID"
}
```

#### 2. 配置后端 API 地址

打开 `app.js`，修改 `apiBaseUrl`：

```javascript
globalData: {
  apiBaseUrl: 'https://你的后端地址/api'
}
```

**重要：**
- 后端必须支持 HTTPS
- 需要在微信公众平台配置服务器域名

#### 3. 配置服务器域名

登录微信公众平台 → 开发 → 开发管理 → 服务器域名：

- **request 合法域名**: 添加你的后端域名
- **uploadFile 合法域名**: 添加你的后端域名（用于图片上传）
- **downloadFile 合法域名**: 添加你的后端域名（用于图片显示）

### 运行项目

1. 打开微信开发者工具
2. 导入项目
3. 选择 `pet-keeper-miniprogram` 目录
4. 点击"编译"预览

---

## 📁 项目结构

```
pet-keeper-miniprogram/
├── pages/                    # 页面文件
│   ├── index/               # 首页
│   ├── login/               # 登录
│   ├── register/            # 注册
│   ├── pets/                # 宠物管理
│   │   ├── pets            # 宠物列表
│   │   ├── detail          # 宠物详情
│   │   └── create          # 创建宠物
│   ├── species/            # 物种图鉴
│   │   ├── species         # 物种列表
│   │   └── detail          # 物种详情
│   ├── community/          # 社区
│   │   ├── community       # 帖子列表
│   │   ├── detail          # 帖子详情
│   │   └── create          # 发布帖子
│   └── profile/            # 个人中心
├── utils/                   # 工具类
│   ├── api.js              # API 请求封装
│   └── util.js             # 工具函数
├── images/                  # 图片资源
│   ├── logo.png            # Logo
│   ├── tab-*.png           # TabBar 图标
│   └── default-*.png       # 默认图片
├── app.js                   # 小程序入口
├── app.json                 # 全局配置
├── app.wxss                 # 全局样式
├── project.config.json      # 项目配置
├── sitemap.json            # 站点地图
└── README.md               # 说明文档
```

---

## 🎨 设计规范

### 配色方案

- **主色**: #4a784a (森林绿)
- **背景**: #fefdfb (奶油白)
- **文字**: #333333 (深灰)
- **辅助**: #666666 (中灰)
- **边框**: #eeeeee (浅灰)

### 字体大小

- 标题: 36-48rpx
- 正文: 28-32rpx
- 辅助: 24-26rpx

### 间距规范

- 页面边距: 30rpx
- 卡片间距: 20rpx
- 内容间距: 12-24rpx

---

## 📱 页面说明

### 1. 首页 (index)

**功能：**
- 未登录：展示欢迎页和登录入口
- 已登录：显示分类导航、我的宠物、热门帖子

**交互：**
- 点击分类跳转到物种列表
- 点击宠物卡片查看详情
- 点击帖子卡片查看详情

### 2. 登录/注册

**登录页 (login)**
- 邮箱 + 密码登录
- 跳转注册

**注册页 (register)**
- 邮箱、用户名、密码注册

### 3. 宠物管理 (pets)

**宠物列表 (pets/pets)**
- 显示用户所有宠物
- 支持搜索、筛选

**宠物详情 (pets/detail)**
- 宠物基本信息
- 饲养记录时间轴
- 添加记录

**创建宠物 (pets/create)**
- 填写宠物信息
- 上传图片
- 选择物种

### 4. 物种图鉴 (species)

**物种列表 (species/species)**
- 分类筛选
- 搜索功能
- 卡片展示

**物种详情 (species/detail)**
- 基本信息
- 环境参数
- 食性指南
- 生命周期
- 常见疾病

### 5. 社区 (community)

**帖子列表 (community/community)**
- 热门/最新排序
- 发布帖子入口
- 点赞、评论

**帖子详情 (community/detail)**
- 帖子内容
- 评论列表
- 点赞功能

**发布帖子 (community/create)**
- 标题、内容
- 添加图片
- 选择标签

### 6. 个人中心 (profile)

- 个人信息展示
- 我的宠物
- 我的帖子
- 设置

---

## 🔌 API 接口

### 认证接口

```javascript
// 注册
authApi.register({
  email: 'user@example.com',
  username: 'username',
  password: 'password'
})

// 登录
authApi.login({
  email: 'user@example.com',
  password: 'password'
})

// 获取当前用户
authApi.getCurrentUser()
```

### 宠物接口

```javascript
// 获取宠物列表
petApi.getList()

// 创建宠物
petApi.create({
  name: '宠物名',
  species: '物种',
  image: '图片URL',
  birthDate: '2024-01-01',
  acquisitionDate: '2024-01-01'
})

// 添加记录
petApi.addRecord(petId, {
  type: 'feeding', // molt, feeding, weighing, water_change, treatment, breeding, other
  date: '2024-01-01',
  notes: '备注',
  weight: 10.5,
  length: 20.3
})
```

### 物种接口

```javascript
// 获取物种列表
speciesApi.getList({ category: 'insect' })

// 获取物种详情
speciesApi.getDetail(speciesId)
```

### 社区接口

```javascript
// 获取帖子列表
postApi.getList({ sort: 'hot' })

// 创建帖子
postApi.create({
  title: '标题',
  content: '内容',
  image: '图片URL',
  tags: ['标签1', '标签2']
})

// 点赞
postApi.toggleLike(postId)

// 评论
postApi.addComment(postId, {
  content: '评论内容'
})
```

---

## 🔐 安全配置

### 1. HTTPS 要求

小程序要求后端必须使用 HTTPS。可以使用：
- Let's Encrypt 免费证书
- 阿里云/腾讯云 SSL 证书

### 2. 域名配置

在微信公众平台配置合法域名：
- request 合法域名
- uploadFile 合法域名
- downloadFile 合法域名

### 3. Token 管理

- 登录成功后保存 token 到 storage
- 请求时自动在 header 添加 `Authorization: Bearer <token>`
- token 过期自动跳转登录页

---

## 📦 图片资源

需要准备以下图片资源：

```
images/
├── logo.png                 # Logo (200x200)
├── tab-home.png            # 首页图标 (48x48)
├── tab-home-active.png     # 首页激活 (48x48)
├── tab-species.png         # 图鉴图标 (48x48)
├── tab-species-active.png  # 图鉴激活 (48x48)
├── tab-community.png       # 社区图标 (48x48)
├── tab-community-active.png # 社区激活 (48x48)
├── tab-profile.png         # 我的图标 (48x48)
├── tab-profile-active.png  # 我的激活 (48x48)
├── default-avatar.png      # 默认头像 (100x100)
└── default-pet.png         # 默认宠物图 (200x200)
```

---

## 🚀 发布流程

### 1. 开发版本

在微信开发者工具中：
1. 点击"上传"
2. 填写版本号和说明
3. 上传代码

### 2. 体验版本

在微信公众平台：
1. 开发管理 → 开发版本
2. 选择版本设为体验版
3. 添加体验成员

### 3. 审核发布

1. 点击"提交审核"
2. 填写审核信息
3. 等待审核结果（通常 1-3 天）
4. 审核通过后点击"发布"

---

## 📊 性能优化

### 1. 图片优化

- 使用 WebP 格式
- 压缩图片质量
- 使用 CDN 加速

### 2. 请求优化

- 并行请求
- 数据缓存
- 按需加载

### 3. 渲染优化

- 列表使用 `wx:key`
- 避免频繁 setData
- 使用自定义组件

---

## 🐛 常见问题

### Q: 真机预览白屏？

**A:** 检查：
1. 是否配置了服务器域名
2. API 是否支持 HTTPS
3. 是否打开调试模式（开发工具 → 真机调试）

### Q: 图片上传失败？

**A:** 检查：
1. uploadFile 域名是否配置
2. 图片大小是否超限（默认 5MB）
3. 后端是否支持跨域

### Q: 登录状态丢失？

**A:** 检查：
1. token 是否正确保存
2. storage 是否被清理
3. token 是否过期

---

## 📝 开发日志

### v1.0.0 (2026-03-26)
- ✅ 完成基础框架
- ✅ 登录/注册功能
- ✅ 首页展示
- ✅ API 工具类封装
- 🚧 宠物管理页面（开发中）
- 🚧 物种图鉴页面（开发中）
- 🚧 社区功能页面（开发中）

---

## 🤝 贡献指南

欢迎贡献代码！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

---

## 📄 许可证

MIT License

---

## 👨‍💻 作者

PetKeeper Team

---

## 📞 联系方式

- 问题反馈：GitHub Issues
- 技术交流：查看项目文档

---

**🎉 享受微信小程序开发之旅！**
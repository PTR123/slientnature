# 图片资源说明

本目录需要放置小程序所需的图片资源。

## 必需图片列表

### 1. Logo
- `logo.png` - 应用 Logo (200x200 像素)

### 2. TabBar 图标（每个 48x48 像素）
- `tab-home.png` - 首页图标（未选中）
- `tab-home-active.png` - 首页图标（选中）
- `tab-species.png` - 图鉴图标（未选中）
- `tab-species-active.png` - 图鉴图标（选中）
- `tab-community.png` - 社区图标（未选中）
- `tab-community-active.png` - 社区图标（选中）
- `tab-profile.png` - 我的图标（未选中）
- `tab-profile-active.png` - 我的图标（选中）

### 3. 默认图片
- `default-avatar.png` - 默认头像 (100x100 像素)
- `default-pet.png` - 默认宠物图 (200x200 像素)

## 图片规范

### 格式要求
- 格式：PNG（推荐）或 JPG
- 背景：透明（TabBar 图标）或白色
- 大小：单张图片不超过 40KB

### 设计建议
- TabBar 图标：线性图标，简洁明了
- 未选中状态：灰色 (#999999)
- 选中状态：主色 (#4a784a)

## 快速获取图标

可以从以下网站获取免费图标：
- [阿里巴巴矢量图标库](https://www.iconfont.cn/)
- [Flaticon](https://www.flaticon.com/)
- [Icons8](https://icons8.com/)

## 暂时处理

在开发阶段，如果暂时没有图片资源，可以：
1. 使用占位图
2. 注释掉相关图片引用
3. 使用纯色块代替

**注意：正式发布前必须替换为真实图片！**
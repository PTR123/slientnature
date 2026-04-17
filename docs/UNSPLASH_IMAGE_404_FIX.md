# Unsplash图片404错误修复方案

## 错误信息
```
Failed to load image https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800
the server responded with a status of 404
```

## 问题原因

### 数据库中的Unsplash图片
数据库中的物种使用了Unsplash的外部图片URL，这些URL已经失效：

| ID | 名称 | 图片URL | 状态 |
|----|------|---------|------|
| phelsuma-laticauda | 宽尾守宫 | unsplash.com/...photo-150445... | ⚠️ 可能失效 |
| hymenopus-coronatus | 兰花螳螂 | unsplash.com/...photo-157111... | ❌ 已失效 (404) |
| dynastes-hercules | 长戟大兜虫 | unsplash.com/...photo-155925... | ⚠️ 可能失效 |

## 解决方案

### 方案1: 添加图片加载失败的fallback（推荐）✅

在小程序中添加默认图片处理：

**文件**: `pages/species/detail/detail.wxml`

```xml
<image
  class="species-image"
  src="{{species.image || '/images/default-species.png'}}"
  mode="aspectFit"
  binderror="onImageError"
  data-field="image"
></image>
```

**文件**: `pages/species/detail/detail.js`

```javascript
// 图片加载错误处理
onImageError(e) {
  console.error('图片加载失败:', e.detail)
  const { field } = e.currentTarget.dataset

  // 设置默认图片
  this.setData({
    species: {
      ...this.data.species,
      [field]: '/images/default-species.png'
    }
  })
}
```

### 方案2: 更新数据库中的图片URL

使用可用的图片源替换：

```sql
-- 更新为本地图片
UPDATE Species
SET image = '/images/default-species.png'
WHERE image LIKE '%unsplash%';

-- 或使用其他图片服务
UPDATE Species
SET image = 'https://via.placeholder.com/800x600?text=Species+Image'
WHERE id = 'hymenopus-coronatus';
```

### 方案3: 创建默认物种图片

创建一个默认的物种图片：

```bash
# 创建默认图片
touch /Users/mac/zrby/pet-keeper-miniprogram/images/default-species.png
```

使用项目logo或占位图。

### 方案4: 使用上传的本地图片

如果有本地图片资源：

```sql
UPDATE Species
SET image = '/uploads/species/hymenopus-coronatus.jpg'
WHERE id = 'hymenopus-coronatus';
```

## 推荐实施步骤

### Step 1: 添加错误处理代码（立即生效）

在 `pages/species/detail/detail.js` 中添加：

```javascript
// 图片加载错误处理
onImageError(e) {
  const { field } = e.currentTarget.dataset || { field: 'image' }

  console.error('图片加载失败:', e.detail.errMsg)

  // 使用默认图片
  this.setData({
    species: {
      ...this.data.species,
      [field]: '/images/default-species.png'
    }
  })
}
```

### Step 2: 更新WXML添加binderror

```xml
<image
  class="species-image"
  src="{{species.image}}"
  mode="aspectFit"
  binderror="onImageError"
  data-field="image"
></image>
```

### Step 3: 更新数据库（永久解决）

```bash
sqlite3 /Users/mac/zrby/pet-keeper-backend/prisma/dev.db
```

```sql
-- 查看当前图片
SELECT id, name, image FROM Species;

-- 更新为默认图片
UPDATE Species
SET image = '/images/default-species.png'
WHERE image LIKE '%unsplash%';

-- 验证更新
SELECT id, name, image FROM Species;
```

### Step 4: 创建默认图片

确保存在默认图片文件：

```bash
ls -la /Users/mac/zrby/pet-keeper-miniprogram/images/default-species.png
```

如果不存在，可以复制现有的图片：

```bash
cp /Users/mac/zrby/pet-keeper-miniprogram/images/default-product.png \
   /Users/mac/zrby/pet-keeper-miniprogram/images/default-species.png
```

## 快速修复（推荐）

### 一键修复脚本

```bash
# 1. 更新数据库
sqlite3 /Users/mac/zrby/pet-keeper-backend/prisma/dev.db \
  "UPDATE Species SET image = '/images/default-species.png' WHERE image LIKE '%unsplash%';"

# 2. 确保默认图片存在
if [ ! -f /Users/mac/zrby/pet-keeper-miniprogram/images/default-species.png ]; then
  cp /Users/mac/zrby/pet-keeper-miniprogram/images/default-product.png \
     /Users/mac/zrby/pet-keeper-miniprogram/images/default-species.png
fi

# 3. 重启backend
# (如果backend在运行，数据更新会自动生效)
```

## 验证修复

### 1. 检查数据库
```bash
sqlite3 /Users/mac/zrby/pet-keeper-backend/prisma/dev.db \
  "SELECT id, name, image FROM Species;"
```

应该不再有unsplash.com的URL。

### 2. 在小程序中测试
1. 进入物种图鉴
2. 点击各个物种查看详情
3. 图片应该正常显示（默认图片或上传的图片）
4. Console不应该有404错误

## 预防措施

### 1. 使用本地图片或可靠CDN
- 本地图片: `/uploads/species/xxx.jpg`
- CDN: 使用可靠的图片CDN服务

### 2. 图片上传功能
使用后端的图片上传功能：

```javascript
// 上传物种图片
const imageUrl = await uploadApi.uploadImage(filePath)

// 更新物种数据
await speciesApi.update(id, { image: imageUrl })
```

### 3. 定期检查图片URL
创建脚本定期检查数据库中的图片URL是否有效。

## 影响范围

此问题影响：
- ✅ 物种详情页面
- ✅ 物种列表页面
- ❌ 不影响核心功能（只是图片显示）

## 优先级

**中等优先级** - 不影响功能，但影响用户体验。

---

**修复时间**: 2026-04-10
**相关文件**:
- 数据库: `pet-keeper-backend/prisma/dev.db`
- 页面: `pages/species/detail/detail.js/wxml`
- 图片: `images/default-species.png`
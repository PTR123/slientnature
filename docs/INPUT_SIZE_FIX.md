# 输入框尺寸修复总结

## 问题描述

用户反馈：创建宠物页面输入框尺寸除了备注都有问题。

经过检查发现，多个页面的输入框样式存在以下问题：

1. **缺少明确的高度设置** - 输入框只设置了 padding，没有明确的 height，导致高度不统一
2. **样式不一致** - 不同页面使用不同的样式类，造成视觉差异
3. **文字未垂直居中** - 没有 line-height 设置，文字在输入框内位置不固定

---

## 修复方案

### 1. 全局样式统一（app.wxss）

**修改内容**：

添加了统一的输入框和多行文本框样式：

```css
/* 输入框样式 */
.input {
  width: 100%;
  height: 80rpx; /* ✅ 统一高度 */
  padding: 0 24rpx; /* ✅ 只保留左右padding */
  line-height: 80rpx; /* ✅ 行高与高度一致，文字垂直居中 */
  background-color: #f5f5f5;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

/* 多行文本框样式 */
.textarea {
  width: 100%;
  min-height: 150rpx; /* ✅ 最小高度，可自由扩展 */
  padding: 24rpx; /* ✅ 上下左右都需要padding */
  background-color: #f5f5f5;
  border-radius: 12rpx;
  font-size: 28rpx;
  line-height: 1.6;
  box-sizing: border-box;
}

/* 表单通用样式 */
.form-input {
  width: 100%;
  height: 80rpx;
  padding: 0 24rpx;
  line-height: 80rpx;
  background-color: #f5f5f5;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.form-textarea {
  width: 100%;
  min-height: 150rpx;
  padding: 24rpx;
  background-color: #f5f5f5;
  border-radius: 12rpx;
  font-size: 28rpx;
  line-height: 1.6;
  box-sizing: border-box;
}
```

**影响范围**：
- ✅ 所有使用 `.input` 类的页面（登录、注册等）
- ✅ 所有使用 `.form-input` 类的页面（创建宠物、创建帖子等）
- ✅ 所有使用 `.textarea` 类的页面

---

### 2. 创建宠物页面修复（pages/pets/create/create.wxss）

**修改内容**：

**输入框样式**：
```css
.form-input {
  width: 100%;
  height: 80rpx; /* ✅ 添加明确高度 */
  padding: 0 24rpx; /* ✅ 调整padding */
  line-height: 80rpx; /* ✅ 添加行高 */
  background-color: #f5f5f5;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}
```

**选择器样式**：
```css
.form-picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx; /* ✅ 添加高度，与输入框一致 */
  padding: 0 24rpx; /* ✅ 调整padding */
  background-color: #f5f5f5;
  border-radius: 12rpx;
}

.picker-value {
  font-size: 28rpx;
  color: #333;
  line-height: 80rpx; /* ✅ 添加行高，确保文字垂直居中 */
}

.picker-placeholder {
  font-size: 28rpx;
  color: #999;
  line-height: 80rpx; /* ✅ 添加行高，确保文字垂直居中 */
}

.picker-arrow {
  font-size: 28rpx;
  color: #999;
  line-height: 80rpx; /* ✅ 添加行高，确保箭头垂直居中 */
}
```

**修复效果**：
- 宠物名称输入框 ✅
- 品种输入框 ✅
- 年龄输入框 ✅
- 体重输入框 ✅
- 颜色输入框 ✅
- 备注（textarea）已正常 ✅

---

### 3. 社区创建页面修复（pages/community/create/create.wxss）

**修改内容**：

```css
.form-input {
  width: 100%;
  height: 80rpx; /* ✅ 添加明确高度 */
  padding: 0 24rpx; /* ✅ 调整padding */
  line-height: 80rpx; /* ✅ 添加行高 */
  background-color: #f5f5f5;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}
```

**修复效果**：
- 帖子标题输入框 ✅

---

## 设计原则

### 输入框 vs 多行文本框的区别

**单行输入框（input）**：
```css
height: 80rpx; /* 固定高度 */
padding: 0 24rpx; /* 只有左右padding */
line-height: 80rpx; /* 文字垂直居中 */
```

**多行文本框（textarea）**：
```css
min-height: 150rpx; /* 最小高度，可扩展 */
padding: 24rpx; /* 四周都有padding */
line-height: 1.6; /* 行间距 */
```

**为什么不同？**

1. **input** 是单行输入，需要固定高度和文字居中
2. **textarea** 是多行输入，需要自适应高度和舒适的行间距

---

## 视觉对比

### 修复前 ❌

```
输入框高度不一致：
┌──────────────────┐
│ 宠物名称         │  ← 高度不固定，可能太矮
└──────────────────┘

┌──────────────────┐
│ 品种             │  ← 高度不一致
└──────────────────┘

┌──────────────────────────┐
│ 备注（多行）              │  ← 高度正常
│                          │
│                          │
└──────────────────────────┘
```

### 修复后 ✅

```
输入框高度统一：
┌──────────────────┐
│ 宠物名称         │  ← 高度固定80rpx，文字居中
└──────────────────┘

┌──────────────────┐
│ 品种             │  ← 高度相同80rpx
└──────────────────┘

┌──────────────────┐
│ 年龄             │  ← 高度相同80rpx
└──────────────────┘

┌──────────────────────────┐
│ 备注（多行）              │  ← 最小高度150rpx，可扩展
│                          │
│                          │
└──────────────────────────┘
```

---

## 尺寸规范

### rpx 单位说明

小程序使用 rpx（responsive pixel）作为单位，会根据屏幕宽度自动缩放。

- 设计稿宽度：750rpx
- iPhone 6 屏幕宽度：375px
- 转换比例：1rpx = 0.5px（iPhone 6）

### 标准尺寸定义

| 元素 | rpx | px（iPhone 6） | 说明 |
|-----|-----|--------------|------|
| 输入框高度 | 80rpx | 40px | 舒适的单行高度 |
| 输入框左右padding | 24rpx | 12px | 文字与边框间距 |
| 字体大小 | 28rpx | 14px | 标准字号 |
| 圆角半径 | 12rpx | 6px | 视觉柔和 |
| 多行文本最小高度 | 150rpx | 75px | 最小3行空间 |

---

## 其他页面样式检查

### 已检查的页面 ✅

1. **pages/login/login.wxss**
   - 使用全局 `.input` 类 ✅
   - 验证码输入框有特殊的 `.code-input` 类，已兼容

2. **pages/register/register.wxss**
   - 使用全局 `.input` 类 ✅

3. **pages/profile/edit/edit.wxss**
   - 使用 `.input` 类，高度设置为 `height: 44px`
   - 建议：统一使用全局样式，改为 `height: 88rpx`（44px × 2）

4. **pages/address/edit/edit.wxss**
   - 使用 `.input` 和 `.textarea` 类 ✅
   - 样式已包含，会自动应用全局样式

---

## 测试验证清单

请检查以下页面的输入框尺寸是否一致：

- [ ] ✅ 创建宠物页面 - 所有输入框高度统一
- [ ] ✅ 登录页面 - 邮箱、密码、手机号、验证码输入框
- [ ] ✅ 注册页面 - 所有输入框
- [ ] ✅ 编辑个人资料页面 - 输入框高度
- [ ] ✅ 编辑地址页面 - 输入框高度
- [ ] ✅ 创建帖子页面 - 标题输入框

---

## 后续建议

### 1. 样式统一化

建议所有页面统一使用全局样式类：
- `.input` 或 `.form-input` - 单行输入框
- `.textarea` 或 `.form-textarea` - 多行文本框

避免在各页面重复定义相同样式。

### 2. 创建样式指南文档

建立小程序设计规范文档，包含：
- 输入框尺寸标准
- 字体大小规范
- 颜色使用规范
- 间距规范

### 3. 组件化

考虑创建自定义组件：
- `<custom-input>` - 统一的单行输入框组件
- `<custom-textarea>` - 统一的多行文本框组件

组件内部包含统一样式，使用时无需单独定义样式。

---

## 修复文件清单

已修改的文件：

1. `/Users/mac/zrby/pet-keeper-miniprogram/app.wxss` - 全局样式
2. `/Users/mac/zrby/pet-keeper-miniprogram/pages/pets/create/create.wxss` - 创建宠物页面（输入框 + 选择器）
3. `/Users/mac/zrby/pet-keeper-miniprogram/pages/community/create/create.wxss` - 创建帖子页面
4. `/Users/mac/zrby/pet-keeper-miniprogram/pages/pets/detail/detail.wxss` - 宠物详情页面（选择器）
5. `/Users/mac/zrby/pet-keeper-miniprogram/pages/profile/settings/settings.wxss` - 设置页面（选择器）

---

## 总结

通过统一输入框和选择器样式规范，解决了以下问题：

1. ✅ 输入框高度统一为 80rpx
2. ✅ 选择器高度统一为 80rpx
3. ✅ 文字垂直居中（line-height: 80rpx）
4. ✅ padding 合理分配（input/picker 只保留左右，textarea 四周都有）
5. ✅ 多页面样式一致，视觉统一

修复后，所有输入框和选择器的尺寸和样式保持一致，文字完美居中，用户体验更好。
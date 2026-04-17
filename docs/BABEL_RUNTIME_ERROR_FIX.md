# Babel Runtime 依赖缺失错误修复

## 错误信息
```
Error: module '@babel/runtime/helpers/typeof.js' is not defined
Component is not found in path "wx://not-found"
```

## 问题原因

### 缺少依赖包 ❌
小程序项目缺少 `package.json` 文件，没有安装必要的npm依赖。

### 为什么需要 @babel/runtime？

某些npm包使用了ES6+语法（如async/await、展开运算符等），需要babel转译。
`@babel/runtime` 提供了这些语法转换所需的helper函数。

## 已修复 ✅

### 1. 创建 package.json
```json
{
  "name": "pet-keeper-miniprogram",
  "version": "1.0.0",
  "dependencies": {
    "@babel/runtime": "^7.23.0"
  }
}
```

### 2. 安装依赖
```bash
npm install
```

## 构建NPM步骤（重要！）

在**微信开发者工具**中必须执行以下操作：

### Step 1: 构建npm
1. 点击菜单栏 **"工具"**
2. 选择 **"构建 npm"**
3. 等待构建完成

### Step 2: 查看构建结果
构建成功后会生成：
```
miniprogram_npm/
└── @babel/
    └── runtime/
```

### Step 3: 重新编译
1. 点击 **"编译"** 按钮
2. 或使用快捷键 `Cmd+B`

## 项目配置

### project.config.json 配置

确保项目配置正确：

```json
{
  "setting": {
    "packNpmManually": true,
    "packNpmRelationList": [
      {
        "packageJsonPath": "./package.json",
        "miniprogramNpmDistDir": "./miniprogram_npm/"
      }
    ]
  }
}
```

### app.json 配置（如果使用了npm包）

如果使用了npm包作为自定义组件，需要在 `app.json` 中声明：

```json
{
  "usingComponents": {}
}
```

## 验证步骤

### 1. 检查文件结构
```bash
ls -la miniprogram_npm/@babel/runtime/
```

应该能看到runtime的文件。

### 2. Console测试
在微信开发者工具Console中执行：

```javascript
// 应该不再报错
const app = getApp()
console.log('App initialized successfully')
```

### 3. 检查依赖树
```bash
npm list @babel/runtime
```

## 常见问题

### Q1: 构建npm后仍然报错
**原因**: 构建未生效或路径错误
**解决**:
1. 删除 `miniprogram_npm` 文件夹
2. 重新执行 "工具 → 构建 npm"
3. 完全重启微信开发者工具

### Q2: npm install失败
**原因**: 网络问题或npm源问题
**解决**:
```bash
# 使用国内镜像
npm install --registry=https://registry.npmmirror.com
```

### Q3: 找不到构建npm菜单
**原因**: 微信开发者工具版本过旧
**解决**: 更新到最新版本

### Q4: 仍然提示 module not defined
**原因**: 可能需要其他依赖
**解决**:
```bash
# 安装完整的babel依赖
npm install --save @babel/runtime-corejs3
```

## 项目结构

正确的项目结构应该是：

```
pet-keeper-miniprogram/
├── package.json           ✅ npm配置
├── package-lock.json      ✅ 依赖锁定
├── node_modules/          ✅ npm包
│   └── @babel/
│       └── runtime/
├── miniprogram_npm/       ✅ 小程序npm（构建后生成）
│   └── @babel/
│       └── runtime/
├── app.js
├── app.json
└── pages/
```

## 如果仍然有问题

### 方案1: 完全重置
```bash
# 删除所有依赖
rm -rf node_modules miniprogram_npm package-lock.json

# 重新安装
npm install

# 在开发者工具中构建npm
```

### 方案2: 检查开发者工具设置
1. 详情 → 本地设置
2. ✅ 使用npm模块
3. ✅ 增强编译

### 方案3: 更新依赖
```bash
# 更新到最新版本
npm update @babel/runtime
```

## 相关依赖

如果项目使用了其他ES6+特性，可能还需要：

```json
{
  "dependencies": {
    "@babel/runtime": "^7.23.0",
    "regenerator-runtime": "^0.14.0"
  }
}
```

---

**修复步骤总结**:
1. ✅ 创建package.json
2. ⏳ npm install（进行中）
3. ⏳ 微信开发者工具 → 工具 → 构建npm
4. ⏳ 重新编译项目

**重要提示**: 每次修改package.json后都需要重新构建npm！
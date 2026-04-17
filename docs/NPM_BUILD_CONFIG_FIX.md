# NPM构建配置错误修复

## 错误信息
```
NPM packages not found. Please confirm npm packages which need to build are belong to `miniprogramRoot` directory.
```

## 问题原因

**project.config.json配置错误** ❌

原来的配置：
```json
{
  "setting": {
    "nodeModules": false,           // ❌ 未启用npm模块
    "packNpmManually": false,       // ❌ 未配置手动打包
    "packNpmRelationList": []       // ❌ 空数组
  }
}
```

微信开发者工具不知道npm包的位置和构建目标位置。

## 已修复 ✅

**修改后的配置**：
```json
{
  "setting": {
    "nodeModules": true,            // ✅ 启用npm模块
    "packNpmManually": true,        // ✅ 手动配置打包
    "packNpmRelationList": [
      {
        "packageJsonPath": "./package.json",
        "miniprogramNpmDistDir": "./miniprogram_npm/"
      }
    ]
  }
}
```

### 配置说明

**nodeModules: true**
- 启用npm模块支持

**packNpmManually: true**
- 使用手动配置的npm打包路径

**packNpmRelationList**
- `packageJsonPath`: package.json的位置（相对于项目根目录）
- `miniprogramNpmDistDir`: 构建后npm包的输出目录

## 项目结构

```
pet-keeper-miniprogram/
├── package.json           ← npm配置文件
├── node_modules/          ← npm包安装位置
│   └── @babel/
│       └── runtime/
├── miniprogram_npm/       ← 构建后生成（目标位置）
│   └── @babel/
│       └── runtime/
├── project.config.json    ← 项目配置
├── app.js
└── pages/
```

## 现在请操作

在**微信开发者工具**中：

### 步骤1: 重新加载项目
- 完全关闭项目（Cmd+Q）
- 重新打开项目

### 步骤2: 构建npm
- 菜单栏 → 工具 → 构建 npm
- 应该会成功，显示"构建成功"

### 步骤3: 检查结果
- 项目目录应该生成 `miniprogram_npm/` 文件夹
- 里面有 `@babel/runtime/`

### 步骤4: 编译项目
- 点击"编译"按钮
- 页面应该正常显示

## 验证步骤

### 1. 检查文件生成
```bash
ls -la miniprogram_npm/@babel/runtime/
```

应该看到babel runtime的文件。

### 2. Console测试
```javascript
const app = getApp()
console.log('✅ App初始化成功')
console.log('API:', app.globalData.apiBaseUrl)
```

## 如果仍然失败

### 方案1: 清除缓存
1. 详情 → 本地设置
2. 点击"清除全部缓存"
3. 重启开发者工具
4. 重新构建npm

### 方案2: 检查miniprogramRoot
如果项目有特殊的根目录配置，确保：
```json
{
  "miniprogramRoot": "./"
}
```

### 方案3: 权限问题
确保开发者工具有读写权限：
```bash
chmod -R 755 /Users/mac/zrby/pet-keeper-miniprogram
```

## 常见错误对比

### 错误1: NPM packages not found
**原因**: project.config.json配置错误
**解决**: 已修复，按上述步骤操作

### 错误2: 构建后仍然报babel错误
**原因**: miniprogram_npm未正确生成
**解决**: 删除miniprogram_npm，重新构建

### 错误3: 权限被拒绝
**原因**: 文件权限问题
**解决**: 修改文件夹权限

---

**修复时间**: 2026-04-10 08:25
**修复文件**: project.config.json (Lines 8-48)
**状态**: ✅ 已修复配置，等待重新构建
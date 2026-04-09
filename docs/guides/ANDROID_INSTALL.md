# 📱 PetKeeper Android 安装指南

## 🚀 快速测试（推荐）

### 方法一：使用 Expo Go 应用（最简单）

**优点**: 无需构建，立即测试
**缺点**: 需要电脑和手机在同一网络

#### 步骤：

1. **手机安装 Expo Go**
   - Android: [Google Play 下载](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - 或扫码安装：
     ```
     https://play.google.com/store/apps/details?id=host.exp.exponent
     ```

2. **启动开发服务器**
   ```bash
   cd /Users/mac/my_gzh/zrby/pet-keeper-mobile
   npm start
   ```

3. **连接测试**
   - 手机打开 Expo Go
   - 扫描终端显示的二维码
   - 或手动输入显示的URL

4. **开始使用**
   - 应用会在手机上运行
   - 可以实时查看修改

---

## 📦 构建独立 APK（完整安装）

### 方法二：本地构建 APK

**优点**: 独立安装，无需网络
**缺点**: 构建时间较长（约5-10分钟）

#### 前置要求：
- 已安装 Android Studio
- 或已安装 JDK 和 Android SDK

#### 步骤：

1. **进入项目目录**
   ```bash
   cd /Users/mac/my_gzh/zrby/pet-keeper-mobile
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **构建 APK**
   ```bash
   # 方式1: 使用 Expo（推荐）
   npx expo run:android --variant release

   # 方式2: 使用本地构建
   cd android && ./gradlew assembleRelease
   ```

4. **找到 APK 文件**
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

5. **安装到手机**
   - 将 APK 传输到手机
   - 点击安装
   - 允许未知来源安装

---

## 🌐 网络配置

### 确保手机能访问后端API

**如果使用本地开发服务器**：

1. **查看电脑IP地址**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. **更新 .env 文件**
   ```env
   # 将 localhost 改为电脑IP
   EXPO_PUBLIC_API_URL=http://192.168.x.x:3001/api
   ```

3. **确保手机和电脑在同一WiFi网络**

---

## 🔧 开发者选项

### 启用USB调试（可选）

1. 手机设置 → 关于手机
2. 连续点击"版本号"7次
3. 返回设置 → 开发者选项
4. 启用"USB调试"

### 通过USB安装

```bash
# 连接手机后
adb install app-release.apk
```

---

## ⚡ 快速开始（最简单方案）

**如果您想立即测试，请执行**：

```bash
cd /Users/mac/my_gzh/zrby/pet-keeper-mobile
npm start
```

然后用手机 Expo Go 扫码即可！

---

## 📋 完整安装步骤（独立APK）

如果您想构建独立APK，我可以帮您执行以下命令：

```bash
# 1. 安装 EAS CLI（可选）
npm install -g eas-cli

# 2. 登录 Expo 账号（云端构建需要）
eas login

# 3. 构建 APK
eas build --platform android --profile preview --local

# 或使用 Expo 原生构建
npx expo run:android
```

---

## 🐛 常见问题

### Q: 无法连接到API
**A**:
- 确保手机和电脑在同一WiFi
- 检查防火墙是否允许3001端口
- 使用电脑IP地址而非localhost

### Q: Expo Go 无法加载
**A**:
- 检查手机网络连接
- 重启开发服务器
- 清除 Expo Go 缓存

### Q: APK安装失败
**A**:
- 允许未知来源安装
- 卸载旧版本后重新安装
- 检查存储空间是否充足

---

## 📞 推荐测试方式

**最简单**: 使用 Expo Go（无需构建）
**最完整**: 构建独立 APK

您想使用哪种方式？我可以帮您执行！
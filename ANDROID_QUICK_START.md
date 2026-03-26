# 📱 PetKeeper Android 快速安装指南

## 🎯 方法一：使用 Android Studio（推荐）

### 步骤：

1. **打开 Android Studio**

2. **打开项目**
   ```
   File → Open
   选择: /Users/mac/my_gzh/zrby/pet-keeper-mobile/android
   ```

3. **等待 Gradle 同步完成**（首次需要几分钟）

4. **连接手机**
   - 手机开启开发者选项和 USB 调试
   - 用 USB 连接电脑
   - Android Studio 会自动识别

5. **运行应用**
   - 点击工具栏的绿色运行按钮 ▶️
   - 选择您的手机设备
   - 等待安装完成

---

## 📦 方法二：手动构建 APK

### 前置要求：
- Java JDK 17+
- Android SDK

### 步骤：

1. **安装 Java（如果没有）**
   ```bash
   brew install openjdk@17
   ```

2. **配置环境变量**
   ```bash
   export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
   export ANDROID_HOME="$HOME/Library/Android/sdk"
   export PATH="$JAVA_HOME/bin:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH"
   ```

3. **构建 APK**
   ```bash
   cd /Users/mac/my_gzh/zrby/pet-keeper-mobile/android
   ./gradlew assembleRelease
   ```

4. **找到 APK**
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

5. **安装到手机**
   - 将 APK 传到手机
   - 点击安装

---

## 🔧 方法三：使用 Expo Development Client

### 如果上述方法都有问题，可以构建开发版本：

```bash
cd /Users/mac/my_gzh/zrby/pet-keeper-mobile

# 构建开发客户端
npx expo run:android
```

这会自动：
- 安装所有依赖
- 构建 APK
- 安装到连接的设备

---

## 📱 关于 USB 调试

### 开启开发者选项：

1. 设置 → 关于手机
2. 连续点击"版本号" 7次
3. 返回设置 → 开发者选项
4. 开启"USB 调试"

---

## 🌐 API 配置

**已配置的 API 地址**：
```
http://172.30.112.231:3001/api
```

**确保**：
- ✅ 手机和电脑在同一 WiFi
- ✅ 后端服务正在运行
- ✅ 防火墙允许连接

---

## 🎮 安装后测试

**测试账号**：
- Email: `test@example.com`
- Password: `password123`

**测试功能**：
- ✅ 用户注册登录
- ✅ 查看物种图鉴
- ✅ 创建宠物档案
- ✅ 添加饲养记录
- ✅ 发布社区帖子

---

## 📞 推荐操作

**最快的方法**：使用 Android Studio 打开项目并运行

```bash
# 在 Android Studio 中打开
open -a "Android Studio" /Users/mac/my_gzh/zrby/pet-keeper-mobile/android
```

---

## ❓ 常见问题

### Q: 构建失败怎么办？
**A**:
1. 清理项目：Build → Clean Project
2. 重新同步：File → Sync Project with Gradle Files
3. 检查 SDK 版本是否正确

### Q: 无法连接 API？
**A**:
1. 检查手机和电脑是否同一 WiFi
2. 尝试在手机浏览器访问：http://172.30.112.231:3001/api/health
3. 检查防火墙设置

### Q: 应用闪退？
**A**:
1. 查看 Android Studio 的 Logcat 日志
2. 检查 API 地址是否正确
3. 确保后端服务正常运行

---

**🎊 选择最适合您的方法开始吧！**
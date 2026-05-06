# 自然不语 - Flutter移动端应用

异宠饲养管理平台的Flutter移动端应用

## 技术栈

- **Flutter**: 3.41.1
- **Dart**: 3.11.0
- **状态管理**: Provider
- **HTTP客户端**: http package
- **本地存储**: shared_preferences

## 已实现功能

### 用户认证
- 用户注册
- 用户登录
- JWT Token认证
- 自动登录状态检查

### 页面结构
- 登录/注册页面
- 主页面（底部导航）
- 物种图鉴、宠物、社区、个人中心

## 运行应用

```bash
cd pet_keeper_mobile
flutter pub get
flutter run
```

## 构建APK

```bash
flutter build apk --release
```

输出: `build/app/outputs/flutter-apk/app-release.apk`

## API配置

修改 `lib/config/api_config.dart`:
- NAS生产环境: `http://100.84.59.9:3001/api` (Tailscale)
- 开发环境: `http://localhost:3001/api`

## 下一步开发

1. 物种列表和详情
2. 宠物管理CRUD
3. 社区功能
4. 图片上传

## 作者

自然不语团队
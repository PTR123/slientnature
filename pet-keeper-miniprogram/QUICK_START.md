# 🚀 小程序本地测试快速参考

## ✅ 环境已就绪

### 后端服务
- **地址**: http://localhost:3001
- **API**: http://localhost:3001/api
- **健康检查**: http://localhost:3001/api/health
- **状态**: ✅ 运行中

### 小程序配置
- **项目路径**: `/Users/mac/zrby/pet-keeper-miniprogram`
- **API 地址**: `http://localhost:3001/api` (已配置)
- **AppID**: 使用测试号

---

## 📋 快速开始（3 步）

### 1️⃣ 下载开发者工具
https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

### 2️⃣ 导入项目并配置
```
1. 打开微信开发者工具
2. 导入项目 → 选择目录 → /Users/mac/zrby/pet-keeper-miniprogram
3. AppID → 选择"测试号"
4. 详情 → 本地设置 → ✅ 不校验合法域名
```

### 3️⃣ 开始测试
点击"编译"按钮 → 在模拟器中测试

---

## 🧪 测试账号

**注册新用户：**
- 邮箱: test@example.com
- 用户名: testuser
- 密码: password123

**或者使用已有账号（如果运行了 seed）：**
- 邮箱: admin@example.com
- 密码: admin123

---

## 🔧 常用命令

### 检查后端状态
```bash
curl http://localhost:3001/api/health
```

### 重启后端
```bash
cd /Users/mac/zrby/pet-keeper-backend
npm run dev
```

### 填充测试数据
```bash
cd /Users/mac/zrby/pet-keeper-backend
npx tsx src/seed.ts
```

### 查看数据库
```bash
cd /Users/mac/zrby/pet-keeper-backend
npx prisma studio
```

---

## 📱 真机调试

### 局域网测试
1. 查看电脑 IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`
2. 修改 `app.js` 中的 `apiBaseUrl` 为 `http://你的IP:3001/api`
3. 真机调试 → 扫码测试

---

## 🎯 功能清单

### ✅ 已实现
- 登录页面
- 注册页面（框架）
- 首页展示
- API 工具类

### 🚧 待实现
- 宠物管理页面
- 物种图鉴页面
- 社区功能页面
- 个人中心

---

## 🔍 调试工具

### 控制台
- Console: 查看日志
- Network: 查看请求
- AppData: 查看数据
- Storage: 查看缓存

### 清除缓存
开发者工具 → 清缓存 → 清除全部

---

## 📚 文档参考

- **本地测试详细指南**: `LOCAL_TEST.md`
- **项目说明**: `README.md`
- **部署指南**: `DEPLOYMENT.md`
- **图片资源**: `images/README.md`

---

## ⚠️ 注意事项

1. **必须勾选"不校验合法域名"** 才能连接本地后端
2. **后端必须保持运行** 才能测试小程序
3. **修改代码后** 需要刷新或重新编译
4. **真机调试** 需要同一局域网或使用内网穿透

---

## 🐛 遇到问题？

1. 查看控制台错误信息
2. 检查 Network 面板的请求状态
3. 确认后端是否正常运行
4. 查看 `LOCAL_TEST.md` 详细说明

---

**🎉 开始开发你的小程序吧！**
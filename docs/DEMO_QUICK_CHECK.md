# ⚡ 客户演示快速检查清单

**演示前5分钟快速检查**

---

## ✅ 服务状态检查

```bash
# 检查服务运行
lsof -ti:3000,3001

# 应返回两个PID（前端和后端）
```

如果无返回，运行：
```bash
./scripts/demo-quick-start.sh
```

---

## 🔍 功能快速测试

### 1. API健康检查
访问: http://localhost:3001/api/health
期望: 显示 `{"status":"ok"...}`

### 2. 前端页面检查
访问: http://localhost:3000
期望: 显示"自然不语"首页

### 3. 登录测试
访问: http://localhost:3000
账号: `test@example.com`
密码: `password123`
期望: 成功登录，右上角显示用户名

### 4. 物种图鉴
访问: http://localhost:3000/species
期望: 显示至少3个物种（爬宠1个，昆虫2个）

### 5. 数据统计
```bash
sqlite3 pet-keeper-backend/prisma/dev.db "SELECT COUNT(*) FROM Species; SELECT COUNT(*) FROM User; SELECT COUNT(*) FROM Pet;"
# 期望输出: 3, 5, 2
```

---

## 📱 演示流程（15分钟）

1. **首页介绍**（1分钟）
   - 展示整体设计风格
   - 导览各个功能模块

2. **物种图鉴**（3分钟）
   - 演示分类筛选
   - 查看物种详情（温度、湿度、食性）

3. **登录演示**（1分钟）
   - 使用测试账号登录
   - 展示用户界面变化

4. **宠物档案**（3分钟）
   - 展示/创建宠物档案
   - 添加饲养记录

5. **社区功能**（2分钟）
   - 浏览帖子
   - 演示点赞评论

6. **总结**（1分钟）
   - 技术栈亮点
   - 核心价值

---

## 🔑 关键信息

### 访问地址
- Web: **http://localhost:3000**
- API: **http://localhost:3001**

### 测试账号
- Email: **test@example.com**
- Password: **password123**

### 演示物种
- 宽尾守宫（爬宠）
- 兰花螳螂（昆虫）

---

## ⚠️ 紧急修复

### 页面无法访问
```bash
# 重启所有服务
pkill -f "node.*pet-keeper"
cd pet-keeper-backend && npm run dev &
cd pet-keeper && npm run dev &
```

### 登录失败
```bash
# 重置数据库（谨慎使用）
cd pet-keeper-backend
rm prisma/dev.db
npx prisma db push
npx tsx src/seed.ts
```

### 数据缺失
```bash
# 重新导入种子数据
cd pet-keeper-backend
npx tsx src/seed.ts
```

---

## 💡 演示Tips

1. **浏览器准备**
   - 使用Chrome或Safari
   - 清除缓存（Ctrl+Shift+Delete）
   - 打开开发者工具查看网络请求

2. **演示节奏**
   - 先展示，再互动
   - 准备好演示数据
   - 预留客户提问时间

3. **备用方案**
   - 准备截图（以防服务中断）
   - 准备演示视频
   - 熟悉手动操作流程描述

---

**祝演示成功！🎉**

详细指南请查看: `docs/CLIENT_DEMO_PREPARATION.md`
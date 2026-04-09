# 🚀 开始部署 - 跟着做就可以了！

## ✅ 已完成准备工作

- ✅ 项目代码已准备好
- ✅ Railway 配置文件已创建
- ✅ Vercel 配置文件已创建
- ✅ 部署文档已准备好

---

## 📝 接下来按这个顺序操作

### 第 1 步：部署后端到 Railway（5分钟）

1. **打开 Railway**
   - 浏览器应该已打开：https://railway.app
   - 如果没有，点击上面链接

2. **注册/登录**
   - 点击 "Start a New Project"
   - 选择 "Login with GitHub"
   - 授权 Railway 访问你的 GitHub

3. **创建项目**
   - 点击 "+ New Project"
   - 选择 "Deploy from GitHub repo"
   - 找到并选择：`PTR123/ai-media-workflow`
   - 选择目录：`pet-keeper-backend`（重要！）
   - 点击 "Deploy"

4. **添加数据库**
   - 部署开始后，点击项目名称
   - 点击右上角 "+ New"
   - 选择 "Database" → "Add PostgreSQL"
   - 等待数据库创建（约30秒）

5. **设置环境变量**
   - 点击你的后端服务
   - 选择 "Variables" 标签
   - 点击 "Raw Editor"
   - 粘贴以下内容：

```env
NODE_ENV=production
JWT_SECRET=petkeeper-super-secret-2026
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

   - 点击 "Update Variables"

6. **等待部署完成**
   - Railway 会自动重新部署
   - 大约需要 2-3 分钟
   - 看到 "SUCCESS" 表示部署成功

7. **获取后端地址**
   - 点击后端服务
   - 选择 "Settings" 标签
   - 找到 "Domains" 部分
   - 点击 "Generate Domain"
   - 你会得到类似：`https://pet-keeper-backend-production.up.railway.app`

8. **测试后端**
   - 复制你的域名
   - 在浏览器访问：`https://你的域名/api/health`
   - 应该看到：`{"status":"ok","message":"PetKeeper API is running"}`

---

### 第 2 步：部署前端到 Vercel（3分钟）

1. **打开终端，运行部署命令**

```bash
cd /Users/mac/my_gzh/zrby/pet-keeper
vercel
```

2. **按提示操作**
   - **Set up and deploy?** → 输入 `y`
   - **Which scope?** → 选择你的账号
   - **Link to existing project?** → 输入 `n`
   - **Project name?** → 输入 `pet-keeper`（或自定义）
   - **In which directory?** → 按回车（当前目录）
   - **Want to override settings?** → 输入 `n`

3. **等待部署**
   - Vercel 会自动构建和部署
   - 大约 1-2 分钟

4. **设置环境变量**
   - 部署完成后，终端会显示网址
   - 访问：https://vercel.com
   - 进入你的项目
   - 点击 "Settings" → "Environment Variables"
   - 添加：
     - **Name**: `VITE_API_URL`
     - **Value**: `https://你的railway域名/api`
   - 点击 "Save"

5. **重新部署**
   - 回到 "Deployments" 标签
   - 找到最新的部署
   - 点击右侧 "..." → "Redeploy"

---

### 第 3 步：测试部署（2分钟）

1. **访问你的前端**
   - Vercel 给你的网址，类似：
   - `https://pet-keeper.vercel.app`

2. **测试功能**
   - 注册一个新账号
   - 登录
   - 查看物种图鉴
   - 创建宠物档案

3. **如果一切正常** 🎉
   - 恭喜！部署成功！
   - 你的应用已经在互联网上可访问

---

## 🔧 如果遇到问题

### Q: Railway 部署失败？
- 查看部署日志
- 检查是否选择了正确的目录：`pet-keeper-backend`
- 确认环境变量设置正确

### Q: 前端无法连接后端？
- 检查 Vercel 环境变量 `VITE_API_URL` 是否正确
- 确认后端 API 地址可以在浏览器访问
- 尝试重新部署前端

### Q: 数据库连接失败？
- 确认已添加 PostgreSQL 数据库
- Railway 会自动设置 `DATABASE_URL`
- 检查变量是否使用：`${{Postgres.DATABASE_URL}}`

---

## 📱 部署成功后

**你会得到：**
- 前端地址：`https://你的项目.vercel.app`
- 后端地址：`https://你的项目.up.railway.app/api`

**可以分享给全世界访问！**

---

## 🎓 完整文档

详细步骤请查看：
- `/Users/mac/my_gzh/zrby/CLOUD_DEPLOY_STEPS.md`
- `/Users/mac/my_gzh/zrby/DEPLOYMENT_GUIDE.md`

---

**现在开始吧！跟着上面的步骤，大约 10 分钟就能完成部署！** 🚀
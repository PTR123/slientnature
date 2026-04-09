# 🚀 部署到新仓库：自然不语app

## ✅ 仓库已创建

**GitHub 仓库地址**：
```
https://github.com/PTR123/ziranbuyu-app
```

---

## 📝 完成部署的步骤

### 步骤 1：推送代码到新仓库（网络恢复后）

打开终端，执行：

```bash
cd /Users/mac/my_gzh/zrby

# 推送到新仓库
git push origin main

# 如果提示输入密码，使用 GitHub Personal Access Token
# 创建 token: https://github.com/settings/tokens
```

**如果推送失败，使用 GitHub Desktop：**
1. 下载 GitHub Desktop: https://desktop.github.com
2. 登录你的 GitHub 账号
3. 打开项目文件夹
4. 点击 "Push origin" 按钮

---

### 步骤 2：部署后端到 Railway

#### 2.1 访问 Railway

打开：https://railway.app

#### 2.2 创建项目

1. 点击 **"Start a New Project"**
2. 选择 **"Login with GitHub"**
3. 授权 Railway 访问 GitHub

#### 2.3 部署后端

1. 点击 **"+ New Project"**
2. 选择 **"Deploy from GitHub repo"**
3. 选择仓库：`PTR123/ziranbuyu-app`
4. 选择目录：`pet-keeper-backend`
5. 点击 **"Deploy"**

#### 2.4 添加 PostgreSQL 数据库

1. 点击项目名称
2. 点击右上角 **"+ New"**
3. 选择 **"Database"** → **"Add PostgreSQL"**
4. 等待创建（约 30 秒）

#### 2.5 设置环境变量

1. 点击后端服务
2. 选择 **"Variables"** 标签
3. 点击 **"Raw Editor"**
4. 粘贴：

```env
NODE_ENV=production
JWT_SECRET=ziranbuyu-app-secret-key-2026
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

5. 点击 **"Update Variables"**

#### 2.6 获取后端地址

1. 点击后端服务
2. 选择 **"Settings"** 标签
3. 找到 **"Domains"**
4. 点击 **"Generate Domain"**
5. 复制得到的地址，例如：
   ```
   https://pet-keeper-backend-production.up.railway.app
   ```

#### 2.7 测试后端

访问：`https://你的域名/api/health`

应该看到：
```json
{"status":"ok","message":"PetKeeper API is running"}
```

---

### 步骤 3：部署前端到 Vercel

#### 3.1 部署命令

在终端执行：

```bash
cd /Users/mac/my_gzh/zrby/pet-keeper
vercel
```

#### 3.2 按提示操作

- **Set up and deploy?** → 输入 `y`
- **Which scope?** → 选择你的账号
- **Link to existing project?** → 输入 `n`
- **Project name?** → 输入 `ziranbuyu-app`（或 `pet-keeper`）
- **In which directory?** → 按回车
- **Want to override settings?** → 输入 `n`

#### 3.3 设置环境变量

1. 访问：https://vercel.com
2. 进入你的项目
3. 点击 **"Settings"** → **"Environment Variables"**
4. 添加：
   - **Name**: `VITE_API_URL`
   - **Value**: `https://你的railway域名/api`
5. 点击 **"Save"**

#### 3.4 重新部署

1. 回到 **"Deployments"**
2. 找到最新部署
3. 点击 **"..."** → **"Redeploy"**

#### 3.5 访问前端

你会得到类似地址：
```
https://ziranbuyu-app.vercel.app
```

---

### 步骤 4：测试部署

1. **访问前端网址**
2. **测试功能**：
   - 注册账号
   - 登录
   - 查看物种图鉴
   - 创建宠物档案

---

## 🔧 如果网络问题持续

### 方法 A：使用 GitHub 网页上传

1. 访问：https://github.com/PTR123/ziranbuyu-app
2. 点击 **"uploading an existing file"**
3. 拖拽整个项目文件夹上传
4. 点击 **"Commit changes"**

### 方法 B：使用代理或 VPN

```bash
# 如果使用代理
git config --global http.proxy http://127.0.0.1:7890
git push origin main

# 推送完成后取消代理
git config --global --unset http.proxy
```

### 方法 C：使用 GitHub CLI

```bash
# 使用 GitHub CLI 推送
gh auth login
gh repo clone PTR123/ziranbuyu-app
# 然后手动复制文件
```

---

## 📱 移动端配置

部署完成后，更新移动端 API 地址：

```bash
# 编辑 PetKeeperMobile/.env
API_URL=https://你的railway域名/api
```

---

## 📊 部署成功后

**你会得到：**

- **前端**: `https://你的项目.vercel.app`
- **后端**: `https://你的项目.up.railway.app/api`
- **仓库**: `https://github.com/PTR123/ziranbuyu-app`

**应用名称**: 自然不语 - 异宠饲养管理平台

---

## 🆘 需要帮助？

如果遇到问题：

1. **检查网络连接** - 尝试访问 github.com
2. **查看部署日志** - Railway 和 Vercel 都有详细日志
3. **测试 API** - 确保后端地址可访问
4. **检查环境变量** - 确认所有变量设置正确

---

**当前状态**：
- ✅ GitHub 仓库已创建：`PTR123/ziranbuyu-app`
- ⏳ 等待推送代码（网络恢复后）
- 📝 部署步骤已准备好

**下一步**：网络恢复后执行 `git push origin main`，然后按上述步骤部署！
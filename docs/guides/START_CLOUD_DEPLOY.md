# 🚀 开始部署 - 代码已推送成功！

## ✅ 仓库状态

- **仓库名称**: 自然不语app (ziranbuyu-app)
- **GitHub 地址**: https://github.com/PTR123/ziranbuyu-app
- **代码状态**: ✅ 已推送成功
- **分支**: main
- **提交数**: 97 个文件

---

## 🌐 开始云平台部署

### 第 1 步：部署后端到 Railway（5分钟）

#### 1.1 访问 Railway

打开：https://railway.app

#### 1.2 登录

1. 点击 **"Start a New Project"**
2. 选择 **"Login with GitHub"**
3. 授权 Railway 访问你的 GitHub

#### 1.3 创建项目

1. 点击 **"+ New Project"**
2. 选择 **"Deploy from GitHub repo"**
3. 找到并选择：**`PTR123/ziranbuyu-app`**
4. 选择根目录（默认）
5. 点击 **"Deploy"**

**注意**：Railway 会自动检测到 `pet-keeper-backend` 目录

#### 1.4 添加 PostgreSQL 数据库

1. 项目创建后，点击项目名称
2. 点击右上角 **"+ New"**
3. 选择 **"Database"** → **"Add PostgreSQL"**
4. 等待数据库创建（约 30 秒）

#### 1.5 设置环境变量

1. 点击后端服务
2. 选择 **"Variables"** 标签
3. 点击 **"Raw Editor"**
4. 粘贴以下内容：

```env
NODE_ENV=production
JWT_SECRET=ziranbuyu-app-secret-2026-change-in-production
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

5. 点击 **"Update Variables"**
6. Railway 会自动重新部署

#### 1.6 获取后端地址

1. 点击后端服务
2. 选择 **"Settings"** 标签
3. 向下滚动到 **"Domains"** 部分
4. 点击 **"Generate Domain"**
5. 你会得到一个地址，例如：
   ```
   https://ziranbuyu-app-backend.up.railway.app
   ```

**复制这个地址，后面需要用到！**

#### 1.7 测试后端

在浏览器访问：`https://你的域名/api/health`

应该看到：
```json
{"status":"ok","message":"PetKeeper API is running"}
```

✅ **后端部署完成！**

---

### 第 2 步：部署前端到 Vercel（3分钟）

#### 2.1 在终端执行部署命令

```bash
cd /Users/mac/my_gzh/zrby/pet-keeper
vercel
```

#### 2.2 按提示操作

终端会问几个问题，按以下方式回答：

```
? Set up and deploy "~/my_gzh/zrby/pet-keeper"? [Y/n]
→ 输入 y，按回车

? Which scope do you want to deploy to?
→ 选择你的账号（PTR123），按回车

? Link to existing project? [y/N]
→ 输入 n，按回车

? What's your project's name?
→ 输入 ziranbuyu-app（或自定义），按回车

? In which directory is your code located?
→ 直接按回车（默认 ./）

? Want to modify these settings?
→ 输入 n，按回车
```

#### 2.3 等待部署

Vercel 会自动：
- 安装依赖
- 构建项目
- 部署到全球 CDN

大约 1-2 分钟完成。

#### 2.4 设置环境变量

1. 部署完成后，访问：https://vercel.com
2. 进入你的项目
3. 点击 **"Settings"** 标签
4. 选择 **"Environment Variables"**
5. 点击 **"Add"**，添加变量：
   - **Name**: `VITE_API_URL`
   - **Value**: `https://你的railway域名/api`
   - 例如：`https://ziranbuyu-app-backend.up.railway.app/api`
6. 点击 **"Save"**

#### 2.5 重新部署

添加环境变量后需要重新部署：

1. 点击 **"Deployments"** 标签
2. 找到最新的部署
3. 点击右侧的 **"..."**
4. 选择 **"Redeploy"**
5. 点击 **"Redeploy"** 确认

#### 2.6 获取前端地址

部署完成后，你会得到一个地址：

```
https://ziranbuyu-app.vercel.app
```

或类似地址。

✅ **前端部署完成！**

---

### 第 3 步：测试应用（2分钟）

#### 3.1 访问前端

在浏览器打开你的 Vercel 地址

#### 3.2 测试功能

1. **注册账号**
   - 点击"注册"
   - 填写邮箱、用户名、密码
   - 点击注册

2. **登录**
   - 使用刚才注册的账号登录

3. **查看物种图鉴**
   - 浏览物种列表
   - 点击查看详情

4. **创建宠物档案**
   - 添加你的宠物信息

✅ **如果以上功能都正常，部署成功！**

---

## 🎉 部署完成！

### 你的应用地址

- **前端**: `https://你的项目.vercel.app`
- **后端**: `https://你的项目.up.railway.app/api`
- **GitHub**: `https://github.com/PTR123/ziranbuyu-app`

### 应用名称

**自然不语 - 异宠饲养管理平台**

---

## 📱 更新移动端配置

部署完成后，更新移动端 API 地址：

```bash
cd /Users/mac/my_gzh/zrby/PetKeeperMobile
# 编辑 .env 文件
nano .env
```

修改为：
```env
API_URL=https://你的railway域名/api
```

重新构建 APK 即可连接线上环境。

---

## 🔄 后续更新

以后修改代码后：

```bash
# 提交更改
git add .
git commit -m "更新说明"
git push origin main

# Railway 和 Vercel 会自动重新部署
```

---

## 🆘 遇到问题？

### 后端部署失败
- 检查是否选择了正确的仓库
- 确认环境变量设置正确
- 查看 Railway 部署日志

### 前端无法连接后端
- 确认 Vercel 环境变量 `VITE_API_URL` 正确
- 检查后端 API 是否可访问
- 尝试重新部署前端

### 数据库连接失败
- 确认已添加 PostgreSQL
- 检查环境变量是否使用 `${{Postgres.DATABASE_URL}}`

---

**现在开始部署吧！按照上面的步骤，大约 10 分钟完成！** 🚀
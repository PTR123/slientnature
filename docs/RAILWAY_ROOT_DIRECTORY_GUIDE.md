# Railway设置Root Directory完整步骤

## 📍 为什么需要设置Root Directory？

因为你的GitHub仓库 `PTR123/pet-keeper-app` 包含完整项目：
```
pet-keeper-app/
├── pet-keeper/          # 前端代码
├── pet-keeper-backend/  # 后端代码 ⭐
├── docs/
└── 其他文件

Railway需要知道要部署哪个目录
必须设置为: pet-keeper-backend
```

---

## 🔧 设置Root Directory步骤（图文说明）

### 方法1: 在创建项目时设置（推荐）

#### Step 1: 选择GitHub仓库
```
Railway Dashboard:
点击 "New Project"
选择 "Deploy from GitHub repo"
找到并点击: PTR123/pet-keeper-app
```

#### Step 2: 点击项目名称进入设置
```
创建后会自动开始构建
点击项目名称（如: "web-service-..."）
进入项目详情页面
```

#### Step 3: 进入Settings页面
```
项目详情页面顶部标签:
Deployments | Metrics | Logs | Variables | Settings

点击 "Settings" 标签
```

#### Step 4: 找到Root Directory设置
```
Settings页面往下滚动
找到 "Root Directory" 部分

显示可能是:
Root Directory: ./ (默认)

点击 "Edit" 或直接修改
```

#### Step 5: 设置为pet-keeper-backend
```
输入框中输入:
pet-keeper-backend

点击 "Save" 或 "Update"
```

#### Step 6: 重新部署
```
设置保存后，Railway会提示重新部署

点击 "Redeploy" 按钮
或
Deployments标签 > 最新部署 > Redeploy

等待重新构建（2-3分钟）
```

---

### 方法2: 在项目创建后修改（如果已创建）

如果你的项目已经在构建中：

#### Step 1: 停止当前构建
```
Railway Dashboard > 你的项目

点击右上角 "..." 三点菜单
选择 "Stop Deployment"
```

#### Step 2: 进入Settings
```
点击项目名称
点击 "Settings" 标签
```

#### Step 3: 找到并修改Root Directory
```
滚动找到 "Root Directory"
当前显示: ./ 或为空

点击 "Edit"
输入: pet-keeper-backend
点击 "Save"
```

#### Step 4: 重新部署
```
回到 "Deployments" 标签
点击 "Redeploy"
```

---

## 📸 截图位置指引

### Railway Dashboard布局
```
顶部:
[Dashboard] [Projects] [Templates] [Docs]

左侧项目列表:
┌─────────────────────┐
│ Your Projects       │
│ ├─ pet-keeper-app   │ ← 点击这里
│ └───────────────────┘
```

### 项目详情页面布局
```
顶部标签栏:
[Deployments] [Metrics] [Logs] [Variables] [Settings] ← 点击这里

Settings页面:
┌─────────────────────────┐
│ General                 │
│  Name: web-service...   │
│                         │
│ Source                  │
│  GitHub: PTR123/...     │
│                         │
│ Root Directory          │ ← 找到这里
│  ./ [Edit]              │ ← 点击Edit
│                         │
│ Build Configuration     │
│  Builder: NIXPACKS      │
└─────────────────────────┘
```

---

## ⚠️ 重要提示

### Root Directory设置时机
```
最佳时机: 项目创建后立即设置
原因: 避免构建失败浪费时间

顺序:
1. 创建项目（会自动开始构建）
2. 立即进入Settings设置Root Directory
3. Redeploy重新构建
```

### 如果忘记设置会怎样？
```
Railway会尝试部署根目录
找不到package.json等文件
构建失败: "Error creating build plan"

解决方法:
设置Root Directory: pet-keeper-backend
Redeploy
```

---

## ✅ 设置成功的标志

设置正确后，你会看到：

### Logs中显示
```
Building in /app/pet-keeper-backend
Installing dependencies...
npm install

Build command:
npm run build

Start command:
npm run start

Deploy SUCCESSFUL ✓
```

### 项目状态
```
Status: RUNNING
Health: HEALTHY
URL: https://xxx.up.railway.app
```

---

## 🎯 具体操作流程总结

### 快速步骤（你现在应该执行的）

```
1. Railway网页已打开
2. 找到你的项目（PTR123/pet-keeper-app）
3. 点击项目名称进入详情
4. 点击顶部 "Settings" 标签
5. 滚动找到 "Root Directory"
6. 点击 "Edit" 按钮
7. 输入: pet-keeper-backend
8. 点击 "Save"
9. 回到 "Deployments" 标签
10. 点击 "Redeploy"
11. 等待2-3分钟构建完成
```

---

## 💡 如果找不到Root Directory设置

### 可能的位置名称
```
Railway可能显示为:
- "Root Directory"
- "Source Directory"
- "Working Directory"
- "Project Root"

都在 Settings 页面
如果找不到，尝试滚动到底部
```

### 如果Settings页面很简洁
```
有些Railway版本界面不同
尝试:
1. 点击项目右上角 "..." 或齿轮图标
2. 选择 "Settings" 或 "Configure"
3. 查找Root Directory设置
```

---

## 🆘 如果还是找不到

### 备用方案：删除重建
```
1. Settings > Delete Project
2. New Project > PTR123/pet-keeper-app
3. 创建时立即进入Settings设置Root Directory
4. Redeploy
```

---

## 立即执行

**现在请按这个顺序操作**：

1. ✅ Railway Dashboard找到你的项目
2. ✅ 点击项目名称
3. ✅ 点击Settings标签
4. ✅ 找到Root Directory
5. ✅ Edit改为: `pet-keeper-backend`
6. ✅ Save保存
7. ✅ Deployments > Redeploy

完成后看到构建成功告诉我！

需要我给你截图指引吗？或者你告诉我当前看到什么界面？🚀
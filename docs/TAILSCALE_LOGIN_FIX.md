# Tailscale 登录问题解决方案

## 问题：登录时跳转到 Apple ID

### 原因
Tailscale macOS 应用默认会尝试使用 Apple ID 作为登录方式。

---

## 解决方案

### 方案1: 通过网页注册账号(推荐)

**步骤**:
```
1. 打开浏览器访问: https://tailscale.com
2. 点击右上角 "Get Started" 或 "Sign Up"
3. 选择其他登录方式:
   - Google 账号
   - GitHub 账号
   - Microsoft 账号
   - GitLab 贏号
   - 或使用邮箱注册

4. 注册完成后，回到 macOS Tailscale 应用
5. 点击登录时选择 "Sign in with..."
6. 选择你刚才使用的登录方式
```

---

### 方案2: 在应用中切换登录方式

**步骤**:
```
1. 打开 Tailscale 应用
2. 点击菜单栏的 Tailscale 图标
3. 选择 "Settings" 或 "Account"
4. 点击 "Sign Out" (如果有已登录账号)
5. 点击 "Log In"
6. 在登录界面点击 "Other sign in options"
7. 选择:
   - Sign in with Google
   - Sign in with GitHub
   - Sign in with Microsoft
   - Sign in with email
```

---

### 方案3: 使用 CLI 登录(最简单)

```bash
# 使用 CLI 登录(不会跳转到 Apple ID)
tailscale login

# 会显示一个链接,在浏览器中打开
# 例如: https://login.tailscale.com/a/xxxxxxxxxxxx

# 在浏览器中选择你的登录方式(Google/GitHub等)

# 登录成功后 CLI 会自动完成
```

---

### 方案4: 使用 Auth Key(适合自动化)

```bash
# 1. 登录 Tailscale 网页管理面板
https://login.tailscale.com

# 2. 进入 Settings > Keys
# 3. 生成一个 Auth Key
# 4. 使用 Auth Key 连接:

tailscale up --authkey=tskey-auth-xxxxxxxxxxxx

# 这种方式不需要交互式登录
```

---

## 推荐操作流程

### 最简单方法(使用 CLI)

```bash
# 1. 打开终端执行
tailscale login

# 2. 复制输出的链接并在浏览器打开
# 输出类似:
# To authenticate, visit:
#	https://login.tailscale.com/a/0123456789abcdef

# 3. 在浏览器中选择登录方式(推荐 GitHub 或 Google)
# 4. 登录成功
# 5. 回到终端,会看到成功消息

# 6. 验证连接
tailscale status
```

---

### 如果还是跳转 Apple ID

可能原因和解决:

```
检查是否已经有 Apple ID session:
- Safari 或其他浏览器可能自动使用 Apple ID
- 解决方法:
  1. 使用隐私模式打开浏览器
  2. 或使用其他浏览器(Chrome/Firefox)
  3. 清除浏览器 Apple ID session
```

---

## 完整安装步骤(从零开始)

```bash
# 1. 安装 Tailscale
brew install --cask tailscale

# 2. 打开应用
open /Applications/Tailscale.app

# 3. 使用 CLI 登录(避免 Apple ID)
tailscale login

# 4. 在浏览器中选择登录方式
#    推荐 GitHub (方便后续 GitHub + Vercel 整合)

# 5. 登录成功后验证
tailscale status

# 6. 查看你的 IP
tailscale ip

# 输出类似:
# 100.101.102.103
```

---

## 注册 Tailscale 账号(如果还没账号)

```
1. 访问: https://tailscale.com/signup
2. 选择登录方式:
   - GitHub 账号(推荐,可以和 Vercel 使用同一账号)
   - Google 账号
   - Microsoft 账号
   - 邢箱注册

3. 完成注册(免费)

4. 回到 macOS 应用登录
```

---

## 使用 GitHub 账号的优势

推荐使用 GitHub 账号登录 Tailscale:
- ✅ 和 Vercel 可以使用同一账号
- ✅ 方便后续整合 GitHub + Vercel + Tailscale
- ✅ 不需要额外注册
- ✅ GitHub 账号对开发者更熟悉

---

## 常见问题

**Q: 我不想用 Apple ID,有其他选择吗?**
A: 有很多选择: GitHub、Google、Microsoft、GitLab、邮箱

**Q: 为什么强制 Apple ID?**
A: 不是强制,是 Safari 浏览器自动使用 Apple ID session

**Q: 如何切换登录方式?**
A: 使用 `tailscale login` CLI 命令,在浏览器中自由选择

**Q: 可以多个设备用同一账号吗?**
A: 可以,免费账号支持最多 100 个设备

**Q: NAS 和 Mac 需要用同一账号吗?**
A: 是的,必须在同一 Tailscale 网络才能通信

---

## 下一步

登录成功后:

```bash
# 查看你的 Tailscale IP
tailscale ip

# 记下这个 IP,例如: 100.101.102.103

# 后续部署时:
# 1. NAS 也用同一账号登录 Tailscale
# 2. NAS 会获得另一个 IP,例如: 100.102.103.104
# 3. Mac 可以直接 SSH: ssh admin@100.102.103.104
```

---

## 立即执行

现在请执行:
```bash
tailscale login
```

然后在浏览器中选择 GitHub 或 Google 登录,避免 Apple ID!
# 前端页面排查指南

## 当前状态

✅ **前端服务已重启**
- 服务地址: http://localhost:3000
- 状态: 正常运行
- HTTP状态: 200 OK

## 排查步骤

### 1. 清除浏览器缓存

**Chrome/Edge:**
```
1. 按 Cmd+Shift+Delete (Mac) 或 Ctrl+Shift+Delete (Windows)
2. 选择"缓存的图片和文件"
3. 时间范围选择"过去一小时"
4. 点击"清除数据"
```

**或者使用硬刷新:**
```
Mac: Cmd+Shift+R
Windows: Ctrl+Shift+R
```

### 2. 检查浏览器控制台

打开浏览器开发者工具：
```
Mac: Cmd+Option+I
Windows: F12 或 Ctrl+Shift+I
```

检查 Console 标签页是否有错误：
- ❌ 红色错误信息
- ⚠️ 黄色警告信息

### 3. 检查Network标签

在开发者工具中点击 Network 标签：
1. 刷新页面
2. 查看是否有红色的请求（失败）
3. 检查 CSS/JS 文件是否加载

### 4. 验证服务状态

运行以下命令检查：

```bash
# 检查前端服务
curl -I http://localhost:3000

# 检查后端服务
curl -I http://localhost:3001/api/health
```

### 5. 重启服务

如果问题依然存在：

```bash
# 停止所有Node进程
pkill -f "next dev"

# 重新启动前端
cd pet-keeper
npm run dev

# 重新启动后端
cd ../pet-keeper-backend
npm run dev
```

## 常见问题

### 问题1: 白屏

**原因:** JavaScript 加载失败
**解决:**
1. 检查控制台错误
2. 清除浏览器缓存
3. 检查浏览器是否支持ES6

### 问题2: 样式丢失

**原因:** CSS 加载失败
**解决:**
1. 检查 Network 标签
2. 验证 CSS 文件是否存在
3. 清除缓存重试

### 问题3: 页面加载慢

**原因:** 网络或编译问题
**解决:**
1. 检查网络连接
2. 等待编译完成
3. 重启开发服务器

### 问题4: 登录状态丢失

**原因:** LocalStorage 被清除
**解决:**
1. 重新登录
2. 检查浏览器设置
3. 检查隐私模式

## 页面访问测试

测试以下页面是否正常：

- [ ] 首页: http://localhost:3000/
- [ ] 物种图鉴: http://localhost:3000/species
- [ ] 登录: http://localhost:3000/login
- [ ] 管理后台: http://localhost:3000/admin

## 截图报告

如果问题依然存在，请提供：
1. 浏览器截图
2. 控制台错误信息
3. Network 标签截图
4. 浏览器和版本信息

## 快速修复命令

```bash
# 一键重启所有服务
pkill -f "next dev"
pkill -f "node.*backend"
sleep 2
cd /Users/mac/zrby/pet-keeper && npm run dev &
cd /Users/mac/zrby/pet-keeper-backend && npm run dev &
```

## 联系支持

如果以上步骤都无法解决问题，请提供：
- 浏览器类型和版本
- 操作系统版本
- 具体的错误信息
- 截图或录屏
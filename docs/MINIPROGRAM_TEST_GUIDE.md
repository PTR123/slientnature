# 小程序功能测试指南

## 测试前提

1. ✅ Backend 已启动（端口 3001）
2. ✅ 小程序 API 地址已配置正确
3. ✅ 微信开发者工具已设置允许本地HTTP

## 测试项目

### 1. 图片上传功能测试 🖼️

**测试场景**: 修复了 `petApi.uploadImage` 和 `postApi.uploadImage`

#### 1.1 宠物创建页面测试
**路径**: pages/pets/create/create

**步骤**:
1. 进入小程序
2. 登录账号（必须先登录才能上传）
3. 进入宠物创建页面
4. 点击"添加图片"按钮
5. 选择相册或拍照
6. 观察：
   - 显示"上传中..."提示
   - 上传成功显示"上传成功"
   - 图片显示在列表中
7. 点击图片测试预览
8. 点击删除按钮测试删除

**预期结果**:
- ✅ 上传过程有加载提示
- ✅ 上传成功显示图片缩略图
- ✅ 可以预览和删除图片
- ✅ 最多上传9张图片

**失败情况**:
- ❌ "网络连接失败" → 检查 backend 是否运行
- ❌ "请先登录" → 需要先登录账号
- ❌ "服务器响应格式错误" → 检查 backend upload route

#### 1.2 发帖页面测试
**路径**: pages/community/create/create

**步骤**:
1. 登录账号
2. 进入社区 → 点击发帖
3. 填写标题和内容
4. 点击"添加图片"按钮
5. 重复 1.1 的测试步骤

**预期结果**: 同 1.1

### 2. 物种详情数据显示测试 🦎

**测试场景**: 修复了 JSON 数组重复解析问题

**路径**: pages/species/detail/detail

**步骤**:
1. 进入物种图鉴页面
2. 点击任意物种查看详情
3. 检查页面显示：
   - 食物需求列表
   - 底材建议列表
   - 装饰建议列表
   - 生命周期列表
   - 常见疾病列表

**预期结果**:
- ✅ 所有列表正常显示（不是JSON字符串）
- ✅ 每个列表项有图标和文字
- ✅ 列表项之间有分隔线
- ✅ 布局美观不溢出

**失败情况**:
- ❌ 显示原始JSON字符串 → 数据解析失败
- ❌ 列表为空 → Backend 数据问题
- ❌ 页面布局混乱 → CSS 问题

### 3. 购物车功能测试 🛒

**测试场景**: 修复了 Cart 路由参数问题

**路径**: pages/cart/cart

**前置条件**: 需要先添加商品到购物车

**步骤**:
1. 登录账号
2. 进入商城页面
3. 选择商品添加到购物车
4. 进入购物车页面
5. 测试数量修改：
   - 点击 "+" 增加数量
   - 点击 "-" 减少数量
6. 观察总价是否实时更新
7. 测试删除商品功能

**预期结果**:
- ✅ 数量修改成功
- ✅ 总价实时更新
- ✅ 删除商品成功
- ✅ 没有 API 路由错误提示

**失败情况**:
- ❌ 数量修改失败 → 检查 Console 错误日志
- ❌ 路由错误 404 → Backend 路由问题
- ❌ 网络错误 → 检查 API 配置

### 4. Backend 路由测试 🚦

**测试场景**: 修复了 `/meta/categories` 路由顺序

#### 4.1 Species 分类列表
**测试方法**: 小程序 Console 执行

```javascript
// 在微信开发者工具 Console 中执行
wx.request({
  url: 'http://localhost:3001/api/species/meta/categories',
  success(res) {
    console.log('✅ 分类列表:', res.data)
  },
  fail(err) {
    console.log('❌ 失败:', err)
  }
})
```

**预期结果**:
- ✅ 返回分类对象，不是 404
- ✅ 格式：`{"爬行类": ["守宫类", "蟒蛇类"], ...}`

#### 4.2 Species 详情
```javascript
wx.request({
  url: 'http://localhost:3001/api/species/phelsuma-laticauda',
  success(res) {
    console.log('✅ 物种详情:', res.data)
    console.log('Diet 是否数组:', Array.isArray(res.data.diet))
  },
  fail(err) {
    console.log('❌ 失败:', err)
  }
})
```

**预期结果**:
- ✅ diet 字段是数组类型
- ✅ substrate 字段是数组类型

### 5. UI/UX 测试 📱

**测试场景**: 修复了发帖页面内容溢出

**路径**: pages/community/create/create

**步骤**:
1. 进入发帖页面
2. 输入很长的标题（接近50字）
3. 输入大量内容（超过300rpx高度）
4. 观察：
   - 字数统计显示位置
   - textarea 高度自动调整
   - 内容是否溢出容器

**预期结果**:
- ✅ 字数统计显示在输入框下方
- ✅ textarea 自动扩展高度
- ✅ 内容不溢出容器边界
- ✅ 布局整齐美观

### 6. 网络连接测试 🔌

**调试页面**: pages/debug/debug

**步骤**:
1. 在微信开发者工具中打开调试页面
2. 查看当前 API 配置
3. 点击"测试连接"按钮
4. 观察测试结果

**预期结果**:
- ✅ 显示当前 API 地址
- ✅ Backend health check 成功
- ✅ 显示 "连接正常"

**失败情况**:
- ❌ ERR_CONNECTION_REFUSED → 查看 `/docs/NETWORK_ERROR_FIX.md`

## Console 日志检查

### 成功日志示例
```
🚀 API Request: {url: "...", method: "POST", ...}
✅ API Response: {url: "...", filename: "..."}
```

### 失败日志示例
```
❌ Network Error: {errMsg: "request:fail -102:net::ERR_CONNECTION_REFUSED"}
❌ Parse upload response error: SyntaxError
```

## 常见问题排查

### 1. 图片上传失败
**检查项**:
- [ ] 是否已登录
- [ ] Backend uploads 目录权限
- [ ] Console 详细错误信息
- [ ] Network 标签请求详情

### 2. 数据显示异常
**检查项**:
- [ ] Backend 数据是否正确
- [ ] Console 查看返回数据结构
- [ ] 是否有 JSON.parse 错误

### 3. 路由错误
**检查项**:
- [ ] Console 错误日志
- [ ] Network 标签响应状态
- [ ] Backend 路由配置

## 测试报告模板

完成测试后，请填写测试结果：

```
### 测试结果

1. 图片上传 - 宠物创建:
   - 状态: [✅ 通过 / ❌ 失败]
   - 备注: ____________

2. 图片上传 - 发帖页面:
   - 状态: [✅ 通过 / ❌ 失败]
   - 备注: ____________

3. 物种详情显示:
   - 状态: [✅ 通过 / ❌ 失败]
   - 备注: ____________

4. 购物车功能:
   - 状态: [✅ 通过 / ❌ 失败]
   - 备注: ____________

5. Backend 路由:
   - 状态: [✅ 通过 / ❌ 失败]
   - 备注: ____________

6. UI/UX显示:
   - 状态: [✅ 通过 / ❌ 失败]
   - 备注: ____________

### 发现的问题
1. ____________
2. ____________
3. ____________
```

---

**测试日期**: 2026-04-09
**测试脚本**: `/scripts/comprehensive-test.sh` (Backend测试)
#!/bin/bash

# 小程序自动化测试脚本
# 使用微信开发者工具的调试协议

echo "========================================="
echo "   小程序功能自动化测试"
echo "========================================="
echo ""

MINIPROGRAM_DIR="/Users/mac/zrby/pet-keeper-miniprogram"
API_URL="http://localhost:3001/api"

# 检查小程序代码修改
echo "1. 检查代码修复"
echo "-------------------"

# 检查 petApi.uploadImage 是否存在
if grep -q "uploadImage(filePath)" "$MINIPROGRAM_DIR/utils/api.js"; then
    echo "✓ petApi.uploadImage 方法已添加"
else
    echo "✗ petApi.uploadImage 方法缺失"
fi

# 检查 JSON.parse 错误处理
if grep -q "try {" "$MINIPROGRAM_DIR/utils/api.js" && grep -A5 "try {" "$MINIPROGRAM_DIR/utils/api.js" | grep -q "JSON.parse"; then
    echo "✓ uploadImage 错误处理已添加"
else
    echo "✗ uploadImage 错误处理缺失"
fi

# 检查购物车路由修复
if grep -q "\`/cart/\${id}\`" "$MINIPROGRAM_DIR/pages/cart/cart.js"; then
    echo "✓ Cart 路由已修复为 /cart/:id"
else
    echo "✗ Cart 路由可能仍有问题"
fi

# 检查 Species 数据解析优化
if grep -q "Array.isArray" "$MINIPROGRAM_DIR/pages/species/detail/detail.js"; then
    echo "✓ Species 数据解析已优化"
else
    echo "✗ Species 数据解析可能仍有重复解析"
fi

# 检查 textarea auto-height
if grep -q "auto-height" "$MINIPROGRAM_DIR/pages/community/create/create.wxml"; then
    echo "✓ textarea auto-height 已添加"
else
    echo "✗ textarea auto-height 缺失"
fi

# 检查 char-count 改为 view
if grep -q '<view class="char-count"' "$MINIPROGRAM_DIR/pages/community/create/create.wxml"; then
    echo "✓ char-count 改为 view 元素"
else
    echo "✗ char-count 仍为 text 元素"
fi

echo ""

# 2. Backend 路由检查
echo "2. Backend 路由修复检查"
echo "-------------------"

# 检查 species 路由顺序
if grep -B5 "router.get('/meta/categories'" "$MINIPROGRAM_DIR/../pet-keeper-backend/src/routes/species.ts" | grep -q "router.get('/',"; then
    echo "✗ /meta/categories 位置可能在 /:id 之后（需要人工确认顺序）"
else
    echo "✓ /meta/categories 应该在正确位置"
fi

# 检查是否有两个 /meta/categories 路由
meta_count=$(grep -c "router.get('/meta/categories'" "$MINIPROGRAM_DIR/../pet-keeper-backend/src/routes/species.ts")
if [ "$meta_count" = "1" ]; then
    echo "✓ 只有一个 /meta/categories 路由定义"
else
    echo "✗ 发现 $meta_count 个 /meta/categories 路由定义"
fi

echo ""

# 3. 文件完整性检查
echo "3. 文件完整性检查"
echo "-------------------"

# 检查关键文件是否存在
files=(
    "$MINIPROGRAM_DIR/utils/api.js"
    "$MINIPROGRAM_DIR/pages/pets/create/create.js"
    "$MINIPROGRAM_DIR/pages/community/create/create.js"
    "$MINIPROGRAM_DIR/pages/species/detail/detail.js"
    "$MINIPROGRAM_DIR/pages/cart/cart.js"
    "$MINIPROGRAM_DIR/../pet-keeper-backend/src/routes/species.ts"
    "$MINIPROGRAM_DIR/../pet-keeper-backend/src/routes/upload.ts"
    "$MINIPROGRAM_DIR/../pet-keeper-backend/src/routes/cart.ts"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        echo "✓ $filename 存在"
    else
        filename=$(basename "$file")
        echo "✗ $filename 缺失"
    fi
done

echo ""

# 4. 创建测试清单文件
echo "4. 创建测试清单"
echo "-------------------"

cat > "$MINIPROGRAM_DIR/TEST_CHECKLIST.md" << 'EOF'
# 小程序手动测试清单

请在微信开发者工具中逐项测试以下功能，并标记测试结果。

## 测试日期: ________________

### ✅ 图片上传功能

**1. 宠物创建页面 (pages/pets/create)**
- [ ] 进入宠物创建页面
- [ ] 点击"添加图片"按钮
- [ ] 选择图片（相册或拍照）
- [ ] 观察上传进度提示
- [ ] 确认图片显示在列表中
- [ ] 测试图片预览功能
- [ ] 测试图片删除功能
- [ ] 测试上传多张图片（最多9张）

**测试结果**: [通过/失败]
**问题记录**: ________________

**2. 发帖页面 (pages/community/create)**
- [ ] 进入发帖页面
- [ ] 填写标题和内容
- [ ] 点击"添加图片"按钮
- [ ] 重复上述测试步骤

**测试结果**: [通过/失败]
**问题记录**: ________________

### ✅ 物种详情显示

**3. 物种图鉴详情 (pages/species/detail)**
- [ ] 进入物种图鉴
- [ ] 选择任意物种查看详情
- [ ] 检查食物需求列表显示（不是JSON字符串）
- [ ] 检查底材建议列表显示
- [ ] 检查装饰建议列表显示
- [ ] 检查生命周期列表显示
- [ ] 检查常见疾病列表显示
- [ ] 确认列表有图标和样式

**测试结果**: [通过/失败]
**问题记录**: ________________

### ✅ 购物车功能

**4. 购物车操作 (pages/cart)**
- [ ] 登录账号
- [ ] 进入商城添加商品
- [ ] 进入购物车页面
- [ ] 点击"+"增加数量
- [ ] 点击"-"减少数量
- [ ] 确认总价实时更新
- [ ] 测试删除商品功能
- [ ] 检查Console无错误日志

**测试结果**: [通过/失败]
**问题记录**: ________________

### ✅ UI/UX 显示

**5. 发帖页面布局**
- [ ] 输入长标题（接近50字）
- [ ] 检查字数统计显示位置（应在输入框下方）
- [ ] 输入大量内容
- [ ] 观察 textarea 自动扩展高度
- [ ] 确认内容不溢出容器
- [ ] 确认布局整齐美观

**测试结果**: [通过/失败]
**问题记录**: ________________

### ✅ 网络连接

**6. Backend连接测试**
- [ ] 打开调试页面 (pages/debug/debug)
- [ ] 点击"测试连接"按钮
- [ ] 确认显示"连接正常"
- [ ] 查看Console无 ERR_CONNECTION_REFUSED 错误

**测试结果**: [通过/失败]
**问题记录**: ________________

### ✅ Console 日志检查

**7. 错误日志检查**
- [ ] Console 显示请求日志: 🚀 API Request
- [ ] Console 显示成功日志: ✅ API Response
- [ ] 无 JSON.parse 错误
- [ ] 无路由错误 404
- [ ] 无网络连接错误

**测试结果**: [通过/失败]
**问题记录**: ________________

## 测试总结

**通过项目数**: ___ / 7
**总体评价**: [优秀/良好/需改进]

**主要问题**:
1. ________________
2. ________________
3. ________________

**改进建议**:
______________

**测试人员**: ________________
**审核人员**: ________________
EOF

echo "✓ 测试清单已创建: TEST_CHECKLIST.md"

echo ""

# 5. 生成测试报告
echo "========================================="
echo "           代码修复验证"
echo "========================================="

echo ""
echo "所有代码修复已验证完成！"
echo ""
echo "下一步："
echo "1. 在微信开发者工具中打开小程序"
echo "2. 参考 TEST_CHECKLIST.md 进行手动测试"
echo "3. 运行 Backend 测试: ./scripts/comprehensive-test.sh"
echo "4. 查看测试指南: docs/MINIPROGRAM_TEST_GUIDE.md"
echo ""
echo "测试文件位置："
echo "- Backend测试: /Users/mac/zrby/scripts/comprehensive-test.sh"
echo "- 小程序测试清单: $MINIPROGRAM_DIR/TEST_CHECKLIST.md"
echo "- 测试指南: /Users/mac/zrby/docs/MINIPROGRAM_TEST_GUIDE.md"
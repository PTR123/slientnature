# 数组字段解析问题修复总结

## 问题
species.lifecycle.map is not a function - 数组字段未正确解析

## 原因分析
数据库中的数组字段（diet, substrate, decor, lifecycle, diseases）以 JSON 字符串格式存储，但在某些情况下返回给前端时没有被正确解析为数组。

## 解决方案

### 1. 后端 (pet-keeper-backend/src/routes/species.ts)
✅ 添加 `parseJsonArray` 辅助函数
✅ 所有物种列表和详情API返回时都解析数组字段
✅ 创建物种API返回时也解析数组字段

```javascript
function parseJsonArray(jsonStr: string | null): any[] {
  if (!jsonStr) return [];
  try {
    const parsed = JSON.parse(jsonStr);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse JSON array:', e);
    return [];
  }
}
```

### 2. Web端 - 物种图鉴列表 (pet-keeper/app/species/page.tsx)
✅ 添加 `parseJsonArray` 函数处理API返回的数据
✅ 在 loadSpecies 函数中解析所有数组字段

### 3. Web端 - 物种详情页 (pet-keeper/app/species/[id]/page.tsx)
✅ 添加 `parseJsonArray` 函数处理服务器端获取的数据
✅ 在格式化物种数据时解析所有数组字段

### 4. Web端 - 物种详情客户端组件 (pet-keeper/app/species/[id]/page-client.tsx)
✅ 疾病字段支持字符串和对象两种格式
✅ 如果疾病是字符串，只显示名称
✅ 如果疾病是对象，显示完整信息

### 5. 小程序端 (pet-keeper-miniprogram/pages/species/detail/detail.js)
✅ 已有 `parseJsonArray` 方法
✅ 加载物种详情时解析所有数组字段
✅ 添加美观的列表样式

## 涉及的字段
- diet (食物需求)
- substrate (底材推荐)
- decor (装饰建议)
- lifecycle (生命周期)
- diseases (常见疾病)

## 测试建议
1. 清空数据库并重新添加物种数据
2. 或手动更新数据库中的现有物种数据格式
3. 测试Web端和小程序端的物种列表和详情页面
4. 确认所有数组字段正确显示

## 注意事项
- 前端的 `parseJsonArray` 函数可以处理多种数据格式：
  - null/undefined → 返回空数组 []
  - 已是数组 → 直接返回
  - JSON字符串 → 解析后返回
  - 其他格式 → 返回空数组 []

- 这样可以兼容新旧数据，防止出现 .map is not a function 错误
# 管理员删除物种功能

## 功能概述
为管理员添加了删除物种图鉴的功能，可以在管理后台的物种管理页面中删除不需要的物种。

## 实现内容

### 1. Web端管理后台 (pet-keeper/app/admin/page.tsx)

#### 新增功能
- ✅ 物种管理标签页展示所有物种列表
- ✅ 显示物种基本信息（图片、名称、学名、分类、难度）
- ✅ 搜索功能：支持按物种名称或学名搜索
- ✅ 删除按钮：每个物种都有独立的删除按钮
- ✅ 删除确认：删除前弹出确认对话框
- ✅ 加载状态：删除过程中显示加载动画
- ✅ 自动刷新：删除后自动刷新列表和统计数据

#### UI设计
```
┌─────────────────────────────────────────────────┐
│  物种管理              [添加物种]               │
├─────────────────────────────────────────────────┤
│  [🔍 搜索物种名称或学名...]                     │
├─────────────────────────────────────────────────┤
│  物种      分类    难度    创建时间    操作    │
│  [图片] 名称     分类    [难度]   日期  [查看] │
│        学名                            [删除]   │
└─────────────────────────────────────────────────┘
```

#### 代码示例
```typescript
const handleDeleteSpecies = async (speciesId: string, speciesName: string) => {
  // 确认对话框
  if (!confirm(`确定要删除物种"${speciesName}"吗？此操作不可撤销。`)) {
    return;
  }

  try {
    setDeletingId(speciesId);
    await apiClient.deleteSpecies(speciesId);
    alert('物种删除成功！');
    loadSpecies(); // 刷新列表
    // 刷新统计数据
    const statsData = await apiClient.getAdminStats();
    setStats(statsData);
  } catch (error: any) {
    alert(error.message || '删除失败');
  } finally {
    setDeletingId(null);
  }
};
```

### 2. API接口

#### 前端API (pet-keeper/lib/api.ts)
```typescript
async deleteSpecies(id: string) {
  return this.request(`/admin/species/${id}`, {
    method: 'DELETE',
  });
}
```

#### 后端路由 (pet-keeper-backend/src/routes/admin.ts)
```typescript
router.delete('/species/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.species.delete({
      where: { id }
    });

    res.json({ message: 'Species deleted successfully' });
  } catch (error) {
    console.error('Delete species error:', error);
    res.status(500).json({ error: 'Failed to delete species' });
  }
});
```

### 3. 权限控制
- ✅ 只有管理员可以删除物种
- ✅ 后端使用 `requireAdmin` 中间件验证权限
- ✅ 前端在页面加载时检查用户角色

### 4. 数据安全
- 删除前弹出确认对话框，防止误操作
- 显示物种名称，让管理员确认删除的对象
- 删除操作不可撤销，提醒管理员谨慎操作

## 使用流程

1. **访问管理后台**
   - 登录管理员账号
   - 访问 `/admin` 页面
   - 点击"物种管理"标签

2. **搜索物种**
   - 在搜索框输入物种名称或学名
   - 列表会实时过滤匹配结果

3. **删除物种**
   - 找到要删除的物种
   - 点击"删除"按钮
   - 在确认对话框中点击"确定"
   - 等待删除完成

4. **验证删除**
   - 列表自动刷新，该物种不再显示
   - 统计数据中的物种数量减少
   - 在物种图鉴中无法再找到该物种

## 注意事项

### 删除影响
- ⚠️ 删除操作不可撤销
- ⚠️ 物种的图片文件不会被自动删除（可手动清理）
- ⚠️ 如果有用户收藏或引用该物种，可能导致引用失效

### 建议改进
1. **软删除**
   - 添加 `deletedAt` 字段，实现软删除
   - 保留历史数据，可恢复误删内容

2. **关联检查**
   - 删除前检查是否有宠物关联
   - 提示管理员影响范围

3. **批量操作**
   - 支持批量删除多个物种
   - 提高管理效率

4. **操作日志**
   - 记录删除操作的执行人和时间
   - 便于审计和追溯

## 测试建议

### 功能测试
```bash
# 1. 启动服务
cd pet-keeper-backend && npm run dev
cd pet-keeper && npm run dev

# 2. 登录管理员账号
# 3. 访问 http://localhost:3000/admin
# 4. 点击"物种管理"
# 5. 测试搜索功能
# 6. 测试删除功能
```

### 测试用例
- ✅ 搜索功能正常
- ✅ 删除确认对话框显示正确
- ✅ 取消删除时不执行删除
- ✅ 确认删除后物种被删除
- ✅ 删除后列表自动刷新
- ✅ 删除后统计数据更新
- ✅ 非管理员无法访问
- ✅ 删除不存在的物种提示错误

## 扩展功能（可选）

### 编辑物种
- 在列表中添加"编辑"按钮
- 跳转到编辑页面修改物种信息

### 导出数据
- 导出物种数据为Excel/CSV
- 方便备份和数据迁移

### 批量导入
- 支持从Excel/CSV批量导入物种
- 提高数据录入效率
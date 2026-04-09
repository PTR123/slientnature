'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import {
  Folder,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    sortOrder: 0,
    isActive: true
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadCategories();
    }
  }, [user]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(res => res.json());
      setCategories(data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (categoryId: string, isActive: boolean) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/admin/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive: !isActive })
      });
      loadCategories();
    } catch (error: any) {
      alert(error.message || '操作失败');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('确定要删除这个分类吗？')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/admin/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '删除失败');
      }

      loadCategories();
    } catch (error: any) {
      alert(error.message || '删除分类失败');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      sortOrder: category.sortOrder,
      isActive: category.isActive
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      alert('请填写分类名称');
      return;
    }

    try {
      const url = editingCategory
        ? `${process.env.NEXT_PUBLIC_API_URL}/categories/admin/${editingCategory.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/categories/admin`;

      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '操作失败');
      }

      setShowForm(false);
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        image: '',
        sortOrder: 0,
        isActive: true
      });
      loadCategories();
    } catch (error: any) {
      alert(error.message || '操作失败');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      sortOrder: 0,
      isActive: true
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto"></div>
          <p className="mt-4 text-forest-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-cream-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-forest-900 flex items-center gap-3">
              <Folder className="h-8 w-8" />
              分类管理
            </h1>
            <p className="text-forest-600 mt-2">管理商品分类信息</p>
          </div>
          <Button
            size="lg"
            className="bg-forest-600 hover:bg-forest-700"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            添加分类
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingCategory ? '编辑分类' : '添加新分类'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    分类名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                    placeholder="请输入分类名称"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    分类描述
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                    placeholder="分类描述"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    分类图片
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                    placeholder="图片URL"
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="分类图片"
                      className="mt-2 w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-forest-700 mb-2">
                      排序
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 mt-6">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-5 h-5 rounded border-cream-300"
                      />
                      <span className="text-forest-700">启用分类</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 justify-end">
                  <Button variant="outline" onClick={handleCancel}>
                    取消
                  </Button>
                  <Button type="submit" className="bg-forest-600 hover:bg-forest-700">
                    {editingCategory ? '更新' : '创建'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Categories List */}
        <Card>
          <CardHeader>
            <CardTitle>分类列表</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map(category => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 bg-cream-50 rounded-lg border border-cream-200 hover:bg-cream-100"
                >
                  <div className="flex items-center gap-4">
                    {category.image && (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-forest-900">
                          {category.name}
                        </h3>
                        <Badge variant={category.isActive ? 'default' : 'secondary'}>
                          {category.isActive ? '启用' : '禁用'}
                        </Badge>
                      </div>
                      {category.description && (
                        <p className="text-sm text-forest-600 mt-1">
                          {category.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-sm text-forest-500">
                        <span>排序: {category.sortOrder}</span>
                        <span>•</span>
                        <span>{category.productCount} 个商品</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleActive(category.id, category.isActive)}
                    >
                      {category.isActive ? (
                        <EyeOff className="h-4 w-4 text-orange-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-green-600" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="text-center py-12 text-forest-600">
                  暂无分类
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
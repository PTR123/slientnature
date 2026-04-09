'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { Package, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

export default function CreateProductPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    content: '',
    categoryId: '',
    images: '[]',
    price: '',
    originalPrice: '',
    stock: '0',
    unit: '件',
    isHot: false,
    isNew: false,
    isRecommend: false,
    isActive: true
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);

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
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(res => res.json());
      setCategories(data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleAddImage = () => {
    const url = prompt('请输入图片URL');
    if (url) {
      const newImages = [...imageUrls, url];
      setImageUrls(newImages);
      setFormData({ ...formData, images: JSON.stringify(newImages) });
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImages);
    setFormData({ ...formData, images: JSON.stringify(newImages) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.categoryId || !formData.price) {
      alert('请填写必填信息');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          content: formData.content,
          categoryId: formData.categoryId,
          images: formData.images,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          stock: parseInt(formData.stock),
          unit: formData.unit,
          isHot: formData.isHot,
          isNew: formData.isNew,
          isRecommend: formData.isRecommend,
          isActive: formData.isActive
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '创建失败');
      }

      router.push('/admin/products');
    } catch (error: any) {
      alert(error.message || '创建商品失败');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/products">
            <Button variant="ghost" size="lg">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-forest-900 flex items-center gap-3">
              <Package className="h-8 w-8" />
              添加新商品
            </h1>
            <p className="text-forest-600 mt-2">创建新的商品信息</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 商品名称 */}
              <div>
                <label className="block text-sm font-medium text-forest-700 mb-2">
                  商品名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="请输入商品名称"
                  required
                />
              </div>

              {/* 商品分类 */}
              <div>
                <label className="block text-sm font-medium text-forest-700 mb-2">
                  商品分类 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  required
                >
                  <option value="">请选择分类</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* 商品简述 */}
              <div>
                <label className="block text-sm font-medium text-forest-700 mb-2">
                  商品简述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="简短描述商品特点"
                  rows={3}
                  required
                />
              </div>

              {/* 商品详情 */}
              <div>
                <label className="block text-sm font-medium text-forest-700 mb-2">
                  商品详情
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="详细描述商品信息（富文本内容）"
                  rows={6}
                />
              </div>

              {/* 商品图片 */}
              <div>
                <label className="block text-sm font-medium text-forest-700 mb-2">
                  商品图片
                </label>
                <div className="flex gap-4 mb-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative w-32 h-32">
                      <img
                        src={url}
                        alt={`商品图片 ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border border-cream-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="w-32 h-32 border-2 border-dashed border-cream-300 rounded-lg flex items-center justify-center hover:border-forest-500"
                  >
                    <div className="text-center">
                      <div className="text-2xl">+</div>
                      <div className="text-sm text-forest-600">添加图片</div>
                    </div>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>价格与库存</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* 销售价格 */}
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    销售价格 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                {/* 原价 */}
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    原价
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* 库存 */}
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    库存数量
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                    placeholder="0"
                  />
                </div>

                {/* 单位 */}
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    单位
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                    placeholder="件"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>商品标签</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                {/* 热门 */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isHot}
                    onChange={(e) => setFormData({ ...formData, isHot: e.target.checked })}
                    className="w-5 h-5 rounded border-cream-300"
                  />
                  <span className="text-forest-700">热门商品</span>
                </label>

                {/* 新品 */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="w-5 h-5 rounded border-cream-300"
                  />
                  <span className="text-forest-700">新品上架</span>
                </label>

                {/* 推荐 */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isRecommend}
                    onChange={(e) => setFormData({ ...formData, isRecommend: e.target.checked })}
                    className="w-5 h-5 rounded border-cream-300"
                  />
                  <span className="text-forest-700">推荐商品</span>
                </label>

                {/* 上架 */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-cream-300"
                  />
                  <span className="text-forest-700">立即上架</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="mt-8 flex gap-4 justify-end">
            <Link href="/admin/products">
              <Button variant="outline" size="lg">
                取消
              </Button>
            </Link>
            <Button
              type="submit"
              size="lg"
              className="bg-forest-600 hover:bg-forest-700"
              disabled={loading}
            >
              <Save className="h-5 w-5 mr-2" />
              {loading ? '保存中...' : '保存商品'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter
} from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  content: string;
  categoryId: string;
  images: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sales: number;
  unit: string;
  isHot: boolean;
  isNew: boolean;
  isRecommend: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const productsData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=100`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(res => res.json());

      const categoriesData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(res => res.json());

      setProducts(productsData.products || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (productId: string, isActive: boolean) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/admin/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive: !isActive })
      });
      loadData();
    } catch (error: any) {
      alert(error.message || '操作失败');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('确定要删除这个商品吗？')) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/admin/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      loadData();
    } catch (error: any) {
      alert(error.message || '删除失败');
    }
  };

  const filteredProducts = products.filter(product => {
    if (searchKeyword && !product.name.includes(searchKeyword) && !product.description.includes(searchKeyword)) {
      return false;
    }
    if (filterCategory && product.categoryId !== filterCategory) {
      return false;
    }
    if (filterStatus === 'active' && !product.isActive) {
      return false;
    }
    if (filterStatus === 'inactive' && product.isActive) {
      return false;
    }
    return true;
  });

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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-forest-900 flex items-center gap-3">
              <Package className="h-8 w-8" />
              商品管理
            </h1>
            <p className="text-forest-600 mt-2">管理所有商品信息</p>
          </div>
          <Link href="/admin/products/create">
            <Button size="lg" className="bg-forest-600 hover:bg-forest-700">
              <Plus className="h-5 w-5 mr-2" />
              添加商品
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-forest-900">{products.length}</div>
              <p className="text-sm text-forest-600">总商品数</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {products.filter(p => p.isActive).length}
              </div>
              <p className="text-sm text-forest-600">上架商品</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">
                {products.filter(p => !p.isActive).length}
              </div>
              <p className="text-sm text-forest-600">下架商品</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
              <p className="text-sm text-forest-600">商品分类</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-forest-400" />
                  <input
                    type="text"
                    placeholder="搜索商品名称或描述..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
              >
                <option value="">全部分类</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
              >
                <option value="">全部状态</option>
                <option value="active">已上架</option>
                <option value="inactive">已下架</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>商品列表</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cream-200">
                    <th className="text-left py-3 px-4 font-semibold text-forest-700">商品信息</th>
                    <th className="text-left py-3 px-4 font-semibold text-forest-700">分类</th>
                    <th className="text-left py-3 px-4 font-semibold text-forest-700">价格</th>
                    <th className="text-left py-3 px-4 font-semibold text-forest-700">库存</th>
                    <th className="text-left py-3 px-4 font-semibold text-forest-700">销量</th>
                    <th className="text-left py-3 px-4 font-semibold text-forest-700">状态</th>
                    <th className="text-left py-3 px-4 font-semibold text-forest-700">标签</th>
                    <th className="text-right py-3 px-4 font-semibold text-forest-700">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="border-b border-cream-100 hover:bg-cream-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {JSON.parse(product.images)[0] && (
                            <img
                              src={JSON.parse(product.images)[0]}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <div className="font-medium text-forest-900">{product.name}</div>
                            <div className="text-sm text-forest-600 truncate max-w-xs">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{product.category.name}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-forest-900 font-medium">¥{product.price}</div>
                        {product.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            ¥{product.originalPrice}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className={product.stock < 10 ? 'text-red-600' : 'text-forest-900'}>
                          {product.stock} {product.unit}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-forest-900">{product.sales}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={product.isActive ? 'default' : 'secondary'}>
                          {product.isActive ? '已上架' : '已下架'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 flex-wrap">
                          {product.isHot && <Badge variant="destructive" className="text-xs">热门</Badge>}
                          {product.isNew && <Badge variant="default" className="text-xs">新品</Badge>}
                          {product.isRecommend && <Badge variant="outline" className="text-xs">推荐</Badge>}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleActive(product.id, product.isActive)}
                          >
                            {product.isActive ? (
                              <EyeOff className="h-4 w-4 text-orange-600" />
                            ) : (
                              <Eye className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-forest-600">
                  没有找到符合条件的商品
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
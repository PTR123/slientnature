'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, ShoppingCart, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';

interface Product {
  id: string;
  name: string;
  description: string;
  images: string;
  price: number;
  originalPrice?: number;
  stock: number;
  unit: string;
  isHot: boolean;
  isNew: boolean;
  isRecommend: boolean;
  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  description?: string;
  productCount: number;
}

export default function ShopPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=100`).then(r => r.json()),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`).then(r => r.json())
      ]);
      setProducts(productsRes.products || []);
      setCategories(categoriesRes || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    if (searchKeyword && !product.name.includes(searchKeyword) && !product.description.includes(searchKeyword)) {
      return false;
    }
    if (filterCategory && product.category.id !== filterCategory) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto"></div>
          <p className="mt-4 text-forest-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-cream-50">
      {/* Header */}
      <div className="bg-white border-b border-cream-200">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-8 w-8 text-forest-600" />
            <h1 className="font-display text-3xl font-bold text-forest-950">宠物商城</h1>
          </div>
          <p className="text-forest-600">为您的宠物选购优质产品</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-forest-900">{products.length}</div>
              <p className="text-sm text-forest-600">全部商品</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{products.filter(p => p.isHot).length}</div>
              <p className="text-sm text-forest-600">热门商品</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{products.filter(p => p.isNew).length}</div>
              <p className="text-sm text-forest-600">新品上架</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">{categories.length}</div>
              <p className="text-sm text-forest-600">商品分类</p>
            </CardContent>
          </Card>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-forest-900 mb-4">商品分类</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map(category => (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  filterCategory === category.id ? 'ring-2 ring-forest-600' : ''
                }`}
                onClick={() => setFilterCategory(filterCategory === category.id ? '' : category.id)}
              >
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-forest-900 mb-1">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-forest-600 mb-2">{category.description}</p>
                  )}
                  <p className="text-xs text-forest-500">{category.productCount} 个商品</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-forest-400" />
                  <input
                    type="text"
                    placeholder="搜索商品..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
              </div>
              {filterCategory && (
                <button
                  onClick={() => setFilterCategory('')}
                  className="px-4 py-2 bg-forest-100 text-forest-700 rounded-lg hover:bg-forest-200"
                >
                  清除筛选
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all">
              <div className="relative h-48 bg-cream-100">
                {JSON.parse(product.images)[0] && (
                  <img
                    src={JSON.parse(product.images)[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  {product.isHot && (
                    <Badge variant="destructive" className="text-xs">热门</Badge>
                  )}
                  {product.isNew && (
                    <Badge variant="default" className="text-xs">新品</Badge>
                  )}
                  {product.isRecommend && (
                    <Badge variant="outline" className="text-xs bg-white">推荐</Badge>
                  )}
                </div>
              </div>
              <CardContent className="pt-4">
                <div className="mb-2">
                  <Badge variant="outline" className="text-xs">{product.category.name}</Badge>
                </div>
                <h3 className="font-semibold text-forest-900 mb-1">{product.name}</h3>
                <p className="text-sm text-forest-600 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-forest-900">¥{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ¥{product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-forest-500">
                    库存: {product.stock} {product.unit}
                  </div>
                </div>
                <Link href={`/shop/${product.id}`}>
                  <button className="w-full mt-4 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700 transition-colors">
                    查看详情
                  </button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-forest-300 mx-auto mb-4" />
            <p className="text-forest-600">没有找到符合条件的商品</p>
          </div>
        )}
      </div>
    </div>
  );
}
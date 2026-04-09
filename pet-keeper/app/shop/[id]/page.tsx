'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, Minus, Plus, ArrowLeft, Heart, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';

interface Product {
  id: string;
  name: string;
  description: string;
  content: string;
  images: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sales: number;
  unit: string;
  isHot: boolean;
  isNew: boolean;
  isRecommend: boolean;
  category: {
    id: string;
    name: string;
    description?: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  const loadProduct = async () => {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}`).then(r => r.json());
      setProduct(data);
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setAddingToCart(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId: product?.id,
          quantity
        })
      });

      if (!response.ok) {
        throw new Error('添加失败');
      }

      alert('已添加到购物车！');
    } catch (error: any) {
      alert(error.message || '添加购物车失败');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

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

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="h-16 w-16 text-forest-300 mx-auto mb-4" />
          <p className="text-forest-600 mb-4">商品不存在或已下架</p>
          <Link href="/shop">
            <Button>返回商城</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = JSON.parse(product.images);

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-cream-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/shop">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回商城
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <Card>
              <CardContent className="pt-6">
                <div className="relative aspect-square bg-cream-100 rounded-lg overflow-hidden mb-4">
                  {images[0] && (
                    <img
                      src={images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {product.isHot && (
                      <Badge variant="destructive">热门</Badge>
                    )}
                    {product.isNew && (
                      <Badge variant="default">新品</Badge>
                    )}
                    {product.isRecommend && (
                      <Badge variant="outline" className="bg-white">推荐</Badge>
                    )}
                  </div>
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((img: string, index: number) => (
                      <div key={index} className="aspect-square bg-cream-100 rounded-lg overflow-hidden">
                        <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Product Info */}
          <div>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <Badge variant="outline" className="mb-2">{product.category.name}</Badge>
                  <h1 className="text-3xl font-bold text-forest-900 mb-2">{product.name}</h1>
                  <p className="text-forest-600">{product.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-forest-900">¥{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">¥{product.originalPrice}</span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <div className="text-sm text-red-600 font-medium">
                      优惠价：节省 ¥{(product.originalPrice - product.price).toFixed(2)}
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-forest-600">销量</span>
                    <span className="font-medium text-forest-900">{product.sales} {product.unit}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-forest-600">库存</span>
                    <span className="font-medium text-forest-900">{product.stock} {product.unit}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-forest-600">单位</span>
                    <span className="font-medium text-forest-900">{product.unit}</span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-forest-700 mb-2">数量</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-cream-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="px-4 py-2 hover:bg-cream-100 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-6 py-2 font-medium text-forest-900">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="px-4 py-2 hover:bg-cream-100 transition-colors"
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-sm text-forest-600">
                      总价: <span className="font-bold text-forest-900">¥{(product.price * quantity).toFixed(2)}</span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={addingToCart || product.stock === 0}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {addingToCart ? '添加中...' : '加入购物车'}
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            {product.content && (
              <Card>
                <CardHeader>
                  <CardTitle>商品详情</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-forest-700 whitespace-pre-wrap">
                    {product.content}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-forest-900 mb-6">相关推荐</h2>
          <p className="text-forest-600 text-center py-8">更多商品即将上架...</p>
        </div>
      </div>
    </div>
  );
}
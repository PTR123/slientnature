'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Trash2, Minus, Plus, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  selected: boolean;
  product: {
    id: string;
    name: string;
    images: string[];
    price: number;
    originalPrice?: number;
    stock: number;
    unit: string;
    isActive: boolean;
  };
  itemTotal: number;
}

interface CartData {
  items: CartItem[];
  totalAmount: number;
  selectedAmount: number;
  itemCount: number;
  selectedCount: number;
}

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadCart();
  }, [user]);

  const loadCart = async () => {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(r => r.json());
      setCartData(data);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ quantity })
      });
      loadCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleToggleSelected = async (itemId: string, selected: boolean) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ selected })
      });
      loadCart();
    } catch (error) {
      console.error('Failed to toggle selected:', error);
    }
  };

  const handleSelectAll = async (selected: boolean) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/select-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ selected })
      });
      loadCart();
    } catch (error) {
      console.error('Failed to select all:', error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('确定要删除这个商品吗？')) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      loadCart();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleCheckout = async () => {
    if (!cartData || cartData.selectedCount === 0) {
      alert('请先选择要购买的商品');
      return;
    }

    // 跳转到结算页面
    router.push('/checkout');
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

  if (!cartData || cartData.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest-50 to-cream-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-24 w-24 text-forest-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-forest-900 mb-2">购物车是空的</h2>
          <p className="text-forest-600 mb-6">快去挑选心仪的商品吧！</p>
          <Link href="/shop">
            <Button size="lg">去逛逛</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-cream-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-forest-900 flex items-center gap-3">
            <ShoppingCart className="h-8 w-8" />
            我的购物车
          </h1>
          <p className="text-forest-600 mt-2">共 {cartData.itemCount} 种商品</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Select All */}
            <Card>
              <CardContent className="pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cartData.selectedCount === cartData.itemCount}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-5 h-5 rounded border-cream-300"
                  />
                  <span className="font-medium text-forest-900">全选</span>
                  <span className="text-sm text-forest-600">
                    已选择 {cartData.selectedCount} / {cartData.itemCount} 种商品
                  </span>
                </label>
              </CardContent>
            </Card>

            {/* Cart Item List */}
            {cartData.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    {/* Checkbox */}
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={(e) => handleToggleSelected(item.id, e.target.checked)}
                        className="w-5 h-5 rounded border-cream-300"
                      />
                    </label>

                    {/* Product Image */}
                    <div className="w-24 h-24 bg-cream-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.images[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link href={`/shop/${item.productId}`}>
                            <h3 className="font-semibold text-forest-900 hover:text-forest-600">
                              {item.product.name}
                            </h3>
                          </Link>
                          {!item.product.isActive && (
                            <Badge variant="secondary" className="mt-1">已下架</Badge>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-forest-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Price */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-forest-900">
                            ¥{item.product.price}
                          </span>
                          {item.product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ¥{item.product.originalPrice}
                            </span>
                          )}
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-cream-300 rounded-lg">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1 hover:bg-cream-100"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-1 font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 hover:bg-cream-100"
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <span className="text-sm text-forest-600">
                            库存: {item.product.stock}
                          </span>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right mt-2">
                        <span className="text-sm text-forest-600">小计: </span>
                        <span className="font-bold text-forest-900">¥{item.itemTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Clear Cart */}
            <div className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  if (!confirm('确定要清空购物车吗？')) return;
                  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/clear`, {
                    method: 'DELETE',
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                  });
                  loadCart();
                }}
              >
                清空购物车
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>订单摘要</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-forest-600">
                    已选商品 ({cartData.selectedCount} 种)
                  </span>
                  <span className="font-medium text-forest-900">
                    ¥{cartData.selectedAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-forest-600">运费</span>
                  <span className="font-medium text-green-600">免运费</span>
                </div>
                <hr className="border-cream-200" />
                <div className="flex justify-between">
                  <span className="font-semibold text-forest-900">合计</span>
                  <span className="text-xl font-bold text-forest-900">
                    ¥{cartData.selectedAmount.toFixed(2)}
                  </span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={cartData.selectedCount === 0 || processing}
                >
                  {processing ? '处理中...' : '去结算'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Link href="/shop">
                  <Button variant="outline" className="w-full" size="lg">
                    继续购物
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, CreditCard, MapPin, User, Phone, ArrowLeft } from 'lucide-react';
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
    unit: string;
    stock: number;
    isActive: boolean;
  };
  itemTotal: number;
}

interface CartData {
  items: CartItem[];
  selectedAmount: number;
  selectedCount: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    remark: ''
  });

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

      // 只获取选中的商品
      const selectedItems = data.items.filter((item: CartItem) => item.selected);
      if (selectedItems.length === 0) {
        alert('请先选择要购买的商品');
        router.push('/cart');
        return;
      }

      setCartData({
        ...data,
        items: selectedItems
      });
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.receiverName || !formData.receiverPhone || !formData.receiverAddress) {
      alert('请填写完整的收货信息');
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(formData.receiverPhone)) {
      alert('请输入正确的手机号');
      return;
    }

    if (!cartData || cartData.items.length === 0) {
      alert('购物车中没有选中的商品');
      return;
    }

    // 检查商品状态和库存
    for (const item of cartData.items) {
      if (!item.product.isActive) {
        alert(`商品 ${item.product.name} 已下架`);
        return;
      }
      if (item.product.stock < item.quantity) {
        alert(`商品 ${item.product.name} 库存不足`);
        return;
      }
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          cartItemIds: cartData.items.map(item => item.id),
          receiverName: formData.receiverName,
          receiverPhone: formData.receiverPhone,
          receiverAddress: formData.receiverAddress,
          remark: formData.remark
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '创建订单失败');
      }

      const order = await response.json();
      alert('订单创建成功！');
      router.push(`/orders/${order.id}`);
    } catch (error: any) {
      alert(error.message || '创建订单失败');
    } finally {
      setSubmitting(false);
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

  if (!cartData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-cream-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回购物车
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-forest-900 flex items-center gap-3">
            <CreditCard className="h-8 w-8" />
            确认订单
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Receiver Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    收货信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-forest-700 mb-2">
                      收货人 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-forest-400" />
                      <input
                        type="text"
                        value={formData.receiverName}
                        onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                        placeholder="请输入收货人姓名"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-forest-700 mb-2">
                      手机号 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-forest-400" />
                      <input
                        type="tel"
                        value={formData.receiverPhone}
                        onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                        placeholder="请输入手机号"
                        maxLength={11}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-forest-700 mb-2">
                      收货地址 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.receiverAddress}
                      onChange={(e) => setFormData({ ...formData, receiverAddress: e.target.value })}
                      className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                      placeholder="请输入详细地址"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-forest-700 mb-2">
                      订单备注
                    </label>
                    <textarea
                      value={formData.remark}
                      onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                      className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                      placeholder="选填，可填写特殊要求"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Product List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    商品清单
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cartData.items.map((item) => (
                      <div key={item.id} className="flex gap-4 pb-4 border-b border-cream-200 last:border-0">
                        <div className="w-20 h-20 bg-cream-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product.images[0] && (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-forest-900">{item.product.name}</h4>
                          <div className="text-sm text-forest-600 mt-1">
                            ¥{item.product.price} × {item.quantity} {item.product.unit}
                          </div>
                        </div>
                        <div className="font-bold text-forest-900">
                          ¥{item.itemTotal.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>订单金额</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-forest-600">
                      商品金额 ({cartData.selectedCount} 种)
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
                    <span className="font-semibold text-forest-900">应付金额</span>
                    <span className="text-xl font-bold text-red-600">
                      ¥{cartData.selectedAmount.toFixed(2)}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? '提交中...' : '提交订单'}
                  </Button>

                  <p className="text-xs text-forest-600 text-center">
                    提交订单即表示您同意《服务条款》
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
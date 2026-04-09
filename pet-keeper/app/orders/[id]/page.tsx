'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  MapPin,
  User,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ArrowLeft,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';

interface OrderDetail {
  id: string;
  orderNo: string;
  totalAmount: number;
  payAmount: number;
  status: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  remark?: string;
  paidAt?: string;
  shippedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  items: Array<{
    id: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
  }>;
}

const statusConfig = {
  pending: { label: '待支付', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  paid: { label: '已支付', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  shipped: { label: '已发货', color: 'bg-purple-100 text-purple-800', icon: Truck },
  completed: { label: '已完成', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: '已取消', color: 'bg-gray-100 text-gray-800', icon: XCircle }
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (params.id) {
      loadOrder();
    }
  }, [user, params.id]);

  const loadOrder = async () => {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(r => r.json());
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('确定要取消这个订单吗？')) return;

    try {
      setActionLoading(true);
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order?.id}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('订单已取消');
      loadOrder();
    } catch (error: any) {
      alert(error.message || '取消订单失败');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!confirm('确定要确认收货吗？')) return;

    try {
      setActionLoading(true);
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order?.id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('已确认收货');
      loadOrder();
    } catch (error: any) {
      alert(error.message || '确认收货失败');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!order) return;

    try {
      setActionLoading(true);

      // 调用创建支付接口
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          orderId: order.id,
          paymentMethod: 'mock'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '创建支付失败');
      }

      // 跳转到模拟支付页面
      window.location.href = data.data.payUrl;
    } catch (error: any) {
      alert(error.message || '发起支付失败');
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return <Badge>未知</Badge>;

    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="h-4 w-4 mr-1" />
        {config.label}
      </Badge>
    );
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

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-forest-300 mx-auto mb-4" />
          <p className="text-forest-600">订单不存在</p>
          <Link href="/orders">
            <Button className="mt-4">返回订单列表</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-cream-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <Link href="/orders">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回订单列表
          </Button>
        </Link>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-forest-900">订单详情</h1>
              {getStatusBadge(order.status)}
            </div>
            <span className="text-sm text-forest-600">
              {new Date(order.createdAt).toLocaleString('zh-CN')}
            </span>
          </div>
          <p className="text-forest-600 mt-2">订单号: {order.orderNo}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>订单状态</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${order.createdAt ? 'bg-green-600' : 'bg-gray-300'}`} />
                    <div>
                      <div className="font-medium">订单创建</div>
                      <div className="text-sm text-forest-600">
                        {new Date(order.createdAt).toLocaleString('zh-CN')}
                      </div>
                    </div>
                  </div>
                  {order.paidAt && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-600" />
                      <div>
                        <div className="font-medium">支付成功</div>
                        <div className="text-sm text-forest-600">
                          {new Date(order.paidAt).toLocaleString('zh-CN')}
                        </div>
                      </div>
                    </div>
                  )}
                  {order.shippedAt && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-purple-600" />
                      <div>
                        <div className="font-medium">已发货</div>
                        <div className="text-sm text-forest-600">
                          {new Date(order.shippedAt).toLocaleString('zh-CN')}
                        </div>
                      </div>
                    </div>
                  )}
                  {order.completedAt && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-600" />
                      <div>
                        <div className="font-medium">已完成</div>
                        <div className="text-sm text-forest-600">
                          {new Date(order.completedAt).toLocaleString('zh-CN')}
                        </div>
                      </div>
                    </div>
                  )}
                  {order.cancelledAt && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gray-600" />
                      <div>
                        <div className="font-medium">已取消</div>
                        <div className="text-sm text-forest-600">
                          {new Date(order.cancelledAt).toLocaleString('zh-CN')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product List */}
            <Card>
              <CardHeader>
                <CardTitle>商品信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b border-cream-200 last:border-0">
                      <div className="w-20 h-20 bg-cream-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-forest-900">{item.productName}</h4>
                        <div className="text-sm text-forest-600 mt-1">
                          ¥{item.price} × {item.quantity}
                        </div>
                      </div>
                      <div className="font-bold text-forest-900">
                        ¥{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Amount */}
            <Card>
              <CardHeader>
                <CardTitle>订单金额</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-forest-600">商品金额</span>
                  <span className="font-medium text-forest-900">
                    ¥{order.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forest-600">运费</span>
                  <span className="font-medium text-green-600">免运费</span>
                </div>
                <hr className="border-cream-200" />
                <div className="flex justify-between">
                  <span className="font-semibold text-forest-900">订单总额</span>
                  <span className="text-xl font-bold text-red-600">
                    ¥{order.payAmount.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Receiver Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  收货信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-forest-400" />
                  <span className="text-forest-900">{order.receiverName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-forest-400" />
                  <span className="text-forest-900">{order.receiverPhone}</span>
                </div>
                <div className="text-sm text-forest-600">
                  {order.receiverAddress}
                </div>
                {order.remark && (
                  <div className="pt-3 border-t border-cream-200">
                    <div className="text-sm text-forest-600">
                      <span className="font-medium">备注: </span>
                      {order.remark}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                {order.status === 'pending' && (
                  <>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handlePayment}
                      disabled={actionLoading}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      立即支付 ¥{order.payAmount}
                    </Button>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={actionLoading}
                    >
                      取消订单
                    </Button>
                  </>
                )}
                {order.status === 'shipped' && (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleComplete}
                    disabled={actionLoading}
                  >
                    确认收货
                  </Button>
                )}
                {(order.status === 'completed' || order.status === 'cancelled') && (
                  <Link href="/shop">
                    <Button className="w-full" variant="outline" size="lg">
                      继续购物
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
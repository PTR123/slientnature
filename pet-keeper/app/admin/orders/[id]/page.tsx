'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  User,
  Phone,
  MapPin,
  ArrowLeft,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

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
  user: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
  };
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

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [shipping, setShipping] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'admin' && params.id) {
      loadOrder();
    }
  }, [user, params.id]);

  const loadOrder = async () => {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/admin/all`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(r => r.json());

      // 从所有订单中找到当前订单
      const currentOrder = data.orders?.find((o: any) => o.id === params.id);

      if (currentOrder) {
        // 获取完整订单详情
        const detailData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${params.id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(r => r.json());
        setOrder({ ...currentOrder, ...detailData, user: currentOrder.user });
      }
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShip = async () => {
    if (!confirm('确定要发货吗？')) return;

    try {
      setShipping(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/admin/${order?.id}/ship`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '发货失败');
      }

      alert('发货成功！');
      loadOrder();
    } catch (error: any) {
      alert(error.message || '发货失败');
    } finally {
      setShipping(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return <Badge>未知</Badge>;

    const Icon = config.icon;
    return (
      <Badge className={`${config.color} text-base px-4 py-2`}>
        <Icon className="h-4 w-4 mr-2" />
        {config.label}
      </Badge>
    );
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

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-forest-300 mx-auto mb-4" />
          <p className="text-forest-600">订单不存在</p>
          <Link href="/admin/orders">
            <Button className="mt-4">返回订单列表</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-cream-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Link href="/admin/orders">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回订单列表
          </Button>
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-forest-900">订单详情</h1>
            <p className="text-forest-600 mt-2">订单号: {order.orderNo}</p>
          </div>
          {getStatusBadge(order.status)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>订单状态</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-4 h-4 rounded-full mt-1 ${order.createdAt ? 'bg-green-600' : 'bg-gray-300'}`} />
                    <div className="flex-1">
                      <div className="font-semibold text-forest-900">订单创建</div>
                      <div className="text-sm text-forest-600">
                        {new Date(order.createdAt).toLocaleString('zh-CN')}
                      </div>
                    </div>
                  </div>

                  {order.paidAt && (
                    <div className="flex items-start gap-4">
                      <div className="w-4 h-4 rounded-full mt-1 bg-blue-600" />
                      <div className="flex-1">
                        <div className="font-semibold text-forest-900">支付成功</div>
                        <div className="text-sm text-forest-600">
                          {new Date(order.paidAt).toLocaleString('zh-CN')}
                        </div>
                      </div>
                    </div>
                  )}

                  {order.shippedAt && (
                    <div className="flex items-start gap-4">
                      <div className="w-4 h-4 rounded-full mt-1 bg-purple-600" />
                      <div className="flex-1">
                        <div className="font-semibold text-forest-900">已发货</div>
                        <div className="text-sm text-forest-600">
                          {new Date(order.shippedAt).toLocaleString('zh-CN')}
                        </div>
                      </div>
                    </div>
                  )}

                  {order.completedAt && (
                    <div className="flex items-start gap-4">
                      <div className="w-4 h-4 rounded-full mt-1 bg-green-600" />
                      <div className="flex-1">
                        <div className="font-semibold text-forest-900">已完成</div>
                        <div className="text-sm text-forest-600">
                          {new Date(order.completedAt).toLocaleString('zh-CN')}
                        </div>
                      </div>
                    </div>
                  )}

                  {order.cancelledAt && (
                    <div className="flex items-start gap-4">
                      <div className="w-4 h-4 rounded-full mt-1 bg-gray-600" />
                      <div className="flex-1">
                        <div className="font-semibold text-forest-900">已取消</div>
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
                      <div className="font-bold text-forest-900 text-lg">
                        ¥{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-cream-200">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-forest-900">订单总额</span>
                    <span className="text-2xl font-bold text-red-600">
                      ¥{order.payAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  用户信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  {order.user.avatar && (
                    <img
                      src={order.user.avatar}
                      alt={order.user.username}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <div className="font-semibold text-forest-900">{order.user.username}</div>
                    <div className="text-sm text-forest-600">{order.user.email}</div>
                  </div>
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
                  <span className="font-medium text-forest-900">{order.receiverName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-forest-400" />
                  <span className="text-forest-900">{order.receiverPhone}</span>
                </div>
                <div className="text-sm text-forest-600 mt-2">
                  {order.receiverAddress}
                </div>
                {order.remark && (
                  <div className="pt-3 border-t border-cream-200">
                    <div className="text-sm font-medium text-forest-700">订单备注:</div>
                    <div className="text-sm text-forest-600 mt-1">{order.remark}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            {order.status === 'paid' && (
              <Card>
                <CardContent className="pt-6">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleShip}
                    disabled={shipping}
                  >
                    <Truck className="h-5 w-5 mr-2" />
                    {shipping ? '发货中...' : '确认发货'}
                  </Button>
                  <p className="text-xs text-forest-600 text-center mt-3">
                    发货后用户将可以查看物流信息
                  </p>
                </CardContent>
              </Card>
            )}

            {order.status === 'pending' && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Clock className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
                    <p className="text-forest-900 font-medium">等待用户支付</p>
                    <p className="text-sm text-forest-600 mt-1">
                      用户支付后可进行发货操作
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {order.status === 'shipped' && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Truck className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                    <p className="text-forest-900 font-medium">已发货</p>
                    <p className="text-sm text-forest-600 mt-1">
                      等待用户确认收货
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
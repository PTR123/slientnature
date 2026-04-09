'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Eye,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  orderNo: string;
  totalAmount: number;
  status: string;
  receiverName: string;
  receiverPhone: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
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

interface OrderStats {
  pending: { count: number; amount: number };
  paid: { count: number; amount: number };
  shipped: { count: number; amount: number };
  completed: { count: number; amount: number };
  cancelled: { count: number; amount: number };
}

const statusConfig = {
  pending: { label: '待支付', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  paid: { label: '已支付', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  shipped: { label: '已发货', color: 'bg-purple-100 text-purple-800', icon: Truck },
  completed: { label: '已完成', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: '已取消', color: 'bg-gray-100 text-gray-800', icon: XCircle }
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    }
  }, [user, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, statsData] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/admin/all${statusFilter ? `?status=${statusFilter}` : ''}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(r => r.json()),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/admin/stats`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(r => r.json())
      ]);
      setOrders(ordersData.orders || []);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShip = async (orderId: string) => {
    if (!confirm('确定要发货吗？')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/admin/${orderId}/ship`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '发货失败');
      }

      alert('发货成功！');
      loadData();
    } catch (error: any) {
      alert(error.message || '发货失败');
    }
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return <Badge>未知</Badge>;

    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-cream-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-forest-900 flex items-center gap-3">
            <Package className="h-8 w-8" />
            订单管理
          </h1>
          <p className="text-forest-600 mt-2">管理所有订单，处理发货</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-forest-600">待支付</p>
                    <p className="text-2xl font-bold text-forest-900">{stats.pending.count}</p>
                    <p className="text-xs text-forest-500">¥{stats.pending.amount.toFixed(2)}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-forest-600">已支付</p>
                    <p className="text-2xl font-bold text-forest-900">{stats.paid.count}</p>
                    <p className="text-xs text-forest-500">¥{stats.paid.amount.toFixed(2)}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-forest-600">已发货</p>
                    <p className="text-2xl font-bold text-forest-900">{stats.shipped.count}</p>
                    <p className="text-xs text-forest-500">¥{stats.shipped.amount.toFixed(2)}</p>
                  </div>
                  <Truck className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-forest-600">已完成</p>
                    <p className="text-2xl font-bold text-forest-900">{stats.completed.count}</p>
                    <p className="text-xs text-forest-500">¥{stats.completed.amount.toFixed(2)}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-forest-600">已取消</p>
                    <p className="text-2xl font-bold text-forest-900">{stats.cancelled.count}</p>
                    <p className="text-xs text-forest-500">¥{stats.cancelled.amount.toFixed(2)}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={statusFilter === '' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('')}
          >
            全部订单
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('pending')}
          >
            待支付
          </Button>
          <Button
            variant={statusFilter === 'paid' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('paid')}
          >
            待发货
          </Button>
          <Button
            variant={statusFilter === 'shipped' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('shipped')}
          >
            已发货
          </Button>
          <Button
            variant={statusFilter === 'completed' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('completed')}
          >
            已完成
          </Button>
          <Button
            variant={statusFilter === 'cancelled' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('cancelled')}
          >
            已取消
          </Button>
        </div>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>订单列表</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-forest-300 mx-auto mb-4" />
                <p className="text-forest-600">暂无订单</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cream-200">
                      <th className="text-left py-3 px-4 font-semibold text-forest-700">订单信息</th>
                      <th className="text-left py-3 px-4 font-semibold text-forest-700">用户</th>
                      <th className="text-left py-3 px-4 font-semibold text-forest-700">收货人</th>
                      <th className="text-left py-3 px-4 font-semibold text-forest-700">金额</th>
                      <th className="text-left py-3 px-4 font-semibold text-forest-700">状态</th>
                      <th className="text-right py-3 px-4 font-semibold text-forest-700">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-cream-100 hover:bg-cream-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-forest-900">{order.orderNo}</div>
                            <div className="text-sm text-forest-600 mt-1">
                              {new Date(order.createdAt).toLocaleString('zh-CN')}
                            </div>
                            <div className="text-sm text-forest-500 mt-1">
                              {order.items.length} 件商品
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {order.user.avatar && (
                              <img
                                src={order.user.avatar}
                                alt={order.user.username}
                                className="w-8 h-8 rounded-full"
                              />
                            )}
                            <span className="text-forest-900">{order.user.username}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <div className="font-medium text-forest-900">{order.receiverName}</div>
                            <div className="text-forest-600">{order.receiverPhone}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-forest-900">
                            ¥{order.totalAmount.toFixed(2)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2 justify-end">
                            <Link href={`/admin/orders/${order.id}`}>
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            {order.status === 'paid' && (
                              <Button
                                size="sm"
                                onClick={() => handleShip(order.id)}
                              >
                                <Truck className="h-4 w-4 mr-1" />
                                发货
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Eye, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';

interface Order {
  id: string;
  orderNo: string;
  totalAmount: number;
  status: string;
  receiverName: string;
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

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      const url = statusFilter
        ? `${process.env.NEXT_PUBLIC_API_URL}/orders?status=${statusFilter}`
        : `${process.env.NEXT_PUBLIC_API_URL}/orders`;

      const data = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(r => r.json());
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [statusFilter]);

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
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-forest-900 flex items-center gap-3">
            <Package className="h-8 w-8" />
            我的订单
          </h1>
          <p className="text-forest-600 mt-2">查看和管理您的订单</p>
        </div>

        {/* Status Filter */}
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
            已支付
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
        {orders.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <Package className="h-16 w-16 text-forest-300 mx-auto mb-4" />
                <p className="text-forest-600 mb-2">暂无订单</p>
                <p className="text-sm text-forest-500">快去商城选购心仪的商品吧！</p>
                <Link href="/shop">
                  <Button className="mt-4">去购物</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-forest-600">
                        订单号: {order.orderNo}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <span className="text-sm text-forest-500">
                      {new Date(order.createdAt).toLocaleString('zh-CN')}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-16 h-16 bg-cream-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.productImage && (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-forest-900">{item.productName}</h4>
                          <div className="text-sm text-forest-600">
                            ¥{item.price} × {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream-200">
                    <div>
                      <span className="text-sm text-forest-600">收货人: </span>
                      <span className="text-sm font-medium text-forest-900">{order.receiverName}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-sm text-forest-600">订单金额: </span>
                        <span className="text-lg font-bold text-forest-900">
                          ¥{order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          查看详情
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
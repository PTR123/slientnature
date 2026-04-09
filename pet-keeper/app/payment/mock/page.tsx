'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function MockPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    if (!orderId || !amount) {
      setError('支付参数错误');
    }
  }, [orderId, amount]);

  const handlePayment = async () => {
    if (!orderId) {
      setError('订单ID缺失');
      return;
    }

    try {
      setProcessing(true);
      setError('');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/mock/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ orderId })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '支付失败');
      }

      setSuccess(true);

      // 3秒后跳转到订单详情
      setTimeout(() => {
        router.push(`/orders/${orderId}`);
      }, 3000);
    } catch (error: any) {
      setError(error.message || '支付失败');
      setProcessing(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest-50 to-cream-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-forest-900 mb-2">支付错误</h2>
            <p className="text-forest-600 mb-6">{error}</p>
            <Link href="/orders">
              <Button>返回订单列表</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest-50 to-cream-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-forest-900 mb-2">支付成功！</h2>
            <p className="text-forest-600 mb-6">正在跳转到订单详情...</p>
            <Loader2 className="h-6 w-6 animate-spin text-forest-600 mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-cream-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="h-8 w-8 text-forest-600" />
          </div>
          <CardTitle className="text-2xl">模拟支付</CardTitle>
          <p className="text-sm text-forest-600 mt-2">
            沙箱测试环境，无需真实资金
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-cream-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-forest-600">订单编号</span>
              <span className="font-medium text-forest-900">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-forest-600">支付金额</span>
              <span className="text-2xl font-bold text-red-600">¥{amount}</span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>提示：</strong>这是沙箱测试环境，点击确认后将直接完成支付，无需真实付款。
            </p>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full"
              size="lg"
              onClick={handlePayment}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  支付处理中...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  确认支付 ¥{amount}
                </>
              )}
            </Button>

            <Link href={`/orders/${orderId}`} className="block">
              <Button variant="outline" className="w-full" size="lg">
                取消支付
              </Button>
            </Link>
          </div>

          <p className="text-xs text-center text-forest-500">
            测试环境 · 仅供开发测试使用
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MockPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-forest-50 to-cream-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-forest-600" />
      </div>
    }>
      <MockPaymentContent />
    </Suspense>
  );
}
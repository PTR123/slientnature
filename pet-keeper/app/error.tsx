'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 可以将错误记录到错误报告服务
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-cream-50 flex items-center justify-center px-4">
      <div className="text-center">
        <AlertCircle className="h-24 w-24 text-red-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-forest-900 mb-4">
          出错了
        </h1>
        <p className="text-lg text-forest-600 mb-8 max-w-md">
          抱歉，页面遇到了一些问题。请尝试刷新页面或返回首页。
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg text-left max-w-md mx-auto">
            <p className="text-sm text-red-800 font-mono">
              {error.message}
            </p>
          </div>
        )}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={reset}
            size="lg"
            className="bg-forest-600 hover:bg-forest-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            重试
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg">
              <Home className="h-4 w-4 mr-2" />
              返回首页
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
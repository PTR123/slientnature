'use client';

import { Button } from '@/components/ui/button';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-cream-50 flex items-center justify-center px-4">
      <div className="text-center">
        <FileQuestion className="h-24 w-24 text-forest-300 mx-auto mb-6" />
        <h1 className="text-6xl font-bold text-forest-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-forest-700 mb-4">
          页面未找到
        </h2>
        <p className="text-lg text-forest-600 mb-8 max-w-md">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="bg-forest-600 hover:bg-forest-700">
              <Home className="h-4 w-4 mr-2" />
              返回首页
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回上一页
          </Button>
        </div>
      </div>
    </div>
  );
}
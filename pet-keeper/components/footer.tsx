import Link from 'next/link';
import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-cream-200 bg-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="rounded-lg bg-forest-600 p-2">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-forest-900">PetKeeper</span>
            </Link>
            <p className="mt-4 text-sm text-forest-600">
              专业的异宠饲养管理平台，让每一只异宠都能被科学照料
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-forest-900">快速导航</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/species" className="text-forest-600 hover:text-forest-900">
                  物种图鉴
                </Link>
              </li>
              <li>
                <Link href="/my-pets" className="text-forest-600 hover:text-forest-900">
                  我的记录
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-forest-600 hover:text-forest-900">
                  社区
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-display font-semibold text-forest-900">资源</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/species" className="text-forest-600 hover:text-forest-900">
                  饲养指南
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-forest-600 hover:text-forest-900">
                  常见问题
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-forest-600 hover:text-forest-900">
                  联系我们
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-display font-semibold text-forest-900">法律信息</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-forest-600 hover:text-forest-900">
                  隐私政策
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-forest-600 hover:text-forest-900">
                  服务条款
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-forest-600 hover:text-forest-900">
                  Cookie 政策
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-cream-200 pt-8 text-center">
          <p className="text-sm text-forest-600">
            © {new Date().getFullYear()} PetKeeper. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
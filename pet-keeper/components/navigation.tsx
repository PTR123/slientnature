'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Leaf, Menu, X, User, LogOut, Shield, ShoppingCart, Package } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth-provider';

const navLinks = [
  { href: '/species', label: '物种图鉴' },
  { href: '/my-pets', label: '我的记录' },
  { href: '/shop', label: '商城' },
  { href: '/community', label: '社区' }
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-cream-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="rounded-lg bg-forest-600 p-2 transition-transform group-hover:scale-105">
              <img src="/images/logo.png" alt="自然不语" className="h-5 w-5 object-contain" />
            </div>
            <span className="font-display text-xl font-bold text-forest-900">自然不语</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-forest-600',
                  pathname === link.href ? 'text-forest-600' : 'text-forest-700'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <Link href="/cart">
                  <Button variant="ghost" size="sm">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    购物车
                  </Button>
                </Link>
                <Link href="/orders">
                  <Button variant="ghost" size="sm">
                    <Package className="h-4 w-4 mr-1" />
                    我的订单
                  </Button>
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm">
                      <Shield className="h-4 w-4 mr-1" />
                      管理后台
                    </Button>
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-forest-600" />
                  <span className="text-sm font-medium text-forest-700">{user.username}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  退出
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    登录
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">注册</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-lg p-2 text-forest-700 hover:bg-cream-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-cream-200 py-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-forest-50 text-forest-600'
                      : 'text-forest-700 hover:bg-cream-100'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-cream-200">
                {user ? (
                  <>
                    <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="justify-start w-full">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        购物车
                      </Button>
                    </Link>
                    <Link href="/orders" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="justify-start w-full">
                        <Package className="h-4 w-4 mr-1" />
                        我的订单
                      </Button>
                    </Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="justify-start w-full">
                          <Shield className="h-4 w-4 mr-1" />
                          管理后台
                        </Button>
                      </Link>
                    )}
                    <div className="px-3 py-2 text-sm text-forest-700">
                      {user.username}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start"
                      onClick={handleLogout}
                    >
                      退出登录
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" size="sm" className="justify-start w-full">
                        登录
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm" className="justify-start w-full">
                        注册
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
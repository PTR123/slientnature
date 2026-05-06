'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth-provider';
import { Leaf, Eye, EyeOff, Smartphone, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  // 登录方式
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');

  // 邮箱登录
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 手机号登录
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);

  // 通用状态
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 发送验证码
  const handleSendCode = async () => {
    if (!phone || phone.length !== 11) {
      setError('请输入正确的手机号');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sms/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) throw new Error('发送失败');

      setError('');
      setCountdown(60);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message || '发送验证码失败');
    }
  };

  // 邮箱登录
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || '登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  // 手机号登录
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone || phone.length !== 11) {
      setError('请输入正确的手机号');
      return;
    }

    if (!code || code.length !== 6) {
      setError('请输入6位验证码');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '登录失败');
      }

      const { token, user } = await response.json();

      // 保存 token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // 跳转首页
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  // 微信登录
  const handleWechatLogin = () => {
    // Web端需要跳转到微信扫码登录页面
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/wechat/qrconnect?redirect_uri=${encodeURIComponent(window.location.origin)}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-forest-50 to-cream-50 botanical-pattern px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-forest-600 p-3">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">登录 PetKeeper</CardTitle>
          <p className="text-sm text-forest-600 mt-2">
            还没有账号？{' '}
            <Link href="/register" className="text-forest-700 font-semibold hover:underline">
              立即注册
            </Link>
          </p>
        </CardHeader>
        <CardContent>
          {/* 登录方式切换 */}
          <div className="flex mb-6 bg-cream-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setLoginType('email')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                loginType === 'email'
                  ? 'bg-forest-600 text-white'
                  : 'text-forest-700 hover:bg-cream-200'
              }`}
            >
              <Mail className="h-4 w-4" />
              邮箱登录
            </button>
            <button
              type="button"
              onClick={() => setLoginType('phone')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                loginType === 'phone'
                  ? 'bg-forest-600 text-white'
                  : 'text-forest-700 hover:bg-cream-200'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              手机号登录
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {/* 邮箱登录表单 */}
          {loginType === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-forest-700 mb-1">
                  邮箱
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-forest-700 mb-1">
                  密码
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-400 hover:text-forest-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </form>
          )}

          {/* 手机号登录表单 */}
          {loginType === 'phone' && (
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-forest-700 mb-1">
                  手机号
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  maxLength={11}
                  className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="请输入手机号"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-forest-700 mb-1">
                  验证码
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    maxLength={6}
                    className="flex-1 px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                    placeholder="请输入验证码"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                    className="whitespace-nowrap"
                  >
                    {countdown > 0 ? `${countdown}s` : '发送验证码'}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </form>
          )}

          {/* 分割线 */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-cream-300"></div>
            <span className="px-4 text-sm text-forest-600">或</span>
            <div className="flex-1 border-t border-cream-300"></div>
          </div>

          {/* 微信登录按钮 */}
          <Button
            type="button"
            variant="outline"
            onClick={handleWechatLogin}
            className="w-full bg-green-500 hover:bg-green-600 text-white border-green-500"
            size="lg"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.269-.03-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
            </svg>
            微信扫码登录
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
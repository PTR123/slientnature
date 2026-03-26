'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CookiesContent() {
  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-forest-600 hover:text-forest-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回首页
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="font-display text-4xl font-bold text-forest-950 mb-8">
            Cookie 政策
          </h1>

          <div className="prose prose-forest max-w-none">
            <p className="text-sm text-forest-600 mb-6">
              最后更新日期：2026年3月23日
            </p>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              1. 什么是 Cookie
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              Cookie 是网站存储在您的浏览器中的小型文本文件，用于记住您的偏好和活动。PetKeeper 使用 localStorage 技术存储用户认证信息，这是类似 Cookie 的本地存储技术。
            </p>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              2. 我们如何使用本地存储
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              PetKeeper 使用以下本地存储技术：
            </p>

            <div className="bg-cream-50 border border-cream-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-forest-950 mb-3">localStorage</h3>
              <ul className="list-disc list-inside text-forest-800 space-y-2">
                <li><strong>token</strong>：存储 JWT 认证令牌，用于保持登录状态</li>
                <li><strong>用途</strong>：自动登录、身份验证</li>
                <li><strong>有效期</strong>：除非手动清除或注销，否则永久保存</li>
              </ul>
            </div>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              3. 我们不使用的技术
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              为了保护您的隐私，PetKeeper <strong>不使用</strong>以下技术：
            </p>
            <ul className="list-disc list-inside text-forest-800 space-y-2 mb-4">
              <li>❌ 第三方 Cookie（如 Google Analytics、Facebook Pixel）</li>
              <li>❌ 跨站追踪 Cookie</li>
              <li>❌ 广告追踪技术</li>
              <li>❌ 社交媒体追踪按钮</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              4. 本地存储的目的
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              我们使用本地存储的主要目的：
            </p>
            <ul className="list-disc list-inside text-forest-800 space-y-2 mb-4">
              <li><strong>身份验证</strong>：保持您的登录状态，无需每次访问都重新登录</li>
              <li><strong>安全性</strong>：保护您的账户免受未经授权的访问</li>
              <li><strong>用户体验</strong>：记住您的偏好设置</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              5. 如何管理本地存储
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              您可以随时清除浏览器中存储的数据：
            </p>

            <div className="bg-cream-50 border border-cream-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-forest-950 mb-3">清除方法</h3>
              <ul className="list-disc list-inside text-forest-800 space-y-2">
                <li><strong>注销</strong>：点击页面右上角的"退出"按钮，会自动清除登录令牌</li>
                <li><strong>浏览器设置</strong>：在浏览器设置中清除网站数据</li>
                <li><strong>开发者工具</strong>：打开浏览器开发者工具 → Application → Local Storage → 删除相关项</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-forest-800">
                <strong>注意：</strong>清除登录令牌后，您需要重新登录才能访问需要认证的功能。
              </p>
            </div>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              6. 不同浏览器的设置
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              各浏览器管理 Cookie/本地存储的方式：
            </p>
            <ul className="list-disc list-inside text-forest-800 space-y-2 mb-4">
              <li><strong>Chrome</strong>：设置 → 隐私和安全 → Cookie 及其他网站数据</li>
              <li><strong>Firefox</strong>：设置 → 隐私与安全 → Cookie 和网站数据</li>
              <li><strong>Safari</strong>：偏好设置 → 隐私 → 管理网站数据</li>
              <li><strong>Edge</strong>：设置 → Cookie 和网站权限 → Cookie 和网站数据</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              7. 禁用本地存储的影响
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              如果您禁用浏览器的本地存储功能：
            </p>
            <ul className="list-disc list-inside text-forest-800 space-y-2 mb-4">
              <li>❌ 无法保持登录状态，每次访问都需要重新登录</li>
              <li>❌ 某些功能可能无法正常使用</li>
              <li>❌ 用户体验将受到影响</li>
            </ul>
            <p className="text-forest-800 leading-relaxed mb-4">
              我们建议启用本地存储以获得最佳使用体验。
            </p>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              8. 数据安全
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              我们采取以下措施保护存储的数据：
            </p>
            <ul className="list-disc list-inside text-forest-800 space-y-2 mb-4">
              <li>JWT 令牌使用强加密算法生成</li>
              <li>令牌包含过期时间，自动失效</li>
              <li>不存储敏感信息（如密码、支付信息）</li>
              <li>使用 HTTPS 加密传输</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              9. 移动应用
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              我们的移动应用同样使用本地存储技术来保存登录状态和用户偏好。您可以在应用设置中清除缓存数据。
            </p>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              10. 政策更新
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              我们可能会不时更新本 Cookie 政策。重大变更将在网站上发布通知。继续使用服务即表示您接受更新后的政策。
            </p>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              11. 联系我们
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              如对本 Cookie 政策有任何疑问，请联系：
            </p>
            <ul className="list-disc list-inside text-forest-800 space-y-2 mb-4">
              <li>电子邮件：privacy@petkeeper.com</li>
              <li>社区反馈：在社区版块发布问题</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
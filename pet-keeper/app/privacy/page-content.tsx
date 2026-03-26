'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyContent() {
  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-forest-600 hover:text-forest-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回首页
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="font-display text-4xl font-bold text-forest-950 mb-8">
            隐私政策
          </h1>

          <div className="prose prose-forest max-w-none">
            <p className="text-sm text-forest-600 mb-6">
              最后更新日期：2026年3月23日
            </p>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              1. 信息收集
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              PetKeeper（以下简称"我们"）收集您在使用服务时主动提供的信息，包括：
            </p>
            <ul className="list-disc list-inside text-forest-800 space-y-2 mb-4">
              <li>账户信息：用户名、电子邮件地址、密码（加密存储）</li>
              <li>宠物信息：宠物名称、物种、照片、饲养记录等</li>
              <li>社区内容：发布的帖子、评论、点赞记录</li>
              <li>使用数据：访问日志、设备信息、浏览器类型</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              2. 信息使用
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              我们使用收集的信息用于：
            </p>
            <ul className="list-disc list-inside text-forest-800 space-y-2 mb-4">
              <li>提供、维护和改进我们的服务</li>
              <li>处理您的请求和响应用户咨询</li>
              <li>发送服务相关通知（如系统更新、安全提醒）</li>
              <li>分析用户行为，优化产品体验</li>
              <li>防止欺诈和保障平台安全</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              3. 信息存储与保护
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              我们采取行业标准的安全措施保护您的信息：
            </p>
            <ul className="list-disc list-inside text-forest-800 space-y-2 mb-4">
              <li>使用 HTTPS 加密传输数据</li>
              <li>密码使用 bcrypt 算法加密存储</li>
              <li>JWT Token 认证机制</li>
              <li>定期安全审计和漏洞修复</li>
            </ul>
            <p className="text-forest-800 leading-relaxed mb-4">
              您上传的图片存储在我们的服务器上，仅用于您授权的用途。我们不会未经许可使用、分享或出售您的图片。
            </p>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              4. 信息共享
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              我们不会出售、交易或以其他方式将您的个人信息转让给第三方。以下情况除外：
            </p>
            <ul className="list-disc list-inside text-forest-800 space-y-2 mb-4">
              <li>获得您的明确同意</li>
              <li>法律法规要求</li>
              <li>保护我们或用户的权利、财产或安全</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              5. 用户权利
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              您对自己的个人信息享有以下权利：
            </p>
            <ul className="list-disc list-inside text-forest-800 space-y-2 mb-4">
              <li><strong>访问权</strong>：查看和获取您的个人数据副本</li>
              <li><strong>更正权</strong>：更新或修正不准确的信息</li>
              <li><strong>删除权</strong>：请求删除您的账户和相关数据</li>
              <li><strong>数据导出</strong>：下载您的宠物档案和饲养记录</li>
              <li><strong>注销账户</strong>：随时删除您的账户</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              6. Cookie 使用
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              我们使用 localStorage 存储 JWT Token 以保持登录状态。我们不使用第三方 Cookie 进行追踪。详细信息请参阅我们的{' '}
              <Link href="/cookies" className="text-forest-600 hover:text-forest-700 underline">
                Cookie 政策
              </Link>
              。
            </p>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              7. 儿童隐私
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              我们的服务面向所有年龄段的用户。如果您是 18 岁以下的未成年人，请在父母或监护人的指导下使用本服务。我们不会故意收集儿童的个人信息。
            </p>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              8. 第三方链接
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              我们的服务可能包含指向第三方网站的链接。我们不对这些网站的隐私实践负责。建议您阅读这些网站的隐私政策。
            </p>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              9. 政策更新
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              我们可能会不时更新本隐私政策。重大变更将通过电子邮件或站内通知告知您。继续使用我们的服务即表示您接受更新后的政策。
            </p>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              10. 联系我们
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：
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